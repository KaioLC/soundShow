import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { auth } from '../firebaseConfig'; // Verifique o caminho
import { signInWithEmailAndPassword } from "firebase/auth";
import { GlobalStyles } from '../constants/theme'; // Importa estilos globais

/**
 * Tela de Login (Signin)
 */
export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função de Login
  const handleSignIn = async () => {
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      // Tenta fazer o login com o email e senha
      await signInWithEmailAndPassword(auth, email, password);
      
      // O "porteiro" (index.tsx) vai detectar o login e redirecionar
      // não precisamos fazer nada aqui.

    } catch (e: any) {
      // Trata erros do Firebase
      setLoading(false);
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('Email ou senha inválidos.');
      } else {
        setError('Erro ao fazer login: ' + e.message);
      }
    } finally {
      // (A CORREÇÃO!) Para o loading, não importa se deu certo ou errado.
      setLoading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Login</Text>

      {/* Input de Email */}
      <TextInput
        style={GlobalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Input de Senha */}
      <TextInput
        style={GlobalStyles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Mostra erros, se houver */}
      {error ? <Text style={GlobalStyles.errorText}>{error}</Text> : null}

      {/* Botão de Login (com loading) */}
      {loading ? (
        // Mostra o ActivityIndicator DENTRO do botão
        <Pressable style={GlobalStyles.button} disabled>
          <ActivityIndicator color="#fff" />
        </Pressable>
      ) : (
        <Pressable style={GlobalStyles.button} onPress={handleSignIn}>
          <Text style={GlobalStyles.buttonText}>Entrar</Text>
        </Pressable>
      )}

      {/* Link para ir ao Cadastro */}
      <Link href={{ pathname: '/signup' } as any} asChild>
        <Pressable>
          <Text style={GlobalStyles.link}>Não tem uma conta? Cadastre-se</Text>
        </Pressable>
      </Link>
    </View>
  );
}

