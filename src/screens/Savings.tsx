import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView,
  TouchableWithoutFeedback,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SavingsGoalItem from '../components/savings/SavingsGoalItem';
import SavingsGoalFormModal from '../components/savings/SavingsGoalFormModal';
import SavingsAccountFormModal from '../components/savings/SavingsAccountFormModal';
import SavingsAccountItem from '../components/savings/SavingsAccountItem';
import DeleteConfirmationModal from '../components/savings/DeleteConfirmationModal';
import SavingsDepositHistoryModal from '../components/savings/SavingsDepositHistoryModal';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

// Define savings goal interface
interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  icon: string;
  createdAt: string;
  lastUpdated: string;
}

// Define deposit interface
interface Deposit {
  id: string;
  goalId: string;
  amount: number;
  date: string;
}

// Define savings account interface
interface SavingsAccount {
  id: string;
  name: string;
  balance: number;
  apy: number;
  institution: string;
  accountType: string;
  createdAt: string;
  lastUpdated: string;
}

// Category mapping for icons
const CATEGORY_ICONS = {
  'emergency': 'shield-alert',
  'retirement': 'clock-time-eight',
  'travel': 'airplane',
  'education': 'school',
  'home': 'home',
  'car': 'car',
  'tech': 'laptop',
  'health': 'heart-pulse',
  'other': 'tag'
};

// Category display names
const CATEGORY_DISPLAY_NAMES = {
  'emergency': 'Emergency',
  'retirement': 'Retirement',
  'travel': 'Travel',
  'education': 'Education',
  'home': 'Home',
  'car': 'Car',
  'tech': 'Tech',
  'health': 'Health',
  'other': 'Other'
};

// Sample savings goals data
const SAMPLE_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 2500,
    targetDate: new Date(2025, 11, 31).toISOString(),
    category: 'emergency',
    icon: CATEGORY_ICONS['emergency'],
    createdAt: new Date(2024, 0, 1).toISOString(),
    lastUpdated: new Date(2025, 2, 1).toISOString()
  },
  {
    id: '2',
    title: 'Summer Vacation',
    targetAmount: 3000,
    currentAmount: 1200,
    targetDate: new Date(2025, 5, 15).toISOString(),
    category: 'travel',
    icon: CATEGORY_ICONS['travel'],
    createdAt: new Date(2024, 1, 15).toISOString(),
    lastUpdated: new Date(2025, 2, 1).toISOString()
  },
  {
    id: '3',
    title: 'New Laptop',
    targetAmount: 2000,
    currentAmount: 800,
    targetDate: new Date(2025, 8, 1).toISOString(),
    category: 'tech',
    icon: CATEGORY_ICONS['tech'],
    createdAt: new Date(2024, 2, 10).toISOString(),
    lastUpdated: new Date(2025, 2, 1).toISOString()
  }
];

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Savings = () => {
  // State for savings goals
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('progress-desc'); // Options: progress-asc, progress-desc, date-asc, date-desc
  
  // State for savings accounts
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  
  // State for modals
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isAccountFormModalVisible, setIsAccountFormModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<SavingsAccount | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  
  // State for section expansion
  const [accountsExpanded, setAccountsExpanded] = useState(true);
  const [goalsExpanded, setGoalsExpanded] = useState(true);
  
  // Animation values
  const accountsRotation = useState(new Animated.Value(1))[0];
  const goalsRotation = useState(new Animated.Value(1))[0];
  const accountsHeight = useState(new Animated.Value(1))[0];
  const goalsHeight = useState(new Animated.Value(1))[0];
  const accountsOpacity = useState(new Animated.Value(1))[0];
  const goalsOpacity = useState(new Animated.Value(1))[0];
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [showDepositHistoryModal, setShowDepositHistoryModal] = useState(false);
  const [selectedGoalForHistory, setSelectedGoalForHistory] = useState<SavingsGoal | null>(null);
  
  // Load savings goals, accounts, and deposits from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedGoals = await AsyncStorage.getItem('savingsGoals');
        const storedDeposits = await AsyncStorage.getItem('savingsDeposits');
        const storedAccounts = await AsyncStorage.getItem('savingsAccounts');
        
        if (storedGoals) {
          setSavingsGoals(JSON.parse(storedGoals));
        } else {
          // Use sample data for first-time users
          setSavingsGoals(SAMPLE_SAVINGS_GOALS);
          await AsyncStorage.setItem('savingsGoals', JSON.stringify(SAMPLE_SAVINGS_GOALS));
        }
        
        if (storedDeposits) {
          setDeposits(JSON.parse(storedDeposits));
        } else {
          // Initialize with empty deposits array
          await AsyncStorage.setItem('savingsDeposits', JSON.stringify([]));
        }
        
        if (storedAccounts) {
          setSavingsAccounts(JSON.parse(storedAccounts));
        } else {
          // Initialize with empty accounts array
          await AsyncStorage.setItem('savingsAccounts', JSON.stringify([]));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Failed to load your savings data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Save savings goals to storage
  const saveSavingsGoals = async (goals: SavingsGoal[]) => {
    try {
      await AsyncStorage.setItem('savingsGoals', JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving savings goals:', error);
      Alert.alert('Error', 'Failed to save your savings goals. Please try again.');
    }
  };
  
  // Save savings accounts to storage
  const saveSavingsAccounts = async (accounts: SavingsAccount[]) => {
    try {
      await AsyncStorage.setItem('savingsAccounts', JSON.stringify(accounts));
    } catch (error) {
      console.error('Error saving savings accounts:', error);
      Alert.alert('Error', 'Failed to save your savings accounts. Please try again.');
    }
  };
  
  // Sort savings goals
  const filteredSavingsGoals = useMemo(() => {
    // Sort based on selected sort option
    return [...savingsGoals].sort((a, b) => {
      switch (sortBy) {
        case 'progress-asc':
          return (a.currentAmount / a.targetAmount) - (b.currentAmount / b.targetAmount);
        case 'progress-desc':
          return (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount);
        case 'date-asc':
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
        case 'date-desc':
          return new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime();
        default:
          return 0;
      }
    });
  }, [savingsGoals, sortBy]);
  
  // Calculate total savings stats
  const savingsStats = useMemo(() => {
    const goalsSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalAccounts = savingsAccounts.reduce((sum, account) => sum + account.balance, 0);
    const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const overallProgress = totalTarget > 0 ? (goalsSaved / totalTarget) * 100 : 0;
    
    return {
      totalSaved: goalsSaved,
      totalAccounts,
      totalTarget,
      overallProgress,
      grandTotal: goalsSaved + totalAccounts
    };
  }, [savingsGoals, savingsAccounts]);
  
  // Format currency based on amount size
  const formatCurrency = (amount: number) => {
    // For 7+ figure amounts (1,000,000+), show as $X.XXM
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return `$${millions.toFixed(2)}M`;
    }
    // For 6 figure amounts (100,000+), round to nearest dollar
    else if (amount >= 100000) {
      const roundedAmount = Math.round(amount);
      return `$${roundedAmount.toLocaleString('en-US')}`;
    }
    // For smaller amounts, show dollars and cents with commas for thousands
    else {
      return `$${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  // Handle adding a new savings goal
  // Configure animations for section toggling
  const toggleSection = (section: 'accounts' | 'goals') => {
    if (section === 'accounts') {
      const isExpanding = !accountsExpanded;
      const initialValue = isExpanding ? 0 : 1;
      const finalValue = isExpanding ? 1 : 0;
      
      // Update state
      setAccountsExpanded(isExpanding);
      
      // Reset values if expanding
      if (isExpanding) {
        accountsHeight.setValue(initialValue);
        accountsOpacity.setValue(initialValue);
      }
      
      // Run animations in parallel
      Animated.parallel([
        Animated.timing(accountsRotation, {
          toValue: finalValue,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(accountsHeight, {
          toValue: finalValue,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(accountsOpacity, {
          toValue: finalValue,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
    } else {
      const isExpanding = !goalsExpanded;
      const initialValue = isExpanding ? 0 : 1;
      const finalValue = isExpanding ? 1 : 0;
      
      // Update state
      setGoalsExpanded(isExpanding);
      
      // Reset values if expanding
      if (isExpanding) {
        goalsHeight.setValue(initialValue);
        goalsOpacity.setValue(initialValue);
      }
      
      // Run animations in parallel
      Animated.parallel([
        Animated.timing(goalsRotation, {
          toValue: finalValue,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(goalsHeight, {
          toValue: finalValue,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(goalsOpacity, {
          toValue: finalValue,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
    }
  };
  
  // Calculate rotation interpolations
  const accountsRotateZ = accountsRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  const goalsRotateZ = goalsRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleAddSavingsGoal = () => {
    setSelectedGoal(null);
    setIsEditing(false);
    setIsFormModalVisible(true);
  };
  
  // Handle adding a new savings account
  const handleAddSavingsAccount = () => {
    setSelectedAccount(null);
    setIsEditingAccount(false);
    setIsAccountFormModalVisible(true);
  };
  
  // Handle editing an existing savings goal
  const handleEditSavingsGoal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsEditing(true);
    setIsFormModalVisible(true);
  };
  
  // Handle saving a savings goal (new or edited)
  const handleSaveSavingsGoal = async (goalData: SavingsGoal) => {
    let updatedGoals;
    if (isEditing) {
      // Update existing goal
      updatedGoals = savingsGoals.map(goal => 
        goal.id === goalData.id ? goalData : goal
      );
    } else {
      // Add new goal
      updatedGoals = [...savingsGoals, goalData];
    }
    
    setSavingsGoals(updatedGoals);
    await saveSavingsGoals(updatedGoals);
    
    setIsFormModalVisible(false);
    setSelectedGoal(null);
    setIsEditing(false);
  };
  
  // Handle saving a savings account (new or edited)
  const handleSaveSavingsAccount = async (accountData: SavingsAccount) => {
    let updatedAccounts;
    if (isEditingAccount) {
      // Update existing account
      updatedAccounts = savingsAccounts.map(account => 
        account.id === accountData.id ? accountData : account
      );
    } else {
      // Add new account
      updatedAccounts = [...savingsAccounts, accountData];
    }
    
    setSavingsAccounts(updatedAccounts);
    await saveSavingsAccounts(updatedAccounts);
    
    setIsAccountFormModalVisible(false);
    setSelectedAccount(null);
    setIsEditingAccount(false);
  };
  
  // Handle adding a deposit to a savings goal
  const handleAddDeposit = async (goalId: string, amount: number) => {
    // Update the goal's current amount
    const updatedGoals = savingsGoals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.currentAmount + amount;
        return {
          ...goal,
          currentAmount: newAmount,
          lastUpdated: new Date().toISOString()
        };
      }
      return goal;
    });
    
    // Create a new deposit record
    const newDeposit: Deposit = {
      id: `deposit-${Date.now()}`,
      goalId,
      amount,
      date: new Date().toISOString()
    };
    
    const updatedDeposits = [...deposits, newDeposit];
    
    // Save both updates
    setSavingsGoals(updatedGoals);
    setDeposits(updatedDeposits);
    await saveSavingsGoals(updatedGoals);
    await saveDeposits(updatedDeposits);
  };
  
  // Save deposits to storage
  const saveDeposits = async (depositsList: Deposit[]) => {
    try {
      await AsyncStorage.setItem('savingsDeposits', JSON.stringify(depositsList));
    } catch (error) {
      console.error('Error saving deposits:', error);
      Alert.alert('Error', 'Failed to save your deposit history. Please try again.');
    }
  };
  
  // Show deposit history for a goal
  const handleViewDepositHistory = (goal: SavingsGoal) => {
    setSelectedGoalForHistory(goal);
    setShowDepositHistoryModal(true);
  };
  
  // Handle deleting a savings goal
  const handleDeleteSavingsGoal = async (goalId: string) => {
    setGoalToDelete(goalId);
    setShowDeleteConfirmation(true);
  };
  
  // Confirm delete savings goal
  const confirmDeleteSavingsGoal = async () => {
    if (goalToDelete) {
      try {
        const updatedGoals = savingsGoals.filter(goal => goal.id !== goalToDelete);
        setSavingsGoals(updatedGoals);
        await saveSavingsGoals(updatedGoals);
      } catch (error) {
        console.error('Error deleting savings goal:', error);
        Alert.alert('Error', 'Failed to delete savings goal. Please try again.');
      } finally {
        setShowDeleteConfirmation(false);
        setGoalToDelete(null);
      }
    }
  };
  
  // Cancel delete savings goal
  const cancelDeleteSavingsGoal = () => {
    setShowDeleteConfirmation(false);
    setGoalToDelete(null);
  };
  
  // Render savings goal item
  const renderSavingsGoalItem = ({ item }: { item: SavingsGoal }) => (
    <SavingsGoalItem
      goal={item}
      onPress={handleEditSavingsGoal}
      onDelete={handleDeleteSavingsGoal}
      onAddDeposit={handleAddDeposit}
      onViewHistory={handleViewDepositHistory}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
      calculateProgress={calculateProgress}
      categoryNames={CATEGORY_DISPLAY_NAMES}
    />
  );
  
  // Handle account press
  const handleAccountPress = (account: SavingsAccount) => {
    // Open edit modal for the account
    setSelectedAccount(account);
    setIsEditingAccount(true);
    setIsAccountFormModalVisible(true);
  };
  
  // Handle account deletion
  const handleDeleteAccount = (account: SavingsAccount) => {
    setAccountToDelete(account);
    setDeleteConfirmVisible(true);
  };

  // Confirm account deletion
  const confirmDeleteAccount = () => {
    if (accountToDelete) {
      const updatedAccounts = savingsAccounts.filter(acc => acc.id !== accountToDelete.id);
      setSavingsAccounts(updatedAccounts);
      saveSavingsAccounts(updatedAccounts);
      setDeleteConfirmVisible(false);
      setAccountToDelete(null);
    }
  };

  // Cancel account deletion
  const cancelDeleteAccount = () => {
    setDeleteConfirmVisible(false);
    setAccountToDelete(null);
  };

  // Render savings account item
  const renderSavingsAccountItem = ({ item }: { item: SavingsAccount }) => (
    <SavingsAccountItem
      account={item}
      onPress={handleAccountPress}
      formatCurrency={formatCurrency}
      onAdjust={(account) => {
        setSelectedAccount(account);
        setIsEditingAccount(true);
        setIsAccountFormModalVisible(true);
      }}
      onDelete={handleDeleteAccount}
    />
  );
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your savings goals...</Text>
      </View>
    );
  }
  
  return (
    <TouchableWithoutFeedback>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Savings</Text>
          </View>
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Savings</Text>
              <Text style={[styles.summaryValue, styles.totalSavingsValue]}>{formatCurrency(savingsStats.grandTotal)}</Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAddSavingsAccount}
            >
              <Icon name="bank-plus" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Add Savings Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAddSavingsGoal}
            >
              <Icon name="flag-plus" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Add Goal</Text>
            </TouchableOpacity>
          </View>
          
          {/* Accounts Section */}
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('accounts')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Accounts</Text>
            <Animated.View style={{ transform: [{ rotateZ: accountsRotateZ }] }}>
              <Icon 
                name="chevron-down"
                size={20} 
                color="#8E8E93" 
              />
            </Animated.View>
          </TouchableOpacity>
          
          <Animated.View style={{
            overflow: 'hidden',
            maxHeight: accountsHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500] // Adjust max height as needed
            }),
            opacity: accountsOpacity
          }}>
            {savingsAccounts.length > 0 ? (
              <View style={styles.accountsContainer}>
                <FlatList
                  data={savingsAccounts}
                  keyExtractor={(item) => item.id}
                  renderItem={renderSavingsAccountItem}
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.accountsListContainer}
                  scrollEnabled={false}
                />
              </View>
            ) : (
              <View style={styles.emptyAccountsContainer}>
                <Icon name="bank-outline" size={40} color="#CCCCCC" />
                <Text style={styles.emptyStateSubText}>
                  Add your first account
                </Text>
              </View>
            )}
          </Animated.View>
          
          {/* Goals Section */}
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('goals')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Goals</Text>
            <Animated.View style={{ transform: [{ rotateZ: goalsRotateZ }] }}>
              <Icon 
                name="chevron-down"
                size={20} 
                color="#8E8E93" 
              />
            </Animated.View>
          </TouchableOpacity>
          
          <Animated.View style={{
            overflow: 'hidden',
            maxHeight: goalsHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000] // Adjust max height as needed
            }),
            opacity: goalsOpacity
          }}>
            <FlatList
              data={filteredSavingsGoals}
              keyExtractor={(item) => item.id}
              renderItem={renderSavingsGoalItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              scrollEnabled={accountsExpanded}
              ListEmptyComponent={
                <View style={styles.emptyStateContainer}>
                  <Icon name="piggy-bank-outline" size={60} color="#CCCCCC" />
                  <Text style={styles.emptyStateText}>No goals found</Text>
                  <Text style={styles.emptyStateSubText}>
                    Add your first goal by tapping the "Add Goal" button
                  </Text>
                </View>
              }
            />
          </Animated.View>
          

          
          {/* Modals */}
          <SavingsGoalFormModal
            visible={isFormModalVisible}
            onClose={() => setIsFormModalVisible(false)}
            onSave={handleSaveSavingsGoal}
            goal={selectedGoal}
            isEditing={isEditing}
            categoryIcons={CATEGORY_ICONS}
            categoryNames={CATEGORY_DISPLAY_NAMES}
          />
          
          <SavingsAccountFormModal
            visible={isAccountFormModalVisible}
            onClose={() => setIsAccountFormModalVisible(false)}
            onSave={handleSaveSavingsAccount}
            account={selectedAccount}
            isEditing={isEditingAccount}
          />
          
          <DeleteConfirmationModal
            visible={showDeleteConfirmation}
            onCancel={cancelDeleteSavingsGoal}
            onConfirm={confirmDeleteSavingsGoal}
          />
          
          <SavingsDepositHistoryModal
            visible={showDepositHistoryModal}
            onClose={() => setShowDepositHistoryModal(false)}
            goal={selectedGoalForHistory}
            deposits={deposits}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
          
          {/* Account Delete Confirmation Dialog */}
          <ConfirmationDialog
            visible={deleteConfirmVisible}
            title="Delete Account"
            message={`Are you sure you want to delete ${accountToDelete?.name}?`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={confirmDeleteAccount}
            onCancel={cancelDeleteAccount}
            confirmButtonColor="#FF3B30"
          />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
  },
  totalSavingsValue: {
    color: '#007AFF',
  },
  summaryDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E5EA',
    marginHorizontal: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100, // Extra space for the add button
  },
  accountsContainer: {
    marginBottom: 16,
  },
  accountsListContainer: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  emptyAccountsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },

});

export default Savings;
