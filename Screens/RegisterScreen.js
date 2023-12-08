import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const logoImg = require('../assets/logo.png');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();

  const handleRegister = () => {
    console.log(`Registration pressed with email: ${email} and password: ${password}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logoImg} style={styles.image} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdbcb4',
  },
  input: {
    marginBottom: 16,
    width: '80%', 
  },
  button: {
    marginBottom: 16,
    width: '80%', 
    backgroundColor: "#f26f55",
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
});