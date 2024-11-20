import { View, Text,StyleSheet,Alert,TouchableOpacity,ActivityIndicator,ScrollView,Image,TextInput, FlatList,RefreshControl } from 'react-native'
import React,{useState,useEffect} from 'react'
import { Button } from '@rneui/base';
import { Ionicons } from '@expo/vector-icons';

const moodColors = {
    verySmile: '#03BD5A',  
    smile: '#9EBD01',     
    normal: '#DFB401',     
    sad: '#E08C00',       
    verySad: '#E12B2D'     
}
const moodNameMap = {
    verySad: 'เศร้าเสียใจ',
    sad: 'ไม่สบายใจ',
    normal: 'ปกติ',
    smile: 'มีความสุข',
    verySmile: 'มีความสุขมาก'
};

const convertMoodName = {
    'เศร้าเสียใจ':'verySad',
    'ไม่สบายใจ':'sad',
    'ปกติ':'normal',
    'มีความสุข':'smile',
    'มีความสุขมาก':'verySmile'
}

interface MoodItem{
    id:string;
    mood_name:string;
    description:string;
    create_at:string;
}

export default function Mood() {
    const [activeStep, setActiveStep] = useState(1);
    const [currentMood,setCurrentMood] = useState('normal');
    const [description,setDescription] = useState('');
    const [moodName ,setMoodName] = useState('');
    const [moodList ,setMoodList] = useState<MoodItem[]>([]);
    const [loading ,setLoading] = useState(false);

    useEffect(()=>{
        const mood = getCurrentMood(activeStep);
        setCurrentMood(mood);
        setMoodName(moodNameMap[mood]);
    },[activeStep]);

    const getMoodList = async ()=>{
        try {
            setLoading(true)
            const response = await fetch(global.URL + `/api/mood/${global.session?.user?.id}`);
            const data = await response.json();
            setMoodList(data);
            
        } catch (error) {
           console.log(error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getMoodList();
        console.log(moodList);
    },[]);


    const saveMood = async ()=>{
        try {
            const response = await fetch(global.URL + '/api/mood',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    mood:moodName,
                    description:description,
                    userId:global.session?.user?.id
                })
            });
            if(response.ok){
                Alert.alert('บันทึกสำเร็จ');
            }else{
                Alert.alert('บันทึกไม่สำเร็จ');
            }

        } catch (error) {
            console.log(error);
            Alert.alert('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            getMoodList();
        }
    };

    const deleteMood = async (id:string)=>{
        try {

            Alert.alert('ต้องการลบข้อมูลนี้หรือไม่','ข้อมูลจะถูกลบอย่างถาวร',[
                ,{
                    text:'ยกเลิก',
                    style:'cancel'
                },
                {
                    text:'ยืนยัน',
                onPress:()=>confirmDelete()
            }
            ]);
            const confirmDelete = async()=>{
                try {
                    const res = await fetch(global.URL + `/api/mood/${id}`,{
                        method:"DELETE"
                    });
                    if(res.ok){
                    Alert.alert('ลบสำเร็จ');
                    getMoodList();
                }else{
                    Alert.alert('ลบไม่สำเร็จ');
                }     
            } catch (error) {
                console.log(error);
                Alert.alert('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
            }
            }
            
        } catch (error) {
            console.log(error);
            Alert.alert('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }
    }
   
    const renderStep = (step:number) => {
        const isActive = activeStep >= step;
        const stepMood = getCurrentMood(step);  
        const lineColor = isActive ? moodColors[stepMood] : '#ddd';
        return (
          <View key={step} style={styles.stepWrapper}>
            {step !== 1 &&
            <View style={[styles.line, isActive && {backgroundColor:lineColor}]} />
            }
            <TouchableOpacity onPress={() => setActiveStep(step)} style={styles.circleWrapper}>
              <View style={[styles.circle, isActive && {backgroundColor:moodColors[stepMood]}]}>
                <Image source={switchMoodImage(stepMood)} style={[styles.image,!isActive && {opacity:.3}]}/>
                
              </View>
            </TouchableOpacity>
            {step !== 5 &&
            <View style={[styles.line, isActive && {backgroundColor:lineColor}]} />
            }
          </View>
        );
      };
      const getCurrentMood = (step: number) => {
        switch(step) {
            case 1: return 'verySad';
            case 2: return 'sad';
            case 3: return 'normal';
            case 4: return 'smile';
            case 5: return 'verySmile';
            default: return 'normal';
        }
    };

    const switchMoodImage = (mood:string)=>{
        switch (mood) {
            case 'verySmile':
                return require('../res/emoji-face/very-smile.png');
            case 'smile':
                return require('../res/emoji-face/smile.png');
            case 'normal':
                return require('../res/emoji-face/normal.png');
            case 'sad':
                return require('../res/emoji-face/sad.png');
            case 'verySad':
                return require('../res/emoji-face/very-sad.png');
            default:
                return null;
        }
        
    }

    const renderContent = () => {
        switch (activeStep) {
          case 1:
            return <Text style={styles.card}>เศร้าเสียใจ</Text>;
          case 2:
            return <Text style={styles.card}>ไม่สบายใจ</Text>;
          case 3:
            return <Text style={styles.card}>ปกติ</Text>;
            case 4:
            return <Text style={styles.card}>มีความสุข</Text>;    
            case 5:
            return <Text style={styles.card}>มีความสุขมาก</Text>;
          default:
            return null;
        }
      };

      const renderItem = ({item}:{item:MoodItem})=>{
        return(
            <View style={{
                backgroundColor: '#fff',
                padding: 15,
                marginHorizontal: 10,
                marginVertical: 5,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent:'space-between'
            }}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                <Image 
                    source={switchMoodImage(convertMoodName[item.mood_name])} 
                    style={{width: 40, height: 40, marginRight: 10}}
                />
                <View>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.mood_name}</Text>
                    <Text >{item.description}</Text>
                    <Text style={{fontSize: 12}}>{new Date(item.create_at).toLocaleDateString('th-TH')}</Text>
                </View>
                </View>
                
                <TouchableOpacity onPress={()=>deleteMood(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
        )
      }
  return (
    <View style={{flex:1,flexDirection:'column',backgroundColor:'#dceaf7',paddingTop:10}}>
    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
    <Image source={switchMoodImage(currentMood)} style={{width:100,height:100,margin:4}} />
      <View style={styles.contentContainer}>

        <Text style={{fontSize:16,fontWeight:'bold',marginBottom:10}}>วันนี้คุณรู้สึก: {renderContent()}</Text>
        <TextInput 
        style={{borderWidth:1,borderRadius:5,padding:5,width:'100%'}}
        multiline={true}
        numberOfLines={4}
        placeholder='อธิบายอะไรหน่อยไหม'
        value={description}
        onChangeText={(text)=>setDescription(text)}
        />
        
      </View>
      
    </View>
      <View style={{flexDirection:'row',justifyContent:'center'}}>
      <View style={styles.stepContainer}>
        {renderStep(1)}
        {renderStep(2)}
        {renderStep(3)}
        {renderStep(4)}
        {renderStep(5)}
      </View>
      </View>
      <Button title='บันทึก' color='#023e8a' containerStyle={{width:'75%',alignSelf:'center',marginVertical:4,borderRadius:5}} onPress={saveMood}/>
        {moodList.length > 0 ? (
            <FlatList 
            refreshControl={<RefreshControl refreshing={loading} onRefresh={getMoodList} />}
            data={moodList}
            renderItem={renderItem}
            />

        ):(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text>ไม่มีข้อมูล</Text>
            </View>
        )}
    </View>
  )
}
const styles = StyleSheet.create({
    image:{
        width:50,
        height:50,
    },
    stepContainer: {
        backgroundColor:"#fff",
        borderRadius:20,
        padding:15,
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical:20
      },
    stepWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      circleWrapper: {
        zIndex: 1,
      },
      circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
      },
      activeCircle: {
        backgroundColor: 'blue',
      },
      label: {
        color: 'white',
        fontWeight: 'bold',
      },
      activeLabel: {
        color: 'white',
      },
      line: {
        width: 20,
        height: 2,
        backgroundColor: '#ddd',
        zIndex: 0,
      },
      activeLine: {
        backgroundColor: 'blue',
      },
      contentContainer: {
        alignItems: 'center',
        marginLeft:10,
        backgroundColor:'#fff',
        padding:15,
        borderRadius:10,
        width:'70%',
      },
      card: {
        marginVertical:10,
        fontSize: 16,
        padding: 10,
        backgroundColor: '#ffff',
        borderRadius: 5,
      },
})
