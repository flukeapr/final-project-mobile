import { View, Text,StyleSheet, TouchableOpacity, FlatList, Modal,ActivityIndicator, Dimensions,Image,TextInput } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@rneui/base';
export default function AdminHelpCenter({navigation,route}) {
    const user = route.params;
    
    
  
    const [message, setMessage] = useState(""); 
    const [dataMessage, setDataMessage] = useState([]);
    const flatListRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const getMessage = async () => {
        try {
          const res = await fetch(global.URL +`/api/chat/${global.session.user.id}/${user.user.id}`);
          const data = await res.json();
          if(res.status===200){
            
            setDataMessage(data.message);
           
          }else if(res.status===400){
            setDataMessage([]);
          }
          
          console.log(data);
        } catch (error) {
          console.log(error);
        }finally{
          setLoading(false);
        }
      };
    const markMessagesAsRead = async () => {
        if(dataMessage.length===0) return
        try {
          const res = await fetch( global.URL + `/api/chat/${global.session.user.id}/${user.user.id}`, {
            method: "PUT",
          });
      
          if (res.ok) {
            console.log("Marked messages as read successfully");
          } else {
            console.error("Failed to mark messages as read");
          }
        } catch (error) {
          console.error("Mark messages as read error:", error);
        }
      };
      useEffect(() => {
        getMessage().then(() => {
          markMessagesAsRead();
        })
        setMessage("");
      }, [user]);

      function formatTime(createAt) {
        const date = new Date(createAt);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }

      const handleSendMessage = async () => {
   
        if (!message.trim()) return;
    
        try {
          // Append message locally first
          setDataMessage((prev) => [
            ...prev,
            {
              fromSelf: true,
              message,
              createAt: new Date(),
            },
          ]);
    
          // Send message to the server
          const res = await fetch( global.URL + "/api/chat/chat-to-admin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message,
              from: global.session.user.id,
            }),
          });
    
          const data = await res.json();
          if (res.ok) {
            setMessage("");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.headerText}>ศูนย์การช่วยเหลือ</Text>
      </View>
      <View style={styles.chatContainer}>
        <Text style={styles.chatTitle}>Chat with {user.user.name}</Text>
       
      </View>
      <View style={styles.chatArea}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            data={dataMessage}
            keyExtractor={(item, index) => index.toString()}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <>
              <View style={item.fromSelf ? styles.containerSelf : styles.containerOther}>
              {!item.fromSelf ?               
              <Image source={{ uri: global.URL + item.image }} style={[styles.userImage]}/>
              : <Image source={{ uri: global.URL + global.session.user.image }} style={[styles.userImage]}/> }  
              <View style={item.fromSelf ? styles.chatBubbleSelf : styles.chatBubbleOther}>
                <Text style={styles.chatText}>{item.message}</Text>
                <Text style={styles.chatTime}>{formatTime(item.createAt)}</Text>
              </View>
              </View>
              </>
              
            )}
          />
        )}
         {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="เขียนข้อความ"
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} >
        <Icon name="send" color={'white'} />
        </TouchableOpacity>
        
      </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
    },
    containerSelf:{
    
        display:'flex',
        flexDirection: 'row-reverse',
      },
      containerOther:{
       
        display:'flex',
        flexDirection: 'row',
      },
      userImage:{
        width: 30,
        height: 30,
        borderRadius: 50,
      },
      chatBubbleSelf: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
        borderRadius: 10,
        padding: 10,
        margin: 5,
      },
      chatBubbleOther: {
        backgroundColor: '#E0E0E0',
        alignSelf: 'flex-start',
        borderRadius: 10,
        padding: 10,
        margin: 5,
      },
      chatArea: {
        flex: 1,
        padding: 10,
      },
      chatText: {
        fontSize: 14,
      },
      chatTime: {
        fontSize: 10,
        color: '#888',
        textAlign: 'right',
      },
      header: {
        padding: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
      },
      headerText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      chatContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196f3',
        paddingVertical: 16,
      },
      chatTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#E0E0E0',
        padding: 8,
      },
      input: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 16,
      },
      sendButton:{
        backgroundColor: '#023e8a',
        padding: 10,
        borderRadius: 5,
      },
})