import React, { Component } from 'react';
import { View, Text, FlatList, Modal, Animated } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import * as uuid from '../utils/uuid';
import truncate from '../utils/truncate';

export default class DeckContainer extends Component {

    constructor(props) {
        super(props);

        this.emptyListComponent = this.emptyListComponent.bind(this);
    }

    static navigationOptions = ({ navigation }) => {

        const params = navigation.state.params || {};
        const title = params.title;
        const deleteDeck = params.deleteDeck;
        const id = params.id;

        console.log('DeckContainer: navopts');

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
                            console.log('deleteDeck component callback');
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
        console.log('playanimation');
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
        console.log('addCardToDeck:',card);
        
        this.props.navigation.state.params.addCardToDeck(id, card)
        .then((deck) => {
            this.setState({ deck });
            this.props.navigation.setParams({ deck });
            console.log('addCardToDeck CB: state: ',this.state.deck);
            this.setModalVisible('addCard', false);
        });
    }

    updateCard() {        
        console.log('updateCard()');

        const card = this.state.currentCard;
        console.log('updateCard: ',card);

        if (card.question === '' || card.answer === ''){
            this.handleFormError('editCard', 'no question or answer');
            return;
        }
        
        const id = this.state.id;
        
        console.log('updateCard:',card);
        
        this.props.navigation.state.params.updateCard(id, card)
        .then((deck) => {
            this.setState({ deck });            
            this.props.navigation.setParams({ deck });
            console.log('updateCard CB: state: ',this.state.deck);
            this.setModalVisible('editCard', false);
        });
    }

    deleteCard(cardId){
        console.log('deleteCard');
        
        const id = this.state.id;
        
        console.log('deleteCard:', cardId);
        
        this.props.navigation.state.params.deleteCard(id, cardId)
        .then((deck) => {
            this.setState({ deck });            
            this.props.navigation.setParams({ deck });
            console.log('deleteCard CB: state: ',this.state.deck);
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

        console.log('handleFormError', message, modal, errorMessages[modal]);
        console.log('handleFormError', this.state.errorMessages);
    }

    clearFormError(modal){
        const errorMessages = { ...this.state.errorMessages }
        errorMessages[modal] = '';
        this.setState({ errorMessages });
    }

    emptyListComponent() {

        Animated.loop(
            Animated.sequence([
              Animated.timing(this.state.bounceValue, { duration: 200, toValue: 20}),
              Animated.spring(this.state.bounceValue, { toValue: 1, friction: 4})
            ])
        ).start();

        return (
            <View style={{ display: 'flex', margin: 15, flex: 1, backgroundColor: 'red', flexGrow: 1 }}>
                <Text style={{ color: '#901C7E', marginBottom: 20, display: 'flex', backgroundColor: '#999' }}>You haven't got any decks yet, tap "Add Deck" below to get create one!</Text>

                <Animated.View style={{ marginTop: this.state.bounceValue, bottom: 60, display: 'flex', flex: 1 }}>
                    <Icon
                        name='hand-o-down'
                        type='font-awesome'
                        color='#901C7E'
                        size={50}
                    />
                </Animated.View>
            </View>
        );
    }

    render() {

        const deck = this.state.deck ? JSON.parse(this.state.deck) : {};
        const questions = deck.questions;
        const { modals } = this.state;
        
        (questions.length === 0 && Object.values(modals).every(visible => visible === false)) && this.playAnimation();
        
        const errorMessages = this.state.errorMessages;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10, marginBottom: 10 }}>
                    <Icon
                        name='cards-outline'
                        type='material-community'
                        color='#667'
                    // containerStyle={{ backgroundColor:  }}
                    />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#667', marginLeft: 5, marginTop: 1 }}>CARDS</Text>
                </View>
                <View style={{ borderTopWidth: 1, borderColor: '#bbb' }}>
                </View>

                {(questions.length > 0) && (
                    <FlatList
                        data={questions}
                        contentContainerStyle={{ flexGrow: 1 }}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ 
                                    display: 'flex', flexDirection: 'row', flex: 1,
                                    borderBottomColor: '#bbb', borderBottomWidth: 1, justifyContent: 'space-between',
                                    paddingTop: 5, paddingBottom: 5
                                    }}>
                                    <View style={{ flex: 1, display: 'flex', flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                                        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
                                            <Text style={{ color: '#901C7E', fontWeight: 'bold', marginLeft: 2 }}>Q: {truncate(item.question)}</Text>
                                        </View>

                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end' }}>

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

                                                console.log('EditCard button, currentCard', this.state.currentCard);
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
                    <React.Fragment>
                        <View style={{ borderTopWidth: 1, borderColor: '#bbb' }}>
                        </View>

                        <View style={{ flex: 1, margin: 15, justifyContent: 'space-between', display: 'flex' }}>
                            <Text style={{ color: '#901C7E', marginBottom: 20 }}>You haven't got any cards yet, tap "Add Card" below to get create one!</Text>

                            <Animated.View style={{ bottom: this.state.bounceValue, left: 30, display: 'flex', alignSelf: 'flex-start' }}>
                                <Icon
                                    name='hand-o-down'
                                    type='font-awesome'
                                    color='#901C7E'
                                    size={50}
                                />
                            </Animated.View>
                        </View>

                    </React.Fragment>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 
                }}>
                    <Button
                        raised
                        backgroundColor={'#291CA9'}
                        buttonStyle={{ height: 43 }}
                        containerViewStyle={{ marginLeft: 0, marginRight: 0 }}                        
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
                        buttonStyle={{ height: 43 }}
                        containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
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
                        buttonStyle={{ height: 43 }}
                        containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
                        icon={{ name: 'pencil', type: 'foundation' }}
                        title='Edit Deck'
                        onPress={() => {
                            this.setModalVisible('editTitle', true);
                        }}
                    />
                </View>
                
                {
                //Edit Title
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modals.editTitle}
                    onRequestClose={() => {
                        this.setModalVisible('editTitle', false);
                    }}
                >

                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                        <Icon
                            name='pencil'
                            type='foundation'
                            color='#667'
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#667', marginLeft: 5, marginTop: 1 }}>EDIT DECK</Text>
                    </View>
                    <FormLabel labelStyle={{ color: '#901D7E' }}>Name</FormLabel>
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

                {
                //Add Card
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modals.addCard}
                    onRequestClose={() => {
                        this.setModalVisible('addCard', false);
                    }}
                >

                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                        <Icon
                            name='plus'
                            type='font-awesome'
                            color='#667'
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#667', marginLeft: 5, marginTop: 1 }}>ADD CARD</Text>
                    </View>
                    <FormLabel labelStyle={{ color: '#901D7E' }}>Question</FormLabel>
                    <FormInput
                        onChangeText={
                            (question) => {
                                const newCard = { ...this.state.newCard }
                                newCard.question = question;
                                this.setState({ newCard });
                            }
                        }
                    />
                    <FormLabel labelStyle={{ color: '#901D7E' }}>Answer</FormLabel>
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

                {
                //Edit Card
                }            
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modals.editCard}
                    onRequestClose={() => {
                        this.setModalVisible('editCard', false);
                    }}
                >

                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                        <Icon
                            name='pencil'
                            type='foundation'
                            color='#667'
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#667', marginLeft: 5, marginTop: 1 }}>EDIT CARD</Text>
                    </View>
                    <FormLabel labelStyle={{ color: '#901D7E' }}>Question</FormLabel>
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
                    <FormLabel labelStyle={{ color: '#901D7E' }}>Answer</FormLabel>
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