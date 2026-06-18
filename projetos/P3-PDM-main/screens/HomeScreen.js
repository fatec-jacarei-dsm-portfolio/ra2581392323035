import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Linking, StatusBar, StyleSheet, View } from 'react-native';
import CardInfo from '../components/CardInfo';

export default function HomeScreen({ navigation }) {
  const [dados, setDados] = useState({
    passos: 0,
    sono: 0,
    hidratacao: 0,
    frequencia: 0,
  });

  useEffect(() => {
    setDados({
      passos: Math.floor(Math.random() * 10000),
      sono: (Math.random() * 8 + 1).toFixed(1),
      hidratacao: (Math.random() * 3 + 1).toFixed(1),
      frequencia: Math.floor(Math.random() * 40 + 60),
    });
  }, []);

  const abrirLink = () => {
    Linking.openURL('https://www.tuasaude.com/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Minha Saúde Hoje</Text>

      <CardInfo label="Passos Dados" valor={`${dados.passos} passos`} iconName="walk" />
      <CardInfo label="Horas de Sono" valor={`${dados.sono} horas`} iconName="sleep" />
      <CardInfo label="Hidratação" valor={`${dados.hidratacao} L`} iconName="cup-water" />
      <CardInfo label="Frequência Cardíaca" valor={`${dados.frequencia} bpm`} iconName="heart-pulse" />

      <TouchableOpacity onPress={abrirLink} style={styles.botao}>
        <Text style={styles.textoBotao}>Ver mais informações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#4CAF50', marginTop: 15 }]}
        onPress={() => navigation.navigate('HistoricoDashboard')}
      >
        <Text style={styles.textoBotao}>Histórico - Dashboard</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  botao: {
    marginTop: 30,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
