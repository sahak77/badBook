import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, KeyboardAvoidingView } from "react-native"
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler"
import { SERVER_URL } from "../../config";
import Head from "../Tools/Head";

const SinglePost = (props) => {
    const commentRef = useRef()
    const [commentText, setCommentText] = useState('')
    const [commentData, setCommentData] = useState([])

    const getComment = async () => {
        const token = await AsyncStorage.getItem("token")
        const commentData = await fetch(SERVER_URL + "/comment/" + props.item._id, {
            method: "GET",
            headers: {
                "token": token
            }
        })
        const data = await commentData.json()
        console.log(data, "ppp");
        setCommentData(data)
    }
    const addComment = async () => {
        const token = await AsyncStorage.getItem("token")
        await fetch(SERVER_URL + "/comment/add", {
            method: "POST",
            headers: {
                "token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: commentText,
                postId: props.item._id
            })
        })
        getComment()
        setCommentText("")
    }

    useEffect(() => {
        getComment()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Head
                size={45}
                text={props.item.userId.firstname + " " + props.item.userId.lastname}
                goBack={props.setEditMod}
                stackNav={true}
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "center" }} >
                <View style={{ width: "100%", alignItems: "center", }}>
                    <View style={{ width: "100%" }}>
                        <Text style={{ color: "white", margin: 20 }}>{props.item.text}</Text>
                    </View>
                    {props.item.imgUrl ? <Image source={{ uri: props.item.imgUrl }} style={styles.singlePost_image} /> : null}
                    <View style={styles.singlePost_tool}>
                        {props.item.likes.filter(id => id.includes(props.userId)).length ?
                            <TouchableOpacity onPress={props.unLike} style={styles.singlePost_tool_bottom} >
                                <Image style={styles.singlePost_tool_image} source={require("../../assets/images/like_tomato.png")} />
                                {/* <Text style={[styles.singlePost_tool_text, {color: "tomato"}]} >disLike</Text> */}
                            </TouchableOpacity >
                            : <TouchableOpacity onPress={props.like} style={styles.singlePost_tool_bottom} >
                                <Image style={styles.singlePost_tool_image} source={require("../../assets/images/like_grey.png")} />
                                {/* <Text style={styles.singlePost_tool_text} >Like</Text> */}
                            </TouchableOpacity >
                        }
                        <TouchableOpacity onPress={() => commentRef.current.focus()} style={styles.singlePost_tool_bottom} >
                            <Image style={styles.singlePost_tool_image} source={require("../../assets/images/comment_grey.png")} />
                            {/* <Text style={styles.singlePost_tool_text} >Comment</Text> */}
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "90%" }}>
                        <Text style={styles.comments_title}>Comments</Text>
                    </View>

                    {
                        commentData.map((i, index) => {
                            return (
                                <View style={styles.comments_view} key={index}>
                                    <Image source={{ uri: i.userId.avatar }} style={styles.comment_img} />
                                    <View style={styles.comment}>
                                        <Text style={styles.comment_user_name}>{i.userId.firstname} {i.userId.lastname}</Text>
                                        <Text style={{ color: "white" }}>
                                            {i.comment}
                                        </Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <View style={styles.add_comment_view}>
                    <TextInput ref={commentRef} autoFocus={props.focus}
                        value={commentText} onChangeText={(val) => setCommentText(val)}
                        placeholder="add comment" placeholderTextColor="rgba(255,255,255,0.7)" style={styles.comment_input} />
                    <TouchableOpacity onPress={addComment}><Image source={require("../../assets/images/send.png")} /></TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>

    )
}

export default SinglePost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#010031",
    },
    singlePost_image: {
        width: "100%",
        height: 400,
        borderRadius: 10,
        marginBottom: 20,
    },
    singlePost_tool: {
        flexDirection: "row",
        width: "90%",
        height: 50,
        backgroundColor: "white",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 20,
        borderRadius: 5

    },
    singlePost_tool_bottom: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: "100%"
    },
    singlePost_tool_image: {
        width: 25,
        height: 25,
        marginRight: 10
    },
    singlePost_tool_text: {
        fontSize: 16,
        fontWeight: "500"
    },
    singlePost_stats: {
        backgroundColor: "white",
        width: "90%",
        borderBottomWidth: 1,
        borderBottomColor: "black",
        marginTop: 20,
        padding: 10,
        borderRadius: 5
    },
    comments_title: {
        color: "white",
        fontSize: 20,
        marginBottom: 30,
        fontWeight: "600"
    },
    comments_view: {
        width: "90%",
        flexDirection: "row",
        marginBottom: 30
    },
    comment_img: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    comment: {
        width: "84%",
        backgroundColor: "#acacac",
        padding: 10,
        borderRadius: 18
    },
    comment_user_name: {
        fontWeight: "700",
        color: "white",
        marginBottom: 7,
        fontSize: 17
    },
    comment_input: {
        width: "80%",
        height: "80%",
        borderWidth: 1,
        borderRadius: 50,
        marginRight: 15,
        paddingHorizontal: 15,
        fontSize: 18,
        justifyContent: "center",
        alignItems: "center"
    },
    add_comment_view: {
        width: "100%",
        height: 50,
        backgroundColor: "tomato",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    }

})
