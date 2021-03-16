import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
import SinglePost from '../SinglePost/SinglePost';
import GuestScreen from '../GuestScreen/GuestScreen';

const ProfileStack = createStackNavigator();

function ProfileRoute({allPosts, data, setNewPost}) {
    return ( 
        <ProfileStack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerShown: false,
            }}>
            <ProfileStack.Screen name="Profile">
                {props => <ProfileScreen {...props} allPosts={allPosts} data={data} />}
            </ProfileStack.Screen>
            <ProfileStack.Screen name="SinglePost" component={SinglePost} />
            <ProfileStack.Screen name="Guest" component={GuestScreen} />
        </ProfileStack.Navigator>
    );
}

export default ProfileRoute;