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
            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                {!completed && (

                <React.Fragment>
                    <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                        <Text style={{ color: '#667', fontWeight: 'bold' }}>
                            {`Number: ${currentQuestion + 1} / ${totalQuestions}`}
                        </Text>
                        <Text style={{ color: '#667', fontWeight: 'bold' }}>
                            {`Score:  ${score} / ${totalQuestions}`}
                        </Text>
                    </View>

                    <View style={{ display: 'flex', marginLeft: 10, marginRight: 10, marginTop: 10, elevation: 2, backgroundColor: '#fff', paddingTop: 5, paddingLeft: 10, paddingRight: 10, paddingBottom: 5 }}>
                        <Text style={{ color: '#901C7E', alignSelf: 'center', fontSize: 20 }}>
                            Question:
                        </Text>
                        <Text style={{ color: '#901C7E', fontWeight: 'bold', textAlign: 'center', alignSelf: 'center', fontSize: 20 }}>
                            {`${questions[currentQuestion].question}`}
                        </Text>
                    </View>
                    
                    {flipped && (
                        <View style={{ display: 'flex', marginLeft: 10, marginRight: 10, marginTop: 10, elevation: 2, backgroundColor: '#fff', paddingTop: 5, paddingLeft: 10, paddingRight: 10, paddingBottom: 5 }}>
                            <Text style={{ color: '#05A071', alignSelf: 'center', fontSize: 20 }}>
                                Answer:
                            </Text>
                            <Text style={{ color: '#05A071', textAlign: 'center', fontWeight: 'bold', alignSelf: 'center', fontSize: 20 }}>
                                {`${questions[currentQuestion].answer}`}
                            </Text>
                        </View>
                    )}
                    
                    {/* <Text>
                        {`Number: ${currentQuestion + 1} / ${totalQuestions}\n`}
                        {`Score:  ${score} / ${totalQuestions}\n`}
                        {`Q: ${questions[currentQuestion].question}\n`}
                        {flipped && `A: ${questions[currentQuestion].answer}`}
                    </Text> */}

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
                            <View style={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'stretch' }}>
                                <Button
                                    raised
                                    title='Correct'
                                    containerViewStyle={{ flex: 1, display: 'flex' }}
                                    backgroundColor={'#59B324'}
                                    icon={{ name: 'thumbs-up', type: 'font-awesome' }}
                                    onPress={() => {
                                        this.handleAnswer('correct', currentQuestion, totalQuestions)
                                    }}
                                />
                                <Button
                                    raised
                                    title='Incorrect'
                                    containerViewStyle={{ flex: 1, display: 'flex' }}
                                    backgroundColor={'#cb2431'}
                                    icon={{ name: 'thumbs-down', type: 'font-awesome' }}
                                    onPress={() => {
                                        this.handleAnswer('incorrect', currentQuestion, totalQuestions)
                                    }}
                                />
                            </View>
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

                    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'stretch' }}>                        
                        <Button
                            raised
                            title='Back to Deck'
                            containerViewStyle={{ flex: 1, display: 'flex' }}
                            backgroundColor={'#291CA9'}
                            buttonStyle={{ height: 43 }}
                            icon={{ name: 'arrow-back' }}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        />
                        <Button
                            raised
                            title='Restart Quiz'
                            containerViewStyle={{ flex: 1, display: 'flex' }}
                            backgroundColor={'#05A071'}
                            buttonStyle={{ height: 43 }}
                            icon={{ name: 'loop', type: 'foundation' }}
                            onPress={() => {
                                this.restartQuiz();
                            }}
                        />
                    </View>
                </React.Fragment>
                )}
            
            </View>
        )
    }
}