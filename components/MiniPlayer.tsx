import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useAudioPlayer } from '../context/AudioPlayerContext';

// função pra formatar milissegundos em mm:ss
function formatMillis(millis: number) {

    if(!millis) return '0:00';

  const totalSeconds = millis / 1000;
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function MiniPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    playbackStatus,
    seekPlayback,
    currentVolume,
    setVolume,
  } = useAudioPlayer();

  // sem musica, nao exibe nada
  if (!currentTrack || !playbackStatus || !playbackStatus.isLoaded) {
    return null;
  }

  const { durationMillis, positionMillis } = playbackStatus;

  return (
    <View style={styles.container}>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={durationMillis || 1}
        value={positionMillis || 0}
        onSlidingComplete={seekPlayback} // função que avança a musica
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.border}
        thumbTintColor={Colors.primary}
      />
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatMillis(positionMillis)}</Text>
        <Text style={styles.timeText}>{formatMillis(durationMillis as any)}</Text>
      </View>

      <View style={styles.content}>
        <Image 
          source={{ uri: currentTrack.artworkUrl || 'https://placehold.co/60' }} 
          style={styles.artwork} 
        />

        <View style={styles.info}>
          <Text style={styles.title}>{currentTrack.title}</Text>
          <Text style={styles.artist}>{currentTrack.artist}</Text>
        </View>

        <View style={styles.volumeContainer}>
            <FontAwesome name="volume-down" size={16} color={Colors.textSecondary} />
            <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                value={currentVolume}
                onSlidingComplete={setVolume} // chama a funcao lá do context
                minimumTrackTintColor={Colors.text}
                maximumTrackTintColor={Colors.border}
                thumbTintColor={Colors.text}
            />
            <FontAwesome name="volume-up" size={16} color={Colors.textSecondary} />
        </View>

        <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
          <FontAwesome 
            name={isPlaying ? 'pause' : 'play'} 
            size={24} 
            color={Colors.text} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 2,
  },
  slider: {
    width: '100%',
    height: 20,
    position: 'absolute',
    top: -10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s,
    marginTop: -2,
 },
  timeText: {
    color: Colors.textSecondary,
    fontSize: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    height: 70,
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: Spacing.m,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  artist: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    marginHorizontal: Spacing.s,
  },
  volumeSlider: {
    flex: 1,
    height: 20,
  },
  playButton: {
    padding: Spacing.s,
    marginLeft: Spacing.m,
  },
});