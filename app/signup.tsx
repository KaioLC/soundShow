import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { GlobalStyles } from '../constants/theme';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // função que gerencia o cadastro
  const handleSignUp = async () => {
    setError('');
    
    // validando os campos
    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    // validando tamanho da senha
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    // validando confirmacao da senha
    if (password !== confirmPassword) {
      setError('As senhas não são iguais.');
      return;
    }

    // start loading
    setLoading(true);

    try {
      // tentando criar usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // adicionando nome de usuario
      await updateProfile(userCredential.user, {
        displayName: username
      });

    } catch (e: any) {

      // tratando erros do firebase
      if (e.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso.');
      } else if (e.code === 'auth/weak-password') {
        setError('A senha é muito fraca.');
      } else if (e.code === 'auth/invalid-email') {
        setError('O email digitado é inválido.');
      } else {
        setError('Erro ao criar conta: ' + e.message);
      }

    } finally {
        // parando o loading
      setLoading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Criar Conta</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Nome de Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Senha (mín. 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error ? <Text style={GlobalStyles.errorText}>{error}</Text> : null}

      {loading ? (

        <Pressable style={GlobalStyles.button} disabled>
          <ActivityIndicator color="#fff" />
        </Pressable>
      ) : (
        <Pressable style={GlobalStyles.button} onPress={handleSignUp}>
          <Text style={GlobalStyles.buttonText}>Cadastrar</Text>
        </Pressable>
      )}

      <Link href={{ pathname: '/signin' } as any} asChild>
        <Pressable>
          <Text style={GlobalStyles.link}>Já tem uma conta? Faça login</Text>
        </Pressable>
      </Link>
    </View>
  );
}

