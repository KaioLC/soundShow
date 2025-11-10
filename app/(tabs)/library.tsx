import { FontAwesome } from '@expo/vector-icons';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors, GlobalStyles, Spacing } from '../../constants/theme';
import { auth, db } from '../../firebaseConfig';


// model do som
interface Sound {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string; // URL da capa
  streamUrl: string;  // URL do .mp3
  genre: string;
}

// importando funções do firestore
import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

export default function LibraryScreen() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    
    const fetchSounds = async () => {
      
      try {
        console.log("Buscando sons do Firestore...");
        const soundsCollection = collection(db, 'sounds');
        const soundsSnapshot = await getDocs(soundsCollection);
        
        if (soundsSnapshot.empty) {
          console.log("Firestore: Nenhum documento encontrado na coleção 'sounds'");
        }
        
        const soundsList: Sound[] = soundsSnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            console.log("Música encontrada:", data.title);
            return {
              id: doc.id,
              ...data,
            } as Sound;
          }
        );
        
        setSounds(soundsList);
        
      } catch (error) {
        console.error("Erro ao buscar sons: ", error);
      } finally {
        setLoading(false);
      }
    };

    // autenticando login
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // usuario logado
        console.log("Usuário logado:", user.email); // DEBUG
        setDisplayName(user.displayName || user.email);
        
        // buscando sons depois do usuario estar logado
        fetchSounds(); 
        
      } else {
        // usuario deslogado
        console.log("Usuário deslogado.");
        setDisplayName(null);
        setSounds([]); // limpa a lista de sons
        setLoading(false); 
      }
    });

    return () => unsubscribe();
    
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const handlePlaySound = (sound: Sound) => {
   
    console.log("Tocar o som:", sound.title, sound.streamUrl);

  };

  // renderizando cada item da lista
  const renderSoundItem = ({ item }: { item: Sound }) => (
    <TouchableOpacity style={styles.soundItem} onPress={() => handlePlaySound(item)}>
      <Image source={{ uri: item.artworkUrl || 'https://placehold.co/60' }} style={styles.artwork} />
      <View style={styles.soundInfo}>
        <Text style={styles.soundTitle}>{item.title}</Text>
        <Text style={styles.soundArtist}>{item.artist}</Text>

        {item.genre && (
           <Text style={styles.soundGenre}>{item.genre}</Text>
        )}
      </View>
      <FontAwesome name="play-circle" size={32} color={Colors.primary} />
    </TouchableOpacity>
  );

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
    
      {loading ? (
        <View>
          {displayName && <ListHeader />} 
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
        </View>
      ) : (
        <FlatList
          data={sounds}
          renderItem={renderSoundItem}
          keyExtractor={(item) => item.id} 
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
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

  soundGenre: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.textSecondary,
  }
});