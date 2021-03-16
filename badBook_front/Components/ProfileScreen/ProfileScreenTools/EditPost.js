import AsyncStorage from "@react-native-community/async-storage";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator } from "react-native"
import { TextInput } from "react-native-gesture-handler";
import { SERVER_URL } from "../../../config";
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import ErrorMessage from "../../Tools/ErrorMessage";

const EditPost = ({ setEditPostModal, id, PostText, PostImage, getUserPost }) => {
    const [text, setText] = useState(PostText)
    const [image, setImage] = useState(PostImage)
    const [chosenImgName, setChosenImgName] = useState()

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)

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
                    setImage(result.uri)
                    setChosenImgName(name[1])
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const getImageUrl = async () => {
        if (image == PostImage) {
            return image
        }
        if (image == undefined) {
            return
        }
        else {
            const response = await fetch(image);
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
        if (image == undefined && (text == "" || !text.replace(/\s/g, '').length)) {
            setLoading(false)
            setErrorMsg(true)
            return
        }
        let imageUrl = await getImageUrl()
        const token = await AsyncStorage.getItem("token")
        await fetch(SERVER_URL + "/posts/update/" + id, {
            method: "patch",
            headers: {
                'Content-Type': 'application/json',
                "token": token
            },
            body: JSON.stringify({
                text: text,
                imgUrl: imageUrl
            })
        })
        setEditPostModal(false)
        getUserPost()
        setLoading(false)
        setErrorMsg(false)
    }

    return (
        <SafeAreaView style={{ width: "100%", height: "100%", alignItems: "center", }}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, backgroundColor: "tomato" ,width: "100%" }}>
                    <TouchableOpacity disabled={loading} onPress={() => setEditPostModal(false)}><Image source={require("../../../assets/images/previous.png")} /></TouchableOpacity>
                    <Text style={{ fontWeight: "bold", fontSize: 17 }}>Edit User Information</Text>
                </View>
                <View style={{ width: "90%" }}>

                    <Text style={{ fontWeight: "600", fontSize: 19, marginTop: 20, color: "white" }}>Posts</Text>
                    <View style={{ paddingBottom: 10, borderBottomWidth: 1, borderColor: "white" }}>
                        <View style={styles.input_view}>
                            {errorMsg ? <ErrorMessage top={30} errorMsg={"required"} /> : null}
                            <TextInput placeholderTextColor="#898a8c" editable={!loading} placeholder="type something..." multiline={true} numberOfLines={7} style={styles.input} value={text} onChangeText={(val) => { setText(val) }} />
                        </View>
                    </View>

                    <View style={{ alignItems: "center", marginVertical: 20, }}>
                        <View style={{ flexDirection: "row", marginLeft: "auto", }}>
                            <TouchableOpacity  style={{ backgroundColor: "white", padding: 10, borderRadius: 5, marginBottom: 10 }} onPress={pickImage}><Text>choose image</Text></TouchableOpacity>
                        </View>
                        {image ?
                            <View style={{ width: "100%", height: 200 }}>
                                <TouchableOpacity disabled={loading} style={{ zIndex: 20, position: "absolute", right: 0, backgroundColor: "white", borderRadius: 60, width: 25, height: 25, justifyContent: "center", alignItems: "center" }} onPress={() => setImage(undefined)}><Image style={{ width: 15, height: 15 }} source={require("../../../assets/images/letter-x.png")} /></TouchableOpacity>
                                <Image style={{ width: "100%", height: 200, borderRadius: 20 }} source={{ uri: image }} />
                            </View>
                            : null}
                    </View>
                    <TouchableOpacity disabled={loading} style={{ height: 60, backgroundColor: "tomato", borderRadius: 35, justifyContent: "center", alignItems: "center" }} onPress={updatePost}>
                        {loading ? <ActivityIndicator size="large" /> : <Text style={{fontSize: 18, fontWeight: '500'}}>update</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
        // <View>
        //     <Text>
        //         EditPost
        //     </Text>
        //     <TextInput value={text} onChangeText={(val) => { setText(val) }} />
        //     <TouchableOpacity onPress={pickImage}><Text>choose image</Text></TouchableOpacity>
        //     <TouchableOpacity onPress={updatePost}><Text>update</Text></TouchableOpacity>
        //     <TouchableOpacity onPress={() => setImage("")}><Text>X</Text></TouchableOpacity>
        //     { image ? <Image style={{ width: 200, height: 200 }} source={{ uri: image }} /> : null}
        //     <TouchableOpacity onPress={() => setEditPostModal(false)}><Text>back</Text></TouchableOpacity>
        // </View>
    )
}

export default EditPost

const styles = StyleSheet.create({
    input_view: {
        width: "100%",
    },
    input: {
        borderWidth: 1,
        width: "100%",
        height: 150,
        padding: 10,
        marginBottom: 12,
        borderRadius: 10,
        marginVertical: 25,
        color: "white",
        borderColor: "white",

    },
    input_text: {
        width: "22%",
        fontSize: 14,
        color: "white",

    }

})