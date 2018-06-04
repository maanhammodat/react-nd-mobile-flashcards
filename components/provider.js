import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import store from 'react-native-simple-store';
import { Alert } from 'react-native';
import { withNavigation } from 'react-navigation';

const base = [
  {
    id: 1,
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
  {
    id: 2,
    title: 'JavaScript',
    questions: [
      {
        id: 3,
        question: 'What is a closure?',
        answer: 'The combination of a function and the lexical environment within which that function was declared.'
      }
    ]
  }
]
// const base = {
//   React: {
//     title: 'React!',
//     questions: [
//       {
//         id: 1,
//         question: 'What is React?',
//         answer: 'A library for managing user interfaces'
//       },
//       {
//         id: 2,
//         question: 'Where do you make Ajax requests in React?',
//         answer: 'The componentDidMount lifecycle event'
//       }
//     ]
//   },
//   JavaScript: {
//     title: 'JavaScript',
//     questions: [
//       {
//         id: 3,
//         question: 'What is a closure?',
//         answer: 'The combination of a function and the lexical environment within which that function was declared.'
//       }
//     ]
//   }
// }

export const AppContext = React.createContext();

export class AppProvider extends React.Component {

  constructor( props ) {
      // allow the user this in constructor
      super( props );

      // set default state
      this.state = {
        decks: {}
      }

      // only needed if used in a callback
      this.addDeck = this.addDeck.bind(this);
      this.updateTitle = this.updateTitle.bind(this);
      this.addCardToDeck = this.addCardToDeck.bind(this);
      this.updateCard = this.updateCard.bind(this);
      this.deleteDeck = this.deleteDeck.bind(this);
      this.deleteCard = this.deleteCard.bind(this);
  }
  
  componentDidMount() {

    // store.save('decks', base)
    //   .then((decks) => {

    //     this.setState({ decks })

    //   });
    
    //store.delete('decks');

    store.get('decks').then((decks) => {

        if(decks){
          console.log('Decks found in AS');
          this.setState({ decks });

        }else{

          store.save('decks', base).then(() => {

            store.get('decks').then((decks) => {
              console.log('Decks not found in AS, had to push');
              this.setState({ decks });
            })

          });
        }

      });

  }

  addDeck(deck, key) {
    
    let _this = this;

    return new Promise(function (resolve, reject) {
      console.log('addDeck: called..');
      store.push('decks', deck)
      .then(() => store.get('decks'))
      .then(decks => {
        _this.setState({ decks });
        console.log('addDeck: deck added!',JSON.stringify(decks));

        resolve();
      })
    });
    
    
  }

  updateTitle(id, title) {

    let decks = this.state.decks;
    let _this = this;
    
    return new Promise(function (resolve, reject) {

      console.log('updateTitle: called..');
      decks = decks.map((deck) => deck.id === id ? Object.assign({}, deck, {title}) : deck );
      console.log('updateTitle: deck title edited..');
      
      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {
        _this.setState({ decks });
        console.log('updateTitle: decks updated in AS and state!');
        resolve();
      });
    });

  }

  addCardToDeck(id, card) {

    let decks = this.state.decks;
    let _this = this;

    return new Promise(function (resolve, reject) {

      console.log('addCardToDeck: called..');
      decks = decks.map((deck) => {
        deck.id === id && deck["questions"].push(card);
        return deck;
      });
      console.log('addCardToDeck: deck card created..');

      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {
        _this.setState({ decks });
        const updatedDeck = decks.filter(deck => deck.id === id);
        console.log('addCardToDeck: decks updated in AS and state!');
        resolve(JSON.stringify(updatedDeck[0]));
      });

    });

  }

  updateCard(id, card) {

    let decks = this.state.decks;
    const _this = this;
    const cardId = card.id

    return new Promise(function (resolve, reject) {

      console.log('editCard: called..');
      decks = decks.map((deck) => {
        //get questions by deck.id
        deck.id === id && (
          Object.assign(deck["questions"].find(card => card.id === cardId), card)
        );
        return deck;
      });
      console.log('editCard: deck card created..');

      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {
        _this.setState({ decks });
        const updatedDeck = decks.filter(deck => deck.id === id);
        console.log('editCard: decks updated in AS and state!');
        resolve(JSON.stringify(updatedDeck[0]));
      });

    });

  }

  deleteDeck(id){

    let decks = this.state.decks;
    const _this = this;

    return new Promise(function (resolve, reject) {

      console.log('deleteDeck: called..');
      decks = decks.filter((deck) => { 
        return deck.id !== id;
      });

      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {
        _this.setState({ decks });
        console.log('deleteDeck: decks updated in AS and state!');
        resolve();
      });

    });

  }

  deleteCard(id, cardId){
    
    let decks = this.state.decks;
    const _this = this;

    return new Promise(function (resolve, reject) {

      console.log('deleteDeck: called..');
      
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
        console.log('deleteCard: decks updated in AS and state!');
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