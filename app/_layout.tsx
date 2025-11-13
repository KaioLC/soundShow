import { Stack, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { View } from 'react-native';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import MiniPlayer from '../components/MiniPlayer';
import { AudioPlayerProvider, useAudioPlayer } from '../context/AudioPlayerContext';
import { auth } from '../firebaseConfig';


const MINI_PLAYER_HEIGHT = 70; // a altura do miniplayer


// pra empurrar as telas pra cima quando o miniplayer tá visível
function StackLayout() {

  const { currentTrack } = useAudioPlayer();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          paddingBottom: currentTrack ? MINI_PLAYER_HEIGHT : 0,
        }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="playlists/[id]" 
        options={{ 
          title: 'Playlist', 
          presentation: 'modal', 
        }} 
      />
    </Stack>
  );
}

// componente que gera o redirecionamento baseado na autenticação
function AuthGate() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)/home'); 
      } else {
        router.replace('/signin');
      }
    });
    return () => unsubscribe();
  }, []);
  
  // Este componente não renderiza nada, só faz o redirecionamento
  return null;
}


export default function RootLayout() {
  return (

<AudioPlayerProvider>

      <View style={{ flex: 1 }}>
        
        <AuthGate />
        
        <StackLayout />
        
        <MiniPlayer />
        <AddToPlaylistModal />
      </View>
    </AudioPlayerProvider>
  );
}
