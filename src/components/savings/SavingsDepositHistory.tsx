import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Deposit {
  id: string;
  amount: number;
  date: string;
  goalId: string;
}

interface SavingsDepositHistoryProps {
  deposits: Deposit[];
  goalId: string;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const SavingsDepositHistory: React.FC<SavingsDepositHistoryProps> = ({
  deposits,
  goalId,
  formatCurrency,
  formatDate
}) => {
  // Filter deposits for this goal
  const goalDeposits = deposits.filter(deposit => deposit.goalId === goalId);
  
  // Sort deposits by date (newest first)
  const sortedDeposits = [...goalDeposits].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
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
      <Icon name="cash-remove" size={36} color="#C7C7CC" />
      <Text style={styles.emptyText}>No deposits yet</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Recent Deposits ({sortedDeposits.length})
        </Text>
      </View>
      
      <FlatList
        data={sortedDeposits.slice(0, 3)} // Show only the 3 most recent deposits
        renderItem={renderDepositItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
      
      {sortedDeposits.length > 3 && (
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Deposits</Text>
          <Icon name="chevron-right" size={16} color="#007AFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContainer: {
    marginBottom: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  listContent: {
    flexGrow: 1,
  },
  depositItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 4,
  },
});

export default SavingsDepositHistory;
