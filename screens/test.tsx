import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const TestScreen = () => {
  const navigation = useNavigation();

  // State variables to store quiz statuses
  const [quizStatuses, setQuizStatuses] = useState({
    test1: null,
    test2: null,
    test3: null,
  });

  useEffect(() => {
    const checkQuizStatus = async (quizId, testKey) => {
      try {
        const res = await fetch(global.URL + "/api/quiz/check-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: global.session.user.id,
            quizId,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          if (data.message === "Have a Pre and Post Quiz") {
            setQuizStatuses(prev => ({ ...prev, [testKey]: "ทำทั้งหมดแล้ว" }));
          } else if (data.message === "Have a Pre Quiz") {
            setQuizStatuses(prev => ({ ...prev, [testKey]: "ทำหลังกิจกรรม" }));
          } else {
            setQuizStatuses(prev => ({ ...prev, [testKey]: "ทำก่อนกิจกรรม" }));
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert("An error occurred while checking quiz status.");
      }
    };

    // Fetch quiz statuses for each test
    checkQuizStatus(8, 'test1'); // Replace with actual quiz IDs
    checkQuizStatus(7, 'test2'); // Replace with actual quiz IDs
    checkQuizStatus(6, 'test3'); // Replace with actual quiz IDs
  }, []);

  // Function to return color based on quiz status
  const getStatusColor = (status) => {
    switch (status) {
      case "ทำทั้งหมดแล้ว":
        return styles.completedStatus;
      case "ทำหลังกิจกรรม":
        return styles.postAvailableStatus;
      case "ทำก่อนกิจกรรม":
        return styles.preAvailableStatus;
      default:
        return styles.loadingStatus;
    }
  };

  // Function to return the correct image based on quiz status
  const getStatusImage = (status) => {
    switch (status) {
      case "ทำทั้งหมดแล้ว":
        return require('../res/Head_flow.png'); // Replace with actual image path
      case "ทำหลังกิจกรรม":
        return require('../res/Head_think.png'); // Replace with actual image path
      case "ทำก่อนกิจกรรม":
        return require('../res/Head_question.png'); // Replace with actual image path
      default:
        return require('../res/Head_question.png'); // Replace with actual image path
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>แบบทดสอบ</Text> */}

      <TouchableOpacity style={styles.testItem} onPress={() => navigation.navigate('Test1')}>
        <View style={styles.testItemContent}>
          <Image source={getStatusImage(quizStatuses.test1)} style={styles.image} />
          <View style={styles.testTextContainer}>
            <Text style={styles.testTitle}> แบบประเมิน RQ</Text>
            <Text style={styles.testSubtitle}> 1 นาที | 3 คำถาม</Text>
            <Text style={[styles.testStatus, getStatusColor(quizStatuses.test1)]}>
            สถานะ: {quizStatuses.test1 || "Loading..."}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testItem} onPress={() => navigation.navigate('Test2')}>
        <View style={styles.testItemContent}>
          <Image source={getStatusImage(quizStatuses.test2)} style={styles.image} />
          <View style={styles.testTextContainer}>
            <Text style={styles.testTitle}> แบบประเมินพลังสุขภาพจิต</Text>
            <Text style={styles.testSubtitle}> 10 นาที | 20 คำถาม</Text>
            <Text style={[styles.testStatus, getStatusColor(quizStatuses.test2)]}>
            สถานะ: {quizStatuses.test2 || "Loading..."}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testItem} onPress={() => navigation.navigate('Test3')}>
        <View style={styles.testItemContent}>
          <Image source={getStatusImage(quizStatuses.test3)} style={styles.image} />
          <View style={styles.testTextContainer}>
            <Text style={styles.testTitle}> แบบประเมิน MHL</Text>
            <Text style={styles.testSubtitle}> 15 นาที | 29 คำถาม</Text>
            <Text style={[styles.testStatus, getStatusColor(quizStatuses.test3)]}>
              สถานะ: {quizStatuses.test3 || "Loading..."}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#afd7f6',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  testItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  testItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 150,  // Set the width of your image
    height: 150, // Set the height of your image
    // You can add other styling properties here
  },
  testTextContainer: {
    maxWidth: screenWidth * 0.6,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  testSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  testStatus: {
    fontSize: 14,
    marginTop: 8,
  },
  completedStatus: {
    color: 'green',
    fontWeight: 'bold',
  },
  postAvailableStatus: {
    color: 'orange',
    fontWeight: 'bold',
  },
  preAvailableStatus: {
    color: 'red',
    fontWeight: 'bold',
  },
  loadingStatus: {
    color: '#888',
  },
});

export default TestScreen;
