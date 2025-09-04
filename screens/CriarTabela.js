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
@@ -23,25 +49,245 @@ export default function CriarTabela() {
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
