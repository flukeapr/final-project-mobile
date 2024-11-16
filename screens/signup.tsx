import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView,Image } from 'react-native';
import "../global"

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState('')

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    try {
      const res = await fetch(global.URL + "/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 2
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Registered successfully");

        navigation.navigate("PersonData", { userId: data.id });
      } else {
        console.log("Server error:", data.error); // Log server error
        Alert.alert("Error", data.error || "Registration failed. Please try again.");
      }
      
    } catch (error) {
      console.log("Network or code error:", error); // Log network or other errors
      Alert.alert("Error", "Something went wrong. Please check your network connection or try again later.");
    }
  };

  function validateEmail(text) {
     if (text && !text.includes('@')) {
      setEmailError('กรุณาใส่อีเมลให้ถูกต้อง * มี @ *')
    } else {
      setEmailError('')
    }
    setEmail(text)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/MH1.png')} style={{width:300,height:200}} />
      <Text style={styles.title}>สมัครสมาชิก</Text>
      <Text style={styles.subtitle}>กรุณากรอกข้อมูลเพื่อสร้างบัญชี</Text>
      <TextInput
        style={styles.input}
        placeholder="ชื่อ"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
       {emailError ? (
    <Text style={styles.errorText}>{emailError}</Text>
  ) : null}
      <TextInput
       style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="อีเมล"
        placeholderTextColor="#999"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="สร้างรหัสผ่าน"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="ยืนยันรหัสผ่าน"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>สมัครสมาชิก</Text>
      </TouchableOpacity>
      <Text style={styles.text}>
      มีบัญชีอยู่แล้ว?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>เข้าสู่ระบบ</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Light background color
    padding: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#023e8a', // Dark blue for contrast
    marginBottom: 20,
  },
  subtitle: { 
    fontSize: 16, 
    color: '#555', 
    marginBottom: 20 
  },
  input: { 
    width: '100%', 
    height: 50, 
    borderColor: '#023e8a', // Use the main color for the border
    borderWidth: 1, 
    marginBottom: 15, 
    paddingLeft: 15,
    borderRadius: 10, // Rounded corners
    backgroundColor: 'white', // White input background
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: { 
    backgroundColor: '#afd7f6', // Primary color
    paddingVertical: 15, 
    paddingHorizontal: 80, 
    borderRadius: 10, 
    alignItems: 'center',
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: { 
    color: '#023e8a', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: { 
    marginTop: 20,
    fontSize: 14,
    color: '#023e8a',
  },
  link: { 
    color: '#0077b6', 
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginVertical: 2,
  }
});

export default SignupScreen;
