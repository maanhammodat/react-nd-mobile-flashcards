import React from 'react';
import { Text, View } from 'react-native';
import { Constants } from 'expo';
import { AppProvider } from './components/provider';
import DeckListContainer from './components/DeckListContainer';
import DeckContainer from './components/DeckContainer';
import AddDeck from './components/AddDeck';
import { createStackNavigator } from 'react-navigation';


// export default class App extends React.Component {
//   render() {
//     return (
//       <AppProvider>
//         <Test/>
//       </AppProvider>
//     )
//   }
// }

const RootStack = createStackNavigator(
  {
    Home: DeckListContainer,
    AddDeck: AddDeck,
    Deck: DeckContainer
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