import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native';
import { Tile, List, ListItem, Button, Text, Icon, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
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
        deckTitle : '',
        errorMessage: ''
    }

    addDeck(){
        const title = this.state.deckTitle;
        
        if (!title){
            this.invalidTitle('no title');
            return;
        }

        if (title.length > 26) {
            this.invalidTitle('title too long');
            return;
        }
        
        const deck = {};

        deck.id = uuid.generate();
        deck.questions = [];
        deck.title = title;
        console.log('AddDeckForm addDeck:',deck);
        this.props.addDeck(deck);
        this.props.navigation.goBack();
    }

    invalidTitle(error){
        console.log('invalidTitle', error);
        const errorMessage = 
            (error === 'no title') ? 'Please enter a title' : 
            (error === 'title too long') ? 'The name you entered is too long, please shorten' : '';
        
        console.log('invalidTitle', errorMessage);
        this.setState({ errorMessage });
    }

    render() {
        const { errorMessage } = this.state;
        
        const validation = errorMessage ? (
            <FormValidationMessage containerStyle={{ marginBottom: 10 }}>
                {errorMessage}
            </FormValidationMessage>
        ) : null;

        console.log('errorMessage', errorMessage);
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                    <Icon
                        name='plus-box-outline'
                        type='material-community'
                        color='#667'
                    />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#667', marginLeft: 5, marginTop: 1 }}>ADD A DECK</Text>
                </View>
                <FormLabel labelStyle={{ color: '#901D7E' }}>Name</FormLabel>
                <FormInput
                    placeholder='Tap here to enter a title for the new deck'
                    onChangeText={deckTitle => this.setState(() => ({ deckTitle }))}
                />
                {validation}

                <View style={{ flexDirection: 'row' }}> 
                    <Button
                        raised
                        backgroundColor={'#59B324'}
                        containerViewStyle={{ flex: 1, display: 'flex' }}
                        icon={{ name: 'check', type: 'font-awesome' }}
                        title='SUBMIT'
                        onPress={() => {
                            this.addDeck();
                        }}
                    />
                    <Button
                        raised
                        backgroundColor={ '#cb2431' }
                        icon={{ name: 'ban', type: 'font-awesome' }}
                        containerViewStyle={{ flex: 1, display: 'flex' }}                        
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