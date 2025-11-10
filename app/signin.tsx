import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native';
import { Colors, GlobalStyles } from '../constants/theme';
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
    <View style={GlobalStyles.container}>

      <Image source={logo} style={GlobalStyles.logo} resizeMode="contain" />

      <Text style={GlobalStyles.title}>Login</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Email"
        placeholderTextColor={Colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={GlobalStyles.buttonText}>Entrar</Text>
        )}
      </Pressable>

      <Link href={{ pathname: '/signup' } as any} style={GlobalStyles.linkContainer} asChild>
        <Pressable>
          <Text style={GlobalStyles.linkText}>Não tem uma conta? Cadastre-se</Text>
        </Pressable>
      </Link>
    </View>
  );
}

