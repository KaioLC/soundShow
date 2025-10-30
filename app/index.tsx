import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Certifique-se que o caminho está correto
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged é o "ouvinte" que diz se o usuário logou ou deslogou
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está logado! Mandando para a tela principal
        router.replace({ pathname: '/(tabs)/library' } as any); // usando as any pq o typescript é chato ("reclama" do caminho do arquivo)
      } else {
        // Usuário não está logado! Mandando para a tela de login
        router.replace({ pathname: '/signin' } as any); 
      }
    });

    // limpando o ouvinte quando o componente desmonsta
    return () => unsubscribe(); 
  }, [router]);
  
  // mostrando a tela de carregamento enquanto verifica autenticação
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

