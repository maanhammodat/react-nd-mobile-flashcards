import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native';
import { Tile, List, ListItem, Button, Text } from 'react-native-elements';
import { AppContext } from './provider';

export default class DeckListContainer extends Component {
    render() {
        return (
            <AppContext.Consumer>
                {context => 
                    <DeckList 
                        navigation={this.props.navigation}
                        decks={context.decks}
                        addDeck={context.addDeck}
                        updateTitle={context.updateTitle}
                        deleteDeck={context.deleteDeck}
                        addCardToDeck={context.addCardToDeck}
                        updateCard={context.updateCard}                      
                        deleteCard={context.deleteCard}
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
        decks: this.props.decks
    }

    showAlert(title){
        Alert.alert(
            `Title is ${title}`
        )
    }
    render() {

        const { decks } = this.props;

        return (
            <View style={{ flex: 1 }}>                
                <Tile
                    imageSrc={require('../images/brain.png')}
                    title="Flash Cards v0.21"
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

                
                    <View style={{ flex: 1 }}>
                        {(Object.keys(decks).length > 0) && (
                        <List>
                            {
                                decks.map((item, i) => (
                                    <ListItem
                                        key={i}
                                        title={item["title"]}
                                        badge={{value: item["questions"].length}}
                                        onPress={() => { 
                                            this.props.navigation.navigate('Deck', {
                                                id: item["id"],
                                                title: item["title"],
                                                deck: JSON.stringify(item),                                                
                                                updateTitle: (id, title) => this.props.updateTitle(id, title),
                                                addCardToDeck: (id, card) => this.props.addCardToDeck(id, card),
                                                updateCard: (id, title) => this.props.updateCard(id, title),
                                                deleteDeck: (id) => this.props.deleteDeck(id),
                                                deleteCard: (id, cardId) => this.props.deleteCard(id, cardId)
                                            });
                                        }}
                                    />
                                ))
                            }
                        </List>
                        )}
                        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                            <Button
                                raised
                                icon={{ name: 'plus', type: 'font-awesome' }}
                                title='Add Deck'
                                onPress={() => {
                                    this.props.navigation.navigate('AddDeck');
                                }}
                            />
                        </View>
                    </View>
                

            </View>

            
        )
    }
}