// Importa o React e o hook de estado
import React, { useState } from 'react';

// Importa componentes básicos da UI
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert
} from 'react-native';

// Importa o módulo SQLite do Expo
import * as SQLite from 'expo-sqlite';

// Componente principal
export default function Banco() {
  // Estado para mostrar mensagens de status ao usuário
  const [status, setStatus] = useState('Pronto para criar/conectar ao banco...');

  // Função para criar ou conectar ao banco
  const criarBanco = async () => {
    try {
      // Tenta abrir (ou criar) o banco chamado 'funcionarios.db'
      const db = await SQLite.openDatabaseAsync('funcionarios.db');

      // Executa um comando simples apenas para garantir que o banco está acessível
      await db.execAsync('PRAGMA user_version;');

      // Atualiza o status com sucesso
      setStatus('✅ Banco conectado com sucesso!');
    } catch (error) {
      // Se houver erro, mostra no console e alerta o usuário
      console.error('Erro ao criar banco:', error);
      setStatus('❌ Falha ao conectar/criar banco.');
      Alert.alert('Erro', 'Não foi possível criar ou conectar ao banco.');
    }
  };

  // JSX: Interface do componente
  return (
    <View style={styles.container}>
      {/* Título da tela */}
      <Text style={styles.title}>Banco de Dados</Text>

      {/* Botão para acionar a função de criação/conexão do banco */}
      <Button title="Criar / Conectar Banco" onPress={criarBanco} />

      {/* Exibição do status atual (sucesso ou erro) */}
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

// 🎨 Estilos visuais
const styles = StyleSheet.create({
  container: {
    flex: 1,                          // Ocupa a tela toda
    justifyContent: 'center',        // Centraliza verticalmente
    alignItems: 'center',            // Centraliza horizontalmente
    padding: 20,
    backgroundColor: 'lightblue',    // Cor de fundo
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,                // Espaço abaixo do título
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',                  // Cor da mensagem
    textAlign: 'center',
  },
});
