import React from "react";
import {Text,View,StyleSheet,TouchableOpacity} from 'react-native'

const AddButton =(
    {title,onPress,backgroundColor}) =>{
    return(
        <TouchableOpacity
        style = {[styles.button,{backgroundColor}]}
        onPress={(onPress)}>
            <Text style= {styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button:{
        padding: 10,
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 10
    },
    text:{
        color: 'white',
        fontSize: 18,
    }
})

export default AddButton;