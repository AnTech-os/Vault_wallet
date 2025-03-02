import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface BudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
}

const BudgetSummaryCard: React.FC<BudgetSummaryProps> = ({
  totalBudget,
  totalSpent,
}) => {
  const remaining = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  const chartData = [
    {
      name: 'Spent',
      amount: totalSpent,
      color: '#007AFF',
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Remaining',
      amount: remaining > 0 ? remaining : 0,
      color: '#E5E5EA',
      legendFontColor: '#7F7F7F',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Budget Overview</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
        />
        <View style={styles.centerContent}>
          <Text style={styles.percentageText}>{Math.round(spentPercentage)}%</Text>
          <Text style={styles.percentageLabel}>spent</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Budget</Text>
          <Text style={styles.statValue}>${totalBudget.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={styles.statValue}>${totalSpent.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Remaining</Text>
          <Text style={[styles.statValue, { color: remaining > 0 ? '#34C759' : '#FF3B30' }]}>
            ${Math.abs(remaining).toFixed(2)}
            {remaining < 0 ? ' over' : ''}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  percentageLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});

export default BudgetSummaryCard;
