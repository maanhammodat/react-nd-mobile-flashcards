import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-elements';

export default class Deck extends Component {
    render() {
        const { navigation } = this.props;

        const { card } = this.props.navigation.state.params;
        
        const questions = card && JSON.parse(card).questions;
        
        return (
            <View>
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
                />
            </View>
        )
    }
}