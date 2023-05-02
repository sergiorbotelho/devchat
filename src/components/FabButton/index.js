import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function FabButton({ setVisable, userStatus }) {

    const navigation = useNavigation();

    function handleNavigateButton(){
        
        userStatus ? setVisable() : navigation.navigate('Signin')

    }
    return (
        <TouchableOpacity
            style={styles.containerButton}
            activeOpacity={0.8}
            onPress={handleNavigateButton}
        >
            <View>
                <Text style={styles.text}>+</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerButton: {
        backgroundColor: '#2E54F4',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: '6%',
        bottom: '5%'


    },
    text: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold'
    }
})
