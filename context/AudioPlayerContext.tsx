import { Audio, AVPlaybackStatus } from 'expo-av';
import { doc, increment, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebaseConfig';


// definindo interface do som
interface Sound {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  streamUrl: string;
  genre: string;
  playCount?: number;
}

// o que o contexto vai fornecer
interface AudioPlayerContextData {
  soundObject: Audio.Sound | null;
  currentTrack: Sound | null;
  isPlaying: boolean;
  playbackStatus: AVPlaybackStatus | null;
  loadSound: (track: Sound) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekPlayback: (position: number) => Promise<void>;

  currentVolume: number;
  setVolume: (value: number) => Promise<void>;

  unloadSound: () => Promise<void>;
}

// criando o contexto
const AudioPlayerContext = createContext<AudioPlayerContextData | undefined>(undefined);

// o componente que vai prover o contexto
export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(null);

  const [currentVolume, setCurrentVolume] = useState(1.0); // volume entre 0.0 e 1.0

  // função que atualiza o progresso da musica
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setPlaybackStatus(status);
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        // acabou a musica, limpa o som
        unloadSound();
      }
    }
  };

  // função para descarregar o som atual
  const unloadSound = async () => {
    if (soundObject) {
      console.log("Descarregando som anterior...");
      await soundObject.unloadAsync();
      setSoundObject(null);
      setCurrentTrack(null);
      setIsPlaying(false);
      setPlaybackStatus(null);
    }
  };

  // função para carregar um som novo
  const loadSound = async (track: Sound) => {
    console.log("Context: Tocar o som:", track.title);
    
    // para o som antigo antes de carregar o novo
    await unloadSound();

    try {

      const soundRef = doc(db, 'sounds', track.id);

      await updateDoc(soundRef, {
        playCount: increment(1)
      });

      console.log("Play count atualizado no Firestore para a música:", track.title);

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      console.log("Context: Carregando novo som...");
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.streamUrl },
        { shouldPlay: true, volume: currentVolume }, // toca assim que carregar e com o volume predefinido
        onPlaybackStatusUpdate // define o callback de status
      );
      
      setSoundObject(sound);
      setCurrentTrack(track);
      setIsPlaying(true);
      console.log("Context: Tocando!");

    } catch (error) {
      console.error("Context: Erro ao carregar o som: ", error);
    }
  };

  // função para tocar/pausar
  const togglePlayPause = async () => {
    if (!soundObject) return;

    if (isPlaying) {
      console.log("Context: Pausando...");
      await soundObject.pauseAsync();
    } else {
      console.log("Context: Tocando (resume)...");
      await soundObject.playAsync();
    }
    setIsPlaying(!isPlaying); // inverte o estado
  };
  
  // função que controla o slider de progresso
  const seekPlayback = async (position: number) => {
    if (soundObject) {
      await soundObject.setPositionAsync(position);
    }
  };

  // funcao pra ajustar o volume
  const setVolume = async (value: number) => {
    if (soundObject) {
    await soundObject.setVolumeAsync(value);
    setCurrentVolume(value);
    }
  };
  // garante que o som é descarregado quando o componente é desmontado
  useEffect(() => {
    return () => {
      unloadSound();
    };
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        soundObject,
        currentTrack,
        isPlaying,
        playbackStatus,
        loadSound,
        togglePlayPause,
        seekPlayback,
        currentVolume,
        setVolume,
        unloadSound,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

// o hook que vai ser usado nas telas
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer deve ser usado dentro de um AudioPlayerProvider');
  }
  return context;
};