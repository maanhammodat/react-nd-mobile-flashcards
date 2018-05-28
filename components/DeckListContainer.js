import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native';
import { Tile, List, ListItem, Button, Text } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { AppContext } from './provider';
import * as uuid from '../utils/uuid';

export default class DeckListContainer extends Component {
    render() {
        return (
            <AppContext.Consumer>
                {context => 
                    <DeckList 
                        decks={context.decks}
                        addDeck={context.addDeck}
                        navigation={this.props.navigation}
                    />
                }
            </AppContext.Consumer>
        )
    }
};

class DeckList extends Component {
    constructor(props) {
        super(props);

        this.showAlert = this.showAlert.bind(this);
    }
    state = {
        addDeck : false
    }

    addDeck(title){
        const deck = {}
        deck.id = uuid.generate();
        deck.questions = [];
        deck.title = title;
        // Alert.alert('addDeck child', JSON.stringify(deck));
        this.props.addDeck(deck);
    }

    showAlert(title){
        Alert.alert(
            `Title is ${title}`
        )
    }
    render() {
        const { decks } = this.props;
        const addDeck = this.state.addDeck;
        console.log('render2',decks);
        return (
            <View style={{ flex: 1 }}>

                <Tile
                    imageSrc={require('../images/brain.png')}
                    title="Flash Cards v0.10"
                    featured
                    titleStyle={{ 
                        marginTop: 110, 
                        fontSize: 40, 
                        textShadowColor: 'rgba(0, 0, 0, 0.85)',
                        textShadowOffset: {width: -1, height: 1},
                        textShadowRadius: 15
                    }}
                    imageContainerStyle={{ height: 150 }}
                    containerStyle={{ height: 150 }}
                />

                {(!addDeck && (Object.keys(decks).length > 0)) && (
                    <View style={{ flex: 1 }}>
                        <List>
                            {
                                decks.map((item, i) => (
                                    <ListItem
                                        key={i}
                                        title={item["title"]}
                                        badge={{value: item["questions"].length}}
                                        onPress={() => { 
                                            this.props.navigation.navigate('Deck', {
                                                deck: JSON.stringify(item),
                                                title: item["title"]
                                            });
                                        }}
                                    />
                                ))
                            }
                        </List>
                        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                            <Button
                                raised
                                icon={{ name: 'plus', type: 'font-awesome' }}
                                title='Add Deck'
                                onPress={() => {
                                    //this.setState({ addDeck: true })
                                    this.addDeck('heyyyyo9');
                                }}
                            />
                        </View>
                    </View>
                )}

                {addDeck && (
                    <View>
                        <Text h4 style={{ marginLeft: 20 }}>Add a Deck</Text>
                        <FormLabel>Name</FormLabel>
                        <FormInput />
                        <FormValidationMessage>Error message</FormValidationMessage>
                        <Button
                            raised
                            title='SUBMIT'
                        />
                        <Button
                            raised
                            icon={{ name: 'ban', type: 'font-awesome' }}
                            backgroundColor={ '#cb2431' }
                            title='CANCEL'
                            onPress={() => {
                                this.setState({ addDeck: false })
                            }}
                        />
                    </View>
                )}

            </View>

            
        )
    }
}