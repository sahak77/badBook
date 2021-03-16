import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import TextField from '../Tools/TextField';
import { SERVER_URL } from '../../config';
import Loading from '../Tools/Loading';


const LogInScreen = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [emailErr, setEmailErr] = useState()
    const [passErr, setPassErr] = useState()

    const [loading, setLoading] = useState(false)









    const login = async () => {
        setLoading(true)
        try {
            const fetchData = await fetch(SERVER_URL + "/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
            const data = await fetchData.json()

            if (data.errors) {
                setEmailErr(false)
                setPassErr(false)
                data.errors.map((i) => {
                    if (i.param == "email") {
                        setEmailErr(true)
                    }
                    if (i.param == "password") {
                        setPassErr(true)
                    }
                })
                setLoading(false)
            }
            else {
                await AsyncStorage.setItem('token', data.token)
                await AsyncStorage.setItem('id', data.id)
                props.getData()
                setLoading(false)
            }
        }
        catch (error) {
            setLoading(false)
            console.log(error, "sssss");
        }
    }
    const goRegister = () => {
        props.navigation.navigate('Registration')
        setEmail('')
        setPassword('')
        setEmailErr(false)
        setPassErr(false)
    }
    return (
        <SafeAreaView style={styles.container} >
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={-100}
            >
                {
                    loading ?
                        <Loading />
                        : null

                }
                <Image style={styles.login_bot} source={require("../../assets/images/bot.png")} />
                <View style={styles.login_form} >
                    <TextField err={emailErr} value={email} changeValue={setEmail} placeholder={"Email"} img={require("../../assets/images/email.png")} secure={false} />
                    <TextField err={passErr} value={password} changeValue={setPassword} placeholder={"Password"} img={require("../../assets/images/lock.png")} secure={true} />
                    <TouchableOpacity style={styles.login_button} onPress={login} ><Text style={styles.login_button_text}>SIGN IN</Text></TouchableOpacity>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.noAccount_text}>Don't have an account?</Text>
                    <TouchableOpacity style={styles.go_register} onPress={goRegister}><Text style={styles.go_register_text}>REGISTER</Text></TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default LogInScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "#010031"
    },
    login_bot: {
        width: 150,
        height: 150,
        marginBottom: 25,
        marginTop: -10
    },
    input_view: {
        width: "70%",
        flexDirection: "row",
        borderBottomWidth: 1,
        paddingVertical: 17,
        borderBottomColor: "#b17d87",
        justifyContent: "center",
        alignItems: "center"
    },
    input_icon: {
        width: 25,
        height: 25,
        marginRight: 20
    },
    input: {
        width: "80%",
        height: 40,
        fontSize: 17,
        color: "#abaabc",
    },
    login_button: {
        borderWidth: 1,
        borderRadius: 50,
        backgroundColor: "#b17d87",
        marginTop: 40,
        marginBottom: 25,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    login_button_text: {
        color: "white",
        fontSize: 19
    },
    noAccount_text: {
        color: "white",
    },
    go_register: {
        paddingTop: 8
    },
    go_register_text: {
        color: "#b17d87",
        fontWeight: "bold"
    }
});
