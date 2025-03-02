import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MonthYearSelector from '../components/common/MonthYearSelector';
import FinancialHealthScore from '../components/overview/FinancialHealthScore';

const FinancialOverview = () => {
  const insets = useSafeAreaInsets();
  const [currentMonth, setCurrentMonth] = useState('February');
  const [currentYear, setCurrentYear] = useState(2025);

  // Sample debt trend data
  const debtTrendData = [
    { month: 'Sep', amount: 12000 },
    { month: 'Oct', amount: 11800 },
    { month: 'Nov', amount: 11500 },
    { month: 'Dec', amount: 11200 },
    { month: 'Jan', amount: 10500 },
    { month: 'Feb', amount: 10000 },
  ];

  // Sample savings trend data
  const savingsTrendData = [
    { month: 'Sep', amount: 10000 },
    { month: 'Oct', amount: 11000 },
    { month: 'Nov', amount: 12000 },
    { month: 'Dec', amount: 13000 },
    { month: 'Jan', amount: 14000 },
    { month: 'Feb', amount: 15000 },
  ];

  // Calculate percentage changes
  const debtChange = ((debtTrendData[0].amount - debtTrendData[debtTrendData.length - 1].amount) / debtTrendData[0].amount) * 100;
  const savingsChange = ((savingsTrendData[savingsTrendData.length - 1].amount - savingsTrendData[0].amount) / savingsTrendData[0].amount) * 100;

  // Sample financial health factors
  const financialHealthFactors = [
    {
      label: 'Savings Rate',
      score: 75,
      icon: 'piggy-bank',
    },
    {
      label: 'Debt Ratio',
      score: 65,
      icon: 'credit-card',
    },
    {
      label: 'Emergency Fund',
      score: 90,
      icon: 'shield',
    },
    {
      label: 'Budget Adherence',
      score: 82,
      icon: 'chart-line',
    },
  ];

  // Calculate overall financial health score (weighted average)
  const calculateOverallScore = () => {
    const weights = {
      'Savings Rate': 0.3,
      'Debt Ratio': 0.3,
      'Emergency Fund': 0.25,
      'Budget Adherence': 0.15,
    };

    let weightedScore = 0;
    financialHealthFactors.forEach(factor => {
      weightedScore += factor.score * weights[factor.label];
    });

    return Math.round(weightedScore);
  };

  const handlePreviousMonth = () => {
    // Get the previous month and year
    const date = new Date(currentYear, getMonthIndex(currentMonth) - 1, 1);
    setCurrentMonth(getMonthName(date.getMonth()));
    setCurrentYear(date.getFullYear());
  };

  const handleNextMonth = () => {
    // Get the next month and year
    const date = new Date(currentYear, getMonthIndex(currentMonth) + 1, 1);
    setCurrentMonth(getMonthName(date.getMonth()));
    setCurrentYear(date.getFullYear());
  };

  // Helper function to get month index from name
  const getMonthIndex = (monthName) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(monthName);
  };

  // Helper function to get month name from index
  const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Financial Overview</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="account-circle-outline" size={28} color="#000000" />
          </TouchableOpacity>
        </View>
        <MonthYearSelector
          currentMonth={currentMonth}
          currentYear={currentYear}
          onPrevious={handlePreviousMonth}
          onNext={handleNextMonth}
        />
      </View>

      {/* Key Metrics Section */}
      <View style={styles.section}>
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Income</Text>
            <Text style={[styles.metricValue, { color: '#90D9A6' }]}>$5,000</Text>
          </View>
          
          <View style={styles.metricDivider} />
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Spending</Text>
            <Text style={[styles.metricValue, { color: '#FF9494' }]}>$3,500</Text>
          </View>
          
          <View style={styles.metricDivider} />
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Savings</Text>
            <Text style={[styles.metricValue, { color: '#7AB2FF' }]}>$1,500</Text>
          </View>
        </View>
      </View>

      {/* Financial Health Score */}
      <View style={styles.section}>
        <FinancialHealthScore 
          score={calculateOverallScore()} 
          factors={financialHealthFactors} 
        />
      </View>

      {/* Condensed Trends Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Trends</Text>
        
        {/* Debt Trend Row */}
        <View style={styles.trendRow}>
          <View style={styles.trendLabelContainer}>
            <Icon name="credit-card-minus" size={20} color="#FF6B6B" style={styles.trendIcon} />
            <View>
              <Text style={styles.trendLabel}>Debt</Text>
              <Text style={styles.trendSubLabel}>Last 6 months</Text>
            </View>
          </View>
          
          <View style={styles.trendDataContainer}>
            <Text style={styles.trendAmount}>${debtTrendData[debtTrendData.length - 1].amount.toLocaleString()}</Text>
            <View style={styles.trendChangeContainer}>
              <Icon 
                name={debtChange > 0 ? "arrow-down" : "arrow-up"} 
                size={14} 
                color={debtChange > 0 ? "#34C759" : "#FF3B30"} 
              />
              <Text style={[styles.trendChangeText, { color: debtChange > 0 ? "#34C759" : "#FF3B30" }]}>
                {Math.abs(debtChange).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />
        
        {/* Savings Trend Row */}
        <View style={styles.trendRow}>
          <View style={styles.trendLabelContainer}>
            <Icon name="piggy-bank" size={20} color="#63C7FF" style={styles.trendIcon} />
            <View>
              <Text style={styles.trendLabel}>Savings</Text>
              <Text style={styles.trendSubLabel}>Last 6 months</Text>
            </View>
          </View>
          
          <View style={styles.trendDataContainer}>
            <Text style={styles.trendAmount}>${savingsTrendData[savingsTrendData.length - 1].amount.toLocaleString()}</Text>
            <View style={styles.trendChangeContainer}>
              <Icon 
                name={savingsChange > 0 ? "arrow-up" : "arrow-down"} 
                size={14} 
                color={savingsChange > 0 ? "#34C759" : "#FF3B30"} 
              />
              <Text style={[styles.trendChangeText, { color: savingsChange > 0 ? "#34C759" : "#FF3B30" }]}>
                {Math.abs(savingsChange).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingBottom: 10,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  profileButton: {
    padding: 2,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 8,
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // New metrics layout
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E5E5EA',
  },
  metricLabel: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  // Trend styles
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  trendLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    marginRight: 10,
  },
  trendLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  trendSubLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  trendDataContainer: {
    alignItems: 'flex-end',
  },
  trendAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  trendChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendChangeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 2,
  }
});

export default FinancialOverview;
