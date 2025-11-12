import { Colors } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import MiniPlayer from '../../components/MiniPlayer';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

const MINI_PLAYER_HEIGHT = 70; // altura da abinha do miniplayer

function TabLayout() {

  const { currentTrack } = useAudioPlayer();

  return (
    <View style={{ flex: 1 }}> 
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          
          // empurra as tabs pra cima quando o miniplayer tá visível
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: Colors.border,
            height: 70,
            paddingBottom: 5,
            
            // se tiver musica tocando, sobe a tabBar
            bottom: currentTrack ? MINI_PLAYER_HEIGHT : 0, 
          },
          
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            color: Colors.text,
          },
        }}>
        
        <Tabs.Screen
          name="home"
          options={{
            title: 'Início',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="home" color={color} />
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

        <Tabs.Screen
          name="playlists"
          options={{
            title: 'Playlists',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="list-ul" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="user" color={color} />
            ),
          }}
        />

      </Tabs>

      <MiniPlayer />
    </View>
  );
}

export default function TabsLayoutWithProvider () {

  return (
    <TabLayout/>
  )
}