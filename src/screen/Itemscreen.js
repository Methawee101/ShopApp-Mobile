import React, { useState, useEffect, useReducer } from "react";
import {View,Text,StyleSheet,TextInput,FlatList,TouchableOpacity,Modal,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddButton from "../component/AddButton";
import ItemCard from "../component/ItemCard";
import TotalSummary from "../component/TotalSummary";

const STORAGE_KEY = "@card_data";

const reducer = (state, action) => {
  switch (action.type) {
    case "addCard":
      console.log("➕ Add Card: Current Sum:", state.sum, "Adding:", action.price);
      return { sum: state.sum + action.price };
    case "delete":
      console.log("❌ Delete Card: Current Sum:", state.sum, "Subtracting:", action.price);
      return { sum: state.sum - action.price };
    case "deleteAll":
      console.log("🗑️ Delete All: Reset Sum to 0");
      return { sum: 0 };
    case "setTotal":  
    console.log("🔄 Set Total from AsyncStorage:", action.price);
      return { sum: action.price };
    default:
      return state;
  }
};

const Itemscreen = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [cards, setCards] = useState([]);
  const [image, setImage] = useState("");
  const [Search, setSearch] = useState("");
  const [filterCard, setFilterCard] = useState(cards);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleEdit, setIsVisibleEdit] = useState(false);
  const [state, dispatch] = useReducer(reducer,{ sum: 0 });
  const [edit, setEdit] = useState(null);
  const [total, setTotal] = useState(0);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = cards.filter((card) =>
      card.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilterCard(filtered);
  };

  const addCard = async () => {
    if (!title.trim() || !price.trim()) {
      alert("กรุณากรอก ชื่อสินค้า และ ราคา");
      return;
    }
    const priceValue = parseFloat(price);
    const newCard = {
      id: Date.now().toString(),
      title,
      price: priceValue,
      image: image || "https://img.pptvhd36.com/thumbor/2023/09/01/8fcaa83.jpg",
      isPurchased: false,
    };
    const updateCards = [newCard, ...cards];
    const updatetotal = state.sum + priceValue;
    setCards(updateCards);
    setTitle("");
    setPrice("");
    setImage("");
    setIsVisible(false);
    dispatch({ type: "addCard", price: priceValue });
    console.log('addcard',state.sum);
    console.log('Total',updatetotal);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({cards:updateCards,total:updatetotal}));
      
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleChangeText = (text) => {
    const validText = text.replace(/[^0-9.]/g, "");
    const isValid = validText.split(".").length <= 2;
    if (isValid) {
      setPrice(validText);
    }
  };

  const loadCards = async () => {
    try {
      const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
      console.log(storedCards);
      if (storedCards) {
        const { cards, total } = JSON.parse(storedCards);
        setCards(cards || []);
        dispatch({ type: "setTotal", price: total || 0 });
        setTotal(total || 0);
        // setCards(JSON.parse(storedCards));
      } else {
        setCards([]);
      }
    } catch (error) {
      console.log("Faild ", error);
    }
  };
  
  
  useEffect(() => {
    loadCards();
   
  }, []);

  const DeleteItem = async (id) => {
    const itemToDelete = cards.find((item) => item.id === id); 
    const newCards = cards.filter((item) => item.id !== id);
    const updatetotal = Math.max(0, state.sum - itemToDelete.price);
    setCards(newCards);
    setTotal(updatetotal)
    if (!itemToDelete.isPurchased || state.sum >= itemToDelete.price) {
      dispatch({ type: "delete", price: itemToDelete.price });
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({cards:newCards,total:updatetotal}));
      
      
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const deleteAll = async () => {
    setCards([]);
    setTotal(0);
    dispatch({ type: "deleteAll" });
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({cards:[],total:0}));
      
  
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const openModaladdcard = () => {
    setIsVisible(true);
  };
  const closeModaladdcard = () => {
    setIsVisible(false);
  };
  const openModalEdit = (id) => {
    setIsVisibleEdit(true);
  }
  const closeModalEdit = () => {
    setIsVisibleEdit(false);
  };

  const togglePurchaseStatus = async (id) => {
    let updatetotal = state.sum;
    const updatedCards = cards.map((card) => {
      if (card.id === id) {
        
        const updatedCard = { ...card, isPurchased: !card.isPurchased };
        if (!card.isPurchased) {
          dispatch({ type: "delete", price: card.price });
          updatetotal += card.price;
          
        }else{
          dispatch({ type: "addCard", price: card.price });
          updatetotal -= card.price;
        }
        return updatedCard;
      }
      return card;
    });
    setTotal(updatetotal);
    setCards(updatedCards);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({cards:updatedCards,total:updatetotal}));
  
    } catch (error) {
      console.log("Error:", error);
    }
  };

 
  const EditCard = async (id) => {
    console.log("EditCard called", id);

    if (!title.trim() || !price.trim()) {
        alert("กรุณากรอก ชื่อสินค้า และ ราคา");
        return;
    }
    const priceValue = parseFloat(price);

   // หาข้อมูลสินค้าเดิม
    const oldCard = cards.find((card) => card.id === id);
    if (!oldCard) {
        console.log("Card not found");
        return;
    }

    const updatedCards = cards.map((card) => {
        if (card.id === id) {
            return {
                ...card,
                title: title,
                price: priceValue,
                image: image || "https://img.pptvhd36.com/thumbor/2023/09/01/8fcaa83.jpg",
            };
        }
        return card;
    });

    // คำนวณความแตกต่างของราคา
    const priceDifference = priceValue - oldCard.price;

    // อัปเดต state.sum โดยใช้ dispatch
    dispatch({ type: "setTotal", price: state.sum + priceDifference });

    setCards(updatedCards);
    console.log(updatedCards);
    setTitle("");
    setPrice("");
    setImage("");
    setEdit(null);
    setIsVisibleEdit(false);

    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    } catch (error) {
        console.log("Error:", error);
    }
};



  return (
    <View style={styles.container}>
      <View style={styles.Toch}>
        <Text style={styles.header}>รายการสินค้า</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Search"
        value={Search}
        onChangeText={handleSearch}
      />

      <View style={styles.Toch}>
        <AddButton
          title="+ เพิ่มรายการสินค้า"
          backgroundColor="#6D2323"
          onPress={openModaladdcard}
        />
        <AddButton
          title="ล้างสินค้าทั้งหมด"
          backgroundColor="#A31D1D"
          onPress={deleteAll}
        />
      </View>

      <FlatList
        data={Search.length > 0 ? filterCard : cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <ItemCard
              title={item.title}
              content={item.price}
              image={
                item.image
                  ? item.image
                  : "https://img.pptvhd36.com/thumbor/2023/09/01/8fcaa83.jpg"
              }
              isPurchased={item.isPurchased}
              onEdit={() => openModalEdit(item.id, item)}
              onDelete={() => DeleteItem(item.id)}
              onToggle={() => togglePurchaseStatus(item.id)}
            />
          </View>
        )}
      />

      <Modal transparent={true} visible={isVisible}>
        <View style={styles.containerModal}>
          <View style={styles.Modal}>
            <Text style={styles.header}>เพิ่มรายการสินค้า</Text>
            <TouchableOpacity
              style={styles.ButtonCloseModal}
              onPress={closeModaladdcard}
            >
              <Text>x</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="...ใส่ชื่อสินค้า"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="...ใส่ราคาสินค้า"
              value={price}
              onChangeText={handleChangeText}
              multiline={false}
              numberOfLines={5}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="...ใส่ URL รูปภาพสินค้า"
              value={image}
              onChangeText={setImage}
            />

            <AddButton
              title="เพิ่มรายการสินค้า"
              backgroundColor="#6D2323"
              onPress={addCard}
            />
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={isVisibleEdit}>
        <View style={styles.containerModal}>
          <View style={styles.Modal}>
            <Text style={styles.header}>แก้ไขรายการสินค้า</Text>
            <TouchableOpacity
              style={styles.ButtonCloseModal}
              onPress={closeModalEdit}
            >
              <Text>x</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="...ใส่ชื่อสินค้า"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="...ใส่ราคาสินค้า"
              value={price}
              onChangeText={handleChangeText}
              multiline={false}
              numberOfLines={5}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="...ใส่ URL รูปภาพสินค้า"
              value={image}
              onChangeText={setImage}
            />

        {cards.length > 0 && (
          <AddButton
            key={cards[0].id}
            title={`แก้ไขรายการสิรค้า`}
            onPress={() => EditCard(cards[0].id)}
            backgroundColor="#6D2323"
          />
        )}

          </View>
        </View>
      </Modal>

      <TotalSummary total={state.sum} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FEF9E1",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderBlockColor: "#ccc",
    borderRadius: 15,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  Toch: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  Modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 350,
    height: 300,
    backgroundColor: "#FEF9E1",
  },
  ButtonCloseModal: {
    position: "absolute",
    backgroundColor: "#A31D1D",
    borderRadius: 20,
    width: 30,
    height: 30,
    top: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Itemscreen;
