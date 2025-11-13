import { Link } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from 'react';
import {
  ActivityIndicator, Image,
  Keyboard,
  KeyboardAvoidingView, Platform,
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

          <Text style={GlobalStyles.title}>Crie sua conta no SoundShow</Text>

          <TextInput
            style={GlobalStyles.input}
            placeholder="Nome de Usuário"
            placeholderTextColor={Colors.textSecondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
          />

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
            placeholder="Senha (mín. 6 caracteres)"
            placeholderTextColor={Colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={GlobalStyles.input}
            placeholder="Confirmar Senha"
            placeholderTextColor={Colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {error && (
            <View style={GlobalStyles.errorContainer}>
              <Text style={GlobalStyles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable 
            style={GlobalStyles.button} 
            onPress={handleSignUp} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={GlobalStyles.buttonText}>Cadastrar</Text>
            )}
          </Pressable>

          <Link href={{ pathname: '/signin' } as any} style={GlobalStyles.linkContainer} asChild>
            <Pressable>
              <Text style={GlobalStyles.linkText}>Já tem uma conta? Faça login</Text>
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