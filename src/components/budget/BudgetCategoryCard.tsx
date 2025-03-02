import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BudgetCategoryProps {
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
  onPress: () => void;
}

const BudgetCategoryCard: React.FC<BudgetCategoryProps> = ({
  name,
  allocated,
  spent,
  icon,
  color,
  onPress,
}) => {
  const percentage = (spent / allocated) * 100;
  const remaining = allocated - spent;
  const isOverBudget = spent > allocated;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Icon name={icon} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>
            ${spent.toFixed(2)} of ${allocated.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: color,
              width: `${Math.min(percentage, 100)}%`,
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.remainingText,
          { color: isOverBudget ? '#FF3B30' : '#34C759' },
        ]}>
        {isOverBudget
          ? `$${Math.abs(remaining).toFixed(2)} over budget`
          : `$${remaining.toFixed(2)} remaining`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default BudgetCategoryCard;
