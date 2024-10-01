import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, FlatList, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for image handling

const AdminCommunityScreen = () => {
  const [posts, setPosts] = useState([]); // Stores all posts
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({}); // Tracks comment text per post
  const [postText, setPostText] = useState(''); // Tracks post text
  const [uploadImage, setUploadImage] = useState(null); // Stores selected image for posting
  const [editPostText, setEditPostText] = useState(''); // Tracks the text for editing a post
  const [editingPostId, setEditingPostId] = useState(null); // Tracks which post is being edited


  const getPost = async () => {
    try {
      const res = await fetch(global.URL + '/api/post');
      const data = await res.json();
      if (res.ok) {
        // Format posts and comments into structured data
        const formattedPost = data.reduce((acc, item) => {
          let post = acc.find(post => post.postId === item.post_id);
          if (!post) {
            post = {
              postId: item.post_id,
              postText: item.post_text,
              postImage: item.post_image,
              postUserId: item.post_userId,
              postUserName: item.post_user_name,
              postUserImage: item.post_user_image,
              postCreateAt: item.post_create_at,
              comments: [],
              showComments: false,
              commentText: '',
            };
            acc.push(post);
          }
  
          if (item.comment_id) {
            post.comments.push({
              commentId: item.comment_id,
              commentText: item.comment_text,
              commentImage: item.comment_image,
              commentUser: item.comment_userId,
              commentUserName: item.comment_user_name,
              commentUserImage: item.comment_user_image,
              commentCreateAt: item.comment_create_at,
            });
          }
  
          return acc;
        }, []);
  
        // Sort the posts by creation date in descending order (latest first)
        formattedPost.sort((a, b) => new Date(b.postCreateAt) - new Date(a.postCreateAt));
        
        setPosts(formattedPost); // Update state with formatted posts
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    getPost();
  }, []);

  const toggleComments = (postId) => {
    const post = posts.find(post => post.postId === postId);
    if (post.comments.length === 0) return;
    setPosts(posts.map(post => 
      post.postId === postId 
        ? { ...post, showComments: !post.showComments } 
        : post
    ));
  };

  const handleEditPost = async (postId) => {
    if (!editPostText) {
      Alert.alert('กรุณาใส่ข้อความ');
      return;
    }
  
    try {
      const res = await fetch(global.URL + `/api/post/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editPostText }),
      });
  
      if (res.ok) {
        Alert.alert('แก้ไขโพสต์สำเร็จ');
        setEditingPostId(null); // Stop editing after success
        getPost(); // Refresh posts
      } else {
        Alert.alert('เกิดข้อผิดพลาดในการแก้ไขโพสต์');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('เกิดข้อผิดพลาดในการแก้ไขโพสต์');
    }
  };
  

  const handleDeletePost = async (postId) => {
    Alert.alert(
      "ยืนยันการลบโพสต์",
      "คุณต้องการลบโพสต์นี้หรือไม่?",
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "ลบ",
          onPress: async () => {
            try {
              const res = await fetch(global.URL + `/api/post/${postId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
              });
  
              if (res.ok) {
                Alert.alert("ลบโพสต์สำเร็จ");
                getPost(); // Refresh posts after deletion
              } else {
                Alert.alert("เกิดข้อผิดพลาดในการลบโพสต์");
              }
            } catch (error) {
              console.log(error);
              Alert.alert("เกิดข้อผิดพลาดในการลบโพสต์");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const formatDay = (createAt) => {
    const date = new Date(createAt);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (createAt) => {
    const date = new Date(createAt);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleWriteComment = (postId, text) => {
    setCommentText(prev => ({ ...prev, [postId]: text }));
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text) {
      Alert.alert('กรุณาเขียนความคิดเห็น');
      return;
    }

    try {
      const res = await fetch(global.URL + '/api/post/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: global.session.user.id, text }),
      });

      const data = await res.json();
      if (res.ok) {
        setCommentText(prev => ({ ...prev, [postId]: '' }));
        getPost();
      } else {
        Alert.alert(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      try {

        setUploadImage(result.assets[0]);
      console.log(result.assets[0]);
      } catch (error) {
        console.log("error")
      }
      
    }
  };

  const handlePost = async () => {
    if (!postText) {
      Alert.alert('กรุณาใส่ข้อความ');
      return;
    }
  
    try {
      const res = await fetch(global.URL + '/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: global.session.user.id, 
          text: postText 
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        const id = data.id;
  
        if (uploadImage) {
          const formData = new FormData();
          formData.append('image', {
            uri: uploadImage.uri,
            type: uploadImage.mimeType,
            name: uploadImage.fileName || "filename",
            size: uploadImage.fileSize,
          });
  
          try {
            const imageRes = await fetch(global.URL + `/api/post/image/${id}`, {
              method: 'PUT',
              body: formData,
            });
  
            if (!imageRes.ok) {
              const imageData = await imageRes.json();
              Alert.alert(imageData.error);
              // If the image upload fails, delete the post
              await fetch(global.URL + `/api/post/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
              });
              return;
            }
          } catch (error) {
            console.log(error);
          }
        }
  
        Alert.alert('โพสต์สําเร็จ');
        setPostText('');
        setUploadImage(null);
        getPost(); // Refresh posts
      } else {
        Alert.alert('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('เกิดข้อผิดพลาด');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.topicCard}>
      {item.postImage && <Image source={{ uri: global.URL + item.postImage }} style={styles.topicImage} />}
      {editingPostId === item.postId ? (
        <TextInput
          style={styles.editInput}
          value={editPostText}
          onChangeText={setEditPostText}
        />
      ) : (
        <Text style={styles.topicText}>{item.postText}</Text>
      )}
      <Text style={styles.topicUser}>โพสต์โดย: {item.postUserName}</Text>
      <View style={styles.topicFooter}>
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleComments(item.postId)}>
          <Text style={styles.commentButtonText}>ความคิดเห็น</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={[styles.commentButtonText, { color: '#EA6B6E' }]}>ชอบ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => {
          setEditPostText(item.postText);
          setEditingPostId(item.postId);
        }}>
          <Ionicons name="create" size={20} color="#FFA500" />
          <Text style={{ color: '#FFA500', marginLeft: 5 }}>แก้ไข</Text>
        </TouchableOpacity>
        {editingPostId === item.postId && (
          <TouchableOpacity style={styles.iconButton} onPress={() => handleEditPost(item.postId)}>
            <Ionicons name="checkmark" size={20} color="#4CAF50" />
            <Text style={{ color: '#4CAF50', marginLeft: 5 }}>บันทึก</Text>
          </TouchableOpacity>
        )}
        {/* ปุ่มลบโพสต์ */}
        <TouchableOpacity style={styles.iconButton} onPress={() => handleDeletePost(item.postId)}>
          <Ionicons name="trash" size={20} color="red" />
          <Text style={{ color: 'red', marginLeft: 5 }}>ลบ</Text>
        </TouchableOpacity>
      </View>
      {item.showComments && (
        <View>
          {item.comments.map(comment => (
            <View key={comment.commentId} style={styles.commentContainer}>
              <Text>{comment.commentUserName}: {comment.commentText}</Text>
            </View>
          ))}
          <TextInput
            style={styles.commentInput}
            placeholder="เพิ่มความคิดเห็น..."
            value={commentText[item.postId] || ''}
            onChangeText={(text) => handleWriteComment(item.postId, text)}
          />
          <TouchableOpacity onPress={() => handleComment(item.postId)} style={styles.commentButton}>
            <Text style={styles.commentButtonText}>ส่ง</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>ชุมชน</Text>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId.toString()}
        contentContainerStyle={styles.topicsContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={pickImage}>
  <Text style={styles.addButtonText}>เพิ่มรูปภาพ</Text>
</TouchableOpacity>
      <TextInput
        style={styles.postInput}
        placeholder="เขียนโพสต์..."
        value={postText}
        onChangeText={setPostText}
      />
      <TouchableOpacity onPress={handlePost} style={styles.postButton}>
        <Text style={styles.postButtonText}>โพสต์</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f0f5', 
    padding: 10 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    alignSelf: 'center', 
    marginVertical: 10 
  },
  topicsContainer: { 
    flexGrow: 1 
  },
  topicCard: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 15, 
    marginBottom: 15 
  },
  topicUser: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  topicImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8, 
    marginTop: 10 
  },
  topicFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  iconButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  topicText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#333' 
  },
  commentContainer: { 
    marginTop: 10 
  },
  commentInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 10, 
    marginTop: 10 
  },
  commentButton: { 
    backgroundColor: '#2196f3', 
    borderRadius: 8, 
    padding: 10, 
    alignItems: 'center' 
  },
  commentButtonText: {
    color: '#333',
    fontSize: 14,
  },
  postInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 10, 
    marginVertical: 10 
  },
  postButton: { 
    backgroundColor: '#4CAF50', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  postButtonText: { 
    color: '#fff', 
    fontSize: 16 
  },
  addButton: { 
    position: 'absolute', 
    bottom: 80, 
    right: 20, 
    backgroundColor: '#007AFF', 
    borderRadius: 50, 
    padding: 15 
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  }
  
});

export default AdminCommunityScreen;
