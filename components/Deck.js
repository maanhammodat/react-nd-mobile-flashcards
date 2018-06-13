import React, { Component } from 'react';
import { View, Text, FlatList, Modal, Animated, StyleSheet } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import * as uuid from '../utils/uuid';
import truncate from '../utils/truncate';

export default class Deck extends Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => {

        const params = navigation.state.params || {};
        const title = params.title;
        const deleteDeck = params.deleteDeck;
        const id = params.id;

        return {
            headerTitle: title,
            headerRight: (
                <Icon
                    name='trash'
                    type='foundation'
                    color='#fff'
                    containerStyle={{ marginRight: 20, padding: 10 }}
                    underlayColor={'transparent'}
                    onPress={() => {
                        deleteDeck(id)
                        .then(() => {
                            navigation.navigate('Home');
                        });
                     }                        
                    }
                />
            ),
        }
    };

    state = {
        id: this.props.navigation.state.params.id,
        title: this.props.navigation.state.params.title,
        deck: this.props.navigation.state.params.deck,
        modals: { editTitle: false, addCard: false, editCard: false },
        currentCard: { question: '', answer: '', id: '' },
        newCard: { question: '', answer: '' },
        errorMessages: { editTitle: '', addCard: '', editCard: '' },
        bounceValue: new Animated.Value(1)
    }

    playAnimation(){
        
        Animated.loop(
            Animated.sequence([
              Animated.timing(this.state.bounceValue, { duration: 200, toValue: 15 }),
              Animated.spring(this.state.bounceValue, { toValue: 1, friction: 4 })
            ])
        ).start();

    }

    setModalVisible(modal, visible) {
        const modals = { ...this.state.modals }
        modals[modal] = visible;
        this.setState({ modals });
    }
    
    updateTitle() {
        const { id, title } = this.state;

        if (!title){
            this.handleFormError('editTitle', 'no title');
            return;
        }
        if (title.length > 26) {
            this.handleFormError('editTitle', 'title too long');
            return;
        }

        this.clearFormError('editTitle');

        this.props.navigation.state.params.updateTitle(id, title)
        .then(() => {
            this.props.navigation.setParams({ title });
            this.setModalVisible('editTitle', false);
        });
    }

    addCardToDeck() {

        const card = this.state.newCard;

        if (card.question === '' || card.answer === ''){
            this.handleFormError('addCard', 'no question or answer');
            return;
        }

        this.clearFormError('addCard');

        const id = this.state.id;

        card.id = uuid.generate();
        
        this.props.navigation.state.params.addCardToDeck(id, card)
        .then((deck) => {
            this.setState({ deck });
            this.props.navigation.setParams({ deck });
            this.setModalVisible('addCard', false);
        });
    }

    updateCard() {        

        const card = this.state.currentCard;

        if (card.question === '' || card.answer === ''){
            this.handleFormError('editCard', 'no question or answer');
            return;
        }
        
        const id = this.state.id;
        
        this.props.navigation.state.params.updateCard(id, card)
        .then((deck) => {
            this.setState({ deck });            
            this.props.navigation.setParams({ deck });
            this.setModalVisible('editCard', false);
        });
    }

    deleteCard(cardId){
        
        const id = this.state.id;
        
        this.props.navigation.state.params.deleteCard(id, cardId)
        .then((deck) => {
            this.setState({ deck });            
            this.props.navigation.setParams({ deck });
        });
    }

    handleFormError(modal, error){
        const message = 
            (error === 'no title') ? 'Please enter a title' : 
            (error === 'title too long') ? 'The title you entered is too long, please shorten it' : 
            (error === 'no question or answer') ? 'Please enter both a question and an answer' : 
            (error === 'question too long') ? 'The question you entered is too long, please shorten it' : 
            (error === 'answer too long') ? 'The answer you entered is too long, please shorten it' : 
            '';
        
        const errorMessages = { ...this.state.errorMessages }
        errorMessages[modal] = message;
        this.setState({ errorMessages });
    }

    clearFormError(modal){
        const errorMessages = { ...this.state.errorMessages }
        errorMessages[modal] = '';
        this.setState({ errorMessages });
    }

    render() {

        const deck = this.state.deck ? JSON.parse(this.state.deck) : {};
        const questions = deck.questions;
        const { modals } = this.state;
        
        (questions.length === 0 && Object.values(modals).every(visible => visible === false)) && this.playAnimation();
        
        const errorMessages = this.state.errorMessages;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon
                        name='cards-outline'
                        type='material-community'
                        color='#667'
                    />
                    <Text style={styles.headerTitle}>CARDS ({questions.length})</Text>
                </View>

                {(questions.length > 0) && (
                    <FlatList
                        data={questions}
                        contentContainerStyle={{ flexGrow: 1 }}
                        renderItem={({ item }) => {
                            return (

                                <View style={styles.listItem}>

                                    <View style={styles.listTitleContainer}>
                                    
                                            <Text style={styles.listTitle}>
                                                Q: {truncate(item.question)}
                                            </Text>

                                    </View>

                                    <View style={styles.listControls}>

                                        <Icon
                                            reverse
                                            reverseColor={'#fff'}
                                            name='pencil'
                                            type='foundation'
                                            color='#11549F'
                                            size={18}
                                            underlayColor={'transparent'}
                                            onPress={() => {
                                                this.clearFormError('editCard');
                                                const currentCard = { ...this.state.currentCard }
                                                currentCard.question = item.question;
                                                currentCard.answer = item.answer;
                                                currentCard.id = item.id;
                                                this.setState({ currentCard });
                                                this.setModalVisible('editCard', true);
                                            }}
                                        />

                                        <Icon
                                            reverse
                                            reverseColor={'#fff'}
                                            name='trash'
                                            type='foundation'
                                            color='#cb2431'
                                            size={18}
                                            underlayColor={'transparent'}
                                            onPress={() => {
                                                this.deleteCard(item.id);
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        }}
                        keyExtractor={item => item.id.toString()}
                    />
                )}

                {(questions.length === 0) && (

                    <View style={styles.fallBackContainer}>
                        <Text style={{ color: '#901C7E' }}>You haven't got any cards yet, tap "Add Card" below to get create one!</Text>

                        <Animated.View style={{ bottom: this.state.bounceValue, left: 30, display: 'flex', alignSelf: 'flex-start' }}>
                            <Icon
                                name='hand-o-down'
                                type='font-awesome'
                                color='#901C7E'
                                size={50}
                            />
                        </Animated.View>
                    </View>

                )}

                <View style={styles.footer}>
                    <Button
                        raised
                        backgroundColor={'#291CA9'}
                        buttonStyle={styles.footerButton}
                        containerViewStyle={styles.footerButtonContainer}                        
                        icon={{ name: 'plus', type: 'font-awesome' }}
                        title='Add Card'
                        onPress={() => {
                            this.setModalVisible('addCard', true);
                        }}
                    />
                    
                    <Button
                        raised
                        disabled={(questions.length === 0)}
                        backgroundColor={'#05A071'}
                        buttonStyle={styles.footerButton}
                        containerViewStyle={styles.footerButtonContainer}
                        icon={{ name: 'question', type: 'font-awesome' }}
                        title='Start Quiz'
                        onPress={() => {
                            this.props.navigation.navigate('Quiz', {
                                deck: this.state.deck,
                                id: this.state.id,
                                title: this.state.title,                                
                            });
                        }}
                    />

                    <Button
                        raised
                        backgroundColor={'#11549F'}
                        buttonStyle={styles.footerButton}
                        containerViewStyle={styles.footerButtonContainer}
                        icon={{ name: 'pencil', type: 'foundation' }}
                        title='Edit Deck'
                        onPress={() => {
                            this.setModalVisible('editTitle', true);
                        }}
                    />
                </View>
                
                {/* Edit Title */}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modals.editTitle}
                    onRequestClose={() => {
                        this.setModalVisible('editTitle', false);
                    }}
                >

                    <View style={styles.modalHeader}>
                        <Icon
                            name='pencil'
                            type='foundation'
                            color='#667'
                        />
                        <Text style={styles.headerTitle}>EDIT DECK</Text>
                    </View>
                    <FormLabel labelStyle={styles.formLabel}>Name</FormLabel>
                    <FormInput
                        placeholder='Tap here to edit the name for the new deck'
                        onChangeText={title => this.setState(() => ({ title }))}
                        value={this.state.title}
                    />
                    {errorMessages.editTitle !== '' && (
                        <FormValidationMessage containerStyle={{ marginBottom: 10 }}>
                            {errorMessages.editTitle}
                        </FormValidationMessage>
                        )
                    }
                    

                    <View style={{ flexDirection: 'row' }}> 
                        <Button
                            raised
                            backgroundColor={'#59B324'}
                            containerViewStyle={{ flex: 1, display: 'flex' }}
                            icon={{ name: 'check', type: 'font-awesome' }}
                            title='SUBMIT'
                            onPress={() => {
                                this.updateTitle();
                            }}
                        />
                        <Button
                            raised
                            icon={{ name: 'ban', type: 'font-awesome' }}
                            containerViewStyle={{ flex: 1, display: 'flex' }}
                            backgroundColor={ '#cb2431' }
                            title='CANCEL'                             
                            onPress={() => {
                                this.setModalVisible('editTitle', false);
                            }}
                        />
                    </View>

                </Modal>

                { /* Add Card */ }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modals.addCard}
                    onRequestClose={() => {
                        this.setModalVisible('addCard', false);
                    }}
                >

                    <View style={styles.modalHeader}>
                        <Icon
                            name='plus'
                            type='font-awesome'
                            color='#667'
                        />
                        <Text style={styles.headerTitle}>ADD CARD</Text>
                    </View>
                    <FormLabel labelStyle={styles.formLabel}>Question</FormLabel>
                    <FormInput
                        onChangeText={
                            (question) => {
                                const newCard = { ...this.state.newCard }
                                newCard.question = question;
                                this.setState({ newCard });
                            }
                        }
                    />
                    <FormLabel labelStyle={styles.formLabel}>Answer</FormLabel>
                    <FormInput
                        onChangeText={
                            (answer) => {
                                const newCard = { ...this.state.newCard }
                                newCard.answer = answer;
                                this.setState({ newCard });
                            }
                        }
                    />
                    {errorMessages.addCard !== '' && (
                        <FormValidationMessage containerStyle={{ marginBottom: 10 }}>
                            {errorMessages.addCard}
                        </FormValidationMessage>
                        )
                    }

                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            raised
                            backgroundColor={'#59B324'}
                            containerViewStyle={{ flex: 1, display: 'flex' }}
                            icon={{ name: 'check', type: 'font-awesome' }}
                            title='SUBMIT'
                            onPress={() => {
                                this.addCardToDeck();
                            }}
                        />
                        <Button
                            raised
                            icon={{ name: 'ban', type: 'font-awesome' }}
                            containerViewStyle={{ flex: 1, display: 'flex' }}
                            backgroundColor={ '#cb2431' }
                            title='CANCEL'                             
                            onPress={() => {
                                this.setModalVisible('addCard', false);
                            }}
                        />
                    </View>

                </Modal>

                { /* Edit Card */ }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modals.editCard}
                    onRequestClose={() => {
                        this.setModalVisible('editCard', false);
                    }}
                >

                    <View style={styles.modalHeader}>
                        <Icon
                            name='pencil'
                            type='foundation'
                            color='#667'
                        />
                        <Text style={styles.headerTitle}>EDIT CARD</Text>
                    </View>
                    <FormLabel labelStyle={styles.formLabel}>Question</FormLabel>
                    <FormInput
                        onChangeText={
                            (question) => {
                                const currentCard = { ...this.state.currentCard }
                                currentCard.question = question;
                                this.setState({ currentCard });
                            }    
                        }
                        value={this.state.currentCard.question}
                    />
                    <FormLabel labelStyle={styles.formLabel}>Answer</FormLabel>
                    <FormInput
                        onChangeText={
                            (answer) => {
                                const currentCard = { ...this.state.currentCard }
                                currentCard.answer = answer;
                                this.setState({ currentCard });
                            }
                        }
                        value={this.state.currentCard.answer}
                    />
                    {errorMessages.editCard !== '' && (
                        <FormValidationMessage containerStyle={{ marginBottom: 10 }}>
                            {errorMessages.editCard}
                        </FormValidationMessage>
                        )
                    }

                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            raised
                            backgroundColor={'#59B324'}
                            containerViewStyle={{ flex: 1, display: 'flex' }}
                            icon={{ name: 'check', type: 'font-awesome' }}
                            title='SUBMIT'
                            onPress={() => {
                                this.updateCard();
                            }}
                        />
                        <Button
                            raised
                            icon={{ name: 'ban', type: 'font-awesome' }}
                            containerViewStyle={{ flex: 1, display: 'flex' }}
                            backgroundColor={ '#cb2431' }
                            title='CANCEL'                             
                            onPress={() => {
                                this.setModalVisible('editCard', false);
                            }}
                        />
                    </View>

                </Modal>


            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        marginTop: 10,
        paddingLeft: 10,
        paddingBottom: 10,
        borderBottomColor: '#bbb',
        borderBottomWidth: 1
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667',
        marginLeft: 5,
        marginTop: 1
    },
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        borderBottomColor: '#bbb',
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5
    },
    listTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        flex: 1
    },
    listTitle: {
        color: '#901C7E',
        fontWeight: 'bold',
        marginLeft: 2,
        marginRight: 10,
        flexDirection: 'column',
        alignSelf: 'center',
        display: 'flex'
    },
    listControls: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    fallBackContainer: {
        justifyContent: 'space-between',
        display: 'flex',
        margin: 15,
        flex: 1
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footerButton: {
        height: 43
    },
    footerButtonContainer: {
        marginLeft: 0,
        marginRight: 0
    },
    modalHeader: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 10
    },
    formLabel: {
        color: '#901D7E'
    }
});