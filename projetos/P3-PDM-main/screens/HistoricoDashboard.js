import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import CardDashboard from '../components/CardDashboard';

const screenWidth = Dimensions.get('window').width;

const colors = {
  passos: '#4CAF50', 
  sono: '#3F51B5', 
  hidratacao: '#00BCD4',
  frequencia: '#E91E63',  
};

export default function HistoricoDashboard({ navigation }) {
  const [dados, setDados] = useState({
    passos: 8423,
    sono: 6.8,
    hidratacao: 2.5,
    frequencia: 72,
  });

  const [historico, setHistorico] = useState({
    meses: [],
    passos: [],
    sono: [],
    hidratacao: [],
    frequencia: [],
  });

  useEffect(() => {
    const hoje = new Date();
    const meses = [];
    const passos = [];
    const sono = [];
    const hidratacao = [];
    const frequencia = [];

    for (let i = 11; i >= 0; i--) {
      const dt = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push(dt.toLocaleString('pt-BR', { month: 'short' }));

      passos.push(Math.floor(Math.random() * 10000));
      sono.push(parseFloat((Math.random() * 4 + 4).toFixed(1))); // 4 a 8 horas
      hidratacao.push(parseFloat((Math.random() * 2 + 1).toFixed(1))); // 1 a 3 litros
      frequencia.push(Math.floor(Math.random() * 40 + 60)); // 60 a 100 bpm
    }

    setHistorico({ meses, passos, sono, hidratacao, frequencia });
  }, []);

  // Função para criar chartConfig para cada cor
  function createChartConfig(color) {
    return {
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      color: (opacity = 1) => `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      decimalPlaces: 1,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '5',
        strokeWidth: '2',
        stroke: color,
      },
    };
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Histórico - Dashboard</Text>

      <View style={styles.cardGrid}>
        <CardDashboard
          label="Passos Dados"
          valor={`${dados.passos} passos`}
          iconName="walk"
          iconColor={colors.passos}
        />
        <CardDashboard
          label="Horas de Sono"
          valor={`${dados.sono} h`}
          iconName="sleep"
          iconColor={colors.sono}
        />
        <CardDashboard
          label="Hidratação"
          valor={`${dados.hidratacao} L`}
          iconName="cup-water"
          iconColor={colors.hidratacao}
        />
        <CardDashboard
          label="Frequência"
          valor={`${dados.frequencia} bpm`}
          iconName="heart-pulse"
          iconColor={colors.frequencia}
        />
      </View>

      <Text style={[styles.chartTitle, { color: colors.passos }]}>
        Passos nos Últimos 12 Meses
      </Text>
      <LineChart
        data={{ labels: historico.meses, datasets: [{ data: historico.passos, color: () => colors.passos }] }}
        width={screenWidth - 40}
        height={220}
        chartConfig={createChartConfig(colors.passos)}
        bezier
        style={styles.chartStyle}
      />

      <Text style={[styles.chartTitle, { color: colors.sono }]}>
        Horas de Sono nos Últimos 12 Meses
      </Text>
      <LineChart
        data={{ labels: historico.meses, datasets: [{ data: historico.sono, color: () => colors.sono }] }}
        width={screenWidth - 40}
        height={220}
        chartConfig={createChartConfig(colors.sono)}
        bezier
        style={styles.chartStyle}
      />

      <Text style={[styles.chartTitle, { color: colors.hidratacao }]}>
        Hidratação nos Últimos 12 Meses (L)
      </Text>
      <LineChart
        data={{ labels: historico.meses, datasets: [{ data: historico.hidratacao, color: () => colors.hidratacao }] }}
        width={screenWidth - 40}
        height={220}
        chartConfig={createChartConfig(colors.hidratacao)}
        bezier
        style={styles.chartStyle}
      />

      <Text style={[styles.chartTitle, { color: colors.frequencia }]}>
        Frequência Cardíaca nos Últimos 12 Meses (bpm)
      </Text>
      <LineChart
        data={{ labels: historico.meses, datasets: [{ data: historico.frequencia, color: () => colors.frequencia }] }}
        width={screenWidth - 40}
        height={220}
        chartConfig={createChartConfig(colors.frequencia)}
        bezier
        style={styles.chartStyle}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#f1f1f1',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  chartStyle: {
    borderRadius: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
