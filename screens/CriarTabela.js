import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;
const openDb = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('funcionarios.db');
  return db;
};

export default function CriarTabela() {
  const [mensagem, setMensagem] = useState('Aguardando ação...');

  const criarTabela = async () => {
    try {
      const database = await openDb();
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS funcionarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          salario REAL NOT NULL,
          cargo TEXT NOT NULL
        );
      `);
      setMensagem('✅ Tabela criada com sucesso!');
      Alert.alert('Sucesso', 'Tabela "funcionarios" pronta para usar.');
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
      setMensagem('❌ Falha ao criar tabela.');
      Alert.alert('Erro', 'Não foi possível criar a tabela.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Tabela</Text>
      <Button title="Criar Tabela Funcionários" onPress={criarTabela} />
      <Text style={styles.status}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20 },
  status: { marginTop:20, fontSize:16, textAlign:'center' },
});
