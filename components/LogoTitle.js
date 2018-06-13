import React from 'react';
import { View, Text, Image } from 'react-native';

const LogoTitle = () => {
    return (
      <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
        <Image
          source={require('../images/brain2.png')}
          style={{ width: 30, height: 30, marginLeft: 5 }}
        />
        <Text style={{ color: '#fff', marginLeft: 5, marginTop: 2, fontSize: 18, fontWeight: '900' }}>MOBILE FLASHCARDS</Text>
      </View>
    );
}

export default LogoTitle;