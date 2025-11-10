import { Text, View } from 'react-native';
import { GlobalStyles } from '../../constants/theme';

export default function ExploreScreen() {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Explorar</Text>
      <Text style={{ textAlign: 'center' }}>Em breve...</Text>
    </View>
  );
}