import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { clearLocalNotification, setLocalNotification} from '../utils/notification';

export default class Quiz extends Component {

    static navigationOptions = ({ navigation }) => {

        const params = navigation.state.params || {};
        const title = params.title;

        return {
            headerTitle: `Quiz: ${title}`,
            headerRight: (
                <Icon
                    name='x'
                    type='foundation'
                    color='#fff'
                    containerStyle={{ marginRight: 20, padding: 10  }}
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
            <View style={styles.container}>

                {!completed && (

                    <React.Fragment>

                        <View style={styles.header}>
                            <Text style={styles.headerText}>
                                {`Number: ${currentQuestion + 1} / ${totalQuestions}`}
                            </Text>
                            <Text style={styles.headerText}>
                                {`Score:  ${score} / ${totalQuestions}`}
                            </Text>
                        </View>

                        <View style={styles.contentContainer}>
                            <Text style={styles.questionTitle}>
                                Question:
                            </Text>
                            <Text style={styles.questionText}>
                                {`${questions[currentQuestion].question}`}
                            </Text>
                        </View>
                        
                        {flipped && (
                            <View style={styles.contentContainer}>
                                <Text style={styles.answerTitle}>
                                    Answer:
                                </Text>
                                <Text style={styles.answerText}>
                                    {`${questions[currentQuestion].answer}`}
                                </Text>
                            </View>
                        )}

                        <View style={styles.footer}>
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
                                <View style={styles.footerButtonContainer}>
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

                        <View style={styles.contentContainer}>
                            <Text style={styles.answerTitle}>
                                Quiz Completed!
                            </Text>
                            <Text style={styles.answerText}>
                                {`Total Score: ${(score / totalQuestions * 100).toFixed(0)}%\n${score} Questions Correct Out of ${totalQuestions}`}
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <View style={styles.footerButtonContainer}>
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
                        </View>
                    </React.Fragment>

                )}
            
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginLeft: 10, marginRight: 10, marginTop: 10
    },
    headerText: {
        color: '#667',
        fontWeight: 'bold'
    },
    contentContainer: {
        display: 'flex',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        elevation: 2,
        backgroundColor: '#fff',
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5
    },
    questionTitle: {
        color: '#901C7E',
        alignSelf: 'center',
        fontSize: 20
    },
    questionText: {
        color: '#901C7E',
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 20
    },
    answerTitle: {
        color: '#05A071',
        alignSelf: 'center',
        fontSize: 20
    },
    answerText: {
        color: '#05A071',
        textAlign: 'center',
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 20
    },
    footer: {
        position: 'absolute', left: 0, right: 0, bottom: 0
    },
    footerButtonContainer: { display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'stretch' }
});