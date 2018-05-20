import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native'
import { Tile, List, ListItem, Button, Text } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

export default class DeckList extends Component {
    constructor(props) {
        super(props);

        this.showAlert = this.showAlert.bind(this);
    }
    state = {
        cards : {
            React: {
                title: 'React',
                questions: [
                    {
                        id: 1,
                        question: 'What is React?',
                        answer: 'A library for managing user interfaces'
                    },
                    {
                        id: 2,
                        question: 'Where do you make Ajax requests in React?',
                        answer: 'The componentDidMount lifecycle event'
                    }
                ]
            },
            JavaScript: {
                title: 'JavaScript',
                questions: [
                    {
                        id: 3,
                        question: 'What is a closure?',
                        answer: 'The combination of a function and the lexical environment within which that function was declared.'
                    }
                ]
            }
        },
        addDeck : false
    }

    showAlert(title){
        Alert.alert(
            `Title is ${title}`
        )
    }
    render() {
        const { cards, addDeck } = this.state;
        const list = Object.keys(cards);
        
        return (
            <View>

                <Tile
                    imageSrc={require('../images/brain.png')}
                    title="Flash Cards v0.2"
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
                {!addDeck && (
                    <View>
                        <Button
                            raised
                            icon={{ name: 'plus', type: 'font-awesome' }}
                            title='Add Deck'
                            onPress={() => {
                                this.setState({ addDeck: true })
                            }}
                        />
                        <List>
                            {
                                list.map((item, i) => (
                                    <ListItem
                                        key={i}
                                        title={item}
                                        badge={{value: cards[item]["questions"].length}}
                                        onPress={() => { 
                                            this.props.navigation.navigate('Deck', {
                                                card: JSON.stringify(cards[item])
                                            });
                                        }}
                                    />
                                ))
                            }
                        </List>
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