import AsyncStorage from "@react-native-community/async-storage";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, ActivityIndicator } from "react-native"
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SERVER_URL } from "../../../config";
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorMessage from "../../Tools/ErrorMessage";

const EditUserInfo = ({ setEditUserModal, firstname, lastname, email, avatar, info, id, getUser }) => {
    console.log(firstname, lastname, email, avatar, info);
    const [userFirstname, setUserFirstname] = useState(firstname)
    const [userLastname, setUserLastname] = useState(lastname)
    const [userEmail, setUserEmail] = useState(email)
    const [userInfo, setUserInfo] = useState(info)
    const [userAvatar, setUserAvatar] = useState(avatar)

    const [chosenImgName, setChosenImgName] = useState()

    const [loading, setLoading] = useState(false)
    
    const [firstnameErr, setFirstnameErr] = useState(false)
    const [lastnameErr, setLastnameErr] = useState(false)
    const [emailErr, setEmailErr] = useState(false)

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
            else {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.5,
                });
                if (!result.cancelled) {
                    let name = result.uri.split("ImagePicker");
                    setUserAvatar(result.uri)
                    setChosenImgName(name[1])
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const getImageUrl = async () => {
        if (userAvatar == avatar) {
            return userAvatar
        }
        if (userAvatar == "") {
            return
        }
        else {
            const response = await fetch(userAvatar);
            const blob = await response.blob();
            let ref = firebase.storage().ref().child("images" + chosenImgName);
            await ref.put(blob)

            // Get URL
            const imageUrl = await ref.getDownloadURL().then((url) => {
                return url
            }).catch(function (error) {
                return error
            })
            return imageUrl
        }
    }

    const updatePost = async () => {
        setLoading(true)
        setFirstnameErr(false)
        setLastnameErr(false)
        setEmailErr(false)
        let imageUrl = await getImageUrl()
        const token = await AsyncStorage.getItem("token")
        const fetchData = await fetch(SERVER_URL + "/auth/updateUserInfo/" + id, {
            method: "patch",
            headers: {
                'Content-Type': 'application/json',
                "token": token
            },
            body: JSON.stringify({
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                info: userInfo,
                avatar: imageUrl
            })
        })
        const data = await fetchData.json()
        if (data.errors) {
            data.errors.map((i, index) => {
                console.log(i);
                if (i.param == "firstname") {
                    setFirstnameErr(true)
                }
                if (i.param == "lastname") {
                    setLastnameErr(true)
                }
                if (i.param == "email") {
                    setEmailErr(true)
                }
            })
            
            setLoading(false)

        }
        else{
            console.log("ssssss");
            setEditUserModal(false)
            getUser()
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={{ width: "100%", height: "100%", alignItems: "center", }}>
               <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, backgroundColor: "tomato" }}>
                        <TouchableOpacity disabled={loading} onPress={() => setEditUserModal(false)}><Image source={require("../../../assets/images/previous.png")} /></TouchableOpacity>
                        <Text style={{ fontWeight: "bold", fontSize: 17 }}>Edit User Information</Text>
                    </View>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }}>
                <View style={{ width: "90%" }}>
                 


                    <View style={{ marginVertical: 25, paddingBottom: 10, borderBottomWidth: 1, borderColor: "white" }}>
                        <View style={styles.input_view}>
                        {firstnameErr ? <ErrorMessage top={1} errorMsg={"required"}  /> : null}
                            <Text style={styles.input_text}>firstname:</Text>
                            <TextInput placeholderTextColor="#898a8c" editable={!loading} placeholder="firstname" style={styles.input} value={userFirstname} onChangeText={(val) => { setUserFirstname(val) }} />
                        </View>
                        <View style={styles.input_view}>
                        {lastnameErr ? <ErrorMessage top={1} errorMsg={"required"}  /> : null}
                            <Text style={styles.input_text}>lastname:</Text>
                            <TextInput placeholderTextColor="#898a8c" editable={!loading} placeholder="lastname" style={styles.input} value={userLastname} onChangeText={(val) => { setUserLastname(val) }} />
                        </View>
                        <View style={styles.input_view}>
                        {emailErr ? <ErrorMessage top={1} errorMsg={"invalid email"}  /> : null}
                            <Text style={styles.input_text}>email:</Text>
                            <TextInput placeholderTextColor="#898a8c" editable={!loading} placeholder="email" style={styles.input} value={userEmail} onChangeText={(val) => { setUserEmail(val) }} />
                        </View>
                        <View style={styles.input_view}>
                            <Text style={styles.input_text}>user info:</Text>
                            <TextInput placeholderTextColor="#898a8c"  editable={!loading} placeholder="password" multiline={true} numberOfLines={4} style={[styles.input, { height: 100 }]} value={userInfo} onChangeText={(val) => { setUserInfo(val) }} />
                        </View>
                    </View>
                    <View style={{ alignItems: "center", marginBottom: 30 }}>
                        <View style={{ flexDirection: "row", marginLeft: "auto", height: 150 }}>
                            <TouchableOpacity disabled={loading} onPress={pickImage}><Text style={{ fontSize: 15, marginRight: 10, fontWeight: "bold", color: "white" }}>Edit</Text></TouchableOpacity>
                        </View>
                        {userAvatar ? <Image style={{ width: 160, height: 160, borderRadius: 80, position: "absolute" }} source={{ uri: userAvatar }} /> : null}
                    </View>
                    <TouchableOpacity disabled={loading} style={{ height: 60, backgroundColor: "tomato", borderRadius: 35, justifyContent: "center", alignItems: "center" }} onPress={updatePost}>{loading?<ActivityIndicator size="large" /> :<Text style={{fontSize: 18, fontWeight: '500'}} >update user information</Text>}</TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditUserInfo
const styles = StyleSheet.create({
    input_view: {
        flexDirection: "row",
        width: "100%",
    },
    input: {
        color: "white",
        borderColor: "white",
        borderWidth: 1,
        width: "78%",
        padding: 10,
        marginBottom: 12,
        borderRadius: 10
    },
    input_text: {
        color: "white",
        width: "22%",
        fontSize: 14

    }

})