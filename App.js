import React from 'react';
import { Text, View } from 'react-native';
import { Constants } from 'expo';
import { AppProvider } from './components/provider';
import DeckListContainer from './components/DeckListContainer';
import DeckContainer from './components/DeckContainer';
import AddDeck from './components/AddDeck';
import EditDeck from './components/EditDeck';
import AddCard from './components/AddCard';
import { createStackNavigator } from 'react-navigation';




const RootStack = createStackNavigator(
  {
    Home: DeckListContainer,
    AddDeck: AddDeck,
    Deck: DeckContainer,
    EditDeck: EditDeck,
    AddCard: AddCard
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return (
      <AppProvider>
        <RootStack />
      </AppProvider>
    )
  }
}
/**
 * TODO
 * 
 * Deck:
 *  -Edit Deck Title
 *  -Delete Deck
 * 
 * Card:
 *  -Add Card to Deck
 *  -Edit Card
 *  -Delete Card
 * 
 * Quiz:
 *  -Start Quiz
 * 
 */

// export default class App extends React.Component {
//   render() {
//     return (
//       <AppProvider>
//         <Test/>
//       </AppProvider>
//     )
//   }
// }