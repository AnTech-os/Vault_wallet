import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Deposit {
  id: string;
  amount: number;
  date: string;
  goalId: string;
}

interface SavingsDepositHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  goal: {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
  } | null;
  deposits: Deposit[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const SavingsDepositHistoryModal: React.FC<SavingsDepositHistoryModalProps> = ({
  visible,
  onClose,
  goal,
  deposits,
  formatCurrency,
  formatDate
}) => {
  if (!goal) return null;
  
  // Filter deposits for this goal
  const goalDeposits = deposits.filter(deposit => deposit.goalId === goal.id);
  
  // Sort deposits by date (newest first)
  const sortedDeposits = [...goalDeposits].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate total deposits
  const totalDeposits = goalDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  
  // Render each deposit item
  const renderDepositItem = ({ item }: { item: Deposit }) => (
    <View style={styles.depositItem}>
      <View style={styles.depositInfo}>
        <Text style={styles.depositAmount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.depositDate}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="cash-remove" size={48} color="#C7C7CC" />
      <Text style={styles.emptyText}>No deposits yet</Text>
      <Text style={styles.emptySubText}>
        Add your first deposit to start tracking your progress towards this goal.
      </Text>
    </View>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="chevron-down" size={24} color="#8E8E93" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Deposit History</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.goalInfoContainer}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <View style={styles.goalAmounts}>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Current</Text>
                <Text style={styles.amountValue}>{formatCurrency(goal.currentAmount)}</Text>
              </View>
              
              <View style={styles.amountDivider} />
              
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Target</Text>
                <Text style={styles.amountValue}>{formatCurrency(goal.targetAmount)}</Text>
              </View>
              
              <View style={styles.amountDivider} />
              
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Total Deposits</Text>
                <Text style={styles.amountValue}>{formatCurrency(totalDeposits)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.listHeaderContainer}>
            <Text style={styles.listHeaderText}>
              {sortedDeposits.length} {sortedDeposits.length === 1 ? 'Deposit' : 'Deposits'}
            </Text>
          </View>
          
          <FlatList
            data={sortedDeposits}
            renderItem={renderDepositItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 50,
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
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 32,
  },
  goalInfoContainer: {
    padding: 16,
    backgroundColor: '#F2F2F7',
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  amountDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5EA',
  },
  listHeaderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  depositItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  depositInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  depositAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  depositDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
});

export default SavingsDepositHistoryModal;
