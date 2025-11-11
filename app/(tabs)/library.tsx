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
import { useAudioPlayer } from '../../context/AudioPlayerContext';

export default function LibraryScreen() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { loadSound, currentTrack, isPlaying } = useAudioPlayer();

  useEffect(() => {
    
    const fetchSounds = async () => {
      
      try {

        console.log("Buscando sons do Firestore...");
        const soundsCollection = collection(db, 'sounds');
        console.log("Referência da coleção 'sounds' obtida:", soundsCollection);
        const soundsSnapshot = await getDocs(soundsCollection);
        console.log("Documentos obtidos:", soundsSnapshot.size);
        
        if (soundsSnapshot.empty) {
          console.log("Firestore: Nenhum documento encontrado na coleção 'sounds'");
        }
        
        console.log("Processando documentos...");
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
        console.log("Sons processados:", soundsList.length);
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

  // função que envia o som pro context tocar
  const handlePlaySound = (sound: Sound) => {
   
    console.log("tela da biblioteca está pedindo pro context tocar:", sound.title, sound.streamUrl);
    loadSound(sound);
  
  };

  // renderizando cada item da lista
  const renderSoundItem = ({ item }: { item: Sound }) => {

    const isCurrentTrack = currentTrack?.id === item.id;
    const iconName = isCurrentTrack && isPlaying ? 'pause-circle' : 'play-circle';
    const iconColor = isCurrentTrack ? Colors.primary : Colors.text;

    return (
      <TouchableOpacity style={styles.soundItem} onPress={() => handlePlaySound(item)}>
        <Image source={ {uri: item.artworkUrl} } style={styles.artwork} />
        <View style={styles.soundInfo}>
          <Text style={[styles.soundTitle, isCurrentTrack && { color: Colors.primary}] }>{item.title}</Text>
          <Text style={styles.soundArtist}>{item.artist}</Text>
          {item.genre && (
            <Text style={styles.soundGenre}>{item.genre}</Text>
          )}
        </View>
        <FontAwesome name={iconName} size={32} color={iconColor} />
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={GlobalStyles.title}>
        Bem vindo, {displayName || 'Usuário'}!
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
    paddingBottom: 0,
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