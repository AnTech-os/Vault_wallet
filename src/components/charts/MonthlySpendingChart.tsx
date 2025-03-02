import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface SpendingData {
  month: string;
  amount: number;
}

interface MonthlySpendingChartProps {
  data: SpendingData[];
}

const MonthlySpendingChart: React.FC<MonthlySpendingChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.8,
  };

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        data: data.map(item => item.amount),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={chartData}
        width={screenWidth * 0.9}
        height={220}
        yAxisLabel="$"
        yAxisSuffix=""
        chartConfig={chartConfig}
        verticalLabelRotation={45}
        showValuesOnTopOfBars
        fromZero
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MonthlySpendingChart;
