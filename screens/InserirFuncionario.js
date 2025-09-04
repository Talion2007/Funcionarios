// Importa React e os hooks necessários
import React, { useState } from "react";

// Importa componentes básicos da interface do React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity, // Botão customizável
  StyleSheet,
  Alert,
} from "react-native";

// Importa o módulo SQLite do Expo
import * as SQLite from "expo-sqlite";

// Variável para armazenar a instância do banco
let db;

// Função assíncrona para abrir (ou criar) o banco de dados
const openDb = async () => {
  if (!db) db = await SQLite.openDatabaseAsync("funcionarios.db"); // Nome do banco
  return db;
};

// Componente principal para inserção de funcionário
export default function InserirFuncionario() {
  // Estados para armazenar os valores digitados nos inputs
  const [nome, setNome] = useState("");
  const [salario, setSalario] = useState("");
  const [cargo, setCargo] = useState("");

  // Função que insere um novo funcionário no banco
  const inserir = async () => {
    // Verifica se todos os campos foram preenchidos
    if (!nome || !salario || !cargo) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const database = await openDb(); // Abre o banco

      // Executa o comando SQL para inserir os dados
      await database.runAsync(
        "INSERT INTO funcionarios (nome, salario, cargo) VALUES (?, ?, ?);",
        [nome, parseFloat(salario), cargo]
      );

      // Exibe alerta de sucesso
      Alert.alert("✅ Sucesso", "Funcionário inserido com sucesso!");

      // Limpa os campos
      setNome("");
      setSalario("");
      setCargo("");
    } catch (error) {
      // Em caso de erro
      console.error("Erro ao inserir funcionário:", error);
      Alert.alert("❌ Erro", "Falha ao inserir funcionário.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Título da tela */}
      <Text style={styles.title}>👨‍💼 Inserir Funcionário</Text>

      {/* Campo de entrada para o nome */}
      <TextInput
        placeholder="Nome"
        placeholderTextColor="#666" // cor do placeholder
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo de entrada para o salário */}
      <TextInput
        placeholder="Salário"
        placeholderTextColor="#666"
        keyboardType="numeric" // só números
        style={styles.input}
        value={salario}
        onChangeText={setSalario}
      />

      {/* Campo de entrada para o cargo */}
      <TextInput
        placeholder="Cargo"
        placeholderTextColor="#666"
        style={styles.input}
        value={cargo}
        onChangeText={setCargo}
      />

      {/* Botão estilizado com TouchableOpacity */}
      <TouchableOpacity style={styles.button} onPress={inserir}>
        <Text style={styles.buttonText}>Salvar Funcionário</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Estilos da interface
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FDF6E3", // fundo bege claro
    justifyContent: "center", // centraliza verticalmente
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#2C3E50", // azul escuro elegante
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd", // cinza claro
    borderRadius: 12, // bordas arredondadas
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff", // fundo branco
    fontSize: 16,

    // sombra leve no Android
    elevation: 2,

    // sombra leve no iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  button: {
    backgroundColor: "#27AE60", // verde elegante
    paddingVertical: 14,
    borderRadius: 12, // bordas arredondadas
    alignItems: "center", // centraliza o texto no botão

    // sombra para destacar o botão
    elevation: 3,
  },
  buttonText: {
    color: "#fff", // texto branco
    fontSize: 18,
    fontWeight: "600",
  },
});
