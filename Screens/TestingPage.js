import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { Button, Text } from "react-native-paper";
import styles, { theme } from "../Styles/styles";

const logoImg = require("../assets/logo.png");

export default function TestingPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Test page for development. For going to screens quickly</Text>
      <Button
        mode="outlined"
        style={{ margin: 4 }}
        onPress={() => navigation.navigate("Login")}
      >
        Go to login page
      </Button>
      <Button
        mode="outlined"
        style={{ margin: 4 }}
        onPress={() => navigation.navigate("Businesses")}
      >
        Go to businesses page
      </Button>
      <Button
        mode="outlined"
        style={{ margin: 4 }}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        Go to home page
      </Button>
      <Button
        mode="outlined"
        style={{ margin: 4 }}
        onPress={() => navigation.navigate("Map")}
      >
        Go to map page
      </Button>
    </SafeAreaView>
  );
}
