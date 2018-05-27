import React from 'react';
import { View, Text } from 'react-native';
import { Constants } from 'expo'
import DeckList from './components/DeckList';
import Deck from './components/Deck';
import { createStackNavigator } from 'react-navigation';
import store from 'react-native-simple-store';
import { Button } from 'react-native-elements';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View>
//         <View style={{ height: Constants.statusBarHeight }}></View>
//         <DeckList />
//       </View>
//     );
//   }
// }

const RootStack = createStackNavigator(
  {
    Home: DeckList,
    Deck: Deck
  },
  {
    initialRouteName: 'Home',
  }
);

const base = {
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

export default class App extends React.Component {
  state = {
    cards: {}
  }
  componentDidMount(){

    store.get('cards').then((cards) => {
      this.setState({ 
        cards
      })
    })
    
  }
  addCard(){
    store.save('cards', base)
    .then(() => {

      this.setState({ cards: base })

    });
  }
  render() {
    let c = JSON.stringify(this.state.cards);
    
    return (
      <View style={{ flex: 1, height: Constants.statusBarHeight }}>
        <Text style={{ flex: 1, marginTop: 40 }}>
        {/* <RootStack /> */}
        1 Cards: {c}
        </Text>
        <Button
          raised
          title='Add Card'
          onPress={() => {
            this.addCard()
          }}
        />
      </View>
    )
  }
}