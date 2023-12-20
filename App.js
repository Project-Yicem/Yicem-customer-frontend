import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import styles, { theme } from "./Styles/styles";
import BusinessesScreen from "./screens/BusinessesScreen";
import TestingPage from "./screens/TestingPage";
import BusinessDetailsScreen from "./screens/BusinessDetailsScreen";
import HomeScreen from "./screens/HomeScreen";
import MainTabs from "./Components/MainTabs";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
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
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
