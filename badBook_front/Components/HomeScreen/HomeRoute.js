import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import GuestScreen from '../GuestScreen/GuestScreen';
import SinglePost from '../SinglePost/SinglePost';

const HomeStack = createStackNavigator();

function HomeRoute({ data }) {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="Home">
        {props => <HomeScreen {...props} data={data} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="Guest" component={GuestScreen} />
      <HomeStack.Screen name="SinglePost" component={SinglePost} />
    </HomeStack.Navigator>
  );
}

export default HomeRoute;