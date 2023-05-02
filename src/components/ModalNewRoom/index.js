import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export default function ModalNewRoom({ setVisable }) {

    const [roomName, setRoomName] = useState('');
    const user = auth().currentUser.toJSON();

    function handleButtonCreate() {
        if (roomName === '') return

        firestore().collection("MESSAGE_THREADS").get()
            .then((snapshot) => {
                let myThreads = 0;

                snapshot.docs.map((docItem) => {
                    if (docItem.data().owner === user.uid) {
                        myThreads += 1;

                    }

                })

                if (myThreads >= 4) {
                    alert("Você atingiu o limite máximo por usuário")
                } else {

                    createRoom();
                }

            })
    }

    function createRoom() {
        firestore().collection('MESSAGE_THREADS').add({
            name: roomName,
            owner: user.uid,
            lastMessage: {
                text: `Grupo ${roomName} criado, Bem vindo(a)!`,
                createdAt: firestore.FieldValue.serverTimestamp(),

            }
        })
            .then((docRef) => {
                docRef.collection('MESSAGES').add({
                    text: `Grupo ${roomName} criado, Bem vindo(a)!`,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    system: true
                }).then(() => {
                    setVisable();

                })

            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={setVisable}>
                <View style={styles.modal}></View>
            </TouchableWithoutFeedback>
            <Animatable.View
                style={styles.modalContent}
                animation="fadeInRight"
                iterationCount={1}

            >
                <Text style={styles.title}>Criar um novo grupo?</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Nome do seu grupo'
                    value={roomName}
                    onChangeText={(text) => setRoomName(text)}
                />
                <TouchableOpacity style={styles.buttonCreate} onPress={handleButtonCreate}>
                    <Text style={styles.buttonText}>Criar Grupo</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(34,34,34,0.7)',
        justifyContent: 'center'
    },
    modalContent: {
        backgroundColor: '#FFF',
        width: '100%',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        position: 'absolute'
    },
    title: {
        color: "#000",
        fontSize: 22,
        marginTop: 22,
        marginBottom: 14
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
    buttonCreate: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        marginBottom: 10,
        backgroundColor: '#2E54D4',
        marginBottom: 22
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 22
    },
    modal: {
        flex: 1
    }


})