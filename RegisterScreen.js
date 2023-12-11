import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import styles, { theme } from '../Styles/styles';

const logoImg = require('../assets/logo.png');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();


  const handleRegister = () => {
    console.log(`Registration pressed with username: ${username}, email: ${email} and password: ${password}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logoImg} style={styles.image} />
      <TextInput
        label="Enter Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        secureTextEntry
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
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
    </SafeAreaView>
  );
}