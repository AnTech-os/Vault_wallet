import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';

// Import the debt components
import DebtProductItem from '../components/debt/DebtProductItem';
import DebtProductFormModal from '../components/debt/DebtProductFormModal';
import DebtPaymentHistoryModal from '../components/debt/DebtPaymentHistoryModal';
import DeleteConfirmationModal from '../components/debt/DeleteConfirmationModal';
import DebtStrategyModal, { DebtRepaymentStrategy } from '../components/debt/DebtStrategyModal';

interface Payment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

interface DebtProduct {
  id: string;
  name: string;
  type: 'credit-card' | 'loan';
  balance: number;
  interestRate: number;
  dueDate?: string;
  paymentDue: number;
  paymentsMade?: number;
  totalPayments?: number;
  payments?: Payment[];
  createdAt: string;
  lastUpdated: string;
}

const Debt = () => {
  // State for debt products
  const [debtProducts, setDebtProducts] = useState<DebtProduct[]>([
    { 
      id: '1',
      name: 'Chase Sapphire',
      type: 'credit-card',
      balance: 4500,
      interestRate: 19.24,
      dueDate: '2025-03-25T00:00:00.000Z',
      paymentDue: 150,
      createdAt: '2023-01-15T00:00:00.000Z',
      lastUpdated: '2023-01-15T00:00:00.000Z',
      payments: [
        {
          id: uuid.v4().toString(),
          amount: 150,
          date: '2023-02-15T00:00:00.000Z',
          note: 'February payment'
        },
        {
          id: uuid.v4().toString(),
          amount: 150,
          date: '2023-03-15T00:00:00.000Z',
          note: 'March payment'
        }
      ]
    },
    {
      id: '2',
      name: 'Student Loan',
      type: 'loan',
      balance: 20000,
      interestRate: 4.5,
      paymentDue: 500,
      totalPayments: 60,
      paymentsMade: 12,
      dueDate: '2025-04-15T00:00:00.000Z',
      createdAt: '2022-05-10T00:00:00.000Z',
      lastUpdated: '2022-05-10T00:00:00.000Z',
      payments: [
        {
          id: uuid.v4().toString(),
          amount: 500,
          date: '2023-01-15T00:00:00.000Z',
          note: 'January payment'
        },
        {
          id: uuid.v4().toString(),
          amount: 500,
          date: '2023-02-15T00:00:00.000Z',
          note: 'February payment'
        }
      ]
    },
  ]);
  
  // State for modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DebtProduct | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Debt repayment strategy state
  const [repaymentStrategy, setRepaymentStrategy] = useState<DebtRepaymentStrategy>('avalanche');
  
  // Calculate total debt and monthly payments
  const totalDebt = debtProducts.reduce((sum, product) => sum + product.balance, 0);
  const monthlyPayment = debtProducts.reduce((sum, product) => sum + product.paymentDue, 0);
  const interestAccrued = debtProducts.reduce(
    (sum, product) => sum + (product.balance * product.interestRate) / 1200, 0
  );
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = (current: number, total: number) => {
    if (total <= 0) return 0;
    const percentage = (current / total) * 100;
    return Math.min(Math.round(percentage), 100);
  };
  
  // Sort debt products based on selected strategy
  const getSortedDebtProducts = useCallback(() => {
    // First separate paid and unpaid debt products
    const paidProducts = debtProducts.filter(product => product.balance === 0);
    const unpaidProducts = debtProducts.filter(product => product.balance > 0);
    
    // Sort unpaid products based on strategy
    let sortedUnpaidProducts;
    if (repaymentStrategy === 'avalanche') {
      // Sort by highest interest rate first
      sortedUnpaidProducts = [...unpaidProducts].sort((a, b) => b.interestRate - a.interestRate);
    } else {
      // Sort by lowest balance first (snowball)
      sortedUnpaidProducts = [...unpaidProducts].sort((a, b) => a.balance - b.balance);
    }
    
    // Sort paid products by name (or any other criteria)
    const sortedPaidProducts = [...paidProducts].sort((a, b) => a.name.localeCompare(b.name));
    
    // Return unpaid products first, then paid products
    return [...sortedUnpaidProducts, ...sortedPaidProducts];
  }, [debtProducts, repaymentStrategy]);
  
  // Handle adding a new debt product
  const handleAddProduct = (product: DebtProduct) => {
    if (isEditing) {
      setDebtProducts(prevProducts => 
        prevProducts.map(p => p.id === product.id ? product : p)
      );
    } else {
      setDebtProducts(prevProducts => [...prevProducts, product]);
    }
  };
  
  // Handle editing a debt product
  const handleEditProduct = (product: DebtProduct) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowAddProductModal(true);
  };
  
  // Handle deleting a debt product
  const handleDeleteProduct = (id: string) => {
    setDebtProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    setShowDeleteModal(false);
  };
  
  // Handle adding a payment to a debt product
  const handleAddPayment = (id: string, amount: number) => {
    const newPayment = {
      id: uuid.v4().toString(),
      amount,
      date: new Date().toISOString(),
    };
    
    setDebtProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === id) {
          // Update balance
          const newBalance = Math.max(0, product.balance - amount);
          
          // Update payments array
          const payments = product.payments ? [...product.payments, newPayment] : [newPayment];
          
          // Update payments made count if available
          const paymentsMade = product.paymentsMade 
            ? Math.min(product.paymentsMade + 1, product.totalPayments || 0)
            : undefined;
          
          return {
            ...product,
            balance: newBalance,
            payments,
            paymentsMade,
            lastUpdated: new Date().toISOString()
          };
        }
        return product;
      })
    );
  };
  
  // Handle viewing payment history
  const handleViewPaymentHistory = (product: DebtProduct) => {
    setSelectedProduct(product);
    setShowPaymentHistoryModal(true);
  };
  
  // Handle strategy change
  const handleStrategyChange = (strategy: DebtRepaymentStrategy) => {
    setRepaymentStrategy(strategy);
  };
  
  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Add Button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Debt Tracker</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setSelectedProduct(null);
              setIsEditing(false);
              setShowAddProductModal(true);
            }}
          >
            <Icon name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Total Debt Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryColumn}>
              <Text style={styles.summaryLabel}>Total Debt</Text>
              <Text style={styles.totalAmount}>{formatCurrency(totalDebt)}</Text>
            </View>
            <View style={styles.summaryColumn}>
              <Text style={styles.secondaryText}>
                Monthly Payment: {formatCurrency(monthlyPayment)}
              </Text>
              <Text style={styles.secondaryText}>
                Interest Accruing: {formatCurrency(interestAccrued)}/mo
              </Text>
            </View>
          </View>
        </View>

        {/* Repayment Strategy */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Repayment Strategy</Text>
            <TouchableOpacity 
              style={styles.strategyButton}
              onPress={() => setShowStrategyModal(true)}
            >
              <Icon 
                name={repaymentStrategy === 'avalanche' ? 'arrow-down-bold' : 'snowflake'} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text style={styles.strategyButtonText}>
                {repaymentStrategy === 'avalanche' ? 'Avalanche' : 'Snowball'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.planInfo}>
            <Text style={styles.planName}>
              {repaymentStrategy === 'avalanche' 
                ? 'Avalanche Method (Highest Interest First)' 
                : 'Snowball Method (Lowest Balance First)'}
            </Text>
            <Text style={styles.planDetails}>
              Projected payoff date: {repaymentStrategy === 'avalanche' ? 'March 2026' : 'May 2026'}
            </Text>
          </View>
        </View>

        {/* Debt Products List */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Debt Products</Text>
            <Text style={styles.strategySummary}>
              {(() => {
                const unpaidProducts = debtProducts.filter(product => product.balance > 0);
                if (unpaidProducts.length === 0) {
                  return 'All debts paid off!';
                }
                
                let focusProduct;
                if (repaymentStrategy === 'avalanche') {
                  focusProduct = [...unpaidProducts].sort((a, b) => b.interestRate - a.interestRate)[0];
                  return `Focus on highest interest: ${focusProduct.name}`;
                } else {
                  focusProduct = [...unpaidProducts].sort((a, b) => a.balance - b.balance)[0];
                  return `Focus on lowest balance: ${focusProduct.name}`;
                }
              })()}
            </Text>
          </View>
          
          {debtProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="credit-card-off" size={48} color="#C7C7CC" />
              <Text style={styles.emptyStateText}>No debt products added yet</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => {
                  setSelectedProduct(null);
                  setIsEditing(false);
                  setShowAddProductModal(true);
                }}
              >
                <Text style={styles.emptyStateButtonText}>Add Your First Debt</Text>
              </TouchableOpacity>
            </View>
          ) : (
            getSortedDebtProducts().map((product, index) => (
              <DebtProductItem
                key={product.id}
                product={product}
                priority={index === 0 && product.balance > 0}
                onPress={handleEditProduct}
                onDelete={(id) => {
                  setSelectedProduct(product);
                  setShowDeleteModal(true);
                }}
                onAddPayment={handleAddPayment}
                onViewHistory={handleViewPaymentHistory}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                calculateProgress={calculateProgress}
              />
            ))
          )}
        </View>
      </ScrollView>
      
      {/* Modals */}
      <DebtProductFormModal
        visible={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onSave={handleAddProduct}
        product={selectedProduct}
        isEditing={isEditing}
      />
      
      <DebtPaymentHistoryModal
        visible={showPaymentHistoryModal}
        onClose={() => setShowPaymentHistoryModal(false)}
        product={selectedProduct}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
      
      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteProduct(selectedProduct?.id || '')}
        itemName={selectedProduct?.name || ''}
      />
      
      <DebtStrategyModal
        visible={showStrategyModal}
        onClose={() => setShowStrategyModal(false)}
        onSelectStrategy={handleStrategyChange}
        currentStrategy={repaymentStrategy}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  strategyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  strategyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryColumn: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  secondaryText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'right',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },

  planInfo: {
    marginBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  planDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  productsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  strategySummary: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  actionButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default Debt;
