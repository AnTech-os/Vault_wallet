import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Custom dropdown instead of Picker

// Interface for savings account
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

// Props interface
interface SavingsAccountFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (account: SavingsAccount) => void;
  account?: SavingsAccount;
  isEditing?: boolean;
}

// Account types
const ACCOUNT_TYPES = [
  { value: 'savings', label: 'Savings Account' },
  { value: 'checking', label: 'Checking Account' },
  { value: 'cd', label: 'Certificate of Deposit (CD)' },
  { value: 'money_market', label: 'Money Market Account' },
  { value: 'high_yield', label: 'High-Yield Savings' },
  { value: 'other', label: 'Other' },
];

// Bank icons for common institutions
const BANK_ICONS: Record<string, string> = {
  'chase': 'bank',
  'bank_of_america': 'bank',
  'wells_fargo': 'bank',
  'citibank': 'bank',
  'capital_one': 'bank',
  'discover': 'credit-card',
  'ally': 'bank',
  'other': 'bank-outline',
};

const SavingsAccountFormModal: React.FC<SavingsAccountFormModalProps> = ({
  visible,
  onClose,
  onSave,
  account,
  isEditing = false
}) => {
  // State variables
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [apy, setApy] = useState('');
  const [institution, setInstitution] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [showDepositWithdrawal, setShowDepositWithdrawal] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [isDeposit, setIsDeposit] = useState(true);

  // Initialize form when modal opens
  useEffect(() => {
    if (visible) {
      if (isEditing && account) {
        // Populate form with existing account data
        setName(account.name);
        setBalance(account.balance.toString());
        setApy(account.apy.toString());
        setInstitution(account.institution);
        setAccountType(account.accountType);
      } else {
        // Default values for new account
        setName('');
        setBalance('');
        setApy('1.5'); // Default APY
        setInstitution('');
        setAccountType('savings');
      }
      // Reset transaction form
      setShowDepositWithdrawal(false);
      setTransactionAmount('');
      setIsDeposit(true);
    }
  }, [visible, isEditing, account]);

  // Calculate monthly interest based on current balance and APY
  const calculateMonthlyInterest = () => {
    const balanceNum = parseFloat(balance) || 0;
    const apyNum = parseFloat(apy) || 0;
    
    // Monthly interest = (Balance * APY/100) / 12
    const monthlyInterest = (balanceNum * (apyNum / 100)) / 12;
    return monthlyInterest.toFixed(2);
  };

  // Handle transaction (deposit or withdrawal)
  const handleTransaction = () => {
    const amountNum = parseFloat(transactionAmount) || 0;
    if (amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0.');
      return;
    }

    const balanceNum = parseFloat(balance) || 0;
    let newBalance;
    
    if (isDeposit) {
      newBalance = balanceNum + amountNum;
    } else {
      // Check if withdrawal amount exceeds balance
      if (amountNum > balanceNum) {
        Alert.alert('Error', 'Withdrawal amount cannot exceed current balance.');
        return;
      }
      newBalance = balanceNum - amountNum;
    }
    
    setBalance(newBalance.toString());
    setTransactionAmount('');
    setShowDepositWithdrawal(false);
  };

  // Validate and save account
  const handleSave = () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an account name.');
      return;
    }
    
    const balanceNum = parseFloat(balance);
    if (isNaN(balanceNum) || balanceNum < 0) {
      Alert.alert('Error', 'Please enter a valid balance amount.');
      return;
    }
    
    const apyNum = parseFloat(apy);
    if (isNaN(apyNum) || apyNum < 0) {
      Alert.alert('Error', 'Please enter a valid APY percentage.');
      return;
    }
    
    // Create account object
    const accountData: SavingsAccount = {
      id: isEditing && account ? account.id : `account-${Date.now()}`,
      name: name.trim(),
      balance: balanceNum,
      apy: apyNum,
      institution: institution.trim(),
      accountType,
      createdAt: isEditing && account ? account.createdAt : new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    // Save account
    onSave(accountData);
    onClose();
  };

  // Format currency
  const formatCurrency = (value: string) => {
    return `$${parseFloat(value || '0').toFixed(2)}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Savings Account' : 'New Savings Account'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Icon name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContentContainer}>
            {/* Account Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Emergency Fund Savings"
                placeholderTextColor="#C7C7CC"
              />
            </View>
            
            {/* Institution Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Financial Institution</Text>
              <TextInput
                style={styles.textInput}
                value={institution}
                onChangeText={setInstitution}
                placeholder="e.g., Chase, Bank of America"
                placeholderTextColor="#C7C7CC"
              />
            </View>
            
            {/* Account Type Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Type</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => {
                  // Show a simple alert with options for now
                  Alert.alert(
                    'Select Account Type',
                    '',
                    [
                      ...ACCOUNT_TYPES.map(type => ({
                        text: type.label,
                        onPress: () => setAccountType(type.value)
                      })),
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {ACCOUNT_TYPES.find(type => type.value === accountType)?.label || 'Select Account Type'}
                </Text>
                <Icon name="chevron-down" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            {/* Balance and Transaction Section */}
            <View style={styles.inputGroup}>
              <View style={styles.balanceHeader}>
                <Text style={styles.inputLabel}>Current Balance</Text>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => setShowDepositWithdrawal(!showDepositWithdrawal)}
                >
                  <Text style={styles.adjustButtonText}>
                    {showDepositWithdrawal ? 'Cancel' : 'Adjust Balance'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.currencyInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.currencyInput}
                  value={balance}
                  onChangeText={setBalance}
                  placeholder="0.00"
                  placeholderTextColor="#C7C7CC"
                  keyboardType="decimal-pad"
                />
              </View>
              
              {/* Deposit/Withdrawal Form */}
              {showDepositWithdrawal && (
                <View style={styles.transactionContainer}>
                  <View style={styles.transactionTypeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.transactionTypeButton,
                        isDeposit && styles.activeTransactionType
                      ]}
                      onPress={() => setIsDeposit(true)}
                    >
                      <Icon 
                        name="arrow-down-bold-circle-outline" 
                        size={20} 
                        color={isDeposit ? '#FFFFFF' : '#333333'} 
                      />
                      <Text style={[
                        styles.transactionTypeText,
                        isDeposit && styles.activeTransactionTypeText
                      ]}>
                        Deposit
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.transactionTypeButton,
                        !isDeposit && styles.activeTransactionType
                      ]}
                      onPress={() => setIsDeposit(false)}
                    >
                      <Icon 
                        name="arrow-up-bold-circle-outline" 
                        size={20} 
                        color={!isDeposit ? '#FFFFFF' : '#333333'} 
                      />
                      <Text style={[
                        styles.transactionTypeText,
                        !isDeposit && styles.activeTransactionTypeText
                      ]}>
                        Withdraw
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.transactionInputRow}>
                    <View style={styles.transactionInputContainer}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.currencyInput}
                        value={transactionAmount}
                        onChangeText={setTransactionAmount}
                        placeholder="0.00"
                        placeholderTextColor="#C7C7CC"
                        keyboardType="decimal-pad"
                      />
                    </View>
                    
                    <TouchableOpacity
                      style={styles.applyButton}
                      onPress={handleTransaction}
                    >
                      <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            
            {/* APY Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Annual Percentage Yield (APY)</Text>
              <View style={styles.apyInputContainer}>
                <TextInput
                  style={styles.apyInput}
                  value={apy}
                  onChangeText={setApy}
                  placeholder="1.50"
                  placeholderTextColor="#C7C7CC"
                  keyboardType="decimal-pad"
                />
                <Text style={styles.percentSymbol}>%</Text>
              </View>
            </View>
            
            {/* Monthly Interest Calculation */}
            <View style={styles.interestContainer}>
              <Text style={styles.interestLabel}>Estimated Monthly Interest</Text>
              <Text style={styles.interestValue}>${calculateMonthlyInterest()}</Text>
              <Text style={styles.interestNote}>
                Based on current balance and APY
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 0,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    maxHeight: '80%',
  },
  formContentContainer: {
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333333',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adjustButton: {
    padding: 4,
  },
  adjustButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#333333',
    marginRight: 4,
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  transactionContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  transactionTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
  },
  activeTransactionType: {
    backgroundColor: '#007AFF',
  },
  transactionTypeText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTransactionTypeText: {
    color: '#FFFFFF',
  },
  transactionInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  apyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  apyInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  percentSymbol: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 4,
  },
  interestContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  interestLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  interestValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  interestNote: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginLeft: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default SavingsAccountFormModal;
