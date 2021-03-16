import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Modal, FlatList, RefreshControl, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Card from '../Tools/Card';
import { SERVER_URL } from '../../config';
import Head from '../Tools/Head';
import * as Notifications from 'expo-notifications';

const HomeScreen = (props) => {
    const [searchView, setChangeView] = useState(false)
    const [data, setData] = useState([])

    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)

    const id = useRef("")
    const limit = useRef(0)

    useEffect(() => {
        allPosts()
        getId()
    }, [])



    const getId = async () => {
        const userId = await AsyncStorage.getItem("id")
        id.current = userId
    }
    const allPosts = async () => {
        try {
            const fetchAllPosts = await fetch(SERVER_URL + "/posts/posts/" + limit.current)
            const data = await fetchAllPosts.json()
            setData(data)
            setRefresh(false)
            setLoading(false)

        } catch (error) {
            console.log(error);
        }
    }
    const renderFooter = () => {
        return (
            loading ? < View >
                <ActivityIndicator size="large" />
            </View > : null

        )
    }
    let datareverse = [...data].reverse();

    return (
        <SafeAreaView style={styles.container}>
            {
                searchView
                    ?
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                        }}
                    >
                        <View style={{ backgroundColor: "red", flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text>Hello World!</Text>
                            <TouchableOpacity onPress={() => { setChangeView(false) }}><Text>go back</Text></TouchableOpacity>
                            <TextInput style={{ borderWidth: 1, width: 100 }} />
                        </View>
                    </Modal>
                    : null
            }

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ width: "100%", height: "100%" }}
                contentContainerStyle={{ alignContent: "center" }}
                ListHeaderComponent={
                    <>
                        <Head navigation={props.navigation.navigate} data={data} text={"BadBook"} size={60} />
                    </>
                }
                data={datareverse}
                renderItem={({ item }) => {
                    return (<View style={{ alignItems: "center" }}>
                        <Card
                            item={item}
                            profilePage={false}
                            navigation={props.navigation.navigate}
                            stackNav={"home"}
                            userId={id.current}
                            Posts={allPosts}
                            // schedulePushNotification={schedulePushNotification}
                        />
                    </View>
                    )
                }}
                tintColor="white" titleColor="white"
                keyExtractor={item => item._id.toString()}
                // onEndReached={loadMore}
                onEndReachedThreshold={0}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={allPosts}
                        title="Pull to refresh"
                        tintColor="#fff"
                        titleColor="#fff"
                        colors="#fff"
                    />}
            />
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#010031",
        alignItems: 'center',
    },

});