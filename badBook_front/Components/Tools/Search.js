import AsyncStorage from "@react-native-community/async-storage"
import React, { useEffect, useState } from "react"
import { View, SafeAreaView, StyleSheet, Dimensions, TextInput, Text, Image } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { SERVER_URL } from "../../config"

const Search = (props) => {
    console.log(props);
    const [newData, setNewData] = useState([])
    const [val, changeval] = useState("")

    const [data, setData] = useState([])

    const users = async () => {

        const token = await AsyncStorage.getItem('token')
        const data = await fetch(SERVER_URL + "/auth/users/", {
            method: "GET",
            headers: {
                "token": token
            }
        })
        const getData = await data.json()
        setData(getData)
    }

    const searchFilterFunction = text => {
        changeval(text);
        const newData = data.filter(item => {
            const itemData = `${item.firstname.toUpperCase()} ${item.lastname.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setNewData(newData);
    };

    useEffect(() => {
        users()
    }, [])

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.search_view}>
                <TouchableOpacity style={{ width: 30, height: 30 }} onPress={() => props.changeShowSearch(false)}>
                    <Image style={{ width: 26, height: 26 }} source={require("../../assets/images/previous.png")} />
                </TouchableOpacity>
                <TextInput
                    onChangeText={text => searchFilterFunction(text)}
                    value={val}
                    autoFocus={true}
                    style={styles.search_input}
                    placeholder="search people" placeholderTextColor="rgba(255,255,255,0.8)"
                />
            </View>
            <ScrollView contentContainerStyle={{ alignItems: "center" }} style={{ width: "100%" }}>
                <View style={{ width: "100%" }}>
                    {
                        newData.map((i, index) => {
                            return (
                                <TouchableOpacity onPress={()=>{props.navigation("Guest", {userId:{...i}});  props.changeShowSearch(false) }} key={index} style={styles.search_item} >
                                    <View style={{ flexDirection: "row" }}>
                                        <Image style={{ width: 40, height: 40, borderRadius: 20 }} source={{ uri: i.avatar }} />
                                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }} >
                                            <Text>{i.firstname} </Text>
                                            <Text>{i.lastname}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "#010031",
        alignItems: "center"
    },
    search_view: {
        flexDirection: "row",
        width: "100%",
        height: 80,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "tomato"
    },
    search_input: {
        borderWidth: 1,
        width: "85%",
        height: 36,
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: "#010031",
        color: "white"
    },

    search_item: {
        width: "100%",
        height: 60,
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        backgroundColor: "#d8dbdd",
    }

})
