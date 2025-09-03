import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function Banco() {
  const [status, setStatus] = useState('Pronto para criar/conectar ao banco...');

  const criarBanco = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('funcionarios.db');
      await db.execAsync('PRAGMA user_version;');
      setStatus('✅ Banco conectado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar banco:', error);
      setStatus('❌ Falha ao conectar/criar banco.');
      Alert.alert('Erro', 'Não foi possível criar ou conectar ao banco.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Banco de Dados</Text>
      <Button title="Criar / Conectar Banco" onPress={criarBanco} />
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  status: { marginTop:20, fontSize:16, color:'green', textAlign:'center' },
});
