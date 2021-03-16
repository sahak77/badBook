import React from "react"
import {View, Text} from "react-native"

const ErrorMessage = ({top,errorMsg})=>{
    return(
    <View style={{position: "absolute", right: 0,top: top ,paddingHorizontal: 10 }}>
        <Text style={{color: "red" ,fontSize: 10, fontWeight: "700"}}>{errorMsg}</Text>
    </View>
    )
}

export default ErrorMessage