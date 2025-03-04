import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Alert,
  Modal,
  Pressable
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
  const [showOptions, setShowOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ x: 0, y: 0 });
  
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);
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
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name={goal.icon} size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.goalTitle} numberOfLines={1}>{goal.title}</Text>
          <TouchableOpacity 
            style={styles.addMoneyButton}
            onPress={() => setShowDepositInput(!showDepositInput)}
          >
            <Icon name="cash-plus" size={16} color="#007AFF" />
            <Text style={styles.addMoneyText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.optionsButton}
            onPress={(event) => {
              const { pageX, pageY } = event.nativeEvent;
              setOptionsPosition({ x: pageX, y: pageY });
              setShowOptions(!showOptions);
            }}
          >
            <Icon name="dots-vertical" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* Options Menu */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showOptions}
          onRequestClose={() => setShowOptions(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowOptions(false)}
          >
            <View style={[styles.optionsMenu, {
              position: 'absolute',
              top: optionsPosition.y - 70,
              right: 20,
            }]}>
              <TouchableOpacity 
                style={styles.optionItem}
                onPress={() => {
                  setShowOptions(false);
                  onViewHistory && onViewHistory(goal);
                }}
              >
                <Icon name="history" size={18} color="#007AFF" />
                <Text style={styles.optionText}>History</Text>
              </TouchableOpacity>
              <View style={styles.optionsDivider} />
              <TouchableOpacity 
                style={styles.optionItem}
                onPress={() => {
                  setShowOptions(false);
                  onDelete(goal.id);
                }}
              >
                <Icon name="trash-can-outline" size={18} color="#FF3B30" />
                <Text style={[styles.optionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <View style={styles.amountsRow}>
            <Text style={styles.currentAmount}>{formatCurrency(goal.currentAmount)}</Text>
            <Text style={styles.targetAmount}>{formatCurrency(goal.targetAmount)}</Text>
          </View>
          
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%']
                    })
                  },
                  progress >= 100 ? styles.progressComplete : null
                ]} 
              />
            </View>
            
            <Animated.View 
              style={[styles.progressIndicator, { 
                left: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['2%', '98%']
                })
              }]}>
              <Icon name="triangle" size={12} color="#007AFF" style={styles.progressArrow} />
              <View style={styles.progressBubble}>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
            </Animated.View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  goalContainer: {
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
    marginRight: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  targetAmount: {
    fontSize: 15,
    color: '#8E8E93',
  },
  progressBarWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
    position: 'relative',
    marginBottom: 16,
    marginHorizontal: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    minWidth: 6,
  },
  progressComplete: {
    backgroundColor: '#34C759',
  },
  progressIndicator: {
    position: 'absolute',
    top: 14,
    left: 0,
    transform: [{ translateX: '-50%' }],
    alignItems: 'center',
    zIndex: 2,
  },
  progressBubble: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    minWidth: 45,
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressArrow: {
    transform: [{ rotate: '0deg' }],
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addMoneyText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  optionsButton: {
    padding: 8,
    width: 32,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    width: 160,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  optionsDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 0,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#007AFF',
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
