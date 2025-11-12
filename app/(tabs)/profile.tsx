import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, GlobalStyles, Spacing } from '../../constants/theme';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { auth } from '../../firebaseConfig';

export default function ProfileScreen() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  
  
  const { unloadSound } = useAudioPlayer(); 

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setDisplayName(user.displayName || user.email);
      } else {
        setDisplayName(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {

    unloadSound(); // para e limpa o player
    signOut(auth);
  };

  return (
    <View style={[GlobalStyles.container, styles.container]}>
      <Text style={GlobalStyles.title}>
        Perfil
      </Text>
      <Text style={styles.greeting}>
        Logado como: {displayName || 'Usuário'}
      </Text>
      
      
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={GlobalStyles.buttonText}>Sair (Logout)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    paddingTop: Spacing.xl * 2,
  },
  greeting: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
  logoutButton: {
    ...GlobalStyles.button,
    backgroundColor: Colors.error, 
    width: '100%',
    alignSelf: 'center',
    marginTop: Spacing.m,
  },
});