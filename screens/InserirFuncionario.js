// Importa React e os hooks necessários
import React, { useState } from 'react';

// Importa componentes básicos da interface do React Native
import {
  View,        // Contêiner de layout
  Text,        // Componente de texto
  TextInput,   // Campo de entrada de texto
  Button,      // Botão básico
  StyleSheet,  // Estilização inline
  Alert        // Caixa de alerta
} from 'react-native';

// Importa o módulo SQLite do Expo
import * as SQLite from 'expo-sqlite';

// Variável para armazenar a instância do banco
let db;

// Função assíncrona para abrir (ou criar) o banco de dados
const openDb = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('funcionarios.db'); // Nome do banco
  return db;
};

// Componente principal para inserção de funcionário
export default function InserirFuncionario() {
  // Estados para armazenar os valores digitados nos inputs
  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [cargo, setCargo] = useState('');

  // Função que insere um novo funcionário no banco
  const inserir = async () => {
    // Verifica se todos os campos foram preenchidos
    if (!nome || !salario || !cargo) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const database = await openDb(); // Abre o banco

      // Executa o comando SQL para inserir o funcionário
      await database.runAsync(
        'INSERT INTO funcionarios (nome, salario, cargo) VALUES (?, ?, ?);',
        [nome, parseFloat(salario), cargo]
      );

      // Exibe mensagem de sucesso
      Alert.alert('Sucesso', 'Funcionário inserido com sucesso!');

      // Limpa os campos após inserção
      setNome('');
      setSalario('');
      setCargo('');
    } catch (error) {
      // Em caso de erro, exibe alerta e loga no console
      console.error('Erro ao inserir funcionário:', error);
      Alert.alert('Erro', 'Falha ao inserir funcionário.');
    }
  };

  // JSX: renderização da tela
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inserir Funcionário</Text>

      {/* Campo de entrada para o nome */}
      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo de entrada para o salário (aceita apenas números) */}
      <TextInput
        placeholder="Salário"
        keyboardType="numeric"
        style={styles.input}
        value={salario}
        onChangeText={setSalario}
      />

      {/* Campo de entrada para o cargo */}
      <TextInput
        placeholder="Cargo"
        style={styles.input}
        value={cargo}
        onChangeText={setCargo}
      />

      {/* Botão que chama a função de inserção */}
      <Button title="Inserir" onPress={inserir} />
    </View>
  );
}

// 🎨 Estilos da interface
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'lightyellow', // Cor de fundo clara
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
