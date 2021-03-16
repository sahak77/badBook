import React from "react"
import { Text, TouchableOpacity, StyleSheet } from "react-native"

const PostTool = (props) => {
    return (
        <TouchableOpacity style={styles.button} onPress={props.func}>
            <Text>{props.text}</Text>
        </TouchableOpacity>
    )
}

export default PostTool

const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 70,
        justifyContent: "center",
        paddingHorizontal: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#acacac"
    }
})
