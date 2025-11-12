import { Stack, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';
import { auth } from '../firebaseConfig';

export default function RootLayout() {
  
  useEffect(() => {
   
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // usuário logado, mandando para a tela principal
        router.replace('/(tabs)/home');
      } else {
        // usuario não ta logado, mandando para a tela de login
        router.replace('/signin');
      }
    });

    // limpando o ouvinte quando o usuario desloga
    return () => unsubscribe();
  }, []);

  return (
    <AudioPlayerProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AudioPlayerProvider>
  );
}
