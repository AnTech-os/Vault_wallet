import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Get screen dimensions
const screenWidth = Dimensions.get('window');

// Constants for picker dimensions
const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PICKER_PADDING = PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2;

interface CustomDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
}) => {
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState(value);
  
  // Refs for scroll views
  const monthScrollRef = useRef<ScrollView>(null);
  const dayScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);
  
  // Update tempDate when value changes
  useEffect(() => {
    setTempDate(value);
  }, [value]);
  
  // Scroll to selected values when the picker opens
  useEffect(() => {
    if (visible) {
      // Use setTimeout to ensure the scroll happens after the modal is fully visible
      setTimeout(() => {
        scrollToSelectedValues();
      }, 100);
    }
  }, [visible, scrollToSelectedValues]);
  
  // Generate arrays for days, months, years
  const currentYear = new Date().getFullYear();
  const minYear = minimumDate ? minimumDate.getFullYear() : currentYear - 10;
  const maxYear = maximumDate ? maximumDate.getFullYear() : currentYear + 10;
  
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const days = Array.from(
    { length: getDaysInMonth(tempDate.getFullYear(), tempDate.getMonth()) }, 
    (_, i) => i + 1
  );
  
  // Format date for display
  const formatDate = (date: Date) => {
    // Adjust for timezone to prevent date shift
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    
    return adjustedDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Scroll to selected values
  const scrollToSelectedValues = useCallback(() => {
    const monthIndex = tempDate.getMonth();
    const day = tempDate.getDate();
    const year = tempDate.getFullYear();
    
    if (monthScrollRef.current) {
      monthScrollRef.current.scrollTo({ y: monthIndex * ITEM_HEIGHT, animated: true });
    }
    
    if (dayScrollRef.current) {
      dayScrollRef.current.scrollTo({ y: (day - 1) * ITEM_HEIGHT, animated: true });
    }
    
    if (yearScrollRef.current) {
      const yearIndex = years.findIndex(y => y === year);
      if (yearIndex !== -1) {
        yearScrollRef.current.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: true });
      }
    }
  }, [tempDate, years]);
  
  // Handle scroll end to snap to nearest item
  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>, 
    type: 'month' | 'day' | 'year'
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    
    // Snap to the nearest item
    switch (type) {
      case 'month':
        if (monthScrollRef.current) {
          monthScrollRef.current.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
          handleMonthChange(index);
        }
        break;
      case 'day':
        if (dayScrollRef.current) {
          dayScrollRef.current.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
          handleDayChange(index + 1); // +1 because days are 1-indexed
        }
        break;
      case 'year':
        if (yearScrollRef.current && index >= 0 && index < years.length) {
          yearScrollRef.current.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
          handleYearChange(years[index]);
        }
        break;
    }
  };
  
  // Handle date selection
  const handleDayChange = (day: number) => {
    const newDate = new Date(tempDate);
    newDate.setDate(day);
    setTempDate(newDate);
    
    // Scroll to center the selected day
    if (dayScrollRef.current) {
      dayScrollRef.current.scrollTo({ y: (day - 1) * ITEM_HEIGHT, animated: true });
    }
  };
  
  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(monthIndex);
    
    // Adjust day if necessary (e.g., if we switched from a month with 31 days to one with 30)
    const daysInNewMonth = getDaysInMonth(newDate.getFullYear(), newDate.getMonth());
    if (newDate.getDate() > daysInNewMonth) {
      newDate.setDate(daysInNewMonth);
    }
    
    setTempDate(newDate);
    
    // Scroll to center the selected month
    if (monthScrollRef.current) {
      monthScrollRef.current.scrollTo({ y: monthIndex * ITEM_HEIGHT, animated: true });
    }
  };
  
  const handleYearChange = (year: number) => {
    const newDate = new Date(tempDate);
    newDate.setFullYear(year);
    
    // Adjust for leap years
    if (newDate.getMonth() === 1 && newDate.getDate() === 29) {
      if (!isLeapYear(year)) {
        newDate.setDate(28);
      }
    }
    
    setTempDate(newDate);
    
    // Scroll to center the selected year
    if (yearScrollRef.current) {
      const yearIndex = years.findIndex(y => y === year);
      if (yearIndex !== -1) {
        yearScrollRef.current.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: true });
      }
    }
  };
  
  // Check if year is leap year
  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };
  
  // Open the picker
  const openPicker = () => {
    // Make sure tempDate is set to the current value
    setTempDate(new Date(value));
    setVisible(true);
  };
  
  // Handle confirm
  const handleConfirm = () => {
    onChange(tempDate);
    setVisible(false);
  };
  
  // Handle cancel
  const handleCancel = () => {
    setTempDate(value);
    setVisible(false);
  };
  
  return (
    <View>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={openPicker}
      >
        <Icon name="calendar" size={20} color="#007AFF" style={styles.dateIcon} />
        <Text style={styles.dateText}>{formatDate(value)}</Text>
      </TouchableOpacity>
      
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Select Date</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContent}>
              {/* Selection indicator - centered in the picker content */}
              <View style={styles.selectionIndicator} />
              
              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <ScrollView 
                  ref={monthScrollRef}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(e) => handleScrollEnd(e, 'month')}
                >
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={`month-${index}`}
                      style={[
                        styles.pickerItem,
                        tempDate.getMonth() === index && styles.selectedItem
                      ]}
                      onPress={() => handleMonthChange(index)}
                    >
                      <Text 
                        style={[
                          styles.pickerItemText,
                          tempDate.getMonth() === index && styles.selectedItemText
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Day Picker */}
              <View style={styles.pickerColumn}>
                <ScrollView 
                  ref={dayScrollRef}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(e) => handleScrollEnd(e, 'day')}
                >
                  {days.map((day) => (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.pickerItem,
                        tempDate.getDate() === day && styles.selectedItem
                      ]}
                      onPress={() => handleDayChange(day)}
                    >
                      <Text 
                        style={[
                          styles.pickerItemText,
                          tempDate.getDate() === day && styles.selectedItemText
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <ScrollView 
                  ref={yearScrollRef}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(e) => handleScrollEnd(e, 'year')}
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={`year-${year}`}
                      style={[
                        styles.pickerItem,
                        tempDate.getFullYear() === year && styles.selectedItem
                      ]}
                      onPress={() => handleYearChange(year)}
                    >
                      <Text 
                        style={[
                          styles.pickerItemText,
                          tempDate.getFullYear() === year && styles.selectedItemText
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    position: 'relative',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  cancelText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  doneText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  pickerContent: {
    flexDirection: 'row',
    height: PICKER_HEIGHT,
    position: 'relative',
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT/2, // Center the indicator (half of its height)
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    zIndex: 1,
    marginHorizontal: 10,
  },
  pickerColumn: {
    flex: 1,
    height: PICKER_HEIGHT,
  },
  scrollContent: {
    paddingVertical: PICKER_PADDING, // Add padding to allow scrolling to all items
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: 'transparent',
  },
  pickerItemText: {
    fontSize: 18,
    color: '#666666',
  },
  selectedItemText: {
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default CustomDatePicker;
