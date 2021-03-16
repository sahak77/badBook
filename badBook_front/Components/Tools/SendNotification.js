import AsyncStorage from '@react-native-community/async-storage';
export const schedulePushNotification = async (expoPushToken, id) => {
    const userId = await AsyncStorage.getItem("id")
    if (id === userId) {
        return
    }
    else {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Original Title',
            body: 'And here is the body!',
            data: { data: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }
}