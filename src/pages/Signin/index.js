import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
export default function Signin() {

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState(false);
  const navigation = useNavigation();


  function handleLogin() {
    if (type) {
      auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          user.user.updateProfile({
            displayName: name
          })
          .then(()=>{
            navigation.goBack();
          })
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('Email já em uso');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('Email inválido');
          }
        })
    }
    else {
      if(email === '' || password === ''){
        return
      }
      
      auth().signInWithEmailAndPassword(email, password)
      .then(()=>{
        navigation.goBack();
      })
      .catch((error)=>{
        if (error.code === 'auth/invalid-email') {
          console.log('Email inválido');
          return
        }
        if (error.code === 'auth/wrong-password') {
          console.log('Senha inválida');
          return
        }
        if (error.code === 'auth/user-not-found') {
          console.log('Usuario não encontrado');
          return
        }

        console.log(error);

      })
    }
  }
  return (


    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>DevChat</Text>
      <Text style={{ marginBottom: 20 }}>Ajude, colabore, faça networking!</Text>

      {type && (

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder='Qual seu nome?'
          placeholderTextColor={'#99999b'}
        />
      )}
      < TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder='Seu email?'
        placeholderTextColor={'#99999b'}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder='Sua senha?'
        placeholderTextColor={'#99999b'}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={[styles.buttonLogin, { backgroundColor: type ? '#F53745' : '#2E54D4' }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>{type ? "Cadastrar" : "Acessar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setType(!type)}>
        <Text>{type ? "Já possuo uma conta" : "Criar uma nova conta"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  logo: {
    marginTop: Platform.OS === 'android' ? 55 : 80,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000'
  },
  input: {
    color: '#121212',
    backgroundColor: '#EBEBEB',
    width: '90%',
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 50
  },
  buttonLogin: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 10
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 19
  }
})