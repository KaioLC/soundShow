import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#E53935',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  
  text: '#212121',
  textSecondary: '#616161',

  border: '#D3D3D3',
  error: '#E53935',
  errorBackground: 'rgba(229, 57, 53, 0.1)',

  white: '#FFFFFF',
  black: '#000000',
};

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

export const GlobalStyles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.l,
    backgroundColor: Colors.background,
  },

  title: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },

  input: {
    height: 55,
    backgroundColor: Colors.surface,
    color: Colors.text,
    paddingHorizontal: Spacing.m,
    borderRadius: Spacing.s,
    marginBottom: Spacing.m,
    fontSize: FontSizes.input,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  button: {
    height: 55,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginVertical: Spacing.s,
  },

  buttonText: {
    fontSize: FontSizes.button,
    fontWeight: 'bold',
    color: Colors.white,
  },

  linkContainer: {
    marginVertical: Spacing.m,
  },
  linkText: {
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },

  errorContainer: {
    backgroundColor: Colors.errorBackground,
    padding: Spacing.m,
    borderRadius: Spacing.s,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  logo: {
    width: 500,
    height: 300,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
});

