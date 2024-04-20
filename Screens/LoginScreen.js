import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  ActivityIndicator,
} from "react-native-paper";
import styles, { theme } from "../Styles/styles";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { IP_ADDRESS } from "../Functions/GetIP";

const logoImg = require("../assets/logo.png");

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginFailed, setShowLoginFailed] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLogin = async () => {
    const apiUrl = `http://${IP_ADDRESS}:8080/api/auth/signin`;

    try {
      setIsLoginLoading(true);
      console.log("Logging in with username: ", username);
      console.log("Sending request to ", apiUrl);
      const response = await axios.post(apiUrl, {
        username: username,
        password: password,
      });

      const token = response.data.token;
      const userInfo = {
        username: response.data.username,
        email: response.data.email,
        id: response.data.id,
      };
      // Store the user data using expo-secure-store
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userInfo", JSON.stringify(userInfo));
      setIsLoginLoading(false);
      navigation.navigate("MainHome");
    } catch (error) {
      setShowLoginFailed(true);
      setIsLoginLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logoImg} style={styles.image} />
      <TextInput
        label="Enter Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Enter Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        disabled={isLoginLoading}
      >
        Login
      </Button>
      {/*Login failed, show a snackbar*/}
      <Snackbar
        visible={showLoginFailed}
        onDismiss={() => setShowLoginFailed(false)}
        onIconPress={() => setShowLoginFailed(false)}
        duration={Snackbar.LENGTH_SHORT}
      >
        Login failed. Please try again.
      </Snackbar>
      <Text
        style={styles.signupText}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Sign up
      </Text>
    </SafeAreaView>
  );
}
