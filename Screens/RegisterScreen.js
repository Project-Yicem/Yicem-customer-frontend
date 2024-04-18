import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import {
  TextInput,
  Button,
  Snackbar,
  Portal,
  Modal,
  Text,
} from "react-native-paper";
import styles, { theme } from "../Styles/styles";
import axios from "axios";
import { IP_ADDRESS } from "../Functions/GetIP";

const logoImg = require("../assets/logo.png");

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [name, setName] = useState();
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const handleRegister = () => {
    console.log(
      `Registration pressed with email: ${email} and password: ${password} and name: ${name} and confirm password: ${confirmPassword}`
    );
    const apiUrl = `http://${IP_ADDRESS}:8080/api/auth/signup/buyer`;
    if (!email || !password || !confirmPassword || !name) {
      setErrorText("Please make sure that none of the fields are empty");
      setErrorVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setErrorText("Please make sure that the passwords match");
      setErrorVisible(true);
      return;
    }
    try {
      setIsRegisterLoading(true);
      axios
        .post(apiUrl, {
          username: name,
          email: email,
          password: password,
        })
        .then((response) => {
          console.log("Registration successful");
          setIsRegisterLoading(false);
          setSuccessVisible(true);
        });
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorText("Error registering user: " + error.message);
      setIsRegisterLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logoImg} style={styles.image} />
      <TextInput
        label="Enter Username"
        value={name}
        onChangeText={(text) => setName(text)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Enter Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
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
      <TextInput
        label="Confirm Password"
        secureTextEntry
        onChangeText={(text) => setConfirmPassword(text)}
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        disabled={isRegisterLoading}
      >
        Register
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")}
        disabled={isRegisterLoading}
      >
        Go back to login
      </Button>
      {/*Error message, show a snackbar*/}
      <Snackbar
        visible={errorVisible}
        onDismiss={() => setErrorVisible(false)}
        onIconPress={() => setErrorVisible(false)}
        duration={Snackbar.LENGTH_SHORT}
      >
        {errorText}
      </Snackbar>
      <Portal>
        <Modal
          visible={successVisible}
          onDismiss={() => navigation.navigate("Login")}
          contentContainerStyle={{ backgroundColor: "white", padding: 20 }}
        >
          <View>
            <Text>Registration successful. You can now login.</Text>
            <Button onPress={() => navigation.navigate("Login")}>Okay</Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}
