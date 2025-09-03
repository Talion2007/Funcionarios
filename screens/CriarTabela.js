// Importação dos módulos necessários
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import * as SQLite from 'expo-sqlite';

// Variável global para armazenar o banco de dados
let db;

// Função para abrir ou criar o banco de dados SQLite
const openDb = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('funcionarios.db');
  return db;
};

// Componente principal
export default function App() {
  // Estados para inserção
  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [cargo, setCargo] = useState('');

  // Estados para pesquisa
  const [lista, setLista] = useState([]);
  const [mensagem, setMensagem] = useState('Aguardando ação...');

  // =========================
  // 📌 1. Criar a Tabela
  // =========================
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
      Alert.alert('Sucesso', 'Tabela "funcionarios" pronta para uso.');
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
      setMensagem('❌ Falha ao criar tabela.');
      Alert.alert('Erro', 'Não foi possível criar a tabela.');
    }
  };

  // =========================
  // 📌 2. Inserir Funcionário
  // =========================
  const inserirFuncionario = async () => {
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
      setNome('');
      setSalario('');
      setCargo('');
      buscarTodos(); // Atualiza lista
    } catch (error) {
      console.error('Erro ao inserir funcionário:', error);
      Alert.alert('Erro', 'Falha ao inserir funcionário.');
    }
  };

  // =========================
  // 📌 3. Buscar Funcionários
  // =========================

  // Busca todos
  const buscarTodos = async () => {
    try {
      const database = await openDb();
      const rows = await database.getAllAsync('SELECT * FROM funcionarios;');
      setLista(rows);
    } catch (error) {
      console.error('Erro ao buscar todos:', error);
      Alert.alert('Erro', 'Falha ao buscar todos os funcionários.');
    }
  };

  // Busca por nome
  const buscarPorNome = async () => {
    if (!nome.trim()) return Alert.alert('Aviso', 'Digite um nome para pesquisar.');
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

  // Busca por salário
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

  // Busca por cargo
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

  // Cria a tabela automaticamente ao abrir o app (opcional)
  useEffect(() => {
    criarTabela();
    buscarTodos();
  }, []);

  // =========================
  // 📦 Interface (JSX)
  // =========================

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📋 Funcionários</Text>

      {/* Mensagem de status da tabela */}
      <Text style={styles.status}>{mensagem}</Text>

      {/* Inputs de cadastro/pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Salário"
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

      {/* Botões de ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={inserirFuncionario}>
          <Text style={styles.buttonText}>➕ Inserir Funcionário</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={buscarTodos}>
          <Text style={styles.buttonText}>👀 Mostrar Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={buscarPorNome}>
          <Text style={styles.buttonText}>🔍 Pesquisar por Nome</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={buscarPorSalario}>
          <Text style={styles.buttonText}>💰 Pesquisar por Salário</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={buscarPorCargo}>
          <Text style={styles.buttonText}>📌 Pesquisar por Cargo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de funcionários */}
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.nome} — R$ {item.salario.toFixed(2)} — {item.cargo}
            </Text>
          </View>
        )}
        style={{ marginTop: 20, marginBottom: 50 }}
      />
    </ScrollView>
  );
}

// =========================
// 🎨 Estilos
// =========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eef8f1', // Verde clarinho
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2c3e50',
  },
  status: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
  },
  button: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
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
