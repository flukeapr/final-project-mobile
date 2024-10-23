import { View, Text,StyleSheet, TouchableOpacity, FlatList, Modal, Dimensions, Image, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native'
import {useState, useEffect} from 'react'


const { width, height } = Dimensions.get('window');
export default function AdminListUsers({navigation}) {
    const [users , setUsers] = useState([]);
    const [unreadMessage, setUnreadMessage] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const getUsers = async ()=>{
        try {
            const res = await fetch(global.URL + `/api/users`);
            const data = await res.json();
            
            if(res.ok){
                setUsers(data.filter((user) => user.role_id === 2));
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }
    const getUnreadMessage = async () => {
        try {
          const res = await fetch(global.URL +"/api/chat/unread", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: global.session.user.id,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            console.log(data)
            setUnreadMessage(data);
          }
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        getUsers();
        getUnreadMessage();
    }, [navigation]);

    if(isLoading){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

  return (
    <SafeAreaView style={styles.container}> 
    <View style={styles.text}><Text style={{color:'white',fontSize:16}}>เลือกแชทกับผู้ใช้</Text></View>
    <View >
    
        <FlatList
        
        data={users.sort((a, b) => {
            const unreadA = unreadMessage.some(
              (item) => item.sender === a.id
            );
            const unreadB = unreadMessage.some(
              (item) => item.sender === b.id
            );
            return unreadB - unreadA;
          })}
        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('AdminHelpCenter', { user: item })}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}
            >
              <Image
                source={{ uri: global.URL + item.image }}   
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              <View style={{ flex: 1, marginLeft: 10, flexDirection: 'column' }}>
              <Text style={{ marginLeft: 10 }}>{item.name}</Text>
              {unreadMessage.some((message) => message.sender === item.id) ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 10 }}>ข้อความใหม่</Text>
                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#2196f3', marginLeft: 5 }}></View>
                      </View>
                    ) : null}
              </View>
              
            </View>
          </TouchableOpacity>
        )}
      />
    
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
        
    },
    text:{
      backgroundColor:'#2196f3',
      width:'100%',
      height:40,
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row',
      
    }
})