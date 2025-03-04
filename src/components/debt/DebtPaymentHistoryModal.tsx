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
import { DebtProduct, Payment } from '../../screens/Debt';

interface DebtPaymentHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  product: DebtProduct | null;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const DebtPaymentHistoryModal: React.FC<DebtPaymentHistoryModalProps> = ({
  visible,
  onClose,
  product,
  formatCurrency,
  formatDate,
}) => {
  if (!product) return null;

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentAmount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.paymentDate}>{formatDate(item.date)}</Text>
      </View>
      {item.note && (
        <Text style={styles.paymentNote}>{item.note}</Text>
      )}
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="cash-remove" size={48} color="#C7C7CC" />
      <Text style={styles.emptyText}>No payment history yet</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Payment History</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productType}>
              {product.type === 'credit-card' ? 'Credit Card' : 'Loan'}
            </Text>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current Balance</Text>
              <Text style={styles.summaryValue}>{formatCurrency(product.balance)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Payments</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  (product.payments || []).reduce((sum, payment) => sum + payment.amount, 0)
                )}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>All Payments</Text>
          
          <FlatList
            data={product.payments?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
            renderItem={renderPaymentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  productHeader: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  productType: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9E9EB',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  paymentItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  paymentDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  paymentNote: {
    fontSize: 14,
    color: '#3A3A3C',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default DebtPaymentHistoryModal;
