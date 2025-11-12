import { StyleSheet, Text, View } from 'react-native';
import { Colors, GlobalStyles } from '../../constants/theme';

export default function PlaylistsScreen() {
  return (
    <View style={[GlobalStyles.container, styles.container]}>
      <Text style={GlobalStyles.title}>Minhas Playlists</Text>
      <Text style={styles.subtitle}>Em breve...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', // Centraliza o conteúdo
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.textSecondary,
  }
});