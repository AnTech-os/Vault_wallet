import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDatePicker from '../common/CustomDatePicker';

// Available subscription categories
const SUBSCRIPTION_CATEGORIES = [
  { id: 'entertainment', name: 'Entertainment', icon: 'television-play' },
  { id: 'software', name: 'Software', icon: 'code-tags' },
  { id: 'fitness', name: 'Fitness', icon: 'dumbbell' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping' },
  { id: 'music', name: 'Music', icon: 'music' },
  { id: 'news', name: 'News', icon: 'newspaper' },
  { id: 'food', name: 'Food', icon: 'food' },
  { id: 'meds', name: 'Meds', icon: 'pill' },
  { id: 'other', name: 'Other', icon: 'tag' }
];

// Available billing cycles
const BILLING_CYCLES = [
  { id: 'monthly', name: 'Monthly' },
  { id: 'quarterly', name: 'Quarterly' },
  { id: 'yearly', name: 'Yearly' }
];

interface SubscriptionFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (subscription: any) => void;
  onDelete?: (subscriptionId: string) => void;
  subscription?: any; // Optional subscription for editing
  isEditing?: boolean;
}

const SubscriptionFormModal: React.FC<SubscriptionFormModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  subscription,
  isEditing = false
}) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [renewalDate, setRenewalDate] = useState(new Date());
  const [id, setId] = useState('');

  // Populate form fields when editing an existing subscription
  useEffect(() => {
    if (isEditing && subscription) {
      setName(subscription.name || '');
      setCost(subscription.cost ? subscription.cost.toString() : '');
      setCategory(subscription.category || '');
      setBillingCycle(subscription.billingCycle || 'monthly');
      setId(subscription.id || '');
      
      // Parse and set the renewal date with timezone adjustment
      if (subscription.nextRenewal) {
        const date = new Date(subscription.nextRenewal);
        if (!isNaN(date.getTime())) {
          // Adjust for timezone to prevent date shift
          const userTimezoneOffset = date.getTimezoneOffset() * 60000;
          const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
          setRenewalDate(adjustedDate);
        }
      }
    } else {
      // Reset form for new subscription
      resetForm();
    }
  }, [isEditing, subscription, visible]);

  // Reset form
  const resetForm = () => {
    setName('');
    setCost('');
    setCategory('');
    setBillingCycle('monthly');
    setRenewalDate(new Date());
    setId('');
  };

  // Handle form close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle form submission
  const handleSave = () => {
    // Validate required fields
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a subscription name.');
      return;
    }

    if (!cost.trim()) {
      Alert.alert('Missing Information', 'Please enter a subscription cost.');
      return;
    }

    if (!category) {
      Alert.alert('Missing Information', 'Please select a category.');
      return;
    }

    // Create subscription object
    const subscriptionData = {
      id: id || `sub_${Date.now()}`,
      name: name.trim(),
      cost: parseFloat(cost),
      category,
      billingCycle,
      nextRenewal: renewalDate.toISOString(),
    };

    // Save subscription
    onSave(subscriptionData);
    handleClose();
  };

  // Handle delete button press
  const handleDeletePress = () => {
    // First close this modal to prevent modal stacking issues
    handleClose();
    
    // Then trigger the delete action with a small delay
    // to ensure this modal is fully closed
    if (onDelete && id) {
      setTimeout(() => {
        onDelete(id);
      }, 100);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Subscription' : 'Add Subscription'}
            </Text>
            <View style={styles.headerButtons}>
              {isEditing && onDelete && (
                <TouchableOpacity 
                  onPress={handleDeletePress} 
                  style={styles.deleteButton}
                  activeOpacity={0.6}
                >
                  <Icon name="trash-can-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.formContainer}>
            {/* Subscription Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subscription Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Netflix, Spotify"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Cost */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cost *</Text>
              <View style={styles.costInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.costInput}
                  placeholder="0.00"
                  value={cost}
                  onChangeText={setCost}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.categoryContainer}>
                {SUBSCRIPTION_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      category === cat.id && styles.selectedCategoryButton
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Icon 
                      name={cat.icon} 
                      size={20} 
                      color={category === cat.id ? '#FFFFFF' : '#333333'} 
                    />
                    <Text 
                      style={[
                        styles.categoryText,
                        category === cat.id && styles.selectedCategoryText
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Frequency (formerly Billing Cycle) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <View style={styles.billingCycleContainer}>
                {BILLING_CYCLES.map((cycle) => (
                  <TouchableOpacity
                    key={cycle.id}
                    style={[
                      styles.billingCycleButton,
                      billingCycle === cycle.id && styles.selectedBillingCycleButton
                    ]}
                    onPress={() => setBillingCycle(cycle.id)}
                  >
                    <Text 
                      style={[
                        styles.billingCycleText,
                        billingCycle === cycle.id && styles.selectedBillingCycleText
                      ]}
                    >
                      {cycle.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Next Renewal Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Next Renewal Date</Text>
              <CustomDatePicker
                value={renewalDate}
                onChange={setRenewalDate}
                minimumDate={new Date()}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleClose}
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
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
    marginRight: 8,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  formContainer: {
    maxHeight: '80%',
  },
  inputGroup: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  costInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  currencySymbol: {
    paddingLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  costInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333333',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  billingCycleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billingCycleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 5,
  },
  selectedBillingCycleButton: {
    backgroundColor: '#007AFF',
  },
  billingCycleText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedBillingCycleText: {
    color: '#FFFFFF',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  }
});

export default SubscriptionFormModal;
