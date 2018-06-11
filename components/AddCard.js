import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native';
import { Tile, List, ListItem, Button, Text } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { AppContext } from './provider';
import * as uuid from '../utils/uuid';

export default class AddCard extends Component {
    render() {
        return (
            <AppContext.Consumer>
                {context => 
                    <AddCardForm
                        addCardToDeck={context.addCardToDeck}
                        navigation={this.props.navigation}
                    />
                }
            </AppContext.Consumer>
        )
    }
};

class AddCardForm extends Component {

    state = {
        question: '',
        answer: ''
    }

    addCardToDeck() {

        const question = this.state.question;
        const answer = this.state.answer;

        if (!question || !answer) return;

        const deckId = this.props.navigation.state.params.id;

        const card = {}
        card.question = question;
        card.answer = answer;
        card.id = uuid.generate();
        console.log('addCardToDeck:',card);
        
        this.props.addCardToDeck(deckId, card)
        .then(() => {
            this.props.navigation.goBack();
        });
    }

    render() {
        
        return (
            <View style={{ flex: 1 }}>
                <Text h4 style={{ marginLeft: 20 }}>Add Card</Text>
                <FormLabel>Question</FormLabel>
                <FormInput
                    onChangeText={question => this.setState(() => ({ question }))}
                />
                <FormLabel labelStyle={{ color: '#901D7E' }}>Answer</FormLabel>
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
                        }}
                    />
                    <Button
                        raised
                        icon={{ name: 'ban', type: 'font-awesome' }}
                        backgroundColor={ '#cb2431' }
                        title='CANCEL'                             
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                </View>

            </View>
        )
    }

}