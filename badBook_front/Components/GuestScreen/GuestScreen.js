import AsyncStorage from "@react-native-community/async-storage"
import React, { useEffect, useRef, useState } from "react"
import { View, Text, FlatList, SafeAreaView, StyleSheet, Image, ActivityIndicator } from "react-native"
import { SERVER_URL } from "../../config"
import Card from "../Tools/Card"
import Head from "../Tools/Head";

const GuestScreen = (props) => {
    console.log(props.route.params);
    const fullName = props.route.params.userId.firstname + " " + props.route.params.userId.lastname
    const [postData, setPostData] = useState([])
    const [loading, setLoading] = useState(false)


    const id = useRef()
    const getId = async () => {
        const userId = await AsyncStorage.getItem("id")
        id.current = userId
    }
    const fetchUserPost = async (a) => {
        if (a) {
            setLoading(true)
        }
        const token = await AsyncStorage.getItem("token")
        const userId = props.route.params.userId._id;
        try {
            const fetchPostData = await fetch(SERVER_URL + "/posts/user/" + userId, {
                method: "GET",
                headers: {
                    "token": token
                }
            })
            const userPosts = await fetchPostData.json()
            setPostData(userPosts)
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getId()
        fetchUserPost(true)
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={{ width: "100%", height: "100%" }}
                contentContainerStyle={{ alignContent: "center" }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <Head size={60} text={fullName} goBack={props.navigation.goBack} stackNav={true} />
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <View style={styles.guest_head}>
                                <Image style={styles.guest_headImg} source={props.route.params.userId.avatar ? { uri: props.route.params.userId.avatar } : null} />
                                <Text style={styles.guest_headText}>{props.route.params.userId.firstname} {props.route.params.userId.lastname}</Text>
                                <Text style={{color:"rgba(0,0,0,0.5)"}}>{props.route.params.userId.email}</Text>
                            </View>
                            <View style={styles.guest_info}>
                                <Text style={{color:"rgba(0,0,0,0.5)", marginBottom: 8}}>ABOUT USER</Text>
                                <Text>{props.route.params.userId.info == "" || !props.route.params.userId.info.replace(/\s/g, '').length ? "no information about user" : props.route.params.userId.info}</Text>
                            </View>
                            <View >
                                { loading ? <ActivityIndicator size="large" />: null }
                                {!postData.length ? <Text style={{fontSize: 22 ,color: "white",  width: "100%", height: 150, alignItems: "center", marginTop: 40}}>you dont have any post</Text> : null}
                            </View>
                        </View>

                    </>
                }

                data={postData.reverse()}
                renderItem={({ item }) => {
                    return (<View style={{ alignItems: "center" }}>
                        <Card
                        userId={id.current}
                            item={item}
                            profilePage={false}
                            navigation={props.navigation.navigate}
                            Posts={fetchUserPost}
                        />
                    </View>
                    )
                }}
                keyExtractor={item => item._id.toString()}
            />
        </SafeAreaView>
    )
}

export default GuestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#010031",
    },
    head: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: "tomato",
        justifyContent: "center",
    },
    guest_headImg: {
        width: 200,
        height: 200,
        borderRadius: 100
    },
    guest_headText: {
        color: "white",
        marginTop: 15,
        marginBottom: 5,
        fontSize: 22,
        fontWeight: "bold"
    },
    guest_head: {
        width: "90%",
        marginVertical: 15,
        padding: 10,
        alignItems: "center",
        borderBottomWidth: 0,
        borderBottomColor: "red",
        backgroundColor: "#acacac",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    guest_info: {
        width: "90%",
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: "#acacac",
     
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    img: {
        width: 25,
        height: 25,
    }
})