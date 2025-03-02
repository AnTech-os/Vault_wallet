import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import BudgetSummaryCard from '../components/budget/BudgetSummaryCard';
import BudgetCategoryCard from '../components/budget/BudgetCategoryCard';
import AddExpenseButton from '../components/budget/AddExpenseButton';

const Budget = () => {
  // Sample data - In a real app, this would come from your data store
  const budgetData = {
    totalBudget: 2500,
    totalSpent: 1850,
    categories: [
      {
        name: 'Housing',
        allocated: 1500,
        spent: 1500,
        icon: 'home',
        color: '#FF9500',
      },
      {
        name: 'Food',
        allocated: 400,
        spent: 350,
        icon: 'food',
        color: '#34C759',
      },
      {
        name: 'Transport',
        allocated: 200,
        spent: 175,
        icon: 'car',
        color: '#007AFF',
      },
      {
        name: 'Utilities',
        allocated: 150,
        spent: 140,
        icon: 'lightning-bolt',
        color: '#5856D6',
      },
      {
        name: 'Entertainment',
        allocated: 100,
        spent: 85,
        icon: 'movie',
        color: '#FF2D55',
      },
    ],
  };

  const handleCategoryPress = (category: string) => {
    // In a real app, this would navigate to a detailed view of the category
    Alert.alert('Category Details', `View details for ${category}`);
  };

  const handleAddExpense = () => {
    // In a real app, this would open an expense input form
    Alert.alert('Add Expense', 'Add a new expense');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Budget</Text>
          <Text style={styles.subtitle}>February 2025</Text>
        </View>

        <BudgetSummaryCard
          totalBudget={budgetData.totalBudget}
          totalSpent={budgetData.totalSpent}
        />

        <Text style={styles.sectionTitle}>Categories</Text>

        {budgetData.categories.map((category) => (
          <BudgetCategoryCard
            key={category.name}
            name={category.name}
            allocated={category.allocated}
            spent={category.spent}
            icon={category.icon}
            color={category.color}
            onPress={() => handleCategoryPress(category.name)}
          />
        ))}
      </ScrollView>

      <AddExpenseButton onPress={handleAddExpense} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
});

export default Budget;
