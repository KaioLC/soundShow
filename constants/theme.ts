import { StyleSheet, Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

const colors = Colors.light;

export const Spacing = {
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const FontSizes = {
  title: 32,
  input: 16,
  button: 18,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});


export const GlobalStyles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.l,
    backgroundColor: colors.background,
  },
  
  title: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    marginBottom: Spacing.xl,
    textAlign: 'center',
    color: colors.text,
  },
 
  input: {
    height: 50,
    backgroundColor: colors.background,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: Spacing.s,
    marginBottom: Spacing.m,
    paddingHorizontal: 15,
    fontSize: FontSizes.input,
    color: colors.text,
  },
  
  button: {
    height: 50,
    backgroundColor: colors.tint,
    borderRadius: Spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  buttonText: {
    color: colors.background,
    fontSize: FontSizes.button,
    fontWeight: 'bold',
  },

  link: {
    color: colors.tint,
    textAlign: 'center',
    marginTop: Spacing.m,
    fontSize: 16,
  },

  errorText: {
    color: '#D8000C',
    backgroundColor: '#FFD2D2',
    borderRadius: Spacing.s,
    padding: Spacing.m,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
});

