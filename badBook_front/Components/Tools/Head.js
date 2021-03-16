import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, SafeAreaView, TextInput } from "react-native"
import Search from '../Tools/Search';

const Head = ({ data, text, size, goBack, stackNav, setEditUserModal, profile, navigation }) => {
    const [showSearch, changeShowSearch] = useState(false)
    return (
        <View style={[styles.container, { height: size }]}>
            {  stackNav ?
                <View style={styles.stackHead}>
                    <TouchableOpacity style={styles.stackHead_button} onPress={()=>goBack(false)}>
                        <Image style={styles.img} source={require("../../assets/images/previous.png")} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: "300" }}>{text}</Text>
                </View>
                : showSearch ?
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showSearch}
                        style={{ width: "100%", margin: 0 }}
                    >
                        <Search navigation={navigation} data={data} changeShowSearch={changeShowSearch} />
                    </Modal>
                    : <View style={styles.mainHead}>
                        <Text style={{ fontSize: 20, fontWeight: "300" }}>{text}</Text>
                        <View style={{flexDirection: "row"}}>
{                     profile?   <TouchableOpacity style={{marginRight: 17}} onPress={() => setEditUserModal(true)}><Image style={styles.img} source={require("../../assets/images/edit.png")} /></TouchableOpacity>: null}
                        <TouchableOpacity onPress={() => changeShowSearch(true)}><Image style={styles.img} source={require("../../assets/images/search.png")} /></TouchableOpacity>
                        </View>
                    </View>
            }
        </View>
    )
}

export default Head

const styles = StyleSheet.create({
    mainHead: {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        flexDirection: "row"
    },
    stackHead: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        position: "relative"
    },
    stackHead_button: {
        position: "absolute",
        left: 3,
        marginLeft: "auto",
        marginRight: "auto"
    },
    container: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: "tomato",
        justifyContent: "center",
    },
    img: {
        width: 25,
        height: 25,
    }
})
