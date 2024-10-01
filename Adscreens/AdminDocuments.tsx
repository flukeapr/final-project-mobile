import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';

export default function AdminDocumentsScreen({ navigation }) {
  const [documents, setDocuments] = useState([]);
  const [currentDoc, setCurrentDoc] = useState({ uri: '', url: '', title: '', type: 'image', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(global.URL + '/api/media');
      if (!res.ok) {
        throw new Error('Failed to fetch data.');
      }
      const data = await res.json();
      setDocuments(data);
      setLoading(false);
    } catch (error) {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้");
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!currentDoc.title || (!currentDoc.url && !currentDoc.content)) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกชื่อหัวข้อและ URL หรือเนื้อหา");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
        setLoading(true);
        let docId = null;

        if (isEditing) {
            // ใช้เอกสารที่แก้ไขแล้ว
            const updatedDocuments = documents.map((doc, index) => 
                index === editIndex ? { ...doc, ...currentDoc } : doc
            );
            setDocuments(updatedDocuments);

            // อัปเดตข้อมูลไปยัง API
            const res = await fetch(global.URL + `/api/media/${currentDoc.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentDoc),
            });

            if (!res.ok) {
                throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
            }

            setIsEditing(false);
            setEditIndex(null);
            docId = currentDoc.id;
        } else {
            // สำหรับการเพิ่มเอกสารใหม่
            const res = await fetch(global.URL + '/api/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentDoc),
            });
            const newDoc = await res.json();
            setDocuments([...documents, newDoc]);
            docId = newDoc.id;
        }

        // อัปโหลดไฟล์ภาพหรือวิดีโอหลังจากบันทึกข้อมูลเอกสารแล้ว
        if (image) {
            await uploadMedia('image', docId, image);
        } else if (video) {
            await uploadMedia('video', docId, video);
        }

        setCurrentDoc({ uri: '', url: '', title: '', type: 'image', content: '' });
        setImage(null);
        setVideo(null);
        setModalVisible(false);
        setLoading(false);
    } catch (error) {
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
        setLoading(false);
    }
};
  const uploadMedia = async (mediaType, docId, mediaData) => {
    const formData = new FormData();
    formData.append(mediaType, {
      uri: mediaData.uri,
      type: mediaData.mimeType,
      name: mediaData.fileName || mediaData.uri.split('/').pop(),
    });

    const res = await fetch(global.URL + `/api/media/${docId}`, {
      method: 'PUT',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      Alert.alert(`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} อัปโหลดล้มเหลว`, data.error || `เกิดข้อผิดพลาดในการอัปโหลด ${mediaType}`);
    }
  };

  const handleEdit = (index) => {
    setCurrentDoc(documents[index]);
    setIsEditing(true);
    setEditIndex(index);
    setModalVisible(true);
  };

  const handleDelete = async (index) => {
    Alert.alert("ยืนยันการลบ", "คุณแน่ใจหรือไม่ว่าต้องการลบสื่อนี้?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ", onPress: async () => {
          try {
            const docId = documents[index].id;
            const res = await fetch(global.URL + `/api/media/${docId}`, { method: 'DELETE' });

            if (res.ok) {
              setDocuments(documents.filter((_, i) => i !== index));
              Alert.alert('ลบสำเร็จ');
            } else {
              const data = await res.json();
              Alert.alert("ลบไม่สำเร็จ", data.error || "เกิดข้อผิดพลาดในการลบ");
            }
          } catch (error) {
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบสื่อนี้ได้");
          }
        }
      }
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
  };

  const handleAddNew = () => {
    setCurrentDoc({ uri: '', url: '', title: '', type: 'image', content: '' });
    setIsEditing(false);
    setEditIndex(null);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>จัดการสื่อ</Text>

      {documents.map((doc, index) => (
        <View key={index} style={styles.card}>
          {doc.image ? (
            <Image source={{ uri: global.URL + doc.image }} style={styles.image} />
          ) : doc.video ? (
            <Video source={{ uri: global.URL + doc.video }} resizeMode={ResizeMode.CONTAIN} style={styles.video} />
          ) : doc.content ? (
            <Text style={styles.articleContent}>{doc.content}</Text>
          ) : null}
          <Text style={styles.text}>{doc.title}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(index)}>
              <Text style={styles.saveButtonText}>แก้ไข</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
              <Text style={styles.saveButtonText}>ลบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.newAddButton} onPress={handleAddNew}>
        <Text style={styles.newAddButtonText}>เพิ่มสื่อใหม่</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{isEditing ? "แก้ไขสื่อ" : "เพิ่มสื่อใหม่"}</Text>
          <TextInput
            placeholder="หัวข้อ"
            placeholderTextColor="#999"
            value={currentDoc.title}
            onChangeText={(text) => setCurrentDoc({ ...currentDoc, title: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="URL รูปภาพ/วิดีโอ"
            placeholderTextColor="#999"
            value={currentDoc.uri}
            onChangeText={(text) => setCurrentDoc({ ...currentDoc, uri: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="URL"
            placeholderTextColor="#999"
            value={currentDoc.url}
            onChangeText={(text) => setCurrentDoc({ ...currentDoc, url: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="เนื้อหา (บทความ)"
            placeholderTextColor="#999"
            value={currentDoc.content}
            onChangeText={(text) => setCurrentDoc({ ...currentDoc, content: text })}
            style={styles.input}
            multiline={true}
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerText}>เลือกรูปภาพ</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 100, marginTop: 20 }} />}
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickVideo}>
            <Text style={styles.imagePickerText}>เลือกวิดีโอ</Text>
          </TouchableOpacity>
          {video && <Video ref={videoRef} source={{ uri: video.uri }} resizeMode={ResizeMode.CONTAIN} style={{ width: 200, height: 100, marginTop: 20 }} />}
          {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
            <>
              <Button title={isEditing ? "บันทึกการเปลี่ยนแปลง" : "บันทึก"} onPress={handleSave} />
              <Button title="ยกเลิก" onPress={() => setModalVisible(false)} />
            </>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  video: {
    width: '100%',
    height: 200,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
  },
  newAddButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  newAddButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  imagePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#fff',
    textAlign: 'center',
  }
});
