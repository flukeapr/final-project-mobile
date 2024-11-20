import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet,Image ,SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Icon } from '@rneui/base';

const AiScreen = () => {
  const [messages, setMessages] = useState([{ text: 'สวัสดี! ฉันคือ HAPPY มีอะไรให้ช่วยไหม?', fromSelf: false }]);
  const [input, setInput] = useState('');

  const handleSend = async ()  => {
    try {
      setMessages(prev=> [...prev,{
          fromSelf: true,
          text: input,
          createAt: new Date()
      }])
      const genAI = new GoogleGenerativeAI("AIzaSyDIHbVTehrGmnlde2jr1hFuS2HnOacEnoc");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b"});
      const prompt = `คุณรับบทเป็นนักจิตวิทยาชื่อ "น้อง Happy" โดยผมเป็นผู้ที่กำลังเผชิญกับปัญหาทางสุขภาพจิต คุณสามารถให้คำแนะนำและความรู้เกี่ยวกับสุขภาพจิตในบริบทที่เกี่ยวข้องกับ ${input} ได้ไหมครับ เพื่อช่วยให้ผมเข้าใจและดูแลตัวเองได้ดีขึ้น ขอคำตอบประมาณไม่เกิน 3 บรรทัด`
      const result = await model.generateContent(prompt);
      
      const text =  result.response.text();
      setMessages(prev=> [...prev,{
          fromSelf: false,
          text: text,
          createAt: new Date()
      }])
      setInput('');
  } catch (error) {
      console.log(error)
      if (error.message?.includes('503')) {
        Alert.alert("ขออภัย", "ระบบกำลังมีผู้ใช้งานมาก กรุณาลองใหม่อีกครั้งในภายหลัง");
      } else {
        Alert.alert("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง");
      }
  }
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>พูดคุยกับน้อง{" "}HAPPY</Text>
       <Image source={require('../res/Head_happy.png')} style={styles.image} />
      </View> */}
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={item.fromSelf ? styles.userMessage : styles.botMessage}>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="พิมพ์ข้อความที่นี่..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Icon name="send" color={'white'} />
        </TouchableOpacity>
       
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  image:{
    width: 50,
    height: 50,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#023e8a',
  },
  header:{
    flexDirection: 'row',
    justifyContent:'space-evenly',
    alignItems: 'center',
    padding:10,
    margin:2,
   
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sendButton:{
    backgroundColor: '#023e8a',
    padding: 10,
    borderRadius: 5,
  }
});

export default AiScreen;
