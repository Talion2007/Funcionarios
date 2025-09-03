import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, TextInput } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;
const openDb = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('funcionarios.db');
  return db;
};

export default function PesquisarFuncionarios() {
  const [lista, setLista] = useState([]);
  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [cargo, setCargo] = useState('');

  const buscarTodos = async () => {
    try {
      const database = await openDb();
      const rows = await database.getAllAsync('SELECT * FROM funcionarios;');
      setLista(rows);
    } catch (error) {
      console.error('Erro ao buscar todos:', error);
      Alert.alert('Erro', 'Falha ao buscar todos funcionários.');
    }
  };

  const buscarPorNome = async () => {
    if (!nome.trim()) {
      Alert.alert('Aviso', 'Digite um nome para pesquisar.');
      return;
    }
    try {
      const database = await openDb();
      const rows = await database.getAllAsync(
        'SELECT * FROM funcionarios WHERE nome LIKE ?;',
        [`%${nome}%`]
      );
      setLista(rows);
      if (rows.length === 0) Alert.alert('Aviso', 'Nenhum funcionário encontrado.');
    } catch (error) {
      console.error('Erro ao buscar por nome:', error);
      Alert.alert('Erro', 'Falha na busca por nome.');
    }
  };

  const buscarPorSalario = async () => {
    const valor = parseFloat(salario);
    if (isNaN(valor)) {
      Alert.alert('Aviso', 'Digite um número válido para salário.');
      return;
    }
    try {
      const database = await openDb();
      const rows = await database.getAllAsync(
        'SELECT * FROM funcionarios WHERE salario >= ?;',
        [valor]
      );
      setLista(rows);
      if (rows.length === 0) Alert.alert('Aviso', 'Nenhum funcionário encontrado.');
    } catch (error) {
      console.error('Erro ao buscar por salário:', error);
      Alert.alert('Erro', 'Falha na busca por salário.');
    }
  };

  const buscarPorCargo = async () => {
    if (!cargo.trim()) {
      Alert.alert('Aviso', 'Digite um cargo para pesquisar.');
      return;
    }
    try {
      const database = await openDb();
      const rows = await database.getAllAsync(
        'SELECT * FROM funcionarios WHERE cargo LIKE ?;',
        [`%${cargo}%`]
      );
      setLista(rows);
      if (rows.length === 0) Alert.alert('Aviso', 'Nenhum funcionário encontrado.');
    } catch (error) {
      console.error('Erro ao buscar por cargo:', error);
      Alert.alert('Erro', 'Falha na busca por cargo.');
    }
  };

  useEffect(() => {
    buscarTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesquisar Funcionários</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Salário Mínimo"
        keyboardType="numeric"
        value={salario}
        onChangeText={setSalario}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={cargo}
        onChangeText={setCargo}
      />

      <View style={styles.buttons}>
        <Button title="Mostrar Todos" onPress={buscarTodos} />
        <Button title="Pesquisar Nome" onPress={buscarPorNome} />
        <Button title="Pesquisar Salário" onPress={buscarPorSalario} />
        <Button title="Pesquisar Cargo" onPress={buscarPorCargo} />
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nome} — R$ {item.salario.toFixed(2)} — {item.cargo}</Text>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  title: { fontSize:24, fontWeight:'bold', textAlign:'center', marginBottom:10 },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:5,
    padding:10,
    marginBottom:10,
  },
  buttons: {
    flexDirection: 'column',
    gap: 10,
  },
  item: {
    padding:10,
    backgroundColor:'#fff',
    borderBottomWidth:1,
    borderBottomColor:'#ccc',
  },
});
