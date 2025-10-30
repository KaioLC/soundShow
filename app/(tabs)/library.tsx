import { View, Text, StyleSheet, Pressable } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signOut } from "firebase/auth";
import { Colors, Spacing, FontSizes } from '../../constants/theme';

export default function LibraryScreen() {
  
  // pega o usuário logado
  const user = auth.currentUser;

  // função de logout
  const handleLogout = async () => {
    try {
      await signOut(auth);

    } catch (error) {
      console.error("Erro ao sair: ", error);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Oi, {user ? (user.displayName) : 'Usuário'}!</Text>
      <Text style={styles.subtitle}>Bem-vindo ao soundShow.</Text>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>

        <Text style={styles.logoutButtonText}>Sair (Logout)</Text>

      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.m,
    textAlign: 'center',
    paddingHorizontal: Spacing.m, 
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.tabIconDefault,
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    backgroundColor: '#D8000C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: Spacing.s,
    elevation: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

