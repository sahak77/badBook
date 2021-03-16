import React, { useEffect, useState } from 'react';
import { Button, Image, KeyboardAvoidingView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { SERVER_URL } from '../../config';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import ErrorMessage from './ErrorMessage';
import moment from 'moment';

const firebaseConfig = {
  apiKey: "AIzaSyCuQ_C5_GSQw9HnBITTl9qHl4W02b9pnv8",
  projectId: "socialapp-da7c9",
  storageBucket: "gs://socialapp-da7c9.appspot.com",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AddPost = (props) => {
  const [text, setText] = useState("")
  const [chosenImg, setChosenImg] = useState("")

  const [chosenImgName, setChosenImgName] = useState("")

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(false)

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
    } else {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: false,
        aspect: [16, 9]
      })
      if (!result.cancelled) {
        let name = result.uri.split("ImagePicker");
        setChosenImg(result.uri)
        setChosenImgName(name[1])
      }
    }
  }

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
          setChosenImg(result.uri)
          setChosenImgName(name[1])
        }
      }
    }
    catch (error) {
      setChosenImg(undefined)
    }
  };

  const getImageUrl = async () => {
    if (chosenImg == "") {
      return
    }
    else {
      const response = await fetch(chosenImg);
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

  const addPost = async () => {
    if (text == "" && chosenImg == "") {
        setErrorMsg(true)
      return
    }
    setLoading(true)
    let imageUrl = await getImageUrl()
    const token = await AsyncStorage.getItem('token')
    try {
      const data = await fetch(SERVER_URL + "/posts/add", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          text: text,
          imgUrl: imageUrl,
          date: moment().format('lll')
        })
      })
      // await data.json()
      props.getUserPost()
      setText("")
      setChosenImg("")
      setChosenImgName("")
      setLoading(false)
      setErrorMsg(false)
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ paddingTop: 5, paddingBottom: 15 }}>Add Post</Text>
      {errorMsg ? <ErrorMessage errorMsg={"required"} top={50} />: null}
      <TextInput
        editable={!loading}
        style={styles.textInput}
        multiline={true}
        numberOfLines={10}
        placeholder="type something..."
        value={text}
        onChangeText={(text) => setText(text)} />
      <View style={{ flexDirection: "row", width: "100%", backgroundColor: "white", marginBottom: 10, padding: 10, alignItems: "center", justifyContent: "space-around", borderTopWidth: 1, borderBottomWidth: 1, }}>
        <TouchableOpacity disabled={loading} style={{ flexDirection: "row", alignItems: "center" }} onPress={pickImage}><Image source={require("../../assets/images/gallery.png")} style={{ marginRight: 8 }} /><Text>gallary</Text></TouchableOpacity>
        <TouchableOpacity disabled={loading} style={{ flexDirection: "row", alignItems: "center" }} onPress={takePhoto}><Image source={require("../../assets/images/camera.png")} style={{ marginRight: 8 }} /><Text>take photo</Text></TouchableOpacity>
      </View>
      {chosenImg ? <Image style={{ width: "100%", height: 200, marginBottom: 10, borderRadius: 10 }} source={{ uri: chosenImg }} /> : null}

      <TouchableOpacity disabled={loading} style={styles.add_button} onPress={addPost}>
        {
          loading ? <ActivityIndicator size="large" color="white" /> : <Text style={{ color: "white" }}>add post</Text>
        }
      </TouchableOpacity>
    </View>
  )
}

export default AddPost

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignContent: "center",
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  imgInput: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 20,
    width: "100%",
    height: 40
  },
  textInput: {
    borderTopWidth: 1,
    borderTopColor: "black",
    paddingVertical: 15,
    width: "100%",
    height: 120,
    padding: 5,
  },
  add_button: {
    width: "100%",
    height: 50,
    backgroundColor: "tomato",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  }
});