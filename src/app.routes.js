import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Signin from "./pages/Signin";
import ChatRoom from "./pages/ChatRoom";
import Messages from "./pages/Messages";
import Search from "./pages/Search";
const AppStack = createNativeStackNavigator();

export default function AppRoutes() {
    return (
        <AppStack.Navigator initialRouteName="ChatRoom">
            <AppStack.Screen
                name="Signin"
                component={Signin}
                options={{
                    title: "Faça seu login."
                }}
            />
            <AppStack.Screen
                name="ChatRoom"
                component={ChatRoom}
                options={{
                    headerShown: false
                }}
            />
            <AppStack.Screen
                name="Messages"
                component={Messages}
                options={({ route }) => ({
                    title: route.params.thread.name
                })}    
            />
            <AppStack.Screen
                name="Search"
                component={Search}
                options={{
                    title: "Procurando algum grupo?"
                }}  
            />
        </AppStack.Navigator>
    )
}