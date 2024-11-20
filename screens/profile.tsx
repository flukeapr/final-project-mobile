import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, ScrollView, Alert, StatusBar,Modal,ActivityIndicator, TextInput, FlatList, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const data = [
  {id:1, title:'สายด่วนสขภาพจิต 1323',displayNumber: '1323', url:'https://www.google.com'},
  {id:2, title:'คลินิกวัยรุ่น รพ.มหาวิทยาลัยเทคโนโลยีสุรนารี', url:'https://www.facebook.com/p/%E0%B8%84%E0%B8%A5%E0%B8%B4%E0%B8%99%E0%B8%B4%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%A2%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99-%E0%B8%A3%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%80%E0%B8%97%E0%B8%84%E0%B9%82%E0%B8%99%E0%B9%82%E0%B8%A5%E0%B8%A2%E0%B8%B5%E0%B8%AA%E0%B8%B8%E0%B8%A3%E0%B8%99%E0%B8%B2%E0%B8%A3%E0%B8%B5-100057333614334/?locale=th_TH'},
  {id:3, title:'หน่วยบริการปฐมภูมิ รพ.มทส', url:'https://www.facebook.com/PCUSUTH/'},
  {id:4, title:'รับคำปรึกษาจากจิตแพทย์', url:'/'},
]

const ProfileScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({
    name:global.session?.user?.name,
    email:global.session?.user?.email,
    picture:null
  });
  const [modalHelpCenter, setModalHelpCenter] = useState(false);

  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      try {
        setUser({...user, picture:result.assets[0]});
        console.log(result.assets[0]);
      } catch (error) {
        console.log("error");
      }
    }
  };
  useEffect(()=>{
    console.log(user.picture)
  },[user.picture])
 

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

  const updateProfile = async () => {
    try {
      const res = await fetch(global.URL + `/api/updateuser/profile/data/${global.session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      global.session.user.name = user.name;
      global.session.user.email = user.email;
      if(res.ok){
        if(user.picture !== null){
          const formData = new FormData();
          formData.append('image',{
            uri: user.picture.uri,
            name: user.picture.fileName || 'image.jpg',
            type: user.picture.mimeType || 'image/jpeg',
            
          }as any) ;
          try {
            const resImage = await fetch(global.URL + `/api/updateuser/profile/image/${global.session?.user?.id}`, {
              method: 'PUT',
              body: formData,
            });
           
  
            if(!resImage.ok){
              
              Alert.alert('การอัพเดตรูปภาพผิดพลาด');
              return;
            }
          } catch (error) {
            console.log(error);
            return;
          }
            
        }
        Alert.alert('การอัพเดตข้อมูลสำเร็จ');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('การอัพเดตข้อมูลผิดพลาด');
    }finally{
      setModalVisible(false);
    }
  }
  const closeModal = () => {
    setModalVisible(false);
    setUser({...user, name:global.session?.user?.name, email:global.session?.user?.email,picture:null});
  }

  const renderItem = ({item}) => {
    const handlePress = () => {
      if (item.id === 1) { 
        Linking.openURL(`tel:${item.displayNumber}`);
      }else if(item.id === 4){
        navigation.navigate('HelpCenter');
      }else {
        Linking.openURL(item.url);
      }
    };
    return(
      <>
      
      <TouchableOpacity style={styles.button}onPress={handlePress}>
        <Text style={styles.buttonText}>{item.title}</Text>
      </TouchableOpacity>
     
    </>
    )
  }
  

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
      <TouchableOpacity style={styles.button} onPress={()=>setModalVisible(true)}>
        <Text style={styles.buttonText}>แก้ไขข้อมูล</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {global.session?.user?.role == 1?  navigation.navigate('AdminListUsers') : navigation.navigate('HelpCenter') }}>
        <Text style={styles.buttonText}>ศูนย์การช่วยเหลือ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {setModalHelpCenter(true)}}>
        <Text style={styles.buttonText}>ปรึกษาสุขภาพจิต</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>ออกจากระบบ</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontSize:18, fontWeight:'bold',marginVertical:10}}>แก้ไขข้อมูล</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name='close' size={24} color='black'/>
                </TouchableOpacity>
              </View>
              <View>
                <TextInput 
                  style={styles.input}
                  placeholder='ชื่อ'
                  value={user.name}
                  onChangeText={(text)=>setUser({...user, name:text})}
                
                />
                <TextInput
                  style={styles.input}
                  placeholder='อีเมล'
                  value={user.email}
                  onChangeText={(text)=>setUser({...user, email:text})}
                />
                <TouchableOpacity onPress={pickImage}>
                  {user.picture ? 
                  <Image  source={{uri: user.picture.uri}} style={[styles.profileImage, {borderColor:'#000', borderWidth:1,alignSelf:'center',marginVertical:10}]}/> : 
                  <Image  source={{uri: global.URL + global.session?.user?.picture}} style={[styles.profileImage, {borderColor:'#000', borderWidth:1,alignSelf:'center',marginVertical:10}]}/>
                  }
                <Text style={{textAlign:'center', color:'#000', marginVertical:10}}>เปลี่ยนรูปภาพ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'#023e8a', padding:10, borderRadius:5,width:'100%',alignItems:'center'}} onPress={updateProfile}>  
                  <Text style={{color:'#fff', fontWeight:'bold'}}>ยืนยัน</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>
      <Modal visible={modalHelpCenter} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontSize:18, fontWeight:'bold',marginVertical:10}}>แหล่งข้อมูลให้คำปรึกษา</Text>
                <TouchableOpacity onPress={()=>setModalHelpCenter(false)}>
                  <Ionicons name='close' size={24} color='black'/>
                </TouchableOpacity>
              </View>
              <FlatList 
              data={data}
              renderItem={renderItem}
              keyExtractor={(item)=>item.id.toString()}
              />
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },

});

export default ProfileScreen;
