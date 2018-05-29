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
        addDeck : true
    }

    showAlert(title){
        Alert.alert(
            `Title is ${title}`
        )
    }
    render() {
        const { decks } = this.props;
        const addDeck = this.state.addDeck;
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

                {(Object.keys(decks).length > 0) && (
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
                                    //this.addDeck('heyyyyo9');
                                    this.props.navigation.navigate('AddDeck');
                                }}
                            />
                        </View>
                    </View>
                )}

            </View>

            
        )
    }
}