import React, { Component } from 'react';
import { View, Image } from 'react-native'
import { Tile, List, ListItem } from 'react-native-elements';

export default class DeckList extends Component {
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
        }
    }
    render() {
        const { cards } = this.state;
        const list = Object.keys(cards);
        return (
            <View>

                <Tile
                    imageSrc={require('./brain.png')}
                    title="Flash Cards"
                    featured
                    titleStyle={{ 
                        marginTop: 230, 
                        fontSize: 40, 
                        textShadowColor: 'rgba(0, 0, 0, 0.85)',
                        textShadowOffset: {width: -1, height: 1},
                        textShadowRadius: 15
                    }}
                />
                <List>
                    {
                        list.map((item, i) => (
                            <ListItem
                                key={i}
                                title={item}
                                badge={{value: cards[item]["questions"].length}}
                            />
                        ))
                    }
                </List>
            </View>
        )
    }
}