// Importação dos hooks do React (useState, useEffect) e componentes do React Native
import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, FlatList, StyleSheet,
  Alert, TextInput, TouchableOpacity, ScrollView
} from 'react-native';

// Importa o módulo SQLite do Expo para manipular banco de dados local
import * as SQLite from 'expo-sqlite';

// Declara uma variável para armazenar a instância do banco
let db;

// Função assíncrona para abrir o banco de dados (ou criar se não existir)
const openDb = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('funcionarios.db'); // nome do arquivo do banco
  return db;
};

// Componente principal da tela de pesquisa
export default function PesquisarFuncionarios() {
  // Estados para armazenar:
  // - Lista de funcionários
  // - Filtros de pesquisa: nome, salário mínimo e cargo
  const [lista, setLista] = useState([]);
  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [cargo, setCargo] = useState('');

  // 🔍 Buscar todos os funcionários do banco
  const buscarTodos = async () => {
    try {
      const database = await openDb(); // Abre conexão com o banco
      const rows = await database.getAllAsync('SELECT * FROM funcionarios;'); // Consulta todos
      setLista(rows); // Atualiza a lista exibida
    } catch (error) {
      console.error('Erro ao buscar todos:', error);
      Alert.alert('Erro', 'Falha ao buscar todos funcionários.');
    }
  };

  // 🔍 Buscar funcionários por nome
  const buscarPorNome = async () => {
    if (!nome.trim()) return Alert.alert('Aviso', 'Digite um nome para pesquisar.');

    try {
      const database = await openDb();
      const rows = await database.getAllAsync(
        'SELECT * FROM funcionarios WHERE nome LIKE ?;',
        [`%${nome}%`] // LIKE com wildcard (%)
      );
      setLista(rows);
      if (rows.length === 0) Alert.alert('Aviso', 'Nenhum funcionário encontrado.');
    } catch (error) {
      console.error('Erro ao buscar por nome:', error);
      Alert.alert('Erro', 'Falha na busca por nome.');
    }
  };

  // 🔍 Buscar funcionários por salário mínimo
  const buscarPorSalario = async () => {
    const valor = parseFloat(salario);
    if (isNaN(valor)) return Alert.alert('Aviso', 'Digite um número válido para salário.');

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

  // 🔍 Buscar funcionários por cargo
  const buscarPorCargo = async () => {
    if (!cargo.trim()) return Alert.alert('Aviso', 'Digite um cargo para pesquisar.');

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

  // useEffect executa a função buscarTodos() assim que o componente for montado
  useEffect(() => {
    buscarTodos();
  }, []);

  // JSX: parte visual da tela
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pesquisar Funcionários</Text>

      {/* Campo de entrada para o nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo de entrada para o salário mínimo */}
      <TextInput
        style={styles.input}
        placeholder="Salário Mínimo"
        keyboardType="numeric"
        value={salario}
        onChangeText={setSalario}
      />

      {/* Campo de entrada para o cargo */}
      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={cargo}
        onChangeText={setCargo}
      />

      {/* Botões de ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={buscarTodos}>
          <Text style={styles.buttonText}>Mostrar Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={buscarPorNome}>
          <Text style={styles.buttonText}>Pesquisar Nome</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={buscarPorSalario}>
          <Text style={styles.buttonText}>Pesquisar Salário</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={buscarPorCargo}>
          <Text style={styles.buttonText}>Pesquisar Cargo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de resultados com FlatList */}
      <FlatList
        data={lista} // Lista de dados a ser exibida
        keyExtractor={(item) => item.id.toString()} // Define a key única para cada item
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.nome} - R${item.salario.toFixed(2)} - {item.cargo}
            </Text>
          </View>
        )}
        style={{ marginTop: 20, marginBottom: 50 }}
      />
    </ScrollView>
  );
}

// 🎨 Estilização da interface
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7', // cor de fundo clara
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4a90e2', // azul moderno
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});
