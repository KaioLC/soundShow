import { FontAwesome } from '@expo/vector-icons'; // pro icone de play
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList, // utilizar pra listas performaticas
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors, GlobalStyles, Spacing } from '../../constants/theme';
import { auth, db } from '../../firebaseConfig'; // importando db do firebaseConfig

// definindo model do som
interface Sound {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string; // URL da capa
  streamUrl: string;  // URL do .mp3
}

// importando funções do firestore
import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

export default function LibraryScreen() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [sounds, setSounds] = useState<Sound[]>([]); // ⬅️ Estado para a lista de sons
  const [loading, setLoading] = useState(true);   // ⬅️ Estado de carregamento

  // buscar o nome do usuário
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

  // buscar os sons do Firestore
  useEffect(() => {
    const fetchSounds = async () => {
      setLoading(true);
      try {
        const soundsCollection = collection(db, 'sounds'); // buscando coleção 'sounds'
        const soundsSnapshot = await getDocs(soundsCollection);
        
        const soundsList: Sound[] = soundsSnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
          } as Sound)
        );
        
        setSounds(soundsList); // salvando a lista de sons no estado
        
      } catch (error) {
        console.error("Erro ao buscar sons: ", error);

      } finally {
        setLoading(false);
      }
    };

    fetchSounds();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const handlePlaySound = (sound: Sound) => {

    console.log("Tocar o som:", sound.title);

  };

  // componente responsavel por renderizar cada item da lista
  const renderSoundItem = ({ item }: { item: Sound }) => (
    <TouchableOpacity style={styles.soundItem} onPress={() => handlePlaySound(item)}>
      <Image source={{ uri: item.artworkUrl || 'https://placehold.co/60' }} style={styles.artwork} />
      <View style={styles.soundInfo}>
        <Text style={styles.soundTitle}>{item.title}</Text>
        <Text style={styles.soundArtist}>{item.artist}</Text>
      </View>
      <FontAwesome name="play-circle" size={32} color={Colors.primary} />
    </TouchableOpacity>
  );

  // cabeçalho
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={GlobalStyles.title}>
        Oi, {displayName || 'Usuário'}!
      </Text>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={GlobalStyles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && sounds.length === 0 ? (
       
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={sounds} // dados da lista
          renderItem={renderSoundItem} 
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            // essa linha de baixo só mostra caso nao tenha nenhum item na lista
            <Text style={styles.emptyText}>Nenhum som encontrado na biblioteca.</Text>
          }

          ListFooterComponent={<View style={{ height: 50 }} />} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    paddingHorizontal: 0,
    paddingTop: Spacing.xl,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  logoutButton: {
    ...GlobalStyles.button,
    backgroundColor: Colors.error,
    height: 45,
    width: '50%',
    alignSelf: 'center',
    marginTop: Spacing.m,
  },

  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: Spacing.m,
  },
  soundInfo: {
    flex: 1,
  },
  soundTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  soundArtist: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.textSecondary,
  }
});