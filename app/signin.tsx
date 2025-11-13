import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import {
  ActivityIndicator, Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Colors, GlobalStyles, Spacing } from '../constants/theme';
import { auth } from '../firebaseConfig';


const logo = require('../assets/images/logo.png');

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // função que gerencia o login
  const handleSignIn = async () => {
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      // tentando logar
      console.log("attempting to sign in with email:", email);
      await signInWithEmailAndPassword(auth, email, password);

    } catch (e: any) {
      // trata erros do firebase
      setLoading(false);
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('Email ou senha inválidos.');
      } else {
        setError('Erro ao fazer login: ' + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        
        <ScrollView 
          contentContainerStyle={GlobalStyles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          <Text style={GlobalStyles.title}>Entrar no SoundShow</Text>

          <TextInput
            style={GlobalStyles.input}
            placeholder="Email"
            placeholderTextColor={Colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={GlobalStyles.input}
            placeholder="Senha"
            placeholderTextColor={Colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error && (
            <View style={GlobalStyles.errorContainer}>
              <Text style={GlobalStyles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable 
            style={GlobalStyles.button} 
            onPress={handleSignIn} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={GlobalStyles.buttonText}>Entrar</Text>
            )}
          </Pressable>

          <Link href={{ pathname: '/signup' } as any} style={GlobalStyles.linkContainer} asChild>
            <Pressable>
              <Text style={GlobalStyles.linkText}>Não tem uma conta? Cadastre-se</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  keyboardView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  logo: {
    width: 200, 
    height: 200, 
    alignSelf: 'center', 
    marginBottom: Spacing.xl, 
  },
});