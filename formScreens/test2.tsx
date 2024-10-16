import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Button, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const questions = [
  '1 เรื่องไม่สบายใจเล็กน้อยทำให้ฉันว้าวุ่นใจนั่งไม่ติด',
  '2 ฉันไม่ใส่ใจคนที่หัวเราะเยาะฉัน',
  '3 เมื่อฉันทำผิดพลาดหรือเสียหาย ฉันยอมรับผิดหรือผลที่ตามมา',
  '4 ฉันเคยยอมทนลำบากเพื่ออนาคตที่ดีขึ้น',
  '5 เวลาทุกข์ใจมากๆ ฉันเจ็บป่วยไม่สบาย',
  '6 ฉันสอนและเตือนตัวเอง',
  '7 ความยากลำบากทำให้ฉันแกร่งขึ้น',
  '8 ฉันไม่จดจำเรื่องเลวร้ายในอดีต',
  '9 ถึงแม้ปัญหาจะหนักหนาเพียงใดชีวิตฉันก็ไม่เลวร้ายไปหมด',
  '10 เมื่อมีเรื่องหนักใจ ฉันมีคนปรับทุกข์ด้วย',
  '11 จากประสบการณ์ที่ผ่านมาทำให้ฉันมั่นใจว่าจะแก้ปัญหาต่างๆ ที่ผ่านเข้ามาในชีวิตได้',
  '12 ฉันมีครอบครัวและคนใกล้ชิดเป็นกำลังใจ',
  '13 ฉันมีแผนการที่จะทำให้ชีวิตก้าวไปข้างหน้า',
  '14 เมื่อมีปัญหาวิกฤตเกิดขึ้น ฉันรู้สึกว่าตัวเองไร้ความสามารถ',
  '15 เป็นเรื่องยากสำหรับฉันที่จะทำให้ชีวิตดีขึ้น',
  '16 ฉันอยากหนีไปให้พ้น หากมีปัญหาหนักหนาต้องรับผิดชอบ',
  '17 การแก้ไขปัญหาทำให้ฉันมีประสบการณ์มากขึ้น',
  '18 ในการพูดคุย ฉันหาเหตุผลที่ทุกคนยอมรับหรือเห็นด้วยกับฉันได้',
  '19 ฉันเตรียมหาทางออกไว้ หากปัญหาร้ายแรงกว่าที่คิด',
  '20 ฉันชอบฟังความคิดเห็นที่แตกต่างจากฉัน',
];

const options = ['ไม่จริง', 'จริงบางครั้ง', 'ค่อนข้างจริง', 'จริง', 'จริงมาก'];

const Test2Screen = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [postQuiz, setPostQuiz] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const navigation = useNavigation();

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
            quizId: 7,
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

  const handleOptionPress = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = (selectedAnswers) => {
    const group1Questions = [2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 20];
    const group2Questions = [6, 13, 15, 16];
  
    let score1 = 0;
    let score2 = 0;
    let score3 = 0;
  
    selectedAnswers.forEach((answer, index) => {
      const questionNumber = index + 1;
  
      if (group1Questions.includes(questionNumber)) {
        score1 += answer + 1;
      } else if (group2Questions.includes(questionNumber)) {
        score2 += 5 - answer;
      } else {
        score3 += answer + 1;
      }
    });
  
    const totalScore = score1 + score2 + score3;
    return { score1, score2, score3, totalScore };
  };

  const handleSaveQuiz = async () => {
    if (answers.includes(null)) {
      Alert.alert("Please select all 20 questions.");
      return;
    }

    const scoreAnswer = calculateScore(answers);
    const risk =
      scoreAnswer.totalScore > 69
        ? 'สูงกว่าปกติ'
        : scoreAnswer.totalScore >= 55
        ? 'ปกติ'
        : 'ต่ำกว่าปกติ';

    try {
      const payload = {
        userId: global.session.user.id,
        quizId: 7,
        quizType: postQuiz ? 'POST' : 'PRE',
        answers: answers,
        pressure: scoreAnswer.score1,
        encouragement: scoreAnswer.score2,
        obstacle: scoreAnswer.score3, 
        total: scoreAnswer.totalScore,
        risk: risk,
      };

      const resSave = await fetch(global.URL + '/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (resSave.ok) {
        setQuizResults({
          pressure: scoreAnswer.score1,
          encouragement: scoreAnswer.score2,
          obstacle: scoreAnswer.score3,
          total: scoreAnswer.totalScore,
          risk: risk,
        });
        setShowModal(true);
      } else {
        Alert.alert('Failed to save quiz.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('An error occurred while saving the quiz.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Animatable.Text animation="fadeInDown" style={styles.header}>
          แบบประเมิน RQ 20 ข้อ
        </Animatable.Text>
      </View>

      {questions.map((question, questionIndex) => (
        <Animatable.View
          key={questionIndex}
          animation="fadeInUp"
          delay={questionIndex * 100}
          style={styles.questionContainer}
        >
          <Text style={styles.questionText}>{question}</Text>
          <View style={styles.optionsContainer}>
            {options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionButton,
                  answers[questionIndex] === optionIndex &&
                    styles.selectedOptionButton,
                ]}
                onPress={() => handleOptionPress(questionIndex, optionIndex)}
              >
                <Text
                  style={[
                    styles.optionText,
                    answers[questionIndex] === optionIndex &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animatable.View>
      ))}

      <Animatable.View animation="pulse" iterationCount="infinite">
        <TouchableOpacity style={styles.submitButton} onPress={handleSaveQuiz}>
          <Text style={styles.submitButtonText}>Submit Quiz</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ผลลัพธ์ของคุณ</Text>
            <Text style={styles.modalText}>แรงกดดัน: {quizResults?.pressure}</Text>
            <Text style={styles.modalText}>กำลังใจ: {quizResults?.encouragement}</Text>
            <Text style={styles.modalText}>อุปสรรค: {quizResults?.obstacle}</Text>
            <Text style={styles.modalText}>คะแนนรวม: {quizResults?.total}</Text>
            {/* Display image based on the risk */}
            {quizResults?.risk === 'ต่ำกว่าปกติ' && (
              <Image source={require('../res/Head_wow.png')} style={styles.resultImage} />
            )}
            {quizResults?.risk === 'ปกติ' && (
              <Image source={require('../res/Head_meh.png')} style={styles.resultImage} />
            )}
            {quizResults?.risk === 'สูงกว่าปกติ' && (
              <Image source={require('../res/Head_happy.png')} style={styles.resultImage} />
            )}
            <Text style={styles.modalText}>ระดับความเสี่ยง: {quizResults?.risk}</Text>

            

            <Button
              title="ตกลง"
              onPress={() => {
                setShowModal(false);
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#F0F4F8',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
    marginBottom: 10,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedOptionButton: {
    backgroundColor: '#0288D1',
  },
  optionText: {
    textAlign: 'center',
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#0288D1',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    fontSize: 18,
    marginBottom: 10,
  },
  resultImage: {
    width: 100,
    height: 100,
    marginVertical: 15,
  },
});

export default Test2Screen;
