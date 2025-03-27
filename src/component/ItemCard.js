import React from "react";
import {View,Text, StyleSheet,TouchableOpacity,Image } from 'react-native';

const ItemCard = ({ title, content, image, onDelete, isPurchased,onToggle, status,onEdit }) => {
    return (
        <View style={[styles.card, isPurchased && styles.cardPurchased]}>
            <View style={styles.container}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.content}>ราคา {content} บาท</Text>
                    <TouchableOpacity
                        style={[styles.toggleButton,
                            { backgroundColor: isPurchased ? "#E5D0AC" : "#E5D0AC" },]}
                        onPress={onToggle}
                        disabled={isPurchased} // ปิดใช้งานปุ่มเมื่อซื้อแล้ว
                        >
                        <Text style={styles.TextButton}>
                            {isPurchased? "ซื้อแล้ว" : "ซื้อ"}
                        </Text>
                    </TouchableOpacity>
                    
            </View>
            <TouchableOpacity style={styles.EditButton}onPress={onEdit}>
                <Text>แก้ไข</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.DeleteButton} onPress={onDelete}>
                <Text style={styles.TextButton}>X</Text>
            </TouchableOpacity>
        </View>
    );
};
 

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#A31D1D",
        padding: 20,
        borderRadius: 10,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardPurchased: {
        backgroundColor: "#E5D0AC", // เปลี่ยนสีพื้นหลังเมื่อซื้อแล้ว
        opacity: 0.7, // ทำให้ดูจางลง
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    content: {
        fontSize: 17,
        color: "black",
    },
    DeleteButton: {
        position: "absolute",
        backgroundColor: "red",
        borderRadius: 20,
        width: 30,
        height: 30,
        top: 10,
        right: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    TextButton: {
        color: "black",
        fontSize: 15,
        textAlign: "center",
    },
    image: {
        width: "100%",
        height: 270,
        borderRadius: 10,
        marginBottom: 5,
        marginTop: 32,
    },
    toggleButton: {
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },
    EditButton:{
        position: "absolute",
        backgroundColor: "#E5D0AC",
        borderRadius: 20,
        width: 50,
        height: 30,
        top: 10,
        left: 10,
        justifyContent: "center",
        alignItems: "center",
    }
});
export default ItemCard;


