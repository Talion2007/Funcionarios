import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Banco from './screens/Banco';
import CriarTabela from './screens/CriarTabela';
import InserirFuncionario from './screens/InserirFuncionario';
import PesquisarFuncionarios from './screens/PesquisarFuncionarios';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Banco">
        <Drawer.Screen name="Banco" component={Banco} />
        <Drawer.Screen name="Criar Tabela" component={CriarTabela} />
        <Drawer.Screen name="Inserir Funcionário" component={InserirFuncionario} />
        <Drawer.Screen name="Pesquisar Funcionários" component={PesquisarFuncionarios} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
