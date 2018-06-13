import React, { Component } from 'react';
import { AppContext } from './Provider';
import DeckList from './DeckList';

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