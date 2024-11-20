import { Icon } from "@rneui/base";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  TouchableOpacity,
  RefreshControl
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
const { width, height } = Dimensions.get("window");

const ResultScreen = ({navigation}) => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleModal ,setVisibleModal] = useState<boolean>(false);
  const [selectQuiz , setSelectQuiz] = useState([]);

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

  const preRq29: QuizDetails = quizResults.find(
    (result) => result.quizId === 6 && result.quizType === "PRE"
  );

  const postRq29: QuizDetails = quizResults.find(
    (result) => result.quizId === 6 && result.quizType === "POST"
  );

  useEffect(() => {
    fetchQuizResults();
  }, [navigation]);

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
      // Alert.alert("An error occurred while fetching quiz results.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>กำลังโหลด...</Text>
      </View>
    );
  }

  const selectedQuiz = (quiz1 : QuizDetails,quiz2 : QuizDetails)=>{
    setVisibleModal(true);
    setSelectQuiz([quiz1,quiz2]);
  }
  
  console.log(preRq20)
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
    <>
    <View style={styles.header}>
      <Text style={styles.headerText}>ผลการประเมิน</Text>
    </View>
   
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchQuizResults} />}>
      {/* Test 1 Results */}
      <View style={styles.quizContainer}>
        <Text style={styles.quizHeader}>แบบประเมิน RQ 3 ข้อ</Text>
        <View style={styles.chartContainer}>
          <View style={styles.childContainer}>
            <Text>ก่อน</Text>
            <View style={styles.chartPie}>
              <Text style={styles.chartPieText}>{preRq3 ? preRq3.total || 0 : 0}</Text>
            </View>
            <Text>{preRq3 ? preRq3.risk ? preRq3.risk : "ไม่มีข้อมูล" : 'ยังไม่ทำแบบปรเมิน'} </Text>
          </View>
          <View style={styles.childContainer}>
            <Text>หลัง</Text>
            <View style={styles.chartPie}>
              <Text style={styles.chartPieText}>{postRq3 ? postRq3.total || 0 : 0}</Text>
            </View>
            <Text >{postRq3 ? postRq3.risk ? postRq3.risk : "ไม่มีข้อมูล" : 'ยังไม่ทำแบบปรเมิน'} </Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=> selectedQuiz(preRq3, postRq3)}>
        <Text style={{textAlign: 'center', marginVertical :10}}>ดูผลลัพธ์แบบประเมินที่ทำ</Text>
        </TouchableOpacity>
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
                data={preRq20data ? postRq20data : [{value: 0, label: 'ไม่มีข้อมูล'}]}
                yAxisThickness={0}
                xAxisThickness={0}
            />
            <Text  style={styles.risk}>{preRq20 ? preRq20.risk ? preRq20.risk : "ไม่มีข้อมูล" : 'ยังไม่ทำแบบปรเมิน'} </Text>
          </View>
          <View style={styles.childContainer}>
            <Text>หลัง</Text>
            <BarChart
                height={300}
                barWidth={40}
                
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={postRq20data ? postRq20data : [{value: 0, label: 'ไม่มีข้อมูล'}]}
                yAxisThickness={0}
                xAxisThickness={0}
            />
            <Text style={styles.risk}>{postRq20 ? postRq20.risk ? postRq20.risk : "ไม่มีข้อมูล" : 'ยังไม่ทำแบบปรเมิน'} </Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=> selectedQuiz(preRq20, postRq20)}>
        <Text style={{textAlign: 'center', marginVertical :10}}>ดูผลลัพธ์แบบประเมินที่ทำ</Text>
        </TouchableOpacity>
      </View>

      {/* Test 3 Results */}
      <View style={styles.quizContainer}>
        <Text style={styles.quizHeader}>แบบประเมิน  MHL 29 ข้อ</Text>
        <View style={{display: 'flex', flexDirection: 'column'}}>
          <View style={styles.childContainer}>
            <Text>ก่อน</Text>
            <View style={styles.chartPie}>
              <Text style={styles.chartPieText}>{preRq29 ? preRq29.total || 0 :0}</Text>
            </View>
            <Text numberOfLines={2} >{preRq29 ? preRq29.risk ? preRq29.risk : "ไม่มีข้อมูล" : 'ยังไม่ทำแบบปรเมิน'} </Text>
          </View>
          <View style={styles.childContainer}>
            <Text>หลัง</Text>
            <View style={styles.chartPie}>
              <Text style={styles.chartPieText}>{postRq29 ? postRq29.total || 0 : 0}</Text>
            </View>
            <Text >{postRq29 ? postRq29.risk ? postRq29.risk : "ไม่มีข้อมูล" : 'ยังไม่ทำแบบปรเมิน'} </Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=> selectedQuiz(preRq29, postRq29)}>
        <Text style={{textAlign: 'center', marginVertical :10}}>ดูผลลัพธ์แบบประเมินที่ทำ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    <Modal
    animationType="slide"
    visible={visibleModal}
    onRequestClose={() => {
      setVisibleModal(false);
    }}
    transparent={true}
    
    >
      <View style={styles.modal} >
        <View style={styles.modalView}>
          <Icon name="close" size={24} color="black" onPress={() => setVisibleModal(false)} style={{alignSelf: 'flex-end'}} />  
            <ScrollView>

           
            <View >
            {selectQuiz[0]?.answers?.length > 0 &&  selectQuiz[0]?.question.length > 0 &&(
        <ScrollView>
            <Text style={styles.quizHeader}>{selectQuiz[0]?.name}</Text>
            <Text style={{marginVertical: 10 ,fontSize: 18}}>แบบประเมินก่อนกิจกรรม</Text>
            {selectQuiz[0].question.map((question, qIndex) => (
                <View key={qIndex} style={{marginVertical: 10}}>
                <Text style={styles.question}>
                    {question}
                </Text>
                

                <ScrollView horizontal  style={{flexDirection:'row',display:'flex'}}>
                {[...Array(selectQuiz[0]?.quizId === 6 || selectQuiz[0]?.quizId === 7 ? 5 : 10)].map((_, oIndex) => {
                    const isSelected =  selectQuiz[0].answers[qIndex] === oIndex +1
                    return (
                        
                      <View key={oIndex} style={[styles.scoreButton , {backgroundColor: isSelected ? "#3498DB" : "white"  }]}>
                        <Text>{oIndex +1}</Text>
                        </View>                         
                  
                    )
                    
                   
                    })}
                </ScrollView> 
                 </View>
            ))}
            
        </ScrollView>
      )}
            </View>
            <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical:20
  }}
/>
            
            <View >
            {selectQuiz[1]?.answers?.length > 0 &&  selectQuiz[1]?.question.length > 0 &&(
        <ScrollView>
            <Text style={{marginVertical: 10,fontSize: 18}}>แบบประเมินหลังกิจกรรม</Text>
            {selectQuiz[1].question.map((question, qIndex) => (
                <View key={qIndex}>
                <Text style={styles.question}>
                    {question}
                </Text>
                

                <ScrollView horizontal  style={{flexDirection:'row',display:'flex'}}>
                {[...Array(selectQuiz[1]?.quizId === 6 || selectQuiz[1]?.quizId === 7 ? 5 : 10)].map((_, oIndex) => {
                    const isSelected =  selectQuiz[1].answers[qIndex] === oIndex +1
                    return (
                        
                      <View style={[styles.scoreButton , {backgroundColor: isSelected ? "#3498DB" : "white"  }]}>
                        <Text>{oIndex +1}</Text>
                        </View>                         
                  
                    )
                    
                   
                    })}
                </ScrollView> 
                 </View>
            ))}
            
        </ScrollView>
      )}
            </View>
            </ScrollView>
        </View>
      </View>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#dceaf7",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#023e8a', // Dark blue
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
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
  modal:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }, 
  modalView: {
    width: width * 1, // 85% of screen width
    maxHeight: height * 0.9, // Limit modal height to 75% of screen height
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  scoreButton: {
    backgroundColor: '#ECF0F1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    margin: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  question: {
    fontSize:16,
    marginBottom: 10,
  },
  risk:{
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  }
});

export default ResultScreen;
