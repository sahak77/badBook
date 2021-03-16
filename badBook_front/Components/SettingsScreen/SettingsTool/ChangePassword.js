import AsyncStorage from "@react-native-community/async-storage"
import React, { useState } from "react"
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native"
import { SERVER_URL } from "../../../config"
import ErrorMessage from "../../Tools/ErrorMessage"

const ChangePassword = ({ editMod1 }) => {

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")

    const [oldPassErr, setOldPassErr] = useState(false)
    const [newPassErr, setNewPassErr] = useState(false)
    const [repeatPassErr, setRepeatPassErr] = useState(false)

    const getPassword = async () => {
        setOldPassErr(false)
        setNewPassErr(false)
        setRepeatPassErr(false)
        const id = await AsyncStorage.getItem("id")
        try {
            const token = await AsyncStorage.getItem('token')
            const changePass = await fetch(SERVER_URL + "/auth/profile/pass/" + id, {
                method: "PATCH",
                headers: {
                    "token": token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    repeatPassword: repeatPassword,

                })
            })
            const Pass = await changePass.json()

            if (Pass.errors) {
                Pass.errors.map((i, index) => {
                    console.log(i.param);
                    if (i.param == "oldPassword") {
                        setOldPassErr(true)
                    }
                    if (i.param == "newPassword") {
                        setNewPassErr(true)
                    }

                    if (i.param == "repeatPassword") {
                        setRepeatPassErr(true)
                    }
                })

            }
            else {
                editMod1(false)
            }
        } catch (error) {
            console.log(error);
        }

    }




    return (
        <SafeAreaView style={{ width: "100%", height: "100%", alignItems: "center", }}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, backgroundColor: "tomato", width: "100%" }}>
                    <TouchableOpacity onPress={() => editMod1(false)}><Image source={require("../../../assets/images/previous.png")} /></TouchableOpacity>
                    <Text style={{ fontWeight: "bold", fontSize: 17 }}>Change password</Text>
                </View>
                <View style={{ width: "90%", marginTop: 30 }}>
                    <View style={styles.input_view}>
                        {oldPassErr ? <ErrorMessage top={27} errorMsg={"wrong password"} /> : null}
                        <Text style={styles.input_text}>old pass:</Text>
                        <TextInput placeholderTextColor="#898a8c" placeholder="old password" style={styles.input} value={oldPassword} onChangeText={(val) => { setOldPassword(val) }} />
                    </View>
                    <View style={styles.input_view}>
                        {newPassErr ? <ErrorMessage top={27} errorMsg={"min length 6"} /> : null}
                        <Text style={styles.input_text}>new pass:</Text>
                        <TextInput placeholderTextColor="#898a8c" placeholder="new password" style={styles.input} value={newPassword} onChangeText={(val) => { setNewPassword(val) }} />
                    </View>
                    <View style={styles.input_view}>
                        {repeatPassErr ? <ErrorMessage top={27} errorMsg={"wrong password"} /> : null}
                        <Text style={styles.input_text}>repeat new pass:</Text>
                        <TextInput placeholderTextColor="#898a8c" placeholder="repeat password" style={styles.input} value={repeatPassword} onChangeText={(val) => { setRepeatPassword(val) }} />
                    </View>
                    <TouchableOpacity style={{ height: 60, backgroundColor: "tomato", borderRadius: 35, justifyContent: "center", alignItems: "center", marginTop: 30 }} onPress={getPassword}><Text style={{ fontSize: 18, fontWeight: '500' }} >change password</Text></TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChangePassword

const styles = StyleSheet.create({
    input_view: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"

    },
    input: {
        borderWidth: 1,
        width: "80%",
        padding: 15,
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
        marginRight: 10

    }

})