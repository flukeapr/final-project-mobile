import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Image, Button } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const Test1Screen = () => {
  const [scores, setScores] = useState({ q1: 0, q2: 0, q3: 0 });
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [postQuiz, setPostQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [quizResultImage, setQuizResultImage] = useState(null);

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        const res = await fetch(global.URL + "/api/quiz/check-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: global.session.user.id,
            quizId: 8,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          if (data.message === "Have a Pre and Post Quiz") {
            Alert.alert("You have already completed both the Pre and Post quizzes.");
            navigation.goBack();
            return;
          }
          if (data.message === "Have a Pre Quiz") {
            setPostQuiz(true);
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert("An error occurred while checking quiz status.");
      }
    };

    checkQuizStatus();
  }, []);

  const handleScoreChange = (question, score) => {
    setScores({ ...scores, [question]: score });
    setCurrentQuestion(currentQuestion + 1);
  };

  const renderScoreButtons = (questionKey) => {
    return (
      <View style={styles.scoreContainer}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
          <Animatable.View key={score} animation="bounceIn" delay={score * 100}>
            <TouchableOpacity
              style={[
                styles.scoreButton,
                scores[questionKey] === score && styles.selectedScoreButton,
              ]}
              onPress={() => handleScoreChange(questionKey, score)}
            >
              <Text
                style={[
                  styles.scoreButtonText,
                  scores[questionKey] === score && styles.selectedScoreText,
                ]}
              >
                {score}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    );
  };

  const handleSaveQuiz = async () => {
    const selectQuiz = Object.values(scores);

    if (selectQuiz.includes(0)) {
      Alert.alert('กรุณาตอบทุกข้อ');
      return;
    }

    const totalScore = selectQuiz.reduce((a, b) => a + b, 0);
    const averageScore = (totalScore / 3).toFixed(2);

    let resultText, resultImage;
    if (averageScore <= 4) {
      resultText = "พลังใจน้อย";
      resultImage = require('../res/Head_sad.png'); // Use actual path to the image
    } else if (averageScore <= 6) {
      resultText = "พลังใจปานกลาง";
      resultImage = require('../res/Head_meh.png'); // Use actual path to the image
    } else {
      resultText = "พลังใจมาก";
      resultImage = require('../res/Head_wow.png'); // Use actual path to the image
    }

    try {
      const resSave = await fetch(global.URL + "/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: global.session.user.id,
          quizId: 8,
          quizType: postQuiz ? "POST" : "PRE",
          answers: selectQuiz,
          total: averageScore,
          risk: resultText,
        }),
      });

      if (resSave.ok) {
        setQuizResults({ total: averageScore, risk: resultText });
        setQuizResultImage(resultImage); // Set the image based on result
        setShowModal(true); // Show modal with result
      } else {
        Alert.alert("Failed to save quiz.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred while saving the quiz.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Animatable.Text animation="fadeInDown" style={styles.header}>
        แบบประเมิน RQ  3 ข้อ 
        </Animatable.Text>
        <Text style={{fontSize:16}}>ตัวเลขคะแนน ถ้า 1 หมายถึง น้อย และ 10 หมายถึง มาก</Text>
      </View>

      {currentQuestion >= 1 && (
        <Animatable.View animation="fadeInUp" style={styles.questionContainer}>
          <Text style={styles.questionText}>
            1.) ฉันเอาชนะอุปสรรคปัญหาต่างๆ ในชีวิต ได้
          </Text>
          {renderScoreButtons('q1')}
        </Animatable.View>
      )}

      {currentQuestion >= 2 && (
        <Animatable.View animation="fadeInUp" style={styles.questionContainer}>
          <Text style={styles.questionText}>
            2.) ฉันมีกำลังใจและได้รับการสนับสนุนจากคนรอบข้าง
          </Text>
          {renderScoreButtons('q2')}
        </Animatable.View>
      )}

      {currentQuestion >= 3 && (
        <Animatable.View animation="fadeInUp" style={styles.questionContainer}>
          <Text style={styles.questionText}>
            3.) ฉันจัดการกับปัญหาและความเครียดของตนเองได้
          </Text>
          {renderScoreButtons('q3')}
        </Animatable.View>
      )}

      {currentQuestion > 3 && (
        <Animatable.View animation="pulse" iterationCount="infinite">
          <TouchableOpacity style={styles.submitButton} onPress={handleSaveQuiz}>
            <Text style={styles.submitButtonText}>ส่งแบบทดสอบ</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ผลลัพธ์ของคุณ</Text>
            <Text style={styles.modalText}>คะแนนเฉลี่ย: {quizResults?.total}</Text>
            <Text style={styles.modalText}>การประเมินพลังใจ: {quizResults?.risk}</Text>
            {quizResultImage && <Image source={quizResultImage} style={styles.resultImage} />}
            <Button title="ตกลง" onPress={() => {
              setShowModal(false);
              navigation.goBack();
            }} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dceaf7',
    padding: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 8,
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    color: '#2C3E50',
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  scoreButton: {
    backgroundColor: '#ECF0F1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    margin: 10,
  },
  selectedScoreButton: {
    backgroundColor: '#3498DB',
  },
  scoreButtonText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  selectedScoreText: {
    color: '#FFF',
  },
  submitButton: {
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  resultImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
});

export default Test1Screen;
