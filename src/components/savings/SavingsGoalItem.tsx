import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SavingsGoalItemProps {
  goal: {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: string;
    icon: string;
  };
  onPress: (goal: any) => void;
  onDelete: (id: string) => void;
  onAddDeposit: (id: string, amount: number) => void;
  onViewHistory?: (goal: any) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  calculateProgress: (current: number, target: number) => number;
  categoryNames: { [key: string]: string };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SavingsGoalItem: React.FC<SavingsGoalItemProps> = ({
  goal,
  onPress,
  onDelete,
  onAddDeposit,
  onViewHistory,
  formatCurrency,
  formatDate,
  calculateProgress,
  categoryNames
}) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositInput, setShowDepositInput] = useState(false);
  
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const remaining = goal.targetAmount - goal.currentAmount;
  
  // Handle deposit submission
  const handleDepositSubmit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid deposit amount greater than 0.');
      return;
    }
    
    onAddDeposit(goal.id, amount);
    setDepositAmount('');
    setShowDepositInput(false);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.goalContainer}
        onPress={() => onPress(goal)}
        activeOpacity={0.7}
      >
        <View style={styles.topRow}>
          <View style={styles.titleContainer}>
            <Icon name={goal.icon} size={24} color="#007AFF" style={styles.icon} />
            <View>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalCategory}>{categoryNames[goal.category]}</Text>
            </View>
          </View>
          
          <View style={styles.amountsContainer}>
            <Text style={styles.currentAmount}>{formatCurrency(goal.currentAmount)}</Text>
            <Text style={styles.targetAmount}>of {formatCurrency(goal.targetAmount)}</Text>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${progress}%` },
                progress >= 100 ? styles.progressComplete : null
              ]} 
            />
          </View>
          
          <View style={styles.progressDetails}>
            <Text style={styles.progressText}>{progress}% Complete</Text>
            <Text style={styles.targetDateText}>Target: {formatDate(goal.targetDate)}</Text>
          </View>
        </View>
        
        <View style={styles.bottomRow}>
          <Text style={styles.remainingText}>
            {remaining > 0 
              ? `${formatCurrency(remaining)} left to goal` 
              : 'Goal completed! 🎉'}
          </Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowDepositInput(!showDepositInput)}
            >
              <Icon name="cash-plus" size={18} color="#007AFF" />
              <Text style={styles.actionText}>Add</Text>
            </TouchableOpacity>
            
            {onViewHistory && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onViewHistory(goal)}
              >
                <Icon name="history" size={18} color="#007AFF" />
                <Text style={styles.actionText}>History</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(goal.id)}
            >
              <Icon name="trash-can-outline" size={18} color="#FF3B30" />
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {showDepositInput && (
          <View style={styles.depositInputContainer}>
            <Text style={styles.depositLabel}>Add Deposit:</Text>
            <View style={styles.depositInputRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.depositInput}
                value={depositAmount}
                onChangeText={setDepositAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                autoFocus
              />
              <TouchableOpacity 
                style={styles.depositButton}
                onPress={handleDepositSubmit}
              >
                <Text style={styles.depositButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setDepositAmount('');
                  setShowDepositInput(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalContainer: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  goalCategory: {
    fontSize: 14,
    color: '#8E8E93',
  },
  amountsContainer: {
    alignItems: 'flex-end',
  },
  currentAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  targetAmount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  progressComplete: {
    backgroundColor: '#5856D6',
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  targetDateText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FFEBEB',
  },
  actionText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 4,
  },
  deleteText: {
    color: '#FF3B30',
  },
  depositInputContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  depositLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  depositInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginRight: 4,
  },
  depositInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  depositButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  depositButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#8E8E93',
    fontSize: 14,
  },
});

export default SavingsGoalItem;
