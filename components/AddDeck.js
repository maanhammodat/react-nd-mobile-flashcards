import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native';
import { Tile, List, ListItem, Button, Text } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { AppContext } from './provider';
import * as uuid from '../utils/uuid';

export default class AddDeck extends Component {
    render() {
        return (
            <AppContext.Consumer>
                {context => 
                    <AddDeckForm
                        addDeck={context.addDeck}
                        navigation={this.props.navigation}
                    />
                }
            </AppContext.Consumer>
        )
    }
};

class AddDeckForm extends Component {

    state = {
        deckTitle : ''
    }

    addDeck(){
        const title = this.state.deckTitle;

        if (!title) return;
        
        const deck = {};

        deck.id = uuid.generate();
        deck.questions = [];
        deck.title = title;
        this.props.addDeck(deck);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Text h4 style={{ marginLeft: 20 }}>Add a Deck</Text>
                <FormLabel>Name</FormLabel>
                <FormInput
                onChangeText={deckTitle => this.setState(() => ({ deckTitle }))}
                />
                <FormValidationMessage>Error message</FormValidationMessage>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        raised
                        title='SUBMIT'
                        onPress={() => {
                            this.addDeck();
                        }}
                    />
                    <Button
                        raised
                        icon={{ name: 'ban', type: 'font-awesome' }}
                        backgroundColor={ '#cb2431' }
                        title='CANCEL'                             
                        onPress={() => {
                            this.props.navigation.navigate('Home');
                        }}
                    />
                </View>

            </View>
        )
    }

}