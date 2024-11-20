import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Button, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const questions = [
  '1. การออกกำลังกายที่ดีนำไปสู่ภาวะสุขภาพจิตที่ดี',
  '2. ผู้ที่มีภาวะซึมเศร้ามักรู้สึกเป็นทุกข์อย่างมาก',
  '3. ผู้ที่ป่วยเป็นโรคจิตเภทมักมีความคิดหลงผิด',
  '4. หากฉันมีความผิดปกติทางจิตใจ ฉันจะเสาะหาความช่วยเหลือจากญาติ ๆ',
  '5. หากคนที่สนิทกับฉันมีความผิดปกติทางจิตใจ ฉันจะสนับสนุนให้เขา/เธอหานักจิตวิทยา',
  '6. ความผิดปกติทางจิตใจไม่ส่งผลต่อพฤติกรรมของบุคคล',
  '7. การนอนหลับที่ดี นำไปสู่การมีสภาวะสุขภาพจิตที่ดี',
  '8. หากฉันมีความผิดปกติทางจิตใจ ฉันจะเสาะหาความช่วยเหลือจากนักจิตวิทยา',
  '9. ผู้ที่ป่วยเป็นโรควิตกกังวลอาจตื่นตระหนกในสถานการณ์ที่พวกเธอ /เขาหวาดกลัว',
  '10. คนที่มีความผิดปกติทางจิตใจ มาจากครอบครัวที่รายได้น้อย',
  '11. ถ้าคนใกล้ตัวฉันมีปัญหาทางสุขภาพจิต ฉันจะรับฟังเขา โดยไม่ตัดสินหรือวิพากษ์วิจารณ์',
  '12. การใช้แอลกอฮอล์ทำให้เกิดปัญหาทางสุขภาพจิต ได้',
  '13. ปัญหาทางสุขภาพจิตไม่ส่งผลกระทบต่อความรู้สึกของบุคคล',
  '14. หากบุคคลที่มีปัญหาด้านสุขภาพจิตได้รับการตรวจพบและการรักษาได้เร็วเท่าไร ยิ่งเป็นผลดี',
  '15. เฉพาะผู้ใหญ่เท่านั้นที่มีปัญหาทางสุขภาพจิต',
  '16. การเปลี่ยนแปลงของการทำงานของสมองอาจทำให้เกิดปัญหาทางสุขภาพจิต ได้',
  '17. ถ้าคนใกล้ตัวมีปัญหาทางสุขภาพจิต ฉันจะสนับสนุนให้เขาไปพบจิตแพทย์',
  '18. ถ้าฉันเป็นโรคทางจิต ฉันจะขอความช่วยเหลือจากเพื่อน',
  '19. การรับประทานอาหารที่สมดุลช่วยให้สุขภาพจิตดี',
  '20. หนึ่งในอาการของภาวะซึมเศร้าคือการสูญเสียความสนใจหรือความสุขในสิ่งต่างๆ',
  '21. ถ้ามีคนใกล้ตัวฉันเจ็บป่วยโรคทางจิตเวช ฉันก็ไม่สามารถช่วยอะไรได้',
  '22. ระยะเวลาของอาการเป็นเกณฑ์สำคัญอันหนึ่งสำหรับการวินิจฉัยโรคทางจิตเวช',
  '23. อาการซึมเศร้าไม่ใช่ปัญหาทางสุขภาพจิตที่แท้จริง',
  '24. การติดยาอาจทำให้เกิดปัญหาทางสุขภาพจิต',
  '25. ปัญหาทางสุขภาพจิตส่งผลกระทบต่อความคิดของบุคคล',
  '26. การทำสิ่งที่สนุกสนานส่งเสริมให้มีสุขภาพจิตที่ดี',
  '27. คนที่เป็นโรคจิตเภทอาจมองเห็นหรือได้ยินสิ่งที่ใครมองไม่เห็นหรือไม่ได้ยิน',
  '28. สถานการณ์ที่มีความเครียดสูงอาจทำให้เกิดปัญหาทางสุขภาพจิตได้',
  '29. ถ้าฉันมีปัญหาทางสุขภาพจิต ฉันจะขอความช่วยเหลือจากจิตแพทย์',
];

const categories = {
  knowledge: [1, 2, 3, 7, 9, 12, 14, 16, 19, 20, 22, 24, 25, 26, 27, 28],
  belief: [4, 5, 8, 11, 17, 18, 29],
  helpSeeking: [4, 5, 8, 17, 18, 29],
  selfHelp: [6, 10, 13, 15, 18, 21, 23],
};

const options = ['1', '2', '3', '4', '5'];

const Test3Screen = () => {
  const [selectQuiz, setSelectQuiz] = useState(Array(questions.length).fill(null));
  const [postQuiz, setPostQuiz] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [resultData, setResultData] = useState({}); // To store result data
  const navigation = useNavigation();

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        const res = await fetch(global.URL + "/api/quiz/check-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: global.session.user.id, quizId: 6 }),
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

  const handleSelect = (questionIndex, optionIndex) => {
    const newSelectQuiz = [...selectQuiz];
    newSelectQuiz[questionIndex] = optionIndex + 1;
    setSelectQuiz(newSelectQuiz);
  };

  const handleSaveQuiz = async () => {
    if (selectQuiz.includes(null)) {
      Alert.alert('Please select an answer for all questions.');
      return;
    }

    const getCategoryScore = (category) =>
      category.reduce((acc, questionIndex) => acc + selectQuiz[questionIndex - 1], 0);

    const totalKnowledge = getCategoryScore(categories.knowledge);
    const totalBelief = getCategoryScore(categories.belief);
    const totalHelpSeeking = getCategoryScore(categories.helpSeeking);
    const totalSelfHelp = getCategoryScore(categories.selfHelp);

    const averageKnowledge = (totalKnowledge / categories.knowledge.length).toFixed(2);
    const averageBelief = (totalBelief / categories.belief.length).toFixed(2);
    const averageHelpSeeking = (totalHelpSeeking / categories.helpSeeking.length).toFixed(2);
    const averageSelfHelp = (totalSelfHelp / categories.selfHelp.length).toFixed(2);

    const totalScore = (selectQuiz.reduce((acc, answer) => acc + answer, 0) / selectQuiz.length).toFixed(2);

    const evaluateRisk = (score) => {
      if (score <= 2.33) return 'มีความรอบรู้ด้านสุขภาพจิตน้อย';
      if (score <= 3.67) return 'มีความรอบรู้ด้านสุขภาพจิตปานกลาง';
      return 'มีความรอบรู้ด้านสุภาพจิตมาก';
    };

    const riskKnowledge = evaluateRisk(averageKnowledge);
    const riskBelief = evaluateRisk(averageBelief);
    const riskHelpSeeking = evaluateRisk(averageHelpSeeking);
    const riskSelfHelp = evaluateRisk(averageSelfHelp);
    const totalRisk = evaluateRisk(totalScore);

    setResultData({
      averageKnowledge,
      riskKnowledge,
      averageBelief,
      riskBelief,
      averageHelpSeeking,
      riskHelpSeeking,
      averageSelfHelp,
      riskSelfHelp,
      totalScore,
      totalRisk,
    });
    setShowModal(true); // Show the modal

    try {
      const res = await fetch(global.URL + '/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: global.session.user.id,
          quizId: 6,
          quizType: postQuiz ? 'POST' : 'PRE',
          answers: selectQuiz,
          knowledge: averageKnowledge,
          belief: averageBelief,
          helpSeeking: averageHelpSeeking,
          selfHelp: averageSelfHelp,
          total: totalScore,
          risk: totalRisk,
        }),
      });

      if (res.ok) {
        Alert.alert('Quiz saved successfully');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Failed to save quiz.');
    }
  };
  const getRiskImage = (riskLevel) => {
    switch (riskLevel) {
      case 'มีความรอบรู้ด้านสุขภาพจิตน้อย':
        return require('../res/Head_sad.png');
      case 'มีความรอบรู้ด้านสุขภาพจิตปานกลาง':
        return require('../res/Head_meh.png');
      case 'มีความรอบรู้ด้านสุภาพจิตมาก':
        return require('../res/Head_wow.png');
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>แบบประเมิน Mental Health Literacy</Text>
       
        <Text style={styles.levels}>
          การให้คะแนน  1 = ไม่เห็นด้วยอย่างยิ่ง | 2 = ไม่เห็นด้วย | 3 = ทั้งเห็นด้วยและไม่เห็นด้วย | 4 = เห็นด้วย | 5 = เห็นด้วยอย่างมาก
        </Text>
      </View>

      {questions.map((question, questionIndex) => (
        <View key={questionIndex} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question}</Text>
          <View style={styles.optionsContainer}>
            {options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionButton,
                  selectQuiz[questionIndex] === optionIndex + 1 && styles.selectedOptionButton,
                ]}
                onPress={() => handleSelect(questionIndex, optionIndex)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectQuiz[questionIndex] === optionIndex + 1 && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSaveQuiz}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Custom Modal for showing results */}
      <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
      >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>ผลลัพธ์ของคุณ</Text>
          <Text>ความรอบรู้สุขภาพจิตด้านความรู้เกี่ยวกับปัญหาสุขภาพจิต : {resultData.averageKnowledge} (Risk: {resultData.riskKnowledge})</Text>
          <Text>ความรอบรู้สุขภาพจิตด้านความเชื่อที่ผิดเกี่ยวกับปัญหาสุขภาพจิต : {resultData.averageBelief} (Risk: {resultData.riskBelief})</Text>
          <Text>ความรอบรู้สุขภาพจิตด้านพฤติกรรมแสวงหาความช่วยเหลือและการช่วยเหลือเบื้องต้น : {resultData.averageHelpSeeking} (Risk: {resultData.riskHelpSeeking})</Text>
          <Text>ความรอบรู้สุขภาพจิตด้านกลยุทธ์สำหรับการช่วยเหลือตนเองได้เหมาะสม : {resultData.averageSelfHelp} (Risk: {resultData.riskSelfHelp})</Text>
          <Image source={getRiskImage(resultData.totalRisk)} style={styles.riskImage} />
          <Text>คะแนนรวม : {resultData.totalScore} (Risk: {resultData.totalRisk})</Text>

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
    padding: 20, 
    backgroundColor: '#dceaf7' 
  },
  headerContainer: { 
    marginBottom: 20 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10, 
    color: '#34495E',
  },
  description: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 5 
  },
  levels: { 
    fontSize: 14, 
    textAlign: 'center', 
   
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
    marginBottom: 10 
  },
  optionsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  optionButton: { 
    flex: 1, 
    paddingVertical: 10, 
    backgroundColor: '#fff', 
    borderRadius: 5, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    marginHorizontal: 5 
  },
  selectedOptionButton: { 
    backgroundColor: '#4caf50' 
  },
  optionText: { 
    textAlign: 'center', 
    fontSize: 16 
  },
  selectedOptionText: { 
    color: '#fff' 
  },
  submitButton: { 
    backgroundColor: '#4caf50', 
    paddingVertical: 15, 
    borderRadius: 5, 
    marginTop: 20,
    marginBottom: 40
  },
  submitButtonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.7)' 
  },
  modalContent: { 
    width: '80%', 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  closeButton: { 
    marginTop: 20, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    backgroundColor: '#4caf50', 
    borderRadius: 5 
  },
  closeButtonText: { 
    color: '#fff', 
    fontSize: 16 
  },
  riskImage: { 
    width: 100, 
    height: 100,     
    marginVertical: 15,
  }, // Style for the risk image
});

export default Test3Screen;
