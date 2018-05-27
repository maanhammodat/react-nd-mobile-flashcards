import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import store from 'react-native-simple-store';

const base = {
  React: {
    title: 'React!',
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

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
  state = {
    decks: {}
  }
  componentDidMount() {

    // store.save('decks', base)
    //   .then(() => {

    //     this.setState({ decks: base })

    //   });
    store.get('decks')
      .then((decks) => {
        if(decks){
          this.setState({ decks })
        }else{
          store.save('decks', base)
          .then(() => {

            this.setState({ decks: base })

          });
        }
      })

  }
  render() {
    return (
      <AppContext.Provider value={{
        decks: this.state.decks,
      }}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}