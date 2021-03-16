import React from "react"
import { View, Image, TextInput, StyleSheet } from "react-native"

const TextField = ({ err, value, changeValue, placeholder, img, secure }) => {
    return (
        <View style={[styles.input_view, { borderBottomColor: err ? "red" : "#b17d87" }]} >
            <Image style={styles.input_icon} source={img} />
            <TextInput placeholderTextColor="#4f3756" placeholder={placeholder} style={styles.input} value={value} onChangeText={(text) => changeValue(text)} secureTextEntry={secure} />
            { err ? <Image style={{ position: "absolute", right: -25, width: 29, height: 29 }} source={require("../../assets/images/warn.png")} /> : null}
        </View>
    )
}

export default TextField

const styles = StyleSheet.create({
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
        padding: 5
    },
});