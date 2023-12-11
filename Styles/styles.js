import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

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
    signupText: {
      textAlign: 'center',
      color: "#f26f55",
      fontSize: 16,
    },
  });

  export const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#f26f55", //warm color
      accent: '#fdbcb4',  //warm color
    },
  };

  export default styles;