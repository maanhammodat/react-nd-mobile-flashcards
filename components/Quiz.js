import React, { Component } from 'react';
import { View, Text, FlatList, Modal } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

export default class Quiz extends Component {

    static navigationOptions = ({ navigation }) => {

        const params = navigation.state.params || {};
        const title = params.title;

        console.log('Quiz: navopts');

        return {
            headerTitle: `Quiz: ${title}`
        }
    };

    state = {
        deck: this.props.navigation.state.params.deck,
        currentQuestion: 0,
        flipped: false,
        score: 0
    }

    render() {

        const deck = this.state.deck ? JSON.parse(this.state.deck) : {};
        const questions = deck.questions;
        const currentQuestion = this.state.currentQuestion;
        const flipped = this.state.flipped;
        const score = this.state.score;

        return (
            <View style={{ flex: 1 }}>

                <Text>
                    {`${currentQuestion + 1} / ${questions.length}\n`}
                    {`Q: ${questions[currentQuestion].question}\n`}
                    {flipped && `A: ${questions[currentQuestion].answer}`}
                </Text>

                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                    {!flipped && (
                        <Button
                            raised
                            title='View Answer'
                            onPress={() => {
                                this.setState(() => ({ flipped: true }))
                            }}
                        />
                    )}
                    {flipped && (
                        <React.Fragment>
                        <Button
                            raised
                            title='Correct'
                            onPress={() => {
                                this.setState(() => ({ 
                                    currentQuestion: currentQuestion + 1,
                                    flipped: false,
                                    score: score + 1
                                }))
                            }}
                        />
                        <Button
                            raised
                            title='Incorrect'
                            onPress={() => {
                                this.setState(() => ({
                                    currentQuestion: currentQuestion + 1,
                                    flipped: false
                                }))
                            }}
                        />
                        </React.Fragment>
                    )}
                </View>


            </View>
        )
    }
}