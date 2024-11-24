import { View, Text, ScrollView, StyleSheet, Alert, SafeAreaView, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { Button,CheckBox } from '@rneui/base';

export default function Privacy({navigation}:any) {
  const [checked ,setChecked] = useState(false);
    const acceptPrivacy = async ()  => {
        try {
            global.session.user.privacy = 'true';
            const res = await fetch(global.URL + `/api/updateuser/profile/data/${global.session?.user?.id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    privacy:'true'
                })
            })
            if(res.ok){
                Alert.alert('ยอมรับนโยบายความเป็นส่วนตัว','สำเร็จ');
                navigation.navigate('MainTabs');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('ผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }
    }
  return (
    <>


  <SafeAreaView style={{flex:1}}>

  <View style={styles.header}>

<Text style={[styles.title,{color:'#fff'}]}>นโยบายความเป็นส่วนตัว</Text>
  </View>
    <ScrollView style={styles.container}>
    
    
    <View style={styles.content}>
       
      
      <Text style={styles.heading}>1. การเก็บรวบรวมข้อมูลส่วนบุคคล</Text>
      <Text style={styles.paragraph}>
        เราเก็บรวบรวมข้อมูลส่วนบุคคลที่จำเป็นเพื่อการให้บริการ เช่น ชื่อ อีเมล และข้อมูลที่ท่านให้ไว้ในการใช้งานแอปพลิเคชัน
      </Text>

      <Text style={styles.heading}>2. วัตถุประสงค์ในการใช้ข้อมูล</Text>
      <Text style={styles.paragraph}>
        • เพื่อให้บริการและปรับปรุงการใช้งานแอปพลิเคชัน{'\n'}
        • เพื่อติดต่อสื่อสารกับท่านเกี่ยวกับการใช้บริการ{'\n'}
        • เพื่อวิเคราะห์และพัฒนาการให้บริการ
      </Text>

      <Text style={styles.heading}>3. การเปิดเผยข้อมูล</Text>
      <Text style={styles.paragraph}>
        เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านให้กับบุคคลภายนอก ยกเว้นกรณีที่กฎหมายกำหนดหรือได้รับความยินยอมจากท่าน
      </Text>

      <Text style={styles.heading}>4. การรักษาความปลอดภัย</Text>
      <Text style={styles.paragraph}>
        เรามีมาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการสูญหาย การเข้าถึง การใช้ หรือการเปิดเผยข้อมูลโดยไม่ได้รับอนุญาต
      </Text>

      <Text style={styles.heading}>5. สิทธิของเจ้าของข้อมูล</Text>
      <Text style={styles.paragraph}>
        ท่านมีสิทธิในการเข้าถึง แก้ไข ลบ และคัดค้านการประมวลผลข้อมูลส่วนบุคคลของท่าน รวมถึงสิทธิในการถอนความยินยอม
      </Text>
      
      <CheckBox
      checked={checked}
      onPress={()=>setChecked(!checked)}
      title={'ยินยอมการใช้ข้อมูล'}
      />
     <Button title='ยอมรับ' disabled={!checked} onPress={acceptPrivacy} />
    </View>
  </ScrollView>
  </SafeAreaView>
  </>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
        
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom:20
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    //   marginBottom: 20,
      textAlign: 'center',
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 15,
      marginBottom: 10,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        padding:10,
      
        backgroundColor: '#023e8a', // Dark blue
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,
      },
  });