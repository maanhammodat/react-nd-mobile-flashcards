import React, { Component } from 'react';
import store from 'react-native-simple-store';

export const AppContext = React.createContext();

export class AppProvider extends Component {

  constructor( props ) {
    
      super( props );

      this.state = {
        decks: {}
      }

      this.addDeck = this.addDeck.bind(this);
      this.updateTitle = this.updateTitle.bind(this);
      this.addCardToDeck = this.addCardToDeck.bind(this);
      this.updateCard = this.updateCard.bind(this);
      this.deleteDeck = this.deleteDeck.bind(this);
      this.deleteCard = this.deleteCard.bind(this);
  }
  
  componentDidMount() {

    store.get('decks').then((decks) => {
        
      decks && this.setState({ decks });

    });

  }

  addDeck(deck) {
    
    let _this = this;

    return new Promise(function (resolve, reject) {
      
      store.push('decks', deck)
      .then(() => store.get('decks'))
      .then(decks => {

        _this.setState({ decks });
        resolve();

      });

    });
    
  }

  updateTitle(id, title) {

    let decks = this.state.decks;
    let _this = this;
    
    return new Promise(function (resolve, reject) {

      decks = decks.map((deck) => deck.id === id ? Object.assign({}, deck, {title}) : deck );
      
      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {

        _this.setState({ decks });
        resolve();

      });

    });

  }

  addCardToDeck(id, card) {

    let decks = this.state.decks;
    let _this = this;

    return new Promise(function (resolve, reject) {
      
      decks = decks.map((deck) => {
        deck.id === id && deck["questions"].push(card);
        return deck;
      });

      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {

        _this.setState({ decks });
        const updatedDeck = decks.filter(deck => deck.id === id);
        resolve(JSON.stringify(updatedDeck[0]));

      });

    });

  }

  updateCard(id, card) {

    let decks = this.state.decks;
    const _this = this;
    const cardId = card.id

    return new Promise(function (resolve, reject) {
      
      decks = decks.map((deck) => {
        deck.id === id && (
          Object.assign(deck["questions"].find(card => card.id === cardId), card)
        );
        return deck;
      });

      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {

        _this.setState({ decks });
        const updatedDeck = decks.filter(deck => deck.id === id);
        resolve(JSON.stringify(updatedDeck[0]));

      });

    });

  }

  deleteDeck(id){

    let decks = this.state.decks;
    const _this = this;

    return new Promise(function (resolve, reject) {

      decks = decks.filter((deck) => { 
        return deck.id !== id;
      });

      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {

        _this.setState({ decks });
        resolve();

      });

    });

  }

  deleteCard(id, cardId){
    
    let decks = this.state.decks;
    const _this = this;

    return new Promise(function (resolve, reject) {
      
      decks = decks.map((deck) => {
        if(deck.id === id){
          const questions = deck["questions"].filter((question) => {
            return question.id !== cardId;
          });
          deck["questions"] = questions;
        }
        return deck;
      });

      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {

        _this.setState({ decks });
        const updatedDeck = decks.filter(deck => deck.id === id);
        resolve(JSON.stringify(updatedDeck[0]));

      });

    });

  }

  render() {
    return (
      <AppContext.Provider value={{
        decks: this.state.decks,
        addDeck: this.addDeck,
        updateTitle: this.updateTitle,
        deleteDeck: this.deleteDeck,
        addCardToDeck: this.addCardToDeck,
        updateCard: this.updateCard,
        deleteCard: this.deleteCard
      }}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}