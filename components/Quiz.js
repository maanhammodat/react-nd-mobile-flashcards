import React, { Component } from 'react';
import { View, Text, FlatList, Modal } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import { clearLocalNotification, setLocalNotification} from '../utils/notification';

export default class Quiz extends Component {

    static navigationOptions = ({ navigation }) => {

        const params = navigation.state.params || {};
        const title = params.title;

        console.log('Quiz: navopts');

        return {
            headerTitle: `Quiz: ${title}`,
            headerRight: (
                <Icon
                    name='x'
                    type='foundation'
                    color='#fff'
                    containerStyle={{ marginRight: 20 }}
                    underlayColor={'transparent'}
                    onPress={() => {
                        navigation.goBack();
                     }                        
                    }
                />
            ),
        }
    };

    state = {
        deck: this.props.navigation.state.params.deck,
        currentQuestion: 0,
        flipped: false,
        score: 0,
        completed: false
    }

    componentDidUpdate(){
        this.state.completed === true && (
            clearLocalNotification()
            .then(setLocalNotification)
        )
    }

    handleAnswer(answer, current, total){
        const score = (answer === 'correct') ? (this.state.score + 1) : this.state.score;
        const currentQuestion = (current === total) ? current : (current + 1);
        const completed = ((current + 1) === total) ? true : false;

        console.log(`${currentQuestion},${total},${completed}`);

        this.setState(() => ({
            currentQuestion,
            score,
            completed,
            flipped: false
        }))
    }

    restartQuiz(){
        this.setState(() => ({
            currentQuestion: 0,
            flipped: false,
            score: 0,
            completed: false
        }))
    }

    render() {

        const deck = this.state.deck ? JSON.parse(this.state.deck) : {};
        const questions = deck.questions;
        const totalQuestions = questions.length; 
        const currentQuestion = this.state.currentQuestion;
        const flipped = this.state.flipped;
        const score = this.state.score;
        const completed = this.state.completed;

        return (
            <View style={{ flex: 1 }}>

                {!completed && (

                <React.Fragment>
                    <Text>
                        {`Number: ${currentQuestion + 1} / ${totalQuestions}\n`}
                        {`Score:  ${score} / ${totalQuestions}\n`}
                        {`Q: ${questions[currentQuestion].question}\n`}
                        {flipped && `A: ${questions[currentQuestion].answer}`}
                    </Text>

                    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                        {!flipped && (
                            <Button
                                raised
                                backgroundColor={'#05A071'}
                                icon={{ name: 'magnifying-glass', type: 'entypo' }}
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
                                    this.handleAnswer('correct', currentQuestion, totalQuestions)
                                }}
                            />
                            <Button
                                raised
                                title='Incorrect'
                                onPress={() => {
                                    this.handleAnswer('incorrect', currentQuestion, totalQuestions)
                                }}
                            />
                            </React.Fragment>
                        )}
                    </View>
                </React.Fragment>

                )}
        
                {completed && (
                <React.Fragment>
                    <Text>
                        All done!
                        {`\nTotal Score: ${(score / totalQuestions * 100).toFixed(0)}%\n${score} correct out of ${totalQuestions} questions`}
                    </Text>

                    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                        <Button
                            raised
                            title='Restart Quiz'
                            onPress={() => {
                                this.restartQuiz();
                            }}
                        />
                        <Button
                            raised
                            title='Back to Deck'
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        />
                    </View>
                </React.Fragment>
                )}
            
            </View>
        )
    }
}