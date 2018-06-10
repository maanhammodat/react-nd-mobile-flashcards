import React, { Component } from 'react';
import { View, Text, FlatList, Modal } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import * as uuid from '../utils/uuid';
import truncate from '../utils/truncate';

export default class DeckContainer extends Component {

    constructor(props) {
        super(props);

        this.updateTitle = this.updateTitle.bind(this);
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
                    containerStyle={{ marginRight: 20 }}
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

                // <Button
                //     onPress={() => {
                //         deleteDeck(id)
                //         .then(() => {
                //             console.log('deleteDeck component callback');
                //             navigation.navigate('Home');
                //         });
                //      }                        
                //     }
                //     title="Delete"
                //     color="#fff"
                // />
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
        errorMessages: { editTitle: '', addCard: '', editCard: '' }
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

        this.props.navigation.state.params.updateTitle(id, title)
        .then(() => {
            this.props.navigation.setParams({ title });
            this.setModalVisible('editTitle', false);
        });
    }
    addCardToDeck() {

        const card = this.state.newCard;

        if (card.question === '' || card.answer === '') return;

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

        const card = this.state.currentCard;
        console.log('updateCard: ',card);

        if (card.question === '' || card.answer === '' || card.id === '') return;
        
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

    render() {

        const deck = this.state.deck ? JSON.parse(this.state.deck) : {};
        const questions = deck.questions;
        console.log('this.state.errorMessages', this.state.errorMessages);
        //console.log('DeckContainer rendered, state:',this.state.newCard);
        const errorMessages = this.state.errorMessages;
        // const validation = errorMessage ? (
        //     <FormValidationMessage containerStyle={{ marginBottom: 10 }}>
        //         {errorMessage}
        //     </FormValidationMessage>
        // ) : null;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10, marginBottom: 10 }}>
                    <Icon
                        name='cards-outline'
                        type='material-community'
                        color='#667'
                    // containerStyle={{ backgroundColor:  }}
                    />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#667' }}>CARDS</Text>
                </View>
                <View style={{ borderTopWidth: 1, borderColor: '#bbb' }}>
                </View>
                <FlatList
                    data={questions}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ 
                                display: 'flex', flexDirection: 'row', flex: 1,
                                borderBottomColor: '#bbb', borderBottomWidth: 1,
                                paddingTop: 5, paddingBottom: 5
                                }}>
                                <View style={{ flex: 2, display: 'flex', flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                                    <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignSelf: 'center'  }}>
                                        <Text style={{ color: '#901C7E', fontWeight: 'bold', marginLeft: 2 }}>Q: {truncate(item.question)}</Text>
                                    </View>

                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>

                                    <Icon
                                        reverse
                                        reverseColor={'#fff'}
                                        name='pencil'
                                        type='foundation'
                                        color='#11549F'
                                        size={18}
                                        underlayColor={'transparent'}
                                        onPress={() => {
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
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 
                }}>
                    <Button
                        raised
                        backgroundColor={'#291CA9'}
                        containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
                        icon={{ name: 'plus', type: 'font-awesome' }}
                        title='Add Card'
                        onPress={() => {
                            this.setModalVisible('addCard', true);
                        }}
                    />
                    <Button
                        raised
                        backgroundColor={'#05A071'}
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

                    <Text h4 style={{ marginLeft: 20 }}>Edit Deck Title</Text>
                    <FormLabel>Title</FormLabel>
                    <FormInput
                        onChangeText={title => this.setState(() => ({ title }))}
                        value={this.state.title}
                    />
                    {errorMessages.editTitle !== '' &&(
                        <FormValidationMessage>{errorMessages.editTitle}</FormValidationMessage>
                        )
                    }
                    

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            raised
                            title='SUBMIT'
                            onPress={() => {
                                this.updateTitle();
                            }}
                        />
                        <Button
                            raised
                            icon={{ name: 'ban', type: 'font-awesome' }}
                            backgroundColor={'#cb2431'}
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

                    <Text h4 style={{ marginLeft: 20 }}>Add Card</Text>
                    <FormLabel>Question</FormLabel>
                    <FormInput
                        onChangeText={
                            (question) => {
                                const newCard = { ...this.state.newCard }
                                newCard.question = question;
                                this.setState({ newCard });
                            }
                        }
                    />
                    <FormLabel>Answer</FormLabel>
                    <FormInput
                        onChangeText={
                            (answer) => {
                                const newCard = { ...this.state.newCard }
                                newCard.answer = answer;
                                this.setState({ newCard });
                            }
                        }
                    />
                    <FormValidationMessage>Error message</FormValidationMessage>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            raised
                            title='SUBMIT'
                            onPress={() => {
                                this.addCardToDeck();
                                //console.log('add new card: ', this.state.question, this.state.answer);
                            }}
                        />
                        <Button
                            raised
                            icon={{ name: 'ban', type: 'font-awesome' }}
                            backgroundColor={'#cb2431'}
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

                    <Text h4 style={{ marginLeft: 20 }}>Edit Card</Text>
                    <FormLabel>Question</FormLabel>
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
                    <FormLabel>Answer</FormLabel>
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
                    <FormValidationMessage>Error message</FormValidationMessage>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            raised
                            title='SUBMIT'
                            onPress={() => {
                                this.updateCard();
                            }}
                        />
                        <Button
                            raised
                            icon={{ name: 'ban', type: 'font-awesome' }}
                            backgroundColor={'#cb2431'}
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