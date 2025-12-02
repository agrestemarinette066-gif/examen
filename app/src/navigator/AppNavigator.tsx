import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ConsultasScreen from '../screens/ConsultasScreen';
import MaestroScreen from '../screens/MaestroScreen';
import CursoScreen from '../screens/CursoScreen';
import ExamenScreen from '../screens/ExamenScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function FormulariosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FormulariosHome" 
        component={HomeScreen}
        options={{ title: 'Formularios' }}
      />
      <Stack.Screen 
        name="Maestro" 
        component={MaestroScreen}
        options={{ title: 'Registrar Maestro' }}
      />
      <Stack.Screen 
        name="Curso" 
        component={CursoScreen}
        options={{ title: 'Registrar Curso' }}
      />
      <Stack.Screen 
        name="Examen" 
        component={ExamenScreen}
        options={{ title: 'Registrar Examen' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = 'help';

            if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Consultas') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Formularios') {
              iconName = focused ? 'create' : 'create-outline';
            }

            return <Ionicons Name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196f3',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Inicio" 
          component={HomeScreen}
          options={{ title: 'Inicio' }}
        />
        <Tab.Screen 
          name="Consultas" 
          component={ConsultasScreen}
          options={{ title: 'Consultas' }}
        />
        <Tab.Screen 
          name="Formularios" 
          component={FormulariosStack}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}