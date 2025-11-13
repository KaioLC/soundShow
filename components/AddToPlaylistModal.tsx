import { FontAwesome } from '@expo/vector-icons';
import {
    arrayUnion,
    collection,
    doc,
    DocumentData,
    onSnapshot,
    QueryDocumentSnapshot,
    updateDoc
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors, GlobalStyles, Spacing } from '../constants/theme';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { auth, db } from '../firebaseConfig';

import { Playlist } from '../constants/types'; // importando a interface de playlist


export default function AddToPlaylistModal() {
  const { modalTrack, setModalTrack } = useAudioPlayer();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !modalTrack) {
      setPlaylists([]);
      return;
    }

    setLoading(true);

    const playlistsCollection = collection(db, 'users', user.uid, 'playlists');
    
    const unsubscribe = onSnapshot(playlistsCollection, (snapshot) => {
      const playlistsList: Playlist[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        } as Playlist)
      );
      setPlaylists(playlistsList);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao ouvir playlists no modal: ", error);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [modalTrack]); // recarrega as playlists quando uma nova musica é selecionada

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!modalTrack) return;

    // verifica se a musica ja existe na playlist
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && playlist.songIds.includes(modalTrack.id)) {
      alert(`"${modalTrack.title}" já está na playlist "${playlist.name}"!`);
      setModalTrack(null);
      return;
    }

    try {
        // pega o id do user logado
      const user = auth.currentUser;
      if (!user) {
        alert("Erro: Você não está logado.");
        return;
      }

   
      const playlistDocRef = doc(db, 'users', user.uid, 'playlists', playlistId);

      // atualiza o documento usando arrayUnion
      await updateDoc(playlistDocRef, {
        songIds: arrayUnion(modalTrack.id) // adiciona o id da musica
      });

      alert(`Adicionado a "${playlist?.name}"!`);

    } catch (error) {
      console.error("Erro ao adicionar música à playlist: ", error);
      alert("Erro ao adicionar música.");
    } finally {
      setModalTrack(null);
    }
  };


  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity style={styles.playlistItem} onPress={() => handleAddToPlaylist(item.id)}>
      <FontAwesome name="music" size={24} color={Colors.primary} />
      <Text style={styles.playlistName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={!!modalTrack}
      onRequestClose={() => setModalTrack(null)}
    >
      <Pressable style={styles.backdrop} onPress={() => setModalTrack(null)}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Adicionar à Playlist</Text>
          <Text style={styles.songTitle}>"{modalTrack?.title}"</Text>

          {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginVertical: Spacing.l }} />
          ) : (
            <FlatList
              data={playlists}
              renderItem={renderPlaylistItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Você ainda não criou nenhuma playlist. (Vá à aba "Playlists")</Text>
              }
            />
          )}

          <Pressable style={styles.closeButton} onPress={() => setModalTrack(null)}>
            <Text style={GlobalStyles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: Spacing.m,
    padding: Spacing.l,
    width: '100%',
    maxHeight: '70%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  songTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  playlistName: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: Spacing.m,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: Spacing.l,
    color: Colors.textSecondary,
    fontSize: 15,
  },
  closeButton: {
    ...GlobalStyles.button,
    backgroundColor: Colors.textSecondary,
    marginTop: Spacing.l,
  },
});