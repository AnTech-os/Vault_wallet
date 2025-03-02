import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface TrendData {
  month: string;
  amount: number;
}

interface TrendLineChartProps {
  data: TrendData[];
  color: string;
}

const TrendLineChart: React.FC<TrendLineChartProps> = ({ data, color }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${hexToRgb(color)}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: color,
    },
  };

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        data: data.map(item => item.amount),
        color: (opacity = 1) => `rgba(${hexToRgb(color)}, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Helper function to convert hex to rgb
  function hexToRgb(hex: string): string {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth * 0.9}
        height={180}
        yAxisLabel="$"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
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
    padding: 5,
    marginVertical: 5,
  },
  chart: {
    borderRadius: 10,
  },
});

export default TrendLineChart;
