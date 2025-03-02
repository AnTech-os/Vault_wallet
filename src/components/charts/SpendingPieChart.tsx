import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface SpendingData {
  category: string;
  amount: number;
  color: string;
}

interface SpendingPieChartProps {
  data: SpendingData[];
}

const SpendingPieChart: React.FC<SpendingPieChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const chartData = data.map(item => ({
    name: item.category,
    population: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth * 0.9}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
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

export default SpendingPieChart;
