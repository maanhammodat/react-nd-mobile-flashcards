import React, { Component } from 'react';
import { View, Text, FlatList, Modal } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { AppContext } from './provider';
import { NavigationActions } from 'react-navigation';
import * as uuid from '../utils/uuid';

export default class DeckContainer extends Component {

    constructor(props) {
        super(props);

        this.updateTitle = this.updateTitle.bind(this);
    }

    static navigationOptions = ({ navigation }) => {

        const params = navigation.state.params || {};
        const title = params.title;

        console.log('DeckContainer: navopts');

        return {
            headerTitle: title,
            headerRight: (
                <Button
                    onPress={() => alert('This is a button!')}
                    title="Delete"
                    color="#fff"
                />
            ),
        }
    };

    state = {
        id: this.props.navigation.state.params.id,
        title: this.props.navigation.state.params.title,
        deck: this.props.navigation.state.params.deck,
        modals: { updateTitle: false, addCard: false },
        //TODO: newCard: {question: '', answer: ''}
        question: '',
        answer: ''
    }

    setModalVisible(modal, visible) {
        const modals = { ...this.state.modals }
        modals[modal] = visible;
        this.setState({ modals });
    }
    updateTitle() {
        const { id, title } = this.state;

        if (!title) return;

        this.props.navigation.state.params.updateTitle(id, title)
        .then(() => {
            this.props.navigation.setParams({ title });
            this.setModalVisible('updateTitle', false);
        });
    }
    addCardToDeck() {

        const question = this.state.question;
        const answer = this.state.answer;

        if (!question || !answer) return;

        const id = this.state.id;

        const card = {}
        card.question = question;
        card.answer = answer;
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

    render() {

        const deck = this.state.deck ? JSON.parse(this.state.deck) : {};
        const questions = deck.questions;

        console.log('DeckContainer rendered, state:',this.state.deck);

        return (
            <View style={{ flex: 1 }}>

                <FlatList
                    data={questions}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ display: 'flex', flexDirection: 'row', flex: 1, marginBottom: 10 }}>
                                <Text style={{ width: '50%' }}>{item.question}</Text>
                                <Button
                                    raised
                                    title='Edit'
                                />
                                <Button
                                    raised
                                    title='Delete'
                                />
                            </View>
                        )
                    }}
                    keyExtractor={item => item.id.toString()}
                />
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        raised
                        title='Add Card'
                        onPress={() => {
                            this.setModalVisible('addCard', true);
                        }}
                    />
                    <Button
                        raised
                        title='Start Quiz'
                        onPress={() => {
                            this.setState({ addDeck: true })
                        }}
                    />
                    <Button
                        raised
                        title='Edit Deck'
                        onPress={() => {
                            this.setModalVisible('updateTitle', true);
                        }}
                    />
                </View>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modals.updateTitle}
                    onRequestClose={() => {
                        this.setModalVisible('updateTitle', false);
                    }}
                >

                    <Text h4 style={{ marginLeft: 20 }}>Edit Deck Title</Text>
                    <FormLabel>Title</FormLabel>
                    <FormInput
                        onChangeText={title => this.setState(() => ({ title }))}
                        value={this.state.title}
                    />
                    <FormValidationMessage>Error message</FormValidationMessage>

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
                                this.setModalVisible('updateTitle', false);
                            }}
                        />
                    </View>

                </Modal>

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
                        onChangeText={question => this.setState(() => ({ question }))}
                    />
                    <FormLabel>Answer</FormLabel>
                    <FormInput
                        onChangeText={answer => this.setState(() => ({ answer }))}
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


            </View>
        )
    }
}