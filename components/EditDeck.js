import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native';
import { Tile, List, ListItem, Button, Text } from 'react-native-elements';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { AppContext } from './provider';
import { NavigationActions } from 'react-navigation';

export default class EditDeck extends Component {
    render() {
        return (
            <AppContext.Consumer>
                {context => 
                    <EditDeckForm
                        editDeckTitle={context.editDeckTitle}
                        navigation={this.props.navigation}
                    />
                }
            </AppContext.Consumer>
        )
    }
};

class EditDeckForm extends Component {

    state = {
        deckTitle: this.props.navigation.state.params.title
    }

    editDeckTitle(){
        const setParamsAction = NavigationActions.setParams({
          params: { title: 'Hello' },
          key: 'Deck',
        });
        this.props.navigation.dispatch(setParamsAction);
        
        const id = this.props.navigation.state.params.id;
        const title = this.state.deckTitle;

        if (!title) return;
        
        this.props.editDeckTitle(id, title)
        .then(() => {
            this.props.navigation.goBack();
        });
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <Text h4 style={{ marginLeft: 20 }}>Edit Deck Title</Text>
                <FormLabel>Title</FormLabel>
                <FormInput
                    onChangeText={deckTitle => this.setState(() => ({ deckTitle }))}
                    value={this.state.deckTitle}
                />
                <FormValidationMessage>Error message</FormValidationMessage>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        raised
                        title='SUBMIT'
                        onPress={() => {
                            this.editDeckTitle();
                        }}
                    />
                    <Button
                        raised
                        icon={{ name: 'ban', type: 'font-awesome' }}
                        backgroundColor={ '#cb2431' }
                        title='CANCEL'                             
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                </View>

            </View>
        )
    }

}