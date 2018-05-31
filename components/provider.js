import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import store from 'react-native-simple-store';
import { Alert } from 'react-native';

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
      this.editDeckTitle = this.editDeckTitle.bind(this);
  }
  
  componentDidMount() {

    // store.save('decks', base)
    //   .then((decks) => {

    //     this.setState({ decks })

    //   });
    
    // store.delete('decks');

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

      })

  }

  addDeck(deck) {
    
    console.log('addDeck: called..');
    store.push('decks', deck)
    .then(() => store.get('decks'))
    .then(decks => {
      this.setState({ decks });
      console.log('addDeck: deck added!');
      
    })
    
  }

  editDeckTitle(id, title) {

    let _this = this;
    let decks = _this.state.decks;

    return new Promise(function (resolve, reject) {

      console.log('editDeckTitle: called..');
      decks = decks.map((deck) => deck.id === id ? Object.assign({}, deck, {title}) : deck );
      console.log('editDeckTitle: deck title edited..');
      
      store.save('decks', decks)
      .then(() => store.get('decks'))
      .then(decks => {
        _this.setState({ decks });
        console.log('editDeckTitle: decks updated in AS and state!');
        resolve();
      });
    });

  }

  render() {
    return (
      <AppContext.Provider value={{
        decks: this.state.decks,
        addDeck: this.addDeck,
        editDeckTitle: this.editDeckTitle
      }}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}