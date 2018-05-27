import React from 'react';
import { AppContext } from './provider';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

export default class Test extends React.Component {
    render() {
        return (
            <View style={{marginTop:40}}>
                <AppContext.Consumer>
                    {(context) => (
                        <View>
                            <Text>Cards: {JSON.stringify(context.cards)}</Text>                            
                        </View>
                        
                    )}                
                </AppContext.Consumer>
            </View>
            // <View>
            //     <MyContext.Consumer>
            //         {/* {(context) => (
            //             <View>
            //                 <Text>Age: {context.state.age}</Text>
            //                 <Text>Name: {context.state.name}</Text>
            //                 <Button
            //                     raised
            //                     title='Grow Older'
            //                     onPress={context.growAYearOlder}
            //                 />
            //             </View>
            //         )} */}
            //     </MyContext.Consumer>
            // </View>
            
            // <View>
            //     <Text>Age:</Text>
            //     <Text>Name:</Text>
            //     <Button
            //         raised
            //         title='Grow Older'
            //     />
            // </View>

        )
    }
}