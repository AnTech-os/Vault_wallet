import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';
import { DebtProduct } from '../../screens/Debt';

interface DebtProductFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (product: DebtProduct) => void;
  product: DebtProduct | null;
  isEditing: boolean;
}

const DebtProductFormModal: React.FC<DebtProductFormModalProps> = ({
  visible,
  onClose,
  onSave,
  product,
  isEditing,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'credit-card' | 'loan'>('credit-card');
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentDue, setPaymentDue] = useState('');
  const [hasPaymentSchedule, setHasPaymentSchedule] = useState(false);
  const [totalPayments, setTotalPayments] = useState('');
  const [paymentsMade, setPaymentsMade] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      if (isEditing && product) {
        // Populate form with product data
        setName(product.name);
        setType(product.type);
        setBalance(product.balance.toString());
        setInterestRate(product.interestRate.toString());
        setDueDate(product.dueDate || '');
        setPaymentDue(product.paymentDue.toString());
        setHasPaymentSchedule(!!product.totalPayments);
        setTotalPayments(product.totalPayments?.toString() || '');
        setPaymentsMade(product.paymentsMade?.toString() || '');
      } else {
        // Reset form for new product
        setName('');
        setType('credit-card');
        setBalance('');
        setInterestRate('');
        setDueDate('');
        setPaymentDue('');
        setHasPaymentSchedule(false);
        setTotalPayments('');
        setPaymentsMade('');
      }
    }
  }, [visible, isEditing, product]);

  const handleSave = () => {
    // Validate form
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for this debt');
      return;
    }

    if (isNaN(parseFloat(balance)) || parseFloat(balance) < 0) {
      Alert.alert('Error', 'Please enter a valid balance amount');
      return;
    }

    if (isNaN(parseFloat(interestRate)) || parseFloat(interestRate) < 0) {
      Alert.alert('Error', 'Please enter a valid interest rate');
      return;
    }

    if (isNaN(parseFloat(paymentDue)) || parseFloat(paymentDue) < 0) {
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }

    if (hasPaymentSchedule) {
      if (isNaN(parseInt(totalPayments)) || parseInt(totalPayments) <= 0) {
        Alert.alert('Error', 'Please enter a valid number of total payments');
        return;
      }

      if (isNaN(parseInt(paymentsMade)) || parseInt(paymentsMade) < 0 || parseInt(paymentsMade) > parseInt(totalPayments)) {
        Alert.alert('Error', 'Please enter a valid number of payments made');
        return;
      }
    }

    // Create new product or update existing
    const updatedProduct: DebtProduct = {
      id: isEditing && product ? product.id : uuid.v4().toString(),
      name: name.trim(),
      type,
      balance: parseFloat(balance),
      interestRate: parseFloat(interestRate),
      dueDate: dueDate.trim() || undefined,
      paymentDue: parseFloat(paymentDue),
      totalPayments: hasPaymentSchedule ? parseInt(totalPayments) : undefined,
      paymentsMade: hasPaymentSchedule ? parseInt(paymentsMade) : undefined,
      payments: isEditing && product ? product.payments : [],
      createdAt: isEditing && product ? product.createdAt : new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Debt Product' : 'Add Debt Product'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Mortgage, Car Loan, Credit Card"
              placeholderTextColor="#C7C7CC"
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'credit-card' && styles.selectedTypeButton,
                ]}
                onPress={() => setType('credit-card')}
              >
                <Icon
                  name="credit-card"
                  size={20}
                  color={type === 'credit-card' ? '#FFFFFF' : '#8E8E93'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'credit-card' && styles.selectedTypeButtonText,
                  ]}
                >
                  Credit Card
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'loan' && styles.selectedTypeButton,
                ]}
                onPress={() => setType('loan')}
              >
                <Icon
                  name="bank"
                  size={20}
                  color={type === 'loan' ? '#FFFFFF' : '#8E8E93'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'loan' && styles.selectedTypeButtonText,
                  ]}
                >
                  Loan
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Current Balance</Text>
            <TextInput
              style={styles.input}
              value={balance}
              onChangeText={setBalance}
              placeholder="0.00"
              placeholderTextColor="#C7C7CC"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Interest Rate (%)</Text>
            <TextInput
              style={styles.input}
              value={interestRate}
              onChangeText={setInterestRate}
              placeholder="0.00"
              placeholderTextColor="#C7C7CC"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Due Date (optional)</Text>
            <TextInput
              style={styles.input}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="e.g. 15th of each month"
              placeholderTextColor="#C7C7CC"
            />

            <Text style={styles.label}>Monthly Payment</Text>
            <TextInput
              style={styles.input}
              value={paymentDue}
              onChangeText={setPaymentDue}
              placeholder="0.00"
              placeholderTextColor="#C7C7CC"
              keyboardType="decimal-pad"
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Has Payment Schedule?</Text>
              <Switch
                value={hasPaymentSchedule}
                onValueChange={setHasPaymentSchedule}
                trackColor={{ false: '#C7C7CC', true: 'rgba(255, 59, 48, 0.4)' }}
                thumbColor={hasPaymentSchedule ? '#FF3B30' : '#FFFFFF'}
              />
            </View>

            {hasPaymentSchedule && (
              <>
                <Text style={styles.label}>Total Number of Payments</Text>
                <TextInput
                  style={styles.input}
                  value={totalPayments}
                  onChangeText={setTotalPayments}
                  placeholder="e.g. 36 for a 3-year loan"
                  placeholderTextColor="#C7C7CC"
                  keyboardType="number-pad"
                />

                <Text style={styles.label}>Payments Made So Far</Text>
                <TextInput
                  style={styles.input}
                  value={paymentsMade}
                  onChangeText={setPaymentsMade}
                  placeholder="0"
                  placeholderTextColor="#C7C7CC"
                  keyboardType="number-pad"
                />
              </>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Update' : 'Add'} Debt Product
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
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
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#000000',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
  },
  selectedTypeButton: {
    backgroundColor: '#FF3B30',
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  selectedTypeButtonText: {
    color: '#FFFFFF',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DebtProductFormModal;
