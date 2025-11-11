import { Colors } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import MiniPlayer from '../../components/MiniPlayer';

export default function TabLayout() {

  return (
    <View style={{ flex: 1 }}> 
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: Colors.border,

            height: 60,
            paddingBottom: 5,
          },
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            color: Colors.text,
          },
          // headerShown: false,
          // tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="library"
          options={{
            title: 'Biblioteca',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="book" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explorar',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="search" color={color} />
            ),
          }}
        />
      </Tabs>

      <MiniPlayer /> /* O miniplayer fica renderizado aqui */
    </View>
  );
}
