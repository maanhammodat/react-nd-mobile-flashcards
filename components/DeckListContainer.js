import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native'
import { Tile, List, ListItem, Button, Text } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { AppContext } from './provider';

export default DeckListContainer = () => (
    <AppContext.Consumer>
        {context => <DeckList cards={context.cards} />}
    </AppContext.Consumer>
);

class DeckList extends Component {
    constructor(props) {
        super(props);

        this.showAlert = this.showAlert.bind(this);
    }
    state = {
        addDeck : false
    }

    showAlert(title){
        Alert.alert(
            `Title is ${title}`
        )
    }
    render() {
        const { cards } = this.props;
        const addDeck = this.state.addDeck;
        const list = Object.keys(cards);
        
        return (
            <View style={{ flex: 1 }}>

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
                    <View style={{ flex: 1 }}>
                        <List>
                            {
                                list.map((item, i) => (
                                    <ListItem
                                        key={i}
                                        title={cards[item]["title"]}
                                        badge={{value: cards[item]["questions"].length}}
                                        onPress={() => { 
                                            this.props.navigation.navigate('Deck', {
                                                card: JSON.stringify(cards[item]),
                                                title: cards[item]["title"]
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
                                    this.setState({ addDeck: true })
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