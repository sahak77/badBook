import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Head from '../Tools/Head';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SERVER_URL } from '../../config';
import ChangePassword from './SettingsTool/ChangePassword';
import Modal from 'react-native-modal';
import AboutAs from './SettingsTool/AboutAs';


const SettingsScreen = (props) => {
    const [mod1, setMod1] = useState(false)
    const [mod2, setMod2] = useState(false)

    const logOut = async () => {
        try {
            await AsyncStorage.removeItem('token')
            props.getData()
            return true;
        }
        catch (exception) {
            return false;
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ width: "100%", height: 60, backgroundColor: "tomato", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 19, fontWeight: "500" }}>Settings</Text>
            </View>
            <View>
                {/* edit post */}
                <Modal
                    isVisible={mod1}
                    animationInTiming={500}
                    style={styles.edit_modal}
                >
                    <ChangePassword
                        editMod1={setMod1}
                    />
                </Modal>
                <Modal
                    isVisible={mod2}
                    animationInTiming={500}
                    style={styles.edit_modal}
                >
                    <AboutAs
                        editMod2={setMod2}
                    />
                </Modal>
            </View>
            <View style={{ padding: 10, width: "90%", marginTop: 30 }}>
                <TouchableOpacity style={styles.settings_button} title="change password" onPress={()=>setMod1(true)}><Text style={styles.button_text}>change password</Text></TouchableOpacity>
                <TouchableOpacity style={styles.settings_button} title="about as" onPress={()=>setMod2(true)}><Text style={styles.button_text}>about as</Text></TouchableOpacity>
                <TouchableOpacity style={styles.settings_button} title="log out" onPress={logOut}><Text style={styles.button_text}>Log out</Text></TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#010031",
        flex: 1,
        alignItems: 'center',
    },
    settings_button:
    {
        width: "100%",
        height: 50,
        backgroundColor: "white",
        justifyContent: "center",
        borderRadius: 10,
        padding: 10, marginBottom: 20
    },
    button_text: {
        fontWeight: "500", fontSize: 20
    },
    edit_modal: {
        width: "100%",
        height: "100%",
        backgroundColor: "#010031",
        margin: 0
    },

});