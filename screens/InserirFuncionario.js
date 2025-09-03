import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;
const openDb = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('funcionarios.db');
  return db;
};

export default function InserirFuncionario() {
  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [cargo, setCargo] = useState('');

  const inserir = async () => {
    if (!nome || !salario || !cargo) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    try {
      const database = await openDb();
      await database.runAsync(
        'INSERT INTO funcionarios (nome, salario, cargo) VALUES (?, ?, ?);',
        [nome, parseFloat(salario), cargo]
      );
      Alert.alert('Sucesso', 'Funcionário inserido com sucesso!');
      setNome(''); setSalario(''); setCargo('');
    } catch (error) {
      console.error('Erro ao inserir funcionário:', error);
      Alert.alert('Erro', 'Falha ao inserir funcionário.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inserir Funcionário</Text>
      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Salário" keyboardType="numeric" style={styles.input} value={salario} onChangeText={setSalario} />
      <TextInput placeholder="Cargo" style={styles.input} value={cargo} onChangeText={setCargo} />
      <Button title="Inserir" onPress={inserir} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  title: { fontSize:24, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:5, padding:10, marginBottom:10 },
});
