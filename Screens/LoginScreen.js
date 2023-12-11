import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import styles, { theme } from '../Styles/styles';

const logoImg = require('../assets/logo.png');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(`Login pressed with email: ${email} and password: ${password}`);
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
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Text style={styles.signupText} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Sign up
      </Text>
    </SafeAreaView>
  );
}
  
