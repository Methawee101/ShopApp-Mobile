import React, {createContext, useContext}from "react";
import {View,Text,StyleSheet, Button, TouchableOpacity, useColorScheme,} from 'react-native'




const Homescreen = ({navigation}) =>{
    
    return(
        <View style ={styles.ViewStyle}>
            <Text style = {styles.TextStyle}> เพื่อนรักนักช็อป </Text>
            <View style = {styles.button}>
                <TouchableOpacity
                 style={styles.TouchSty}
                 onPress={()=> navigation.navigate('Item')}>
                    <Text
                    style = {styles.textButton}>รายการสินค้า</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    ViewStyle:{
        flex : 1,
        backgroundColor: '#E5D0AC',
        // alignItems: 'center',
        // justyfyContent: 'start',

    },
    TextStyle:{
        fontSize:30,
        margin: 20,
        textAlign: "center",
    },
    button:{
        gap : 10,
        width:'400',
        // alignItems:'center',
        left:5
       
        
        
    },
    TouchSty:{
        backgroundColor: '#6D2323', // สีพื้นหลัง
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',  
    
    },
    textButton:{
        color:'white',
        fontSize: 20,

    }
    
});


export default Homescreen;