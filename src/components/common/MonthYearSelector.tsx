import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  currentMonth: string;
  currentYear: number;
  onPrevious: () => void;
  onNext: () => void;
}

const MonthYearSelector: React.FC<Props> = ({
  currentMonth,
  currentYear,
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevious} style={styles.button}>
        <Icon name="chevron-left" size={24} color="#000" />
      </TouchableOpacity>
      
      <Text style={styles.text}>{`${currentMonth} ${currentYear}`}</Text>
      
      <TouchableOpacity onPress={onNext} style={styles.button}>
        <Icon name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  button: {
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
  },
});

export default MonthYearSelector;
