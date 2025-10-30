import { View, Text, StyleSheet, Pressable } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signOut } from "firebase/auth";
import { GlobalStyles, Colors} from '../../constants/theme';

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

      <Text style={GlobalStyles.title}>Oi, {user ? (user.displayName) : 'Usuário'}!</Text>
      <Text style={styles.subtitle}>Bem-vindo ao soundShow.</Text>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>

        <Text style={GlobalStyles.buttonText}>Sair (Logout)</Text>

      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({


  container: {
    ...GlobalStyles.container, 
    justifyContent: 'center',
    alignItems: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 32,
  },

  logoutButton: {
    ...GlobalStyles.button,
    backgroundColor: Colors.error,
    width: '80%',
  }
});
