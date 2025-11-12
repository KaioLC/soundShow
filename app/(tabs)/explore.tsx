import { FontAwesome } from '@expo/vector-icons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors, GlobalStyles, Spacing } from '../../constants/theme';
import { auth, db } from '../../firebaseConfig';

import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface Sound {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  streamUrl: string;
  genre: string;
  playCount?: number;
}

export default function ExploreScreen() {
  const [loading, setLoading] = useState(true);
  
  // estados pra busca
  const [searchQuery, setSearchQuery] = useState('');
  const [allSounds, setAllSounds] = useState<Sound[]>([]);
  const [filteredSounds, setFilteredSounds] = useState<Sound[]>([]);
  
  const { loadSound, currentTrack, isPlaying } = useAudioPlayer();

 
  useEffect(() => {
    
    // buscando todas as músicas
    const fetchAllSounds = async () => {
      setLoading(true);
      try {
        console.log("Explorar: Buscando TODAS as músicas...");
        const soundsCollection = collection(db, 'sounds');
        
        
        const soundsSnapshot = await getDocs(soundsCollection);
        
        if (soundsSnapshot.empty) {
          console.log("Firestore: Nenhum documento encontrado.");
        }
        
        const soundsList: Sound[] = soundsSnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
          } as Sound)
        );
        
        setAllSounds(soundsList);      // salva todas as musicas na lista
        setFilteredSounds(soundsList); // salva todas as musicas filtradas
        
      } catch (error) {
        console.error("Erro ao buscar sons: ", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        fetchAllSounds(); // so funciona se tiver autenticacao
      } else {
        setAllSounds([]);
        setFilteredSounds([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
    
  }, []); 


  useEffect(() => {
    if (searchQuery === '') {
      // se a busca estiver vazia, mostra todas as músicas
      setFilteredSounds(allSounds);
    } else {
      // filtra as músicas conforme a busca
      const queryLower = searchQuery.toLowerCase();
      
      const filtered = allSounds.filter(sound => 
        sound.title.toLowerCase().includes(queryLower) ||
        sound.artist.toLowerCase().includes(queryLower) ||
        sound.genre.toLowerCase().includes(queryLower)
      );
      
      setFilteredSounds(filtered); // mostra apenas as filtradas
    }
  }, [searchQuery, allSounds]); // dependencias do estado
  
  
  const handlePlaySound = (sound: Sound) => {
    console.log("Explorar: Pedindo para o Context tocar:", sound.title);
    loadSound(sound); 
  };


  const renderSoundItem = ({ item }: { item: Sound }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    const iconName = isCurrentTrack && isPlaying ? 'pause-circle' : 'play-circle';
    const iconColor = isCurrentTrack ? Colors.primary : Colors.text;

    return (
      <TouchableOpacity style={styles.soundItem} onPress={() => handlePlaySound(item)}>
        <Image source={{ uri: item.artworkUrl || 'https://placehold.co/60' }} style={styles.artwork} />
        <View style={styles.soundInfo}>
          <Text style={[styles.soundTitle, isCurrentTrack && { color: Colors.primary }]}>
            {item.title}
          </Text>
          <Text style={styles.soundArtist}>{item.artist}</Text>
          {item.genre && (
             <Text style={styles.soundGenre}>{item.genre}</Text>
          )}
        </View>
        <FontAwesome name={iconName} size={32} color={iconColor} />
      </TouchableOpacity>
    );
  };

  // cabeçalho
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={GlobalStyles.title}>Explorar</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <FontAwesome name="search" size={16} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar por música, artista ou género..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredSounds}
          renderItem={renderSoundItem}
          keyExtractor={(item) => item.id}
          
          ListHeaderComponent={ListHeader}
          
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum som encontrado.</Text>
          }
          ListFooterComponent={<View style={{ height: 80 }} />}
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
  
  searchContainer: {
    paddingHorizontal: Spacing.l,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.s,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  searchBar: {
    flex: 1,
    height: 45,
    fontSize: 15,
    color: Colors.text,
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