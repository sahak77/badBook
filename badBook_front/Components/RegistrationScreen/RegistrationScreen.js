import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, Button, SafeAreaView, KeyboardAvoidingView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SERVER_URL } from '../../config';
import Loading from '../Tools/Loading';
import TextField from '../Tools/TextField';

const RegistrationScreen = (props) => {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [firstnameErr, setFirstnameErr] = useState()
    const [lastnameErr, setLastnameErr] = useState()
    const [emailErr, setEmailErr] = useState()
    const [passwordErr, setPasswordErr] = useState()

    const [loading, setLoading] = useState(false)

    const registration = async () => {
        setLoading(true)
        try {
            const fetchData = await fetch(SERVER_URL + "/auth/registration", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({ firstname, lastname, email, password })
            })
            const data = await fetchData.json()
            if (data.errors) {
                setFirstnameErr(false)
                setLastnameErr(false)
                setEmailErr(false)
                setPasswordErr(false)
                data.errors.map((i, index) => {
                    if (i.param == "firstname") {
                        setFirstnameErr(true)
                    }
                    if (i.param == "lastname") {
                        setLastnameErr(true)
                    }
                    if (i.param == "email") {
                        setEmailErr(true)
                    }
                    if (i.param == "password") {
                        setPasswordErr(true)
                    }
                })
                setLoading(false)
            }
            else {
                props.navigation.navigate('Login')
                setLoading(false)
            }
        }
        catch (error) {
            console.log(error, "rrr");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={-140}
            >
                {
                    loading ?
                        <Loading />
                        : null
                }
                <View style={styles.title_view}>
                    <Text style={styles.title_text}>Registration</Text>
                </View>


                <View style={styles.login_form} >
                    <TextField err={firstnameErr} value={firstname} changeValue={setFirstname} placeholder={"Firstname"} img={require("../../assets/images/user.png")} secure={false} />
                    <TextField err={lastnameErr} value={lastname} changeValue={setLastname} placeholder={"Lastname"} img={require("../../assets/images/user.png")} secure={false} />
                    <TextField err={emailErr} value={email} changeValue={setEmail} placeholder={"Email"} img={require("../../assets/images/email.png")} secure={false} />
                    <TextField err={passwordErr} value={password} changeValue={setPassword} placeholder={"Password"} img={require("../../assets/images/lock.png")} secure={true} />
                    <TouchableOpacity style={styles.reg_button} onPress={registration} ><Text style={styles.reg_button_text}>REGISTER</Text></TouchableOpacity>
                </View>
                <View style={styles.haveAccount_view}>
                    <Text style={styles.existAccount_text}>Alredy have an account?</Text>
                    <TouchableOpacity style={styles.go_login} onPress={() => props.navigation.navigate('Login')}><Text style={styles.go_login_text}>SIGN IN</Text></TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default RegistrationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#010031",
        alignItems: 'center',
        justifyContent: 'center',
    },
    title_view: {
        paddingBottom: 20
    },
    title_text: {
        color: "#dce3e9",
        fontSize: 30,
        fontWeight: "bold"
    },
    reg_button: {
        borderWidth: 1,
        borderRadius: 50,
        backgroundColor: "#b17d87",
        marginTop: 40,
        marginBottom: 25,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    haveAccount_view: {
        justifyContent: "center",
        alignItems: "center",
    },
    reg_button_text: {
        color: "white",
        fontSize: 19
    },
    existAccount_text: {
        color: "white",
    },
    go_login: {
        paddingTop: 8
    },
    go_login_text: {
        color: "#b17d87",
        fontWeight: "bold"
    }
});