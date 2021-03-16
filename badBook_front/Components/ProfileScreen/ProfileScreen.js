import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Image, SafeAreaView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';

import AddPost from '../Tools/AddPost';
import Card from '../Tools/Card';
import PostTool from '../Tools/PostTool';
import Head from '../Tools/Head';
import EditPost from './ProfileScreenTools/EditPost'
import EditUserInfo from "./ProfileScreenTools/EditUserInfo";
import { SERVER_URL } from '../../config';


import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

const ProfileScreen = (props) => {
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("") 
    const [avatar, setAvatar] = useState("")
    const [info, setInfo] = useState("")  

    const [userPosts, setUserPosts] = useState([])

    const [postId, setPostId] = useState(null)

    const [postEdit, setPostEdit] = useState(false)
    const [editPostModal, setEditPostModal] = useState(false)
    const [editUserModal, setEditUserModal] = useState(false)

    const [PostText, setPostText] = useState(null)
    const [PostImage, setPostImage] = useState(null)

    const [loading, setLoading] = useState(false)


    const id = useRef("")

    useEffect(() => {
        setNotificationToken()
        getId()
        getUserPost(true)
        getUser()
    }, [])




    async function registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }



      const setNotificationToken = async ()=>{
        const token = await AsyncStorage.getItem('token')
        const notificationToken = await registerForPushNotificationsAsync()
        await fetch(SERVER_URL + "/auth/setNotificationToken", {
            method: "patch",
            headers: {
                'Content-Type': 'application/json',
                "token": token
            },
            body: JSON.stringify({
                notificationToken: notificationToken,
            })
        })
      }


    const getId = async () => {
        const userId = await AsyncStorage.getItem("id")
        id.current = userId
    }

    const getUser = async () => {
        const token = await AsyncStorage.getItem('token')
        try {
            const fetchData = await fetch(SERVER_URL + '/auth/profile', {
                method: "GET",
                headers: {
                    "token": token
                }
            })
            const data = await fetchData.json()
            setEmail(data.email)
            setFirstname(data.firstname)
            setLastname(data.lastname)
            setAvatar(data.avatar)
            setInfo(data.info)
        }
        catch (error) {
            console.log(error);
        }
    }

    const getUserPost = async (a) => {
        if (a) {
            setLoading(true)
        }
        const token = await AsyncStorage.getItem('token')
        try {
            const userPosts = await fetch(SERVER_URL + "/posts/userpost", {
                method: "GET",
                headers: {
                    "token": token
                }
            })
            const data = await userPosts.json()
            setLoading(false)
            setUserPosts(data)
             } catch (error) {
            console.log(error);
        }
    }
    const deletePost = async (id) => {
        const token = await AsyncStorage.getItem('token')
        try {
            await fetch(SERVER_URL + `/posts/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "token": token
                }
            })
            setPostId(null)
            setPostEdit(false)
            getUserPost()
            // props.allPosts()
        } catch (error) {
            console.log(error);
        }
    }
    const goEditPage = () => {
        setPostEdit(false);
        setTimeout(() => {
            setEditPostModal(true)
        }, 1000);
    }

    let datareverse = [...userPosts].reverse();

    return (
        <SafeAreaView style={styles.container}>
            <View>
                {/* edit post */}
                <Modal
                    isVisible={editPostModal}
                    animationInTiming={500}
                    style={styles.edit_modal}
                >
                    <EditPost
                        setEditPostModal={setEditPostModal}
                        id={postId}
                        PostText={PostText}
                        PostImage={PostImage}
                        getUserPost={getUserPost}
                    />
                </Modal>
                {/* edit user info */}

                <Modal
                    isVisible={editUserModal}
                    animationInTiming={500}
                    style={styles.edit_modal}
                >
                    <EditUserInfo
                        setEditUserModal={setEditUserModal}
                        id={id.current}
                        firstname={firstname}
                        lastname={lastname}
                        email={email}
                        avatar={avatar}
                        info={info}
                        getUser={getUser}
                    />
                </Modal>

                {/* post tools */}
                <Modal
                    isVisible={postEdit}
                    onBackdropPress={() => { setPostEdit(false) }}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={styles.postTool_modal}
                >
                    <View style={styles.postModal_view}>
                        <PostTool text={"Edit post"} func={goEditPage} />
                        <PostTool text={"Delete post"} func={() => deletePost(postId)} />
                    </View>
                </Modal>
            </View>
            <FlatList
                style={{ width: "100%", height: "100%" }}
                contentContainerStyle={{ alignContent: "center" }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <Head
                            data={props.data}
                            text={firstname + " " + lastname}
                            size={60}
                            setEditUserModal={setEditUserModal}
                            profile={true}
                            navigation={props.navigation.navigate}
                        />
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <View style={styles.profile_head}>
                                <Image style={styles.profile_headImg} source={avatar ? { uri: avatar } : null} />
                                <Text style={styles.profile_headText}>{firstname} {lastname}</Text>
                                <Text style={{color:"rgba(0,0,0,0.5)"}}>{email}</Text>

                            </View>
                            <View style={styles.profile_info}>
                                <Text style={{color:"rgba(0,0,0,0.5)"}}>ABOUT USER</Text>
                                <Text>{info == "" || !info.replace(/\s/g, '').length ? "no information about user" : info}</Text>

                            </View>
                            <View style={styles.profile_add}>
                                <AddPost getUserPost={getUserPost} />
                            </View>
                            <View >
                                { loading ? <ActivityIndicator size="large" />: null }
                                {!userPosts.length ? <Text style={{fontSize: 22 ,color: "white",  width: "100%", height: 150, alignItems: "center", marginTop: 40}}>you dont have any post</Text> : null}
                            </View>
                        </View>

                    </>
                }

                data={datareverse}
                renderItem={({ item }) => {
                    return (<View style={{ alignItems: "center" }}>
                        <Card
                            item={item}
                            deletePost={deletePost}
                            profilePage={true}
                            setPostEdit={setPostEdit}
                            setPostId={setPostId}
                            navigation={props.navigation.navigate}
                            userId={id.current}
                            Posts={getUserPost}
                            setPostText={setPostText}
                            setPostImage={setPostImage}
                        />
                    </View>
                    )
                }}
                keyExtractor={item => item._id}
            />

        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#010031",
        alignItems: 'center',
    },
    edit_modal: {
        width: "100%",
        height: "100%",
        backgroundColor: "#010031",
        margin: 0
    },
    postTool_modal: {
        width: "100%",
        borderRadius: 20,
        position: "absolute",
        bottom: 0,
        margin: 0
    },
    postModal_view: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        width: "100%",
        height: "auto",
        backgroundColor: "white"
    },
    profile_headImg: {
        width: 200,
        height: 200,
        borderRadius: 100
    },
    profile_headText: {
        color: "white",
        marginTop: 15,
        marginBottom: 5,
        fontSize: 22,
        fontWeight: "bold"
    },
    profile_head: {
        width: "90%",
        marginVertical: 15,
        padding: 10,
        alignItems: "center",
        borderBottomWidth: 0,
        borderBottomColor: "red",
        backgroundColor: "#bfbfbb", 
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    profile_info: {
        width: "90%",
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: "#bfbfbb",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    profile_add: {
        width: "90%",
        paddingBottom: 20,
        marginTop: 15
    }
});