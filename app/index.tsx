import { View, ActivityIndicator } from 'react-native';
import { GlobalStyles } from '../constants/theme';

export default function Index() {

  const loadingColor = GlobalStyles.button ? GlobalStyles.button.backgroundColor : '#007BFF';

  return (
    <View style={GlobalStyles.container}>
      <ActivityIndicator size="large" color={loadingColor} />
    </View>
  );
}

