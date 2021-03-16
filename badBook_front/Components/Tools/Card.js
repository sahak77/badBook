import React, { useRef, useState } from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { SERVER_URL } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from 'react-native-modal';
import SinglePost from "../SinglePost/SinglePost";
import { schedulePushNotification } from "./SendNotification";

const Card = ({ item,
    profilePage,
    setPostEdit,
    setPostId,
    navigation,
    userId,
    getUserPost,
    setPostText,
    setPostImage,
    Posts, toTop }) => {

        const [editMod, setEditMod] = useState(false)
        const focusComm = useRef(false)




    const like = async () => {
        const token = await AsyncStorage.getItem("token")
        await fetch(SERVER_URL + "/posts/like/" + item._id, {
            method: "PUT",
            headers: {
                "token": token
            }
        })
        Posts(false)
        schedulePushNotification(item.userId.notificationToken, item.userId._id)
    }
    const unLike = async () => {
        const token = await AsyncStorage.getItem("token")
        await fetch(SERVER_URL + "/posts/unlike/" + item._id, {
            method: "PUT",
            headers: {
                "token": token
            }
        })
        Posts(false)
    }
    return (
        <View style={{ width: "90%" }}>
            <Modal
                isVisible={editMod}
                animationInTiming={300}
                style={styles.modal}
                animationIn={"slideInRight"}
                animationOut={"slideOutRight"}
            >
                <SinglePost item={item} focus={focusComm.current} userId={userId} setEditMod={setEditMod} like={like} unLike={unLike} />
            </Modal>

            <View style={styles.card}>
                <View style={styles.post_head}>
                    <Image style={styles.post_mini_avatar} source={{ uri: item.userId.avatar }} />
                    <TouchableOpacity onPress={!profilePage ? item.userId._id === userId ? () => navigation("Profile", true) : () => navigation("Guest", item) : null}><Text>{item.userId.firstname} {item.userId.lastname}</Text></TouchableOpacity>
                    {profilePage ? <View style={styles.post_edit}>
                        <TouchableOpacity onPress={() => { setPostId(item._id); setPostEdit(true); setPostText(item.text); setPostImage(item.imgUrl) }} style={{ width: 27, height: 20 }} >
                            <Image style={{ width: 20, height: 20 }} source={require("../../assets/images/more.png")} />
                        </TouchableOpacity>
                    </View>
                        : null}
                </View>
                <View style={styles.post_content}>
                    {item.text ? <Text>{item.text}</Text> : null}
                    {item.imgUrl ? 
                        <TouchableOpacity onPress={()=>{focusComm.current = false ; setEditMod(true)}}>
                            <Image source={{ uri: item.imgUrl }} style={styles.post_image} />
                        </TouchableOpacity>
                        : null}
                </View>
                <View style={styles.post_tools}>
                    <View style={styles.post_stats}>
                        <Text style={{ color: "#aeada8" }}>Likes: {item.likes.length}</Text>

                        <Text style={{ position: "absolute", right: 5, color: "#aeada8" }}>{item.date}</Text>
                    </View>
                    <View style={styles.post_more}>
                        {item.likes.filter(id => id.includes(userId)).length ?
                            <TouchableOpacity onPress={unLike} style={[styles.more_button, { width: 50 }]}>
                                <Image style={styles.more_img} source={require("../../assets/images/like_tomato.png")} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={like} style={[styles.more_button, { width: 50 }]}>
                                <Image style={styles.more_img} source={require("../../assets/images/like_white.png")} />
                            </TouchableOpacity>
                        }


                        <TouchableOpacity onPress style={styles.more_button} onPress={()=>{setEditMod(true), focusComm.current = true ;}} >
                            <Image style={styles.more_img} source={require("../../assets/images/comment_white.png")} />
                            <Text style={{ fontSize: 16, color: "white" }}>Comments</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    card: {
        width: "100%",
        height: "auto",
        borderWidth: 1,
        backgroundColor: "#fbfafa",
        borderRadius: 20,
        padding: 15,
        marginVertical: 15

    },

    modal: {
        width: "100%",
        height: "100%",
        backgroundColor: "#010031",
        margin: 0
    },
    ///
    post_head: {
        position: "relative",
        width: "100%",
        height: 50,
        flexDirection: "row",
    },
    post_mini_avatar: {
        width: 35,
        height: 35,
        borderRadius: 25,
        marginRight: 15
    },
    post_edit: {
        position: "absolute",
        right: 0
    },



    /////
    post_content: {
        height: "auto",
    },
    post_image: {
        marginTop: 15,
        width: "100%",
        height: 250,
        resizeMode: 'cover',
        borderRadius: 20
    },


    ///
    post_tools: {
        width: "100%",
        height: 70,
        flexDirection: "column",
        marginTop: 20,
        position: "relative",
    },
    post_stats: {
        width: "100%",
        height: "50%",
        flexDirection: "row",


    },
    stats_image: {
        width: 20,
        height: 20,
        marginLeft: 15,
        marginRight: 5
    },
    post_more: {
        width: "100%",
        height: "50%",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    more_img: {
        width: 20,
        height: 20,
        marginRight: 3
    },
    more_button: {
        flexDirection: "row",
        width: "auto",
        height: 33,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
        padding: 6,
        borderRadius: 9
    },
}) 