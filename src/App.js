import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import DetalhesItens from './src/screens/DetalhesItens';
import Sobre from './src/screens/Sobre'; 
import ConsultoriaContato from './src/screens/ConsultoriaContato';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="DetalhesItem" component={DetalhesItens} />
                <Stack.Screen name="Sobre" component={Sobre} />
                <Stack.Screen name="ConsultoriaContato" component={ConsultoriaContato} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
