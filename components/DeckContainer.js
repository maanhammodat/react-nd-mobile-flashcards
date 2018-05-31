import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { AppContext } from './provider';

export default class DeckContainer extends Component {
    //TODO: try moving navigationOptions to Deck
    //Then edit title through callback function on goback:
    //https://stackoverflow.com/questions/44223727/react-navigation-goback-and-update-parent-state
    static navigationOptions = ({ navigation }) => {
        console.log('DeckContainer: navopts');
        const params = navigation.state.params || {};
        const title = params.title;

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
        deck: this.props.navigation.state.params.deck,
        title: this.props.navigation.state.params.title
    }
    
    updateTitle(){

    }

    render(){
        console.log('DeckContainer: render');
        return(
            <AppContext.Consumer>
                {context => 
                    <Deck 
                        decks={context.decks}
                        navigation={this.props.navigation}
                    />
                }
            </AppContext.Consumer>
        )    
    }
}
    

class Deck extends Component {

    state = {
        deck: this.props.navigation.state.params.deck,
        decks: this.props.decks,
        title: ''
    }
    
    render() {

        let deck = this.state.deck;
        deck = deck ? JSON.parse(deck) : {};
        
        const questions = deck.questions;
        const title = deck.title;
        const id = deck.id;

        console.log('Deck: title',title);
        
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
                            this.setState({ addDeck: true })
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
                            this.props.navigation.navigate('EditDeck', {
                                id,
                                title
                            });
                        }}
                    />
                </View>
            </View>
        )
    }
}