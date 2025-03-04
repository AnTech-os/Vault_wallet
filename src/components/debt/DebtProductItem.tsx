import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DebtProduct } from '../../screens/Debt';

interface DebtProductItemProps {
  product: DebtProduct;
  onPress: (product: DebtProduct) => void;
  onDelete: (id: string) => void;
  onAddPayment: (id: string, amount: number) => void;
  onViewHistory: (product: DebtProduct) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  calculateProgress: (current: number, total: number) => number;
  priority?: boolean;
}

const DebtProductItem: React.FC<DebtProductItemProps> = ({
  product,
  onPress,
  onDelete,
  onAddPayment,
  onViewHistory,
  formatCurrency,
  formatDate,
  calculateProgress,
  priority = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleAddPayment = () => {
    Alert.prompt(
      'Make a Payment',
      `Enter payment amount for ${product.name}:`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: (value) => {
            const amount = parseFloat(value || '0');
            if (!isNaN(amount) && amount > 0) {
              onAddPayment(product.id, amount);
            } else {
              Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
            }
          },
        },
      ],
      'plain-text',
      product.paymentDue.toString(),
    );
  };

  // Calculate progress percentage if applicable
  const progressPercentage = product.paymentsMade && product.totalPayments
    ? calculateProgress(product.paymentsMade, product.totalPayments)
    : null;

  return (
    <View style={[styles.container, priority && styles.priorityContainer]}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        onLongPress={() => onPress(product)}
        activeOpacity={0.7}
      >
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, priority && styles.priorityName]}>{product.name}</Text>
            {priority && (
              <View style={styles.priorityBadge}>
                <Icon name="star" size={12} color="#FFFFFF" />
                <Text style={styles.priorityText}>FOCUS</Text>
              </View>
            )}
            <Icon 
              name={expanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#8E8E93" 
              style={styles.expandIcon}
            />
          </View>
          <Text style={styles.type}>
            {product.type === 'credit-card' ? 'Credit Card' : 'Loan'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.balanceText}>{formatCurrency(product.balance)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(product.id)}
          >
            <Icon name="trash-can-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Interest Rate</Text>
            <Text style={styles.value}>{product.interestRate}%</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Monthly Payment</Text>
            <Text style={styles.value}>{formatCurrency(product.paymentDue)}</Text>
          </View>
          
          {product.dueDate && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Due Date</Text>
              <Text style={styles.value}>{formatDate(product.dueDate)}</Text>
            </View>
          )}
          
          {progressPercentage !== null && (
            <View style={styles.progressContainer}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>Payment Progress</Text>
                <Text style={styles.progressText}>
                  {product.paymentsMade}/{product.totalPayments} ({progressPercentage}%)
                </Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
            </View>
          )}
          
          <View style={styles.lastUpdated}>
            <Text style={styles.lastUpdatedText}>
              Last updated: {formatDate(product.lastUpdated)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleAddPayment}
        >
          <Icon name="cash-plus" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Make Payment</Text>
        </TouchableOpacity>
        
        {expanded && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => onViewHistory(product)}
          >
            <Icon name="history" size={16} color="#FF3B30" />
            <Text style={styles.secondaryButtonText}>Payment History</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityContainer: {
    borderWidth: 2,
    borderColor: '#FF9500',
    backgroundColor: '#FFFAF0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandIcon: {
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  priorityName: {
    color: '#FF9500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  type: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E9E9EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF3B30',
    borderRadius: 4,
  },
  lastUpdated: {
    marginTop: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    marginRight: 0,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default DebtProductItem;
