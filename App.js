import React, { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import styles, { theme } from "./Styles/styles";
import BusinessesScreen from "./Screens/BusinessesScreen";
import TestingPage from "./Screens/TestingPage";
import BusinessDetailsScreen from "./Screens/BusinessDetailsScreen";
import HomeScreen from "./Screens/HomeScreen";
import MainTabs from "./Components/MainTabs";
import MapScreen from "./Screens/MapScreen";
import PastPurchasesScreen from "./Screens/PastPurchasesScreen";
import FavoriteBusinessesScreen from "./Screens/FavoriteBusinessesScreen";
import ReviewsScreen from "./Screens/ReviewsScreen";
import * as SecureStore from "expo-secure-store";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </PaperProvider>
  );
}

function AppContent() {
  const navigation = useNavigation();

  const checkToken = async () => {
    // Check if the user is already logged in
    // If so, navigate to the MainHome screen
    // If not, navigate to the Login screen
    const userToken = await SecureStore.getItemAsync("userToken");
    if (userToken) {
      navigation.navigate("MainHome");
    } else {
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    console.log("App loaded");

    checkToken();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Businesses" component={BusinessesScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="BusinessDetailsScreen"
        component={BusinessDetailsScreen}
      />
      <Stack.Screen name="MainHome" component={MainTabs} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="PastPurchases" component={PastPurchasesScreen} />
      <Stack.Screen
        name="FavoriteBusinesses"
        component={FavoriteBusinessesScreen}
      />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
    </Stack.Navigator>
  );
}
