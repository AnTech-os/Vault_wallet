import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type DebtRepaymentStrategy = 'avalanche' | 'snowball';

interface DebtStrategyModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectStrategy: (strategy: DebtRepaymentStrategy) => void;
  currentStrategy: DebtRepaymentStrategy;
}

const DebtStrategyModal: React.FC<DebtStrategyModalProps> = ({
  visible,
  onClose,
  onSelectStrategy,
  currentStrategy
}) => {
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
            <Text style={styles.modalTitle}>Choose Repayment Strategy</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <TouchableOpacity
              style={[
                styles.strategyOption,
                currentStrategy === 'avalanche' && styles.selectedStrategy
              ]}
              onPress={() => {
                onSelectStrategy('avalanche');
                onClose();
              }}
            >
              <View style={styles.strategyHeader}>
                <Icon 
                  name="arrow-down-bold" 
                  size={24} 
                  color={currentStrategy === 'avalanche' ? '#FFFFFF' : '#FF3B30'} 
                />
                <Text style={[
                  styles.strategyTitle,
                  currentStrategy === 'avalanche' && styles.selectedText
                ]}>
                  Avalanche Method
                </Text>
                {currentStrategy === 'avalanche' && (
                  <Icon name="check" size={24} color="#FFFFFF" />
                )}
              </View>
              
              <Text style={[
                styles.strategyDescription,
                currentStrategy === 'avalanche' && styles.selectedText
              ]}>
                Pay minimum payments on all debts, then put extra money toward the debt with the highest interest rate.
              </Text>
              
              <View style={styles.benefitsContainer}>
                <Text style={[
                  styles.benefitsTitle,
                  currentStrategy === 'avalanche' && styles.selectedText
                ]}>
                  Benefits:
                </Text>
                <Text style={[
                  styles.benefitItem,
                  currentStrategy === 'avalanche' && styles.selectedText
                ]}>
                  • Mathematically optimal - saves the most money in interest
                </Text>
                <Text style={[
                  styles.benefitItem,
                  currentStrategy === 'avalanche' && styles.selectedText
                ]}>
                  • Reduces total repayment time
                </Text>
                <Text style={[
                  styles.benefitItem,
                  currentStrategy === 'avalanche' && styles.selectedText
                ]}>
                  • Best for those with high-interest debt
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.strategyOption,
                currentStrategy === 'snowball' && styles.selectedStrategy
              ]}
              onPress={() => {
                onSelectStrategy('snowball');
                onClose();
              }}
            >
              <View style={styles.strategyHeader}>
                <Icon 
                  name="snowflake" 
                  size={24} 
                  color={currentStrategy === 'snowball' ? '#FFFFFF' : '#FF3B30'} 
                />
                <Text style={[
                  styles.strategyTitle,
                  currentStrategy === 'snowball' && styles.selectedText
                ]}>
                  Snowball Method
                </Text>
                {currentStrategy === 'snowball' && (
                  <Icon name="check" size={24} color="#FFFFFF" />
                )}
              </View>
              
              <Text style={[
                styles.strategyDescription,
                currentStrategy === 'snowball' && styles.selectedText
              ]}>
                Pay minimum payments on all debts, then put extra money toward the debt with the smallest balance.
              </Text>
              
              <View style={styles.benefitsContainer}>
                <Text style={[
                  styles.benefitsTitle,
                  currentStrategy === 'snowball' && styles.selectedText
                ]}>
                  Benefits:
                </Text>
                <Text style={[
                  styles.benefitItem,
                  currentStrategy === 'snowball' && styles.selectedText
                ]}>
                  • Psychological wins from paying off debts quickly
                </Text>
                <Text style={[
                  styles.benefitItem,
                  currentStrategy === 'snowball' && styles.selectedText
                ]}>
                  • Builds momentum and motivation
                </Text>
                <Text style={[
                  styles.benefitItem,
                  currentStrategy === 'snowball' && styles.selectedText
                ]}>
                  • Reduces number of monthly payments faster
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <Icon name="information-outline" size={20} color="#8E8E93" />
              <Text style={styles.infoText}>
                Both methods require you to make minimum payments on all debts. The difference is where you put your extra money.
              </Text>
            </View>
          </ScrollView>
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
  content: {
    flex: 1,
  },
  strategyOption: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9E9EB',
  },
  selectedStrategy: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strategyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
  strategyDescription: {
    fontSize: 16,
    color: '#3A3A3C',
    marginBottom: 16,
    lineHeight: 22,
  },
  benefitsContainer: {
    marginTop: 8,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#3A3A3C',
    marginBottom: 4,
    lineHeight: 20,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default DebtStrategyModal;
