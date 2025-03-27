import React from "react";
import {NavigationContainer,useColorScheme,View} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Homescreen from "./src/screen/Homescreen";
import Itemscreen from "./src/screen/Itemscreen";

const Stack = createStackNavigator()

const App =() =>{
  
  
  return(
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name = "Home" component = {Homescreen}/>
        <Stack.Screen name = "Item" component = {Itemscreen}/>
         

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
