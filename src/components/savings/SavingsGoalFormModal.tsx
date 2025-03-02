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
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { v4 as uuidv4 } from 'uuid';

interface SavingsGoalFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (goal: any) => void;
  goal: any | null;
  isEditing: boolean;
  categoryIcons: { [key: string]: string };
  categoryNames: { [key: string]: string };
}

const SavingsGoalFormModal: React.FC<SavingsGoalFormModalProps> = ({
  visible,
  onClose,
  onSave,
  goal,
  isEditing,
  categoryIcons,
  categoryNames
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [category, setCategory] = useState('emergency');
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      if (isEditing && goal) {
        setTitle(goal.title);
        setTargetAmount(goal.targetAmount.toString());
        setCurrentAmount(goal.currentAmount.toString());
        setCategory(goal.category);
        setTargetDate(new Date(goal.targetDate));
      } else {
        // Default values for new goal
        setTitle('');
        setTargetAmount('');
        setCurrentAmount('0');
        setCategory('emergency');
        
        // Set default target date to 6 months from now
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        setTargetDate(sixMonthsFromNow);
      }
    }
  }, [visible, isEditing, goal]);
  
  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Validate and save goal
  const handleSave = () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your savings goal.');
      return;
    }
    
    const targetAmountNum = parseFloat(targetAmount);
    if (isNaN(targetAmountNum) || targetAmountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount greater than 0.');
      return;
    }
    
    const currentAmountNum = parseFloat(currentAmount);
    if (isNaN(currentAmountNum) || currentAmountNum < 0) {
      Alert.alert('Error', 'Please enter a valid current amount (0 or greater).');
      return;
    }
    
    if (currentAmountNum > targetAmountNum) {
      Alert.alert('Error', 'Current amount cannot be greater than target amount.');
      return;
    }
    
    const now = new Date();
    if (targetDate < now) {
      Alert.alert('Error', 'Target date must be in the future.');
      return;
    }
    
    // Create or update goal object
    const updatedGoal = {
      id: isEditing && goal ? goal.id : uuidv4(),
      title: title.trim(),
      targetAmount: targetAmountNum,
      currentAmount: currentAmountNum,
      targetDate: targetDate.toISOString(),
      category,
      icon: categoryIcons[category],
      createdAt: isEditing && goal ? goal.createdAt : new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    onSave(updatedGoal);
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
              {isEditing ? 'Edit Savings Goal' : 'New Savings Goal'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContentContainer}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Goal Title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Emergency Fund"
                placeholderTextColor="#C7C7CC"
              />
            </View>
            
            {/* Target and Current Amount Inputs - Side by Side */}
            <View style={styles.inlineInputsContainer}>
              {/* Target Amount Input */}
              <View style={[styles.inputGroup, styles.inlineInputGroup]}>
                <Text style={styles.inputLabel}>Target Amount</Text>
                <View style={styles.currencyInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.currencyInput}
                    value={targetAmount}
                    onChangeText={setTargetAmount}
                    placeholder="0.00"
                    placeholderTextColor="#C7C7CC"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
              
              {/* Current Amount Input */}
              <View style={[styles.inputGroup, styles.inlineInputGroup]}>
                <Text style={styles.inputLabel}>Current Amount</Text>
                <View style={styles.currencyInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.currencyInput}
                    value={currentAmount}
                    onChangeText={setCurrentAmount}
                    placeholder="0.00"
                    placeholderTextColor="#C7C7CC"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
            
            {/* Target Date Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target Date</Text>
              {Platform.OS === 'ios' ? (
                <View>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(!showDatePicker)}
                  >
                    <Text style={styles.dateText}>{formatDate(targetDate)}</Text>
                    <Icon name="calendar" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  
                  {showDatePicker && (
                    <View style={styles.inlineDatePicker}>
                      <DateTimePicker
                        value={targetDate}
                        mode="date"
                        display="inline"
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>{formatDate(targetDate)}</Text>
                    <Icon name="calendar" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  
                  {showDatePicker && (
                    <DateTimePicker
                      value={targetDate}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>
              )}
            </View>
            
            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {Object.entries(categoryNames).map(([key, name]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.categoryButton,
                      category === key && styles.selectedCategoryButton
                    ]}
                    onPress={() => setCategory(key)}
                  >
                    <Icon
                      name={categoryIcons[key]}
                      size={20}
                      color={category === key ? '#FFFFFF' : '#8E8E93'}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        category === key && styles.selectedCategoryText
                      ]}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
    paddingBottom: 0, // No padding at bottom
    maxHeight: '90%', // Increased max height to show all content
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
    paddingBottom: 30, // More padding at the bottom of the form content
  },
  inputGroup: {
    marginBottom: 20,
  },
  inlineInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inlineInputGroup: {
    flex: 0.48,
    marginBottom: 0,
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
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginRight: 4,
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  inlineDatePicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 4,
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
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

export default SavingsGoalFormModal;
