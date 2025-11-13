import { FontAwesome } from '@expo/vector-icons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors, GlobalStyles, Spacing } from '../../constants/theme';
import { auth, db } from '../../firebaseConfig';

import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';

import { Playlist } from '../../constants/types'; // importando playlist interface

import { useRouter } from 'expo-router';


export default function PlaylistsScreen() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    
    // coletando a autenticacao
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // usuario ta logado
        setUserId(user.uid); // salva o id do user
        setLoading(false);
      } else {
        // usuario nao esta logado
        setUserId(null);
        setPlaylists([]); // limpa as playlists
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
    
  }, []);

  
  useEffect(() => {
    // sem o id do user nada funciona
    if (!userId) {
      setPlaylists([]);
      return;
    }

    // criando referencia pra subcolecao (colecao users)
    const playlistsCollection = collection(db, 'users', userId, 'playlists');
    
    // usa-se snapshot ao inves de docs para pegar em tempo real
    const unsubscribePlaylists = onSnapshot(playlistsCollection, (snapshot) => {
      const playlistsList: Playlist[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        } as Playlist)
      );
      setPlaylists(playlistsList);
      console.log("Playlists carregadas:", playlistsList.length);
    }, (error) => {
      console.error("Erro ao ouvir playlists: ", error);
    });

    // limpa o ouvinte quando o componente desmonta ou userId muda
    return () => unsubscribePlaylists();

  }, [userId]);

  // cria uma nova playlist
  const handleCreatePlaylist = async () => {
    if (!userId || !newPlaylistName.trim()) {
      alert("Por favor, dê um nome à sua playlist.");
      return;
    }

    setIsCreating(true);
    try {
      // criando referencia pra subcolecao (colecao users)
      const playlistsCollection = collection(db, 'users', userId, 'playlists');
      
      // adicionando documento (playlist) na sub-coleção do firestore
      await addDoc(playlistsCollection, {
        name: newPlaylistName.trim(),
        createdAt: Timestamp.now(), // guarda a data de criacao da playlist
        songIds: [] // inicializa o array de músicas vazio
      });

      console.log("Playlist criada!", newPlaylistName);
      setNewPlaylistName(""); // Limpa o input

    } catch (error) {
      console.error("Erro ao criar playlist: ", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handlePlaylistPress = (playlist: Playlist) => {
    
    console.log("Abrir playlist:", playlist.name, "com", playlist.songIds.length, "músicas");
    router.push(`/playlists/${playlist.id}` as any);

    // alert(`Abrir playlist: ${playlist.name}`);
  };

  // renderizacao de cada item da playlist
  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity style={styles.soundItem} onPress={() => handlePlaylistPress(item)}>
      <View style={styles.artwork}>

        <FontAwesome name="music" size={30} color={Colors.primary} />
      </View>
      <View style={styles.soundInfo}>
        <Text style={styles.soundTitle}>{item.name}</Text>
        <Text style={styles.soundArtist}>{item.songIds.length} músicas</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

 

  return (
    <View style={styles.container}>

       <View style={styles.headerContainer}>
      <Text style={GlobalStyles.title}>Minhas Playlists</Text>
      
    </View>
      <View style={styles.createContainer}>
        <TextInput
          style={[GlobalStyles.input, styles.input]}
          placeholder="Nome da nova playlist..."
          placeholderTextColor={Colors.textSecondary}
          value={newPlaylistName}
          onChangeText={setNewPlaylistName}
        />
        <Pressable 
          style={[GlobalStyles.button, styles.button]} 
          onPress={handleCreatePlaylist}
          disabled={isCreating}
        >
          {isCreating ? 
            <ActivityIndicator color={Colors.white} /> :
            <Text style={GlobalStyles.buttonText}>Criar</Text>
          }
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          
          ListEmptyComponent={
            
            <Text style={styles.emptyText}>Você ainda não criou nenhuma playlist.</Text>
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
  createContainer: {
    marginBottom: Spacing.l,
  },
  input: {
    marginBottom: Spacing.s,
  },
  button: {
    height: 45,
    marginVertical: 0,
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
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
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