import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FabButton from '../../components/FabButton';
import auth from '@react-native-firebase/auth';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ModalNewRoom from '../../components/ModalNewRoom';
import firestore from '@react-native-firebase/firestore';
import ChatList from '../../components/ChatList';
export default function ChatRoom() {


  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false)
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null)
  const [threads, setThreads] = useState([]);
  const [loading, setLoagind] = useState(true);

  useEffect(() => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;

    setUser(hasUser)
  }, [isFocused]);


  useEffect(() => {

    let isActive = true;

    function getChats() {
      firestore().collection("MESSAGE_THREADS")
        .orderBy('lastMessage.createdAt', 'desc')
        .limit(10)
        .get()
        .then((snapshot) => {
          const threads = snapshot.docs.map((documentSnapshot) => {
            return {
              _id: documentSnapshot.id,
              name: '',
              lastMessage: { text: '' },
              ...documentSnapshot.data()
            }
          })

          if (isActive) {
            setThreads(threads);
            setLoagind(false);

          }
        })

    }

    getChats()



    return () => {
      isActive = false
    }
  }, [isFocused, threads])

  function handleSignout() {
    auth().signOut()
      .then(() => {
        setUser(null)
        navigation.navigate("Signin")
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function deleteRoom(ownerId, idRoom) {

    if (ownerId !== user?.uid) return

    Alert.alert(
      "Atenção!",
      "Você tem certeza que deseja essa sala?",
      [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => handleDeleteRoom(idRoom)
        }
      ]
    )


  }

  function handleSearch(){
    navigation.navigate('Search')
  }

  async function handleDeleteRoom(idRoom) {
    await firestore()
    .collection('MESSAGE_THREADS')
    .doc(idRoom)
    .delete();

  }

  if (loading) {
    return (
      <ActivityIndicator size="large" color={"#2E54D4"} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>
          {user && (
            <TouchableOpacity onPress={handleSignout}>
              <SimpleLineIcons name="logout" size={28} color="#FFF" />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Grupos</Text>
        </View>
        <TouchableOpacity onPress={handleSearch}>
          <MaterialIcons name="search" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>


      <FlatList
        style={{ marginTop: 10 }}
        data={threads}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatList data={item} deleteRoom={() => deleteRoom(item.owner, item._id)} userStatus={user} />
        )}
      />

      <FabButton setVisable={() => setModalVisible(true)} userStatus={user} />

      <Modal
        visible={modalVisible}
        animationType='fade'
        transparent={true}
      >
        <ModalNewRoom setVisable={() => setModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'

  },
  headerRoom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2E54D4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center'

  },
  headerRoomLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    paddingLeft: 10
  }
})