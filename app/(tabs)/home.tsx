import { FontAwesome } from '@expo/vector-icons';
import { onAuthStateChanged, User } from 'firebase/auth';
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
import { auth, db } from '../../firebaseConfig';

import { Sound } from '../../constants/types'; // importando a interface de som

// importando funções do firestore
import { collection, DocumentData, getDocs, limit, orderBy, query, QueryDocumentSnapshot } from 'firebase/firestore';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

export default function LibraryScreen() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);


  const { loadSound, currentTrack, isPlaying, setModalTrack } = useAudioPlayer();

  useEffect(() => {
    
    const fetchSounds = async () => {
      
      try {

        console.log("Buscando top 5 sons do Firestore...");
        const soundsCollection = collection(db, 'sounds');
        console.log("Referência da coleção 'sounds' obtida:", soundsCollection);

        // query para obter os 5 sons mais tocados (decrescente)
        const top5Query = query(
          soundsCollection, 
          orderBy('playCount', 'desc'), 
          limit(5)
        );
        const soundsSnapshot = await getDocs(top5Query);
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

 
  // função que envia o som pro context tocar
  const handlePlaySound = (sound: Sound) => {
   
    console.log("tela da biblioteca está pedindo pro context tocar:", sound.title, sound.streamUrl);
    loadSound(sound);
  
  };

  // funcao pra renderizar o modal
  const handleOpenModal = (track: Sound) => {
    setModalTrack(track);
  }

  // renderizando cada item da lista
  const renderSoundItem = ({ item }: { item: Sound }) => {

    const isCurrentTrack = currentTrack?.id === item.id;
    const iconName = isCurrentTrack && isPlaying ? 'pause-circle' : 'play-circle';
    const iconColor = isCurrentTrack ? Colors.primary : Colors.text;

    return (

      <View style={styles.soundItemContainer}>
        {/* Item clicável (para tocar) */}
        <TouchableOpacity style={styles.soundItem} onPress={() => handlePlaySound(item)}>
          <Image source={{ uri: item.artworkUrl || 'https://placehold.co/60' }} style={styles.artwork} />
          <View style={styles.soundInfo}>
            <Text style={[styles.soundTitle, isCurrentTrack && { color: Colors.primary }]}>
              {item.title}
            </Text>
            <Text style={styles.soundArtist}>{item.artist}</Text>
            
            <Text style={styles.playCount}>
              <FontAwesome name="play" size={12} color={Colors.textSecondary} />
              {/* Se playCount não existir, mostra 0 */}
              {` ${item.playCount || 0} plays`} 
            </Text>
            
          </View>
          <FontAwesome name={iconName} size={32} color={iconColor} />
        </TouchableOpacity>

        {/* 4. BOTÃO "+" PARA ADICIONAR À PLAYLIST */}
        <TouchableOpacity 
          style={styles.plusButton} 
          onPress={() => handleOpenModal(item)} // ⬅️ Chama a nova função
        >
          <FontAwesome name="plus" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={GlobalStyles.title}>Top 5 Músicas</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View>
          <ListHeader /> 
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
        </View>
      ) : (
        <FlatList
          data={sounds}
          renderItem={renderSoundItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma música encontrada.</Text>
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
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    flex: 1, // ⬅️ ESTE É O VILÃO
  },
  plusButton: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
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
  playCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
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