import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert ,Image } from 'react-native';
import "../global"

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    try {
      const response = await fetch(global.URL + '/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert('Success', 'A reset link has been sent to your email.');
        navigation.navigate('Login');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to reset password.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resetting your password.');
      console.error('Reset password error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/MH2.png')} style={{width:300, height:300}} />
      <Text style={styles.title}>รีเซ็ตรหัสผ่าน</Text>
      <Text style={styles.subtitle}>กรุณากรอกอีเมลของคุณเพื่อรีเซ็ตรหัสผ่านของคุณ</Text>
      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>รีเซ็ตรหัสผ่าน</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>กลับสู่การเข้าสู่ระบบ</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#023e8a',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  input: {
    width: 280,
    height: 50,
    borderColor: '#023e8a',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#afd7f6',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
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
  link: {
    color: '#0077b6',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;
