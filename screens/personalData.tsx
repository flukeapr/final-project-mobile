import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView,SafeAreaView,ActivityIndicator,Modal } from 'react-native';

const PersonalDataScreen = ({ navigation, route }) => {
   const { userId  } = route.params; // Receive userId from SignupScreen
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [faculty, setFaculty] = useState("");
  const [major, setMajor] = useState("");
  const [religion, setReligion] = useState("");
  const [hasDisease, setHasDisease] = useState(false);
  const [physicalDisease, setPhysicalDisease] = useState("");
  const [mentalDisease, setMentalDisease] = useState("");
  const [nearby, setNearby] = useState(false);
  const [nearbyRelation, setNearbyRelation] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!gender  || (!age && !ageGroup) || !year || !faculty || !major || !religion) {
      Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setLoading(true)
    const userData = {
      userId,
      gender,
      age: age || ageGroup,
      education: year,
      faculty,
      major,
      religion,
      disease: hasDisease ? "มี" : "ไม่มี",
      ph: physicalDisease,
      mh: mentalDisease,
      nearby: nearby ? "มี" : "ไม่มี",
      nearby_relation: nearbyRelation,
    };

    try {
      const res = await fetch(global.URL + "/api/user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Your personal data has been submitted successfully");
        navigation.navigate("Login");
      } else {
        console.log("Server error:", data.error); 
        Alert.alert("Error", data.error || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.log("Network or code error:", error);
      Alert.alert("Error", "Something went wrong. Please check your network connection or try again later.");
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    console.log(age);
  }, [age]);

  function selectAgeInput(age:string){
    setAgeGroup('')
    setAge(age)
  }

  return (
   <SafeAreaView>
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>แบบสอบถามข้อมูลส่วนบุคคล</Text>
        
        {/* เพศ */}
        <Text style={styles.label}>1. เพศ</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity onPress={() => setGender("ชาย")} style={[styles.optionButton, gender === "ชาย" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ชาย</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGender("หญิง")} style={[styles.optionButton, gender === "หญิง" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>หญิง</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGender("ไม่ระบุเพศ")} style={[styles.optionButton, gender === "ไม่ระบุเพศ" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ไม่ระบุเพศ</Text>
          </TouchableOpacity>
        </View>

        {/* อายุ */}
        <Text style={styles.label}>2. อายุ</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity onPress={() => {setAgeGroup("ต่ำกว่า 20 ปี"),setAge('')}} style={[styles.optionButton, ageGroup === "ต่ำกว่า 20 ปี" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ต่ำกว่า 20 ปี</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setAgeGroup("20-25 ปี"),setAge('')}} style={[styles.optionButton, ageGroup === "20-25 ปี" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>20-25 ปี</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setAgeGroup("26-30 ปี"),setAge('')}} style={[styles.optionButton, ageGroup === "26-30 ปี" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>26-30 ปี</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="หรือโปรดระบุอายุ..."
            placeholderTextColor="#999"
            value={age}
            onFocus={()=>setAgeGroup('')}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        {/* ชั้นปี */}
        <Text style={styles.label}>3. ชั้นปีที่กำลังศึกษา</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity onPress={() => setYear("ปี 1")} style={[styles.optionButton, year === "ปี 1" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ปี 1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setYear("ปี 2")} style={[styles.optionButton, year === "ปี 2" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ปี 2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setYear("ปี 3")} style={[styles.optionButton, year === "ปี 3" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ปี 3</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setYear("ปี 4")} style={[styles.optionButton, year === "ปี 4" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ปี 4</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setYear("ปี 5")} style={[styles.optionButton, year === "ปี 5" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ปี 5</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setYear("ปี 6")} style={[styles.optionButton, year === "ปี 6" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ปี 6</Text>
          </TouchableOpacity>
          {/* ... other year options */}
          <TextInput
            style={styles.input}
            placeholder="มากกว่าปี 6 โปรดระบุ..."
            placeholderTextColor="#999"
            value={year}
            onFocus={()=>setYear('')}
            onChangeText={setYear}
            keyboardType="numeric"
          />
        </View>
        

        {/* สำนักวิชา */}
        <Text style={styles.label}>4. สำนักวิชา</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity onPress={() => setFaculty("สำนักวิชาวิศวกรรมศาสตร์")} style={[styles.optionButton, faculty === "สำนักวิชาวิศวกรรมศาสตร์" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>สำนักวิชาวิศวกรรมศาสตร์</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFaculty("สำนักวิชาเทคโนโลยีสังคม")} style={[styles.optionButton, faculty === "สำนักวิชาเทคโนโลยีสังคม" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>สำนักวิชาเทคโนโลยีสังคม</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFaculty("สำนักวิชาเทคโนโลยีการเกษตร")} style={[styles.optionButton, faculty === "สำนักวิชาเทคโนโลยีการเกษตร" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>สำนักวิชาเทคโนโลยีการเกษตร</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFaculty("สำนักวิชาวิทยาศาสตร์")} style={[styles.optionButton, faculty === "สำนักวิชาวิทยาศาสตร์" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>สำนักวิชาวิทยาศาสตร์</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFaculty("สำนักวิชาแพทย์ศาสตร์")} style={[styles.optionButton, faculty === "สำนักวิชาแพทย์ศาสตร์" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>สำนักวิชาแพทย์ศาสตร์</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFaculty("สำนักวิชาทันตแพทย์ศาสตร์")} style={[styles.optionButton, faculty === "สำนักวิชาทันตแพทย์ศาสตร์" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>สำนักวิชาทันตแพทย์ศาสตร์</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFaculty("สำนักวิชาพยาบาลศาสตร์")} style={[styles.optionButton, faculty === "สำนักวิชาพยาบาลศาสตร์" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>สำนักวิชาพยาบาลศาสตร์</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFaculty("สำนักวิชาสาธารณสุขศาสตร์")} style={[styles.optionButton, faculty === "สำนักวิชาสาธารณสุขศาสตร์" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>สำนักวิชาสาธารณสุขศาสตร์</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFaculty("สำนักวิชาศาสตร์และศิลป์ดิจิทัล")} style={[styles.optionButton, faculty === "สำนักวิชาศาสตร์และศิลป์ดิจิทัล" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>สำนักวิชาศาสตร์และศิลป์ดิจิทัล</Text>
          </TouchableOpacity>
          </View>

          <Text style={styles.label}>5. สาขาวิชา</Text>
          <View style={styles.optionContainer}>
          <TextInput
            style={styles.input}
            placeholder="โปรดระบุสำนักวิชา..."
            placeholderTextColor="#999"
            value={major}
            onChangeText={setMajor} // Corrected here
          />
        </View>

        {/* ศาสนา */}
        <Text style={styles.label}>6. ศาสนา</Text>
        <View style={styles.optionContainer}>
          <TouchableOpacity onPress={() => setReligion("พุทธ")} style={[styles.optionButton, religion === "พุทธ" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>พุทธ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReligion("คริสต์")} style={[styles.optionButton, religion === "คริสต์" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>คริสต์</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReligion("อิสลาม")} style={[styles.optionButton, religion === "อิสลาม" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>อิสลาม</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReligion("ฮินดู")} style={[styles.optionButton, religion === "ฮินดู" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ฮินดู</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReligion("ซิกข์")} style={[styles.optionButton, religion === "ซิกข์" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ซิกข์</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReligion("ไม่มีศาสนา")} style={[styles.optionButton, religion === "ไม่มีศาสนา" && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>ไม่มีศาสนา</Text>
          </TouchableOpacity>
          
        </View>

        {/* สถานะสุขภาพ */}
        <Text style={styles.label}>7. โรคประจำตัว</Text>
        <View style={styles.optionContainer}>
        <TouchableOpacity onPress={() => setHasDisease(false)} style={[styles.optionButton, !hasDisease && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>{"ไม่มี"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHasDisease(!hasDisease)} style={[styles.optionButton, hasDisease && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>{"มี" }</Text>
          </TouchableOpacity>
          
        </View>
        {hasDisease && (
            <>
              <TextInput
                style={styles.input}
                placeholder="โปรดระบุโรคทางกาย"
                placeholderTextColor="#999"
                value={physicalDisease}
                onChangeText={setPhysicalDisease}
              />
              <TextInput
                style={styles.input}
                placeholder="โปรดระบุโรคทางจิต"
                placeholderTextColor="#999"
                value={mentalDisease}
                onChangeText={setMentalDisease}
              />
            </>
          )}

        {/* ใกล้ชิดผู้ป่วย */}
        <Text style={styles.label}>8. บุคคลใกล้ชิดมีปัญหาสุขภาพจิต</Text>
        <View style={styles.optionContainer}>
        <TouchableOpacity onPress={() => setNearby(false)} style={[styles.optionButton, !nearby && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>{ "ไม่มี"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNearby(!nearby)} style={[styles.optionButton, nearby && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>{ "มี"}</Text>
          </TouchableOpacity>
          
        </View>
        {nearby && (
            <>
            <Text style={styles.label}>หากบุคคลใกล้ชิดมีปัญหาสุขภาพจิต มีความสัมพันธ์กับท่านเป็น </Text>
            <View style={{width:'50%',flexDirection:'row'}}>
              
            <TouchableOpacity onPress={() => setNearbyRelation('คนรู้จัก')} style={[styles.optionButton, nearbyRelation === 'คนรู้จัก' && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>{ "คนรู้จัก"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNearbyRelation('เพื่อน')} style={[styles.optionButton, nearbyRelation === 'เพื่อน' && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>{ "เพื่อน"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNearbyRelation('คนในครอบครัว')} style={[styles.optionButton, nearbyRelation === 'คนในครอบครัว' && styles.optionButtonSelected]}>
            <Text style={styles.optionText}>{ "คนในครอบครัว"}</Text>
          </TouchableOpacity>
            </View>
             {/* <TextInput
              style={styles.input}
              placeholder="โปรดระบุความสัมพันธ์กับผู้ป่วย"
              placeholderTextColor="#999"
              value={nearbyRelation}
              onChangeText={setNearbyRelation}
            /> */}
            
            </>
           
          )}

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>ยืนยันข้อมูล</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={loading} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#0077b6" />
        </View>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#023e8a',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 24,
    color: '#023e8a',
    marginBottom: 15,
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#afd7f6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#023e8a',
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#023e8a',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#023e8a',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#023e8a',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});


export default PersonalDataScreen;
