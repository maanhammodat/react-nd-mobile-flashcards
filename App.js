import React from 'react';
import { View, Image, Text, StatusBar } from 'react-native';
import { Constants } from 'expo';
import { AppProvider } from './components/provider';
import DeckListContainer from './components/DeckListContainer';
import DeckContainer from './components/DeckContainer';
import AddDeck from './components/AddDeck';
import EditDeck from './components/EditDeck';
import AddCard from './components/AddCard';
import Quiz from './components/Quiz';
import { createStackNavigator } from 'react-navigation';
import { setLocalNotification } from './utils/notification';

/**
 * TODO:
 * -Move LogoTitle into component
 * -CSS / Layout
 * -Lock orientation
 * -Readme -> test on Android only
 * -Scrollview infinite (Change DeckListContainer List into FlatList)
 * -File structure tidy up
 */

class LogoTitle extends React.Component {
  render() {
    return (
      <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
        <Image
          source={require('./images/brain2.png')}
          style={{ width: 30, height: 30, marginLeft: 5 }}
        />
        <Text style={{ color: '#fff', marginLeft: 5, marginTop:2, fontSize: 18, fontWeight: '900' }}>MOBILE FLASHCARDS</Text>
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: DeckListContainer,
    AddDeck: AddDeck,
    Deck: DeckContainer,
    EditDeck: EditDeck,
    AddCard: AddCard,
    Quiz: Quiz
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerTitle: <LogoTitle />,
      headerStyle: {
        backgroundColor: '#2d32cc',
      },
      headerTitleStyle: {
        color: '#fff',
      },
      headerTintColor: '#fff',
    }
  }
);

export default class App extends React.Component {
  
  componentDidMount(){
    setLocalNotification();
  }

  render() {
    return (
      <AppProvider>
        <RootStack />
      </AppProvider>
    )
  }
}

// export default class App extends React.Component {
//   render() {
//     return (
//       <AppProvider>
//         <Test/>
//       </AppProvider>
//     )
//   }
// }