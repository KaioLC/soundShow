import { FontAwesome } from '@expo/vector-icons';
import {
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Colors, GlobalStyles, Spacing } from '../../constants/theme';
import { auth, db } from '../../firebaseConfig';


import { collection, DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';

export default function ProfileScreen() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  

  const [playlistCount, setPlaylistCount] = useState(0);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setDisplayName(user.displayName || user.email);
        setNewUsername(user.displayName || '');
        setUserId(user.uid);
      } else {
        setDisplayName(null);
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!userId) {
      setPlaylistCount(0);
      return;
    }

    const playlistsCollection = collection(db, 'users', userId, 'playlists');
    
    const unsubscribe = onSnapshot(playlistsCollection, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        setPlaylistCount(snapshot.size);
      }, (error) => {
        console.error("Erro ao contar playlists: ", error);
      }
    );

    return () => unsubscribe(); 

  }, [userId]); 

  // atualiza o nome de usuário
  const handleUpdateProfile = async () => {
    if (!newUsername.trim()) {
      alert("O nome de usuário não pode estar vazio.");
      return;
    }

    const user = auth.currentUser;
    if (!user) return; 

    setLoading(true);
    try {
      await updateProfile(user, {
        displayName: newUsername.trim()
      });
      setDisplayName(newUsername.trim());
      alert("Nome de usuário atualizado com sucesso!");

    } catch (error) {
      console.error("Erro ao atualizar perfil: ", error);
      alert("Erro ao atualizar o nome.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={[GlobalStyles.container, styles.container]}>
      <Text style={GlobalStyles.title}>
        Perfil
      </Text>
      <Text style={styles.greeting}>
        Logado como: {displayName || 'Usuário'}
      </Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estátisticas do Perfil</Text>
        <Text style={styles.statsText}>
          <FontAwesome name="list-ul" size={16} color={Colors.text} />
          {`  ${playlistCount}`} Playlists Criadas
        </Text>
      </View>

      <View style={styles.editContainer}>
        <Text style={styles.statsTitle}>Mudar Nome de Usuário</Text>
        <TextInput
          style={GlobalStyles.input}
          placeholder="Novo nome de usuário"
          placeholderTextColor={Colors.textSecondary}
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="words"
        />
        <Pressable 
          style={GlobalStyles.button} 
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          {loading ?
            <ActivityIndicator color={Colors.white} /> :
            <Text style={GlobalStyles.buttonText}>Salvar Nome</Text>
          }
        </Pressable>
      </View>

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
  
  statsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.m,
    padding: Spacing.m,
    marginBottom: Spacing.l,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.m,
  },
  statsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.s,
  },
  editContainer: {
    marginBottom: Spacing.xl,
  },

});