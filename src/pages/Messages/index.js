import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ChatMessage from '../../components/ChatMessage';
import Feather from 'react-native-vector-icons/Feather'
export default function Messages({ route }) {

  const { thread } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const user = auth().currentUser.toJSON();


  useEffect(() => {

    const unsubscribeListener = firestore().collection("MESSAGE_THREADS")
      .doc(thread._id)
      .collection("MESSAGES")
      .orderBy('createdAt', 'desc')
      .onSnapshot((querysnapshot) => {
        const messages = querysnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: firestore.FieldValue.serverTimestamp(),
            ...firebaseData
          }

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName
            }
          }
          return data
        })

        setMessages(messages);

      })

    return () => unsubscribeListener();
  }, [])

  async function handleSend(){

    await firestore().collection("MESSAGE_THREADS")
    .doc(thread._id).collection("MESSAGES")
    .add({
      text: input,
      createdAt: firestore.FieldValue.serverTimestamp(),
      user: {
        _id: user.uid,
        displayName: user.displayName
      }
    })

    await firestore().collection("MESSAGE_THREADS")
    .doc(thread._id).set({
      lastMessage: {
        text: input,
        createdAt: firestore.FieldValue.serverTimestamp(),
      }
    }, {merge: true}
    )

    setInput('')
  }


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        inverted={true}
        style={{ width: '100%' }}
        data={messages}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatMessage data={item} />
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ width: '100%' }}
        keyboardVerticalOffset={100}
      >
        <View style={styles.containerInput}>
          <View style={styles.mainContainerInput}>
            <TextInput
              placeholder='Sua mensagem...'
              style={styles.textInput}
              value={input}
              onChangeText={(text) => setInput(text)}
              multiline={true}
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity onPress={handleSend}>
            <View style={styles.buttonContainer}>
              <Feather name='send' size={22} color='#FFF' />
            </View>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerInput:{
    flexDirection: 'row',
    margin: 10,
    alignItems: 'flex-end'
  },
  mainContainerInput:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    flex: 1,
    borderRadius: 25,
    marginRight: 10
  },
  textInput:{
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 130,
    minHeight: 48
  },
  buttonContainer:{
    backgroundColor: '#51c880',
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25
  }

})