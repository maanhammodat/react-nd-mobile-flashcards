import React, { Component } from 'react';
import { View, Image, Modal, Animated } from 'react-native';
import { Tile, List, ListItem, Button, Text, Icon, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { AppContext } from './provider';
import * as uuid from '../utils/uuid';

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
    }
    
    state = {
        decks: this.props.decks,
        modal: false,
        deckTitle : '',
        errorMessage: '',
        bounceValue: new Animated.Value(1)
    }

    componentDidUpdate(){
        const { decks } = this.props;
        const { modal } = this.state;
        if(Object.keys(decks).length === 0 && !modal){
            this.playAnimation();
        }
    }

    playAnimation(){
        console.log('playanimation');
        Animated.loop(
            Animated.sequence([
              Animated.timing(this.state.bounceValue, { duration: 200, toValue: 20}),
              Animated.spring(this.state.bounceValue, { toValue: 1, friction: 4})
            ])
        ).start();
    }
    
    setModalVisible(visible) {
        this.setState({ 
            modal: visible, 
            errorMessage: '' 
        });
    }    

    addDeck(){
        
        const title = this.state.deckTitle;

        if (!title){
            this.invalidTitle('no title');
            return;
        }

        if (title.length > 26) {
            this.invalidTitle('title too long');
            return;
        }

        const deck = {};

        deck.id = uuid.generate();
        deck.questions = [];
        deck.title = title;
        console.log('AddDeckForm addDeck:',deck);
        this.props.addDeck(deck);
        this.setModalVisible(false);
        this.setState({ deckTitle: '', errorMessage: '' });
    }

    invalidTitle(error){
        console.log('invalidTitle', error);
        const errorMessage = 
            (error === 'no title') ? 'Please enter a title' : 
            (error === 'title too long') ? 'The name you entered is too long, please shorten' : '';

        console.log('invalidTitle', errorMessage);
        this.setState({ errorMessage });
    }

    render() {

        const { decks } = this.props;

        const { errorMessage, bounceValue } = this.state;

        const validation = errorMessage ? (
            <FormValidationMessage containerStyle={{ marginBottom: 10 }}>
                {errorMessage}
            </FormValidationMessage>
        ) : null;

        return (
            
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* <Tile
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
                /> */}
                    
                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10, marginBottom: 10 }}>
                    <Icon
                        name='cards-variant'
                        type='material-community'
                        color='#667'
                        // containerStyle={{ backgroundColor:  }}
                    />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#667', marginLeft: 5, marginTop: 1 }}>DECKS</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {(Object.keys(decks).length > 0) && (
                        <View style={{ flex: 1, marginTop: -10 }}>
                            <List>
                                {
                                    decks.map((item, i) => (
                                        <ListItem
                                            key={i}
                                            containerStyle={{ backgroundColor: '#fff' }}
                                            titleStyle={{ color: '#901C7E', fontWeight: 'bold' }}
                                            title={item["title"]}
                                            badge={{ value: item["questions"].length, textStyle: { color: '#fff' }, containerStyle: { backgroundColor: '#901C7E' }}}
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
                        </View>
                    )}
                    {(Object.keys(decks).length === 0) && (
                        <React.Fragment>
                            <View style={{ borderTopWidth: 1, borderColor: '#bbb' }}>
                            </View>
                            <View style={{ display: 'flex', margin: 15 }}>
                                <Text style={{ color: '#901C7E', marginBottom: 20 }}>You haven't got any decks yet, tap "Add Deck" below to get create one!</Text>
                                
                                <Animated.View style={{marginTop: bounceValue}}>
                                    <Icon
                                        name='hand-o-down'
                                        type='font-awesome'
                                        color='#901C7E'
                                        size={50}
                                    />
                                </Animated.View>
                            </View>
                        </React.Fragment>
                        // <Text>You haven't added anything yet, tap "Add Deck" below to get started.</Text>
                    )}
                    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                        <Button
                            raised
                            backgroundColor={'#291CA9'}
                            icon={{ name: 'plus', type: 'font-awesome' }}
                            title='Add Deck'
                            onPress={() => {
                                this.setModalVisible(true);
                            }}
                        />
                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modal}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}
                >

                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                        <Icon
                            name='plus-box-outline'
                            type='material-community'
                            color='#667'
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#667', marginLeft: 5, marginTop: 1 }}>ADD A DECK</Text>
                    </View>
                    <FormLabel labelStyle={{ color: '#901D7E' }}>Name</FormLabel>
                    <FormInput
                        placeholder='Tap here to enter a title for the new deck'
                        onChangeText={deckTitle => this.setState(() => ({ deckTitle }))}
                    />
                    {validation}

                    <View style={{ flexDirection: 'row' }}> 
                        <Button
                            raised
                            backgroundColor={'#59B324'}
                            containerViewStyle={{ flex: 1, display: 'flex' }}
                            icon={{ name: 'check', type: 'font-awesome' }}
                            title='SUBMIT'
                            onPress={() => {
                                this.addDeck();
                            }}
                        />
                        <Button
                            raised
                            backgroundColor={ '#cb2431' }
                            icon={{ name: 'ban', type: 'font-awesome' }}
                            containerViewStyle={{ flex: 1, display: 'flex' }}                        
                            title='CANCEL'                             
                            onPress={() => {
                                this.setModalVisible(false);
                            }}
                        />
                    </View>


                </Modal>
                

            </View>

            
        )
    }
}