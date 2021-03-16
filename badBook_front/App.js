import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/SimpleLineIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';

import LogInScreen from './Components/LogInScreen/LogInScreen';
import RegistrationScreen from './Components/RegistrationScreen/RegistrationScreen';
import ProfileRoute from './Components/ProfileScreen/ProfileRoute';
import SettingsScreen from './Components/SettingsScreen/SettingsScreen';
import HomeRoute from './Components/HomeScreen/HomeRoute';

import { SERVER_URL } from './config';

const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  const [token, setToken] = useState("start")



  const [data, setData] = useState([])

  const allPosts = async () => {
    // const token = await AsyncStorage.getItem('token')
    try {
      const fetchAllPosts = await fetch(SERVER_URL + "/posts/posts" + 0, {
        method: "GET",
        // headers: {
        //     "token": token
        // }
      })
      const data = await fetchAllPosts.text()
      setData(data)
    } catch (error) {
      console.log(error);
    }
  }
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token')
      if (value === null) {
        setToken(false)
      }
      else {
        setToken(true)
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <NavigationContainer>
        {token == false ? token == "start"
        ? 
        null
        
        : <MainStack.Navigator
            initialRouteName="Login"
            screenOptions={
              {
                headerShown: false,
              }}
          >
            <MainStack.Screen name="Login">
              {props => <LogInScreen {...props} getData={getData} />}
            </MainStack.Screen>
            <MainStack.Screen name="Registration" component={RegistrationScreen} />
          </MainStack.Navigator>
          :token == "start" ?

              null
          :<Tab.Navigator
            initialRouteName="Profile"
            tabBarOptions={{
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
              style: {
                backgroundColor: '#363638',
                borderColor: "red",
                borderTopColor: "#363638"
              },
            }}
          >
            <Tab.Screen
              name="Profile"
              // component={ProfileScreen}
              options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="user" color={color} size={26} />
                ),
              }}
            >
              {props => <ProfileRoute {...props} allPosts={allPosts} data={data} />}

            </Tab.Screen>

            <Tab.Screen
              name="Home"
              // component={HomeRoute}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            >
              {props => <HomeRoute {...props} />}
            </Tab.Screen>
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="settings" color={color} size={26} />
                ),
              }}
            >
              {props => <SettingsScreen {...props} getData={getData} />}
            </Tab.Screen>
          </Tab.Navigator>
        }
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#010031"
  },
});


