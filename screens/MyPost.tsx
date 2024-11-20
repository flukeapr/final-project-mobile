import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput,Dimensions, FlatList, Modal, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const {width, height} = Dimensions.get('window');
export default function MyPost({route}:any) {
  const {data} = route.params;
  const [post ,setPost] = useState(data);
  const [modalVisible, setModalVisible] = useState(false);
  const [editPost ,setEditPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postData ,setPostData] = useState({
    text:'',
    image:null
  });

  const formatTime = (createAt) => {
    const date = new Date(createAt);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const showModal = (post:any) => {
    setModalVisible(true);
    setEditPost(true);
    setSelectedPost(post);
    setPostData({text:post.postText, image:null});
  }

  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      try {
        setPostData({...postData, image:result.assets[0]});
        console.log(result.assets[0]);
      } catch (error) {
        console.log("error");
      }
    }
  };

  const closeModal = ()=>{
    setPostData({
        text:'',
        image:null
    });
    setModalVisible(false);
  };

  const handleDeletePost = async (item :any) => {
    try {
     Alert.alert('ยืนยันการลบ','ณต้องการลบโพสต์นี้ใช่หรือไม่?',[
        {
            text:'ยกเลิก',
            onPress:()=>{},
            style:'cancel'
        },
       {
        text:'ยืนยัน',
        onPress:()=>{
            confirmDelete();
        }
       }
     ]);
     
     const confirmDelete = async () => {
       try {
            const res = await fetch(global.URL + `/api/post/${item.postId}`,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if(res.ok){
                if(item.postImage){
                    const resImage = await fetch(global.URL + `/api/post/image/${item.postId}`,{
                        method:'DELETE',
                    });
                }

                setPost(post.filter((post:any) => post.postId !== item.postId));
                Alert.alert('สำเร็จ','ลบโพสต์สำเร็จ');
            }else{
                Alert.alert('ผิดพลาด','กรุณาลองใหม่อีกครั้ง');
            }
       } catch (error) {
            
       }
     }

    } catch (error) {
        console.log(error);
        Alert.alert('ผิดพลาด','กรุณาลองใหม่อีกครั้ง');
    }
  }

  const handleEditPost = async (id:string) => {
    try {
        console.log(postData);
        const res = await fetch(global.URL + `/api/post/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                text:postData.text
            })
        });
        if(res.ok){
            if(postData.image){
                const formData = new FormData();
                formData.append('image',{
                    uri:postData.image.uri,
                    name:postData.image.fileName||'fileName',
                    type:postData.image.mimeType||'image/jpeg',
                }as any);
                try {
                    console.log(global.URL + `/api/post/image/${id}`);
                    const resImage = await fetch(global.URL + `/api/post/image/${id}`,{
                        method:'PUT',
                        body:formData
                    });
                    if(!resImage.ok){
                        Alert.alert('ผิดพลาด','กรุณาลองใหม่อีกครั้ง');
                        return;
                    }
                } catch (error) {
                    console.log(error);
                    return;
                }
                
            }
            
            Alert.alert('สำเร็จ','แก้ไขโพสต์สำเร็จ');
            
        }else{
            Alert.alert('ผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }
    } catch (error) {
        console.log(error);
        Alert.alert('ผิดพลาด','กรุณาลองใหม่อีกครั้ง');
    }finally{
        setModalVisible(false);
    }
  }

const EditPost = ({post}:any) => {
    return (
        <>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text>แก้ไขโพสต์</Text>
            <TouchableOpacity onPress={closeModal}>
                <Ionicons name='close' size={24} color='black'/>
            </TouchableOpacity>
            </View>
            <TextInput 
            style={styles.postInput}
            value={postData.text}
            onChangeText={(text) => setPostData({...postData, text:text})}
           />
            {postData.image ? (
             <Image source={{uri: postData.image.uri}} style={styles.topicImage}/>
            ) : post.postImage ? (
             <Image source={{uri: global.URL + post.postImage}} style={styles.topicImage}/>
            ) : null}
           
            <TouchableOpacity style={{backgroundColor:'#2196f3', padding:10, borderRadius:8, alignItems:'center', marginTop:10 ,width:'40%',alignSelf:'flex-end'}} onPress={pickImage}>
                <Text style={{color:'#fff', fontSize:14}}>เลือกรูปภาพ</Text>
            </TouchableOpacity>
          

            <TouchableOpacity style={{backgroundColor:'#03346E', padding:10, borderRadius:8, alignItems:'center', marginTop:10}} onPress={()=>handleEditPost(selectedPost.postId)}>
                <Text style={styles.postButtonText}>ยืนยัน</Text>
            </TouchableOpacity>
  </>
    )
}

  const renderItem = ({ item }) => (
    <View style={styles.topicCard}>
      <View style={styles.topicUserContainer}>
        <Image
          source={{ uri: global.URL + item.postUserImage }}
          style={styles.topicUserImage}
        />
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Text style={styles.topicUser}>{item.postUserName}</Text>
          <Text style={{ fontSize: 12 }}>{formatTime(item.postCreateAt)}</Text>
        </View>
      </View>
      <Text style={styles.topicText}>{item.postText}</Text>
      {item.postImage && (
        <Image
          source={{ uri: global.URL + item.postImage }}
          style={styles.topicImage}
        />
      )}
     
      <View style={{flexDirection:'row'}}>

     <TouchableOpacity style={{
        backgroundColor:'#DE7C7D',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        padding:5,
        borderRadius:5,
        width:'20%',
        marginTop:10,
        marginRight:10
     }}
     onPress={() => showModal(item)}
     >
        <Text style={{color:'white' ,marginRight:6}}>แก้ไข</Text>
        <Ionicons name='pencil' size={16} color='white'/>
     </TouchableOpacity>
     <TouchableOpacity style={{
        backgroundColor:'#80C4E9',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        padding:5,
        borderRadius:5,
        width:'20%',
        marginTop:10,
        marginRight:10
     }}
     onPress={() => handleDeletePost(item)}
     >
        <Text style={{color:'white' ,marginRight:6}}>ลบ</Text>
        <Ionicons name='trash' size={16} color='white'/>
     </TouchableOpacity>
      </View>
     
     
  
       {/* <View style={{ display: "flex", flexDirection: "row" , justifyContent: "center", alignItems: "center" }}>
      <TextInput
            style={styles.commentInput}
            placeholder="เพิ่มความคิดเห็น..."
            value={commentText[item.postId] || ""}
            onChangeText={(text) => handleWriteComment(item.postId, text)}
          />
          <TouchableOpacity
            onPress={() => handleComment(item.postId)}
            style={styles.commentButton}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              ส่ง
            </Text>
          </TouchableOpacity>
      </View> */}
    </View>
  );
  return (
    <View style={styles.container}>
        {post ? (
            <FlatList
              data={post}
              renderItem={renderItem}
              keyExtractor={(item) => item.postId.toString()}
              contentContainerStyle={styles.topicsContainer}
            />

        ):(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>ไม่มีข้อมูล</Text>
            </View>
        )}
       <Modal visible={modalVisible} transparent={true} onRequestClose={()=>setModalVisible(false)} animationType='fade'>
        <View style={styles.modalContainer}>
            <View style={styles.modalView}>
             <EditPost post={selectedPost}/> 
            </View>
        </View>
      </Modal>
    </View>
  )
};



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#dceaf7",
      padding: 10,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      alignSelf: "center",
      marginVertical: 10,
    },
    topicsContainer: {
      flexGrow: 1,
    },
    topicCard: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 15,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      elevation: 5,
    },
    topicUser: {
      fontSize: 13,
      fontWeight: "bold",
      color: "#333",
    },
    topicImage: {
      width: "100%",
      height: 400,
      borderRadius: 8,
      marginTop: 10,
    },
    topicFooter: {
      flexDirection: "row",
      marginTop: 10,
    },
    iconButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    topicText: {
      marginTop: 10,
      fontSize: 16,
      color: "#333",
    },
    commentContainer: {
      marginTop: 10,
     
    },
    commentInput: {
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 10,
      marginTop: 10,
      height:40,
      width: "80%",
    },
    commentButton: {
      backgroundColor: "#2196f3",
      borderRadius: 8,
      padding: 10,
      width: "20%",
      height:40,
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    commentButtonText: {
      color: "#333",
      fontSize: 14,
    },
    postInput: {
      borderWidth: 1,
      width: "100%",
      height: 100,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 10,
      marginVertical: 10,
    },
    postButton: {
      backgroundColor: "#4CAF50",
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    postButtonText: {
      color: "#fff",
      fontSize: 16,
    },
    addButton: {
      position: "absolute",
      bottom: 80,
      right: 20,
      backgroundColor: "#007AFF",
      borderRadius: 50,
      padding: 15,
    },
    addButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    topicUserImage: {
      width: 40,
      height: 40,
      borderRadius: 15,
    },
    topicUserContainer: {
      flexDirection: "row",
    },
    button: {
      borderRadius: 8,
      padding: 10,
      width: "50%",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    },
    modalView: {
      width: width * 0.9, // 85% of screen width
      maxHeight: height * 0.9, // Limit modal height to 75% of screen height
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 20,
     
    },
    loadingContainer: {
      backgroundColor:"#dceaf7",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });