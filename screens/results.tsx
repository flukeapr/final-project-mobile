import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface QuizDetails {
  id: number;
  userId: number;
  quizId: number;
  answers: JSON;
  quizType: string;
  pressure: number;
  encouragement: number;
  obstacle: number;
  total: number;
  risk: string;
  name: string;
  question: JSON;
}

interface QuizResult {
  test1: QuizDetails | null;
  test2: QuizDetails | null;
  test3: QuizDetails | null;
}

const ResultScreen = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const preRq3: QuizDetails = quizResults.find(
    (result) => result.quizId === 8 && result.quizType === "PRE"
  );
  const postRq3: QuizDetails = quizResults.find(
    (result) => result.quizId === 8 && result.quizType === "POST"
  );
  const preRq20: QuizDetails = quizResults.find(
    (result) => result.quizId === 7 && result.quizType === "PRE"
  );

  const postRq20: QuizDetails = quizResults.find(
    (result) => result.quizId === 7 && result.quizType === "POST"
  );

  useEffect(() => {
    fetchQuizResults();
  }, []);

  const fetchQuizResults = async () => {
    try {
      const response = await fetch(
        global.URL + `/api/userquizView/${global.session.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setQuizResults(data);
      } else {
        Alert.alert("Failed to load quiz results.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred while fetching quiz results.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading results...</Text>
      </View>
    );
  }

  

  const preRq20data = [ 
    {value: preRq20?.pressure || 0 , label: 'ความทนต่อแรงกดดัน', frontColor: '#177AD5' ,topLabelComponent: () => (
      <Text style={{color: '#177AD5', fontSize: 16, marginBottom: 6}}>{preRq20?.pressure || 0 }</Text>
    ), },
    {value: postRq20?.encouragement || 0, label: 'การมีความหวังและกำลังใจ', frontColor: '#177AD5',topLabelComponent: () => (
      <Text style={{color: '#177AD5', fontSize: 16, marginBottom: 6}}>{preRq20?.encouragement || 0 }</Text>
    ),},
    {value: postRq20?.obstacle || 0, label: 'การต่อสู้เอาชนะอุปสรรค', frontColor: '#177AD5',topLabelComponent: () => (
      <Text style={{color: '#177AD5', fontSize: 16, marginBottom: 6}}>{preRq20?.obstacle || 0 }</Text>
    ),},
];
const postRq20data = [ 
  {value: postRq20?.pressure || 0 , label: 'ความทนต่อแรงกดดัน', frontColor: '#177AD5' ,topLabelComponent: () => (
    <Text style={{color: '#177AD5', fontSize: 16, marginBottom: 6}}>{postRq20?.pressure || 0 }</Text>
  ), },
  {value: postRq20?.encouragement || 0, label: 'การมีความหวังและกำลังใจ', frontColor: '#177AD5',topLabelComponent: () => (
    <Text style={{color: '#177AD5', fontSize: 16, marginBottom: 6}}>{postRq20?.encouragement || 0 }</Text>
  ),},
  {value: postRq20?.obstacle || 0, label: 'การต่อสู้เอาชนะอุปสรรค', frontColor: '#177AD5',topLabelComponent: () => (
    <Text style={{color: '#177AD5', fontSize: 16, marginBottom: 6}}>{postRq20?.obstacle || 0 }</Text>
  ),},
];


  return (
    <ScrollView style={styles.container}>
      {/* Test 1 Results */}
      <View style={styles.quizContainer}>
        <Text style={styles.quizHeader}>แบบประเมิน RQ 3 ข้อ</Text>
        <View style={styles.chartContainer}>
          <View style={styles.childContainer}>
            <Text>ก่อน</Text>
            <View style={styles.chartPie}>
              <Text style={styles.chartPieText}>{preRq3.total || 0}</Text>
            </View>
            <Text>{preRq3.risk ? preRq3.risk : "ไม่มีข้อมูล"} </Text>
          </View>
          <View style={styles.childContainer}>
            <Text>หลัง</Text>
            <View style={styles.chartPie}>
              <Text style={styles.chartPieText}>{postRq3.total || 0}</Text>
            </View>
            <Text>{postRq3.risk ? postRq3.risk : "ไม่มีข้อมูล"} </Text>
          </View>
        </View>
      </View>

      {/* Test 2 Results */}
      <View style={styles.quizContainer}>
        <Text style={styles.quizHeader}>แบบประเมินพลังสุขภาพจิต </Text>
        <View style={styles.barContainer}>
          <View style={styles.childContainer}>
            <Text>ก่อน</Text>
            <BarChart
                height={300}
                barWidth={40}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={preRq20data}
                yAxisThickness={0}
                xAxisThickness={0}
            />
            <Text>{preRq20.risk} </Text>
          </View>
          <View style={styles.childContainer}>
            <Text>หลัง</Text>
            <BarChart
                height={300}
                barWidth={40}
                
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={postRq20data}
                yAxisThickness={0}
                xAxisThickness={0}
            />
            <Text>{postRq20.risk} </Text>
          </View>
        </View>
      </View>

      {/* Test 3 Results */}
      <View style={styles.quizContainer}>
        <Text style={styles.quizHeader}>แบบประเมิน  MHL 29 ข้อ</Text>
        <View style={styles.chartContainer}>
          <View style={styles.childContainer}>
            <Text>ก่อน</Text>
            <View style={styles.chartPie}>
              <Text style={styles.chartPieText}>{preRq3.total || 0}</Text>
            </View>
            <Text>{preRq3.risk ? preRq3.risk : "ไม่มีข้อมูล"} </Text>
          </View>
          <View style={styles.childContainer}>
            <Text>หลัง</Text>
            <View style={styles.chartPie}>
              <Text style={styles.chartPieText}>{postRq3.total || 0}</Text>
            </View>
            <Text>{postRq3.risk ? postRq3.risk : "ไม่มีข้อมูล"} </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  quizContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  quizHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  resultContent: {
    marginTop: 10,
  },
  noDataText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chartPie: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 200,
    borderColor: "#0077b6",
    borderWidth: 3,
  },
  chartPieText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  childContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  barContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
});

export default ResultScreen;
