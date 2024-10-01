import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking, Alert ,SafeAreaView, StatusBar } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

const bannerData = [
  { uri: 'https://policywatch.thaipbs.or.th/_next/image?url=https%3A%2F%2Fmedia.policywatch.thaipbs.or.th%2Fwp-content%2Fuploads%2F2024%2F02%2FCover-THpeopleNoHappy-240219-0.jpg&w=1920&q=75', url: 'https://policywatch.thaipbs.or.th' },
  { uri: 'https://www.starfishlabz.com/media/547257', url: 'https://www.starfishlabz.com' },
  { uri: 'https://image.springnews.co.th/uploads/images/md/2021/08/LGdC7wfbv7LGLlrkKABh.jpg', url: 'https://www.springnews.co.th/infographic/813868' }
];
const recommendedData = [
  { uri: 'https://www.hfocus.org/sites/default/files/2023/users/user290/2023-11/s_18833497.jpg', url: 'https://www.hfocus.org/content/2023/11/28878' },
  { uri: 'https://image.springnews.co.th/uploads/images/md/2022/10/DazhwJ8pSH1fw8MCVzP4.webp?x-image-process=style/LG-webp', url: 'https://www.springnews.co.th/lifestyle/lifestyle/831011' },
  { uri: 'https://image.springnews.co.th/uploads/images/md/2021/08/LGdC7wfbv7LGLlrkKABh.jpg', url: 'https://www.springnews.co.th/infographic/813868' }

];

const HomeScreen = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
 
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= bannerData.length) {
        nextIndex = 0;
      }
      scrollViewRef.current.scrollTo({ x: nextIndex * windowWidth, animated: true });
      setCurrentIndex(nextIndex);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / windowWidth);
    setCurrentIndex(newIndex);
  };

  const renderItem = (item, index) => (
    <TouchableOpacity key={index} onPress={() => Linking.openURL(item.url)} style={styles.bannerItem}>
      <Image source={{ uri: item.uri }} style={styles.bannerImage} />
    </TouchableOpacity>
  );

  const handleHeartPress = () => {
    Alert.alert('กำลังใจ', 'คุณคือคนที่ยอดเยี่ยม! อย่ายอมแพ้!', [{ text: 'ขอบคุณ', onPress: () => console.log('OK Pressed') }]);
  };
  const username = global.session?.user?.name || 'Guest';

  return (
    <>
   
   
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content'  backgroundColor={'#f8f8f8'}/>
      <ScrollView>
        <View style={styles.header}>
          <Image source={require('../assets/smile-logo-bg-blue-round.png')} style={styles.logo} />
          <Text style={styles.headerText}>สวัสดี, {username} !</Text>
          
        </View>

        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {bannerData.map((item, index) => renderItem(item, index))}
          </ScrollView>
          <View style={[styles.arrowContainer, { left: 10 }]}>
            <TouchableOpacity onPress={() => {
              let prevIndex = currentIndex - 1;
              if (prevIndex < 0) {
                prevIndex = bannerData.length - 1;
              }
              scrollViewRef.current.scrollTo({ x: prevIndex * windowWidth, animated: true });
              setCurrentIndex(prevIndex);
            }}>
              <IconFontAwesome name="arrow-circle-left" size={30} color="#ff8c00" />
            </TouchableOpacity>
          </View>
          <View style={[styles.arrowContainer, { right: 10 }]}>
            <TouchableOpacity onPress={() => {
              let nextIndex = currentIndex + 1;
              if (nextIndex >= bannerData.length) {
                nextIndex = 0;
              }
              scrollViewRef.current.scrollTo({ x: nextIndex * windowWidth, animated: true });
              setCurrentIndex(nextIndex);
            }}>
              <IconFontAwesome name="arrow-circle-right" size={30} color="#ff8c00" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Button title="พูดคุยกับ HAPPY" buttonStyle={styles.button} onPress={() => navigation.navigate('Ai')} />
          <Button title="ประเมินความเครียด" buttonStyle={styles.button} onPress={() => navigation.navigate('Test')} />
          <Button
            buttonStyle={styles.imageButton}
            title={`วันนี้คุณรู้สึกอย่างไร ?\nแสกนใบหน้า\nเพื่อวิเคราะห์อารมณ์ของคุณ !`}
            icon={
              <Image
                source={require('../res/Head_meh.png')}
                style={styles.imageButtonIcon}
              />
            }
            onPress={() => navigation.navigate('AR')}
          />
        </View>

        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>สื่อที่น่าสนใจ</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.viewAll} onPress={() => navigation.navigate('Documents')}>ดูทั้งหมด ></Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll}>
            {recommendedData.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => Linking.openURL(item.url)}>
                <View style={styles.recommendedItem}>
                  <Image source={{ uri: item.uri }} style={styles.recommendedImage} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.heartIconContainer} onPress={handleHeartPress}>
        <IconFontAwesome name="heart" size={40} color="#ff0000" />
      </TouchableOpacity>
    </SafeAreaView>
   
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#dceaf7', // Light background color
    position: 'relative',
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#023e8a', // Dark blue
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  carouselContainer: {
    alignItems: 'center',
    marginVertical: 16,
    elevation: 3,
  },
  bannerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  bannerImage: {
    width: '95%',
    height: 200,
    borderRadius: 15,
    marginHorizontal: 10,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  arrowContainer: {
    position: 'absolute',
    top: '50%',
    zIndex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    flexWrap: 'wrap',
  },
  button: {
    width: 150,
    height: 80,
    backgroundColor: '#0077b6', // Medium blue
    marginBottom: 10,
    borderRadius: 15,
    elevation: 5,
  },
  imageButton: {
    width: 350,
    height: 130,
    backgroundColor: '#0077b6', // Medium blue
    marginVertical: 10,
    borderRadius: 15,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  recommendedSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#0077b6',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  recommendedScroll: {
    marginTop: 10,
  },
  recommendedItem: {
    marginRight: 16,
  },
  recommendedImage: {
    width: 150,
    height: 100,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  heartIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default HomeScreen;
