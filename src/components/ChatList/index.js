import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
export default function ChatList({ data, deleteRoom, userStatus }) {
    const navigation = useNavigation();

    function openChat() {
        if (userStatus) {
            navigation.navigate('Messages', { thread: data })
            return
        } else {

            navigation.navigate('Signin')
        }
    }
    return (
        <TouchableOpacity onLongPress={deleteRoom} onPress={openChat}>
            <View style={styles.row}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.nameText} numberOfLines={1}>{data.name}</Text>
                    </View>

                    <Text style={styles.contentText} numberOfLines={1}>{data.lastMessage.text}</Text>


                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    row: {
        backgroundColor: 'rgba(241,240,245,0.3)',
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        paddingVertical: 12

    },
    content: {
        flexShrink: 1
    },
    header: {
        flexDirection: 'row'
    },
    contentText: {
        color: '#c1c1c1',
        fontSize: 16,
        marginTop: 2
    },
    nameText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold'
    }
})