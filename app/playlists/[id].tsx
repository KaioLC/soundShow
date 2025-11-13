import { FontAwesome } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router'; // lê o id da url
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors, GlobalStyles, Spacing } from '../../constants/theme';
import { Playlist, Sound } from '../../constants/types';
import { auth, db } from '../../firebaseConfig';

import {
    collection,
    doc,
    DocumentData,
    documentId,
    getDoc,
    getDocs,
    query,
    QueryDocumentSnapshot,
    where
} from 'firebase/firestore';

import { useAudioPlayer } from '../../context/AudioPlayerContext';

export default function PlaylistDetailScreen() {
  const { id: playlistId } = useLocalSearchParams<{ id: string }>(); // pegando id da url
  
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { loadSound, currentTrack, isPlaying, setModalTrack } = useAudioPlayer();

  // buscando dados da playlist
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !playlistId) {
      setLoading(false);
      return;
    }

    const fetchPlaylistData = async () => {
      setLoading(true);
      try {
        // detalhes da playlist
        console.log(`Buscando playlist com ID: ${playlistId}`);
        const playlistDocRef = doc(db, 'users', user.uid, 'playlists', playlistId);
        const playlistSnapshot = await getDoc(playlistDocRef);

        if (!playlistSnapshot.exists()) {
          console.error("Playlist não encontrada!");
          setLoading(false);
          return;
        }

        const playlistData = { id: playlistSnapshot.id, ...playlistSnapshot.data() } as Playlist;
        setPlaylist(playlistData);

        // as musicas contidas na playlist
        const songIds = playlistData.songIds;
        
        // caso nao tenha musicas
        if (!songIds || songIds.length === 0) {
          console.log("Playlist está vazia.");
          setSongs([]); // Define como vazio e termina
          setLoading(false);
          return;
        }

        console.log("Buscando músicas com IDs:", songIds);
        
        // query para pegar todas as musicas com os ids na songIds
        const songsQuery = query(
          collection(db, 'sounds'),
          where(documentId(), 'in', songIds)
        );

        const songsSnapshot = await getDocs(songsQuery);
        
        const songsList: Sound[] = songsSnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
          } as Sound)
        );

        setSongs(songsList);

      } catch (error) {
        console.error("Erro ao buscar dados da playlist: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistData();
    
  }, [playlistId]); // roda sempre que o id da playlist mudar
  
  
  const handlePlaySound = (sound: Sound) => {
    loadSound(sound); 
  };

  const handleOpenModal = (track: Sound) => {
    setModalTrack(track); // O modal "+" funciona aqui também!
  };

  
  const renderSoundItem = ({ item }: { item: Sound }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    const iconName = isCurrentTrack && isPlaying ? 'pause-circle' : 'play-circle';
    const iconColor = isCurrentTrack ? Colors.primary : Colors.text;

    return (
      <View style={styles.soundItemContainer}>
        <Image source={{ uri: item.artworkUrl || 'https://placehold.co/60' }} style={styles.artwork} />
        <TouchableOpacity style={styles.soundInfo} onPress={() => handlePlaySound(item)}>
          <Text style={[styles.soundTitle, isCurrentTrack && { color: Colors.primary }]}>
            {item.title}
          </Text>
          <Text style={styles.soundArtist}>{item.artist}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.plusButton} onPress={() => handleOpenModal(item)}>
          <FontAwesome name="plus" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={() => handlePlaySound(item)}>
          <FontAwesome name={iconName} size={32} color={iconColor} />
        </TouchableOpacity>
      </View>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Stack.Screen options={{ title: playlist?.name || 'Playlist' }} />
      <Text style={GlobalStyles.title}>{playlist?.name || 'Carregando...'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={songs}
          renderItem={renderSoundItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Esta playlist está vazia.</Text>
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
  soundItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  soundInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.m,
    marginRight: Spacing.s,
  },
  plusButton: {
    padding: Spacing.m,
  },
  playButton: {
    padding: Spacing.m,
    paddingRight: Spacing.l,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: Spacing.m,
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