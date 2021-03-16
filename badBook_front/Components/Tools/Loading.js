import React from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"

const Loading = () => {
    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="white" />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 77
    },
})
