import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from "@rneui/base";


import HomeScreen from './screens/home';
import CommunityScreen from './screens/community';
import ResultsScreen from './screens/results';
import DocumentsScreen from './screens/documents';
import ProfileScreen from './screens/profile';
import TestScreen from './screens/test';
import AiScreen from './screens/Ai';
import HelpCenterScreen from './screens/helpcenter';
import ARScreen from './screens/ARscan';

import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import ForgotPasswordScreen from './screens/forgot';
import PersonalDataScreen from './screens/personalData';

import Test1Screen from './formScreens/test1';
import Test2Screen from './formScreens/test2';
import Test3Screen from './formScreens/test3';

import AdminCommunityScreen from './Adscreens/AdminCommunity';
import AdminDocumentsScreen from './Adscreens/AdminDocuments';
import AdminHelpCenter from './Adscreens/AdminHelpCenter';
import AdminListUsers from './Adscreens/AdminListUsers';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false ,tabBarStyle: { height: 50 } }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            
            <Icon
              name={focused ? "home" : "home-outline"}
              color={"#0077b6"}
              type="ionicon"
              size={24}
            ></Icon>
          
          ),
          tabBarLabel: 'หน้าหลัก',
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({focused }) => (
            <Icon name={focused ? "people" : "people-outline"} type="ionicon" size={24} color={"#0077b6"} />
          ),
          tabBarLabel: 'ชุมชน',
        }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "bar-chart" : "bar-chart-outline"}  type="ionicon" size={24} color={ "#0077b6"} />
          ),
          tabBarLabel: 'ผลลัพธ์',
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "document-text" : "document-text-outline"}  type="ionicon" size={24} color={"#0077b6"} />
          ),
          tabBarLabel: 'เอกสาร',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name={focused ? "person" : "person-outline"} type="ionicon" size={24}  color={"#0077b6"} />
          ),
          tabBarLabel: 'บัญชี',
        }}
      />
    </Tab.Navigator>
  );
}

const AdminNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Community"
        component={AdminCommunityScreen}
        options={{
          tabBarIcon: ({focused }) => (
            <Icon  name={focused ? "people" : "people-outline"} type="ionicon" size={24} color={"#0077b6"} />
          ),
          tabBarLabel: 'ชุมชน',
        }}
      />
      <Tab.Screen
        name="Documents"
        component={AdminDocumentsScreen}
        options={{
          tabBarIcon: ({focused }) => (
            <Icon name={focused ? "document-text" : "document-text-outline"} type="ionicon" size={24} color={"#0077b6"} />
          ),
          tabBarLabel: 'เอกสาร',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused }) => (
            <Icon name={focused ? "person" : "person-outline"} type="ionicon" size={24}  color={"#0077b6"} />
          ),
          tabBarLabel: 'บัญชี',
        }}
      />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="PersonData" component={PersonalDataScreen} />

      <Stack.Screen name="Test" component={TestScreen} />
      <Stack.Screen name="Test1" component={Test1Screen} />
      <Stack.Screen name="Test2" component={Test2Screen} />
      <Stack.Screen name="Test3" component={Test3Screen} />
      <Stack.Screen name="AR" component={ARScreen} />
      <Stack.Screen name="Ai" component={AiScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="AdminTabs" component={AdminNavigator} />
      <Stack.Screen name="AdminHelpCenter" component={AdminHelpCenter} />
      <Stack.Screen name="AdminListUsers" component={AdminListUsers} />
    </Stack.Navigator>
    
  </NavigationContainer>
  );
}
