import React, { Component } from 'react';
import { View, FlatList, Modal, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Text, Icon, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import * as uuid from '../utils/uuid';

export default class DeckList extends Component {
    
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

    componentDidMount(){
        this.shouldAnimate();
    }

    componentDidUpdate(){
        this.shouldAnimate();
    }

    shouldAnimate(){
        const { decks } = this.props;
        const { modal } = this.state;
        if (Object.keys(decks).length === 0 && !modal) {
            this.playAnimation();
        }
    }

    playAnimation(){

        Animated.loop(
            Animated.sequence([
              Animated.timing(this.state.bounceValue, { duration: 200, toValue: 15 }),
              Animated.spring(this.state.bounceValue, { toValue: 1, friction: 4 })
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
        this.props.addDeck(deck);
        this.setModalVisible(false);
        this.setState({ deckTitle: '', errorMessage: '' });
    }

    invalidTitle(error){
        
        const errorMessage = 
            (error === 'no title') ? 'Please enter a title' : 
            (error === 'title too long') ? 'The name you entered is too long, please shorten' : '';

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
            
            <View style={styles.container}>
                    
                <View style={styles.header}>
                    <Icon
                        name='cards-variant'
                        type='material-community'
                        color='#667'
                    />
                    <Text style={styles.headerTitle}>DECKS ({Object.keys(decks).length})</Text>
                </View>
                
                {(Object.keys(decks).length > 0) && (

                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={decks}
                            contentContainerStyle={{ flexGrow: 1 }}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.deckItem}
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
                                    >

                                        <View style={styles.deckTitleContainer}>
                                            
                                            <Text style={styles.deckTitle}>
                                                {item["title"]}
                                            </Text>

                                        </View>

                                        <View style={styles.deckControls}>

                                            <View style={styles.deckBadge}>
                                                <Text style={styles.deckBadgeText}>
                                                    {item["questions"].length}
                                                </Text>
                                            </View>

                                            <Icon
                                                name='navigate-next'
                                                color='#901C7E'
                                                size={25}
                                            />
                                            
                                        </View>

                                    </TouchableOpacity>

                                )
                            }}
                            keyExtractor={item => item["id"].toString()}
                        />
                    </View>

                )}
                    
                
                {(Object.keys(decks).length === 0) && (

                    <View style={styles.fallBackContainer}>
                        <Text style={{ color: '#901C7E' }}>You haven't got any decks yet, tap "Add Deck" below to get create one!</Text>

                        <Animated.View style={{ bottom: this.state.bounceValue, display: 'flex' }}>
                            <Icon
                                name='hand-o-down'
                                type='font-awesome'
                                color='#901C7E'
                                size={50}
                            />
                        </Animated.View>
                    </View>

                )}

                <View>
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

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modal}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}
                >

                    <View style={styles.modalHeader}>
                        <Icon
                            name='plus-box-outline'
                            type='material-community'
                            color='#667'
                        />
                        <Text style={styles.headerTitle}>ADD A DECK</Text>
                    </View>

                    <FormLabel labelStyle={styles.formLabel}>Name</FormLabel>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        marginTop: 10,
        paddingLeft: 10,
        paddingBottom: 10,
        borderBottomColor: '#bbb',
        borderBottomWidth: 1
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667',
        marginLeft: 5,
        marginTop: 1
    },
    deckItem: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        borderBottomColor: '#bbb',
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5
    },
    deckTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        flex: 1
    },
    deckTitle: {
        color: '#901C7E',
        fontWeight: 'bold',
        marginLeft: 2,
        marginRight: 10,
        flexDirection: 'column',
        alignSelf: 'center',
        display: 'flex'
    },
    deckControls: {
        display: 'flex',
        flexDirection: 'row'
    },
    deckBadge: {
        backgroundColor: '#901C7E',
        borderRadius: 20,
        paddingHorizontal: 10,
        display: 'flex',
        flexDirection: 'row'
    },
    deckBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        flexDirection: 'column',
        alignSelf: 'center',
        display: 'flex'
    },
    fallBackContainer: {
        justifyContent: 'space-between',
        display: 'flex',
        margin: 15,
        flex: 1
    },
    modalHeader: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 10
    },
    formLabel: {
        color: '#901D7E'
    }
});