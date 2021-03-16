import React, { useState } from "react"
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native"

const AboutAs = ({ editMod2 }) => {

    return (
        <SafeAreaView style={{ width: "100%", height: "100%", alignItems: "center", }}>
            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, backgroundColor: "tomato", width: "100%" }}>
                    <TouchableOpacity onPress={() => editMod2(false)}><Image source={require("../../../assets/images/previous.png")} /></TouchableOpacity>
                    <Text style={{ fontWeight: "bold", fontSize: 17 }}>About As</Text>
                </View>
                <View style={{ width: "90%", marginTop: 30 }}>
                    <Text style={{color: "white", fontSize: 19, fontWeight: "500"}}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AboutAs

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