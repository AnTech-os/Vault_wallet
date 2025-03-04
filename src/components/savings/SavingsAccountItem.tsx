import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

interface SavingsAccountItemProps {
  account: SavingsAccount;
  onPress: (account: SavingsAccount) => void;
  formatCurrency: (amount: number) => string;
  onAdjust?: (account: SavingsAccount) => void;
  onDelete?: (account: SavingsAccount) => void;
}

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

// Account type icons
const ACCOUNT_TYPE_ICONS: Record<string, string> = {
  'savings': 'piggy-bank',
  'checking': 'cash-multiple',
  'cd': 'certificate',
  'money_market': 'chart-line',
  'high_yield': 'trending-up',
  'other': 'bank-outline',
};

const SavingsAccountItem: React.FC<SavingsAccountItemProps> = ({ 
  account, 
  onPress,
  formatCurrency,
  onAdjust,
  onDelete
}) => {
  const [showOptions, setShowOptions] = useState(false);
  // Get appropriate icon based on account type
  const getAccountIcon = () => {
    return ACCOUNT_TYPE_ICONS[account.accountType] || ACCOUNT_TYPE_ICONS.other;
  };

  // Calculate monthly interest
  const calculateMonthlyInterest = () => {
    return (account.balance * (account.apy / 100)) / 12;
  };

  // Format account type for display
  const formatAccountType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Calculate monthly interest
  const monthlyInterest = calculateMonthlyInterest();
  const monthlyInterestFormatted = formatCurrency(monthlyInterest);
  
  // Store position of options button for menu placement
  const [optionsPosition, setOptionsPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const handleOptionSelect = (option: 'adjust' | 'delete') => {
    setShowOptions(false);
    
    if (option === 'adjust' && onAdjust) {
      onAdjust(account);
    } else if (option === 'delete' && onDelete) {
      onDelete(account);
    }
  };
  
  const measureOptionsButton = (event: any) => {
    // Get the position of the button relative to the screen
    event.target.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      // Store both the relative and absolute positions
      setOptionsPosition({
        x: px,
        y: py, // Absolute y position on screen
        width,
        height
      });
    });
  };
  
  // Handle options button press
  const handleOptionsPress = () => {
    setShowOptions(true);
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(account)}
      activeOpacity={0.7}
    >
      <View style={styles.mainRow}>
        {/* Left section: Account name and institution */}
        <View style={styles.leftSection}>
          <Text style={styles.accountName} numberOfLines={1} ellipsizeMode="tail">
            {account.name}
          </Text>
          <Text style={styles.institution} numberOfLines={1} ellipsizeMode="tail">
            {account.institution || formatAccountType(account.accountType)}
          </Text>
        </View>
        
        {/* Middle section: APY and monthly interest */}
        <View style={styles.middleSection}>
          <View style={styles.labelValueContainer}>
            <Text style={styles.inlineLabel}>APY</Text>
            <Text style={styles.apyValue}>{account.apy.toFixed(2)}%</Text>
          </View>
          
          <View style={styles.labelValueContainer}>
            <View style={styles.labelPlaceholder}>
              <Icon name="trending-up" size={14} color="#4CD964" style={styles.interestIcon} />
            </View>
            <Text style={styles.interestValue}>{monthlyInterestFormatted}<Text style={styles.interestPeriod}>/mo</Text></Text>
          </View>
        </View>
        
        {/* Right section: Balance and options */}
        <View style={styles.rightSection}>
          <Text style={styles.balanceAmount} numberOfLines={1}>{formatCurrency(account.balance)}</Text>
          
          <TouchableOpacity 
            style={styles.optionsButton}
            onPress={handleOptionsPress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onLayout={measureOptionsButton}
          >
            <Icon name="dots-vertical" size={18} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Options Modal */}
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={[styles.optionsMenu, { 
            position: 'absolute',
            right: 16,
            top: optionsPosition.y + optionsPosition.height + 5,
          }]}>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => handleOptionSelect('adjust')}
            >
              <Icon name="pencil" size={20} color="#007AFF" />
              <Text style={styles.optionText}>Adjust</Text>
            </TouchableOpacity>
            
            <View style={styles.optionDivider} />
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => handleOptionSelect('delete')}
            >
              <Icon name="delete" size={20} color="#FF3B30" />
              <Text style={[styles.optionText, { color: '#FF3B30' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
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
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 4,
    marginRight: 4,
    maxWidth: '50%',
  },
  middleSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingLeft: 0,
    paddingRight: 8,
    minWidth: 100,
  },
  labelValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    width: '100%',
  },
  labelPlaceholder: {
    width: 28,
    alignItems: 'flex-start',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minWidth: 90, // Ensure minimum width for balance
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 3,
  },
  institution: {
    fontSize: 13,
    color: '#8E8E93',
  },
  inlineValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineLabel: {
    fontSize: 13,
    color: '#8E8E93',
    width: 28,
    textAlign: 'left',
  },
  apyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  interestValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CD964',
    marginLeft: 0,
  },
  interestIcon: {
    marginRight: 0,
  },
  interestPeriod: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8E8E93',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginRight: 8,
    flexShrink: 0, // Prevent text from wrapping
  },
  optionsButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionsMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    width: 140,
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#007AFF',
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
  },
});

export default SavingsAccountItem;
