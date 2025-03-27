import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TotalSummary =({total})=>{
    return(
        <View style={styles.container}>
            <Text style={styles.text}>สินค้าที่ยังไม่ได้ซื้อราคารวม :  {total}   บาท</Text>
        </View>
    )
}


const styles = StyleSheet.create({
  container: { 
    padding: 15, 
    marginTop: 10, 
    backgroundColor: "#6D2323", 
    borderRadius: 8 },
  text: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: 'white'
  },
});

export default TotalSummary;