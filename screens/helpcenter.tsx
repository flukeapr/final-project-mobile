import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator, ScrollView, TouchableOpacity,Image } from 'react-native';
import { Icon } from '@rneui/base';

const HelpCenterScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [unreadMessage, setUnreadMessage] = useState(0);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const flatListRef = useRef(null);


  

  // Fetch messages
  const getMessage = async () => {
    setMessageLoading(true);
    try {
      const res = await fetch(global.URL +`/api/chat/${global.session.user.id}/9`);
      const data = await res.json();
      if (res.status === 200) {
        setMessages(data.message);
      } else if (res.status === 400) {
        setMessages([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMessageLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async () => {
   
    if (!message.trim()) return;

    try {
      // Append message locally first
      setMessages((prev) => [
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

  

  useEffect(() => {
     getMessage(); 
  }, [navigation]);


  // Scroll to the bottom when a new message is added
  // useEffect(() => {
  //   if (flatListRef.current) {
  //     flatListRef.current.scrollToEnd({ animated: true });
  //   }
  // }, [loading, messages]);

  // Format message timestamp
  function formatTime(createAt) {
    const date = new Date(createAt);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>ศูนย์การช่วยเหลือ</Text>
      </View> */}

      {/* Chat Section */}
      <View style={styles.chatContainer}>
        <Text style={styles.chatTitle}>Chat with us!</Text>
       
      </View>

      {/* User Selection */}
      {/* <View style={styles.usersContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(user) => user.id.toString()}
            renderItem={({ item }) => (
              <Button title={item.name} onPress={() => setSelectedUser(item)} />
            )}
          />
        )}
      </View> */}

      {/* Chat Bubbles */}
      <View style={styles.chatArea}>
        {messageLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <>
              <View style={item.fromSelf ? styles.containerSelf : styles.containerOther}>
              {!item.fromSelf ?               
              <Image source={{ uri: global.URL + '/images/admin/admin.png' }} style={[styles.userImage]}/>
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
      </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  chatSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  usersContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chatArea: {
    flex: 1,
    padding: 10,
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
  chatText: {
    fontSize: 14,
  },
  chatTime: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
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
  userImage:{
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  containerSelf:{
    
    display:'flex',
    flexDirection: 'row-reverse',
  },
  containerOther:{
   
    display:'flex',
    flexDirection: 'row',
  }
});

export default HelpCenterScreen;
