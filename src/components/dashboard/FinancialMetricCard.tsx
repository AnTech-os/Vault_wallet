import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FinancialMetricCardProps {
  title: string;
  amount: number;
  icon: string;
  trend?: {
    type: 'up' | 'down';
    percentage: number;
  };
}

const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({
  title,
  amount,
  icon,
  trend,
}) => {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name={icon} size={24} color="#007AFF" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.amount}>{formatAmount(amount)}</Text>
      {trend && (
        <View style={styles.trendContainer}>
          <Icon
            name={trend.type === 'up' ? 'trending-up' : 'trending-down'}
            size={16}
            color={trend.type === 'up' ? '#34C759' : '#FF3B30'}
          />
          <Text
            style={[
              styles.trendText,
              {
                color: trend.type === 'up' ? '#34C759' : '#FF3B30',
              },
            ]}
          >
            {trend.percentage}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: '45%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default FinancialMetricCard;
