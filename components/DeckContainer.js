import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { AppContext } from './provider';

export default class DeckContainer extends Component {

    static navigationOptions = ({ navigation }) => {

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
    
    render(){
        return(
            <AppContext.Consumer>
                {context => 
                    <Deck 
                        navigation={this.props.navigation}
                    />
                }
            </AppContext.Consumer>
        )    
    }
}
    

class Deck extends Component {

    
    
    render() {
        //const { navigation } = this.props;

        const { deck } = this.props.navigation.state.params;
        
        const questions = deck && JSON.parse(deck).questions;
        
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
                            this.setState({ addDeck: true })
                        }}
                    />
                </View>
            </View>
        )
    }
}