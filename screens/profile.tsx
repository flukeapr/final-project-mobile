import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation(); 

  const checkLogin = async () => {
    try {
      const resSession = await fetch(global.URL + "/api/auth/session");
      const session = await resSession.json();

      console.log("session home", session);
      if (!session.user) {
        console.log("User not logged in, redirecting to login page.");
        global.session = null;
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "ยืนยันการออกจากระบบ",
      "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "ตกลง",
          onPress: async () => {
            try {
              // Fetch CSRF token for secure logout
              const resCsrf = await fetch(global.URL + "/api/auth/csrf");
              const csrfToken = await resCsrf.json();
  
              // Perform logout request
              await fetch(global.URL + "/api/auth/signout", {
                method: 'POST',
                headers: {
                  Connection: 'keep-alive',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(csrfToken),
              }).catch((error) => console.log(error));
  
              // Verify if user is logged out
              const resSession = await fetch(global.URL + "/api/auth/session");
              const session = await resSession.json();
              if (!session.user) {
                global.session = null;
                navigation.navigate('Login'); // Navigate to Login screen after successful logout
              }
            } catch (error) {
              console.error("Error logging out:", error);
            }
          }
        }
      ]
    );
  };
  
  useEffect(() => {
    checkLogin(); // Ensure login check on component load
  }, []);
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: global.URL + global.session?.user?.picture || 'https://example.com/profile.jpg' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.profileName}>{global.session?.user?.name}</Text>
        <Text style={styles.profileEmail}>{global.session?.user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HelpCenter')}>
        <Text style={styles.buttonText}>ศูนย์การช่วยเหลือ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>ออกจากระบบ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#dceaf7',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#afd7f6',
    paddingVertical: 20,
    borderRadius: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default ProfileScreen;
