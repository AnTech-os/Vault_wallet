import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Subscription {
  id: string;
  name: string;
  category: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly';
  nextRenewal: string;
  icon?: string;
}

interface SwipeableSubscriptionItemProps {
  item: Subscription;
  onPress: (item: Subscription) => void;
  onDelete: (id: string) => void;
  categoryNames: Record<string, string>;
  categoryIcons: Record<string, string>;
  closeOthers: () => void;
  isOpen: boolean;
  setOpenItemId: (id: string | null) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

const SwipeableSubscriptionItem: React.FC<SwipeableSubscriptionItemProps> = ({
  item,
  onPress,
  onDelete,
  categoryNames,
  categoryIcons,
  closeOthers,
  isOpen,
  setOpenItemId
}) => {
  const pan = useRef(new Animated.Value(0)).current;
  
  // Reset when told to close from parent
  useEffect(() => {
    if (!isOpen && pan.__getValue() !== 0) {
      resetPosition();
    }
  }, [isOpen]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Format billing cycle
  const formatBillingCycle = (cycle: string) => {
    switch (cycle) {
      case 'monthly':
        return 'mo';
      case 'yearly':
        return 'yr';
      case 'quarterly':
        return 'qtr';
      default:
        return cycle;
    }
  };

  // Calculate monthly cost
  const getMonthlyEquivalent = (cost: number, billingCycle: string) => {
    switch (billingCycle) {
      case 'yearly':
        return cost / 12;
      case 'quarterly':
        return cost / 3;
      default:
        return cost;
    }
  };

  // Handle delete
  const handleDelete = (event: any) => {
    if (event) {
      event.stopPropagation();
    }
    
    // Reset the position
    resetPosition();
    
    // Call the onDelete function directly without showing the Alert
    onDelete(item.id);
  };

  // Reset position
  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: 0,
      useNativeDriver: false
    }).start();
    setOpenItemId(null);
  };

  // Open swipe
  const openSwipe = () => {
    // Close any other open items first
    closeOthers();
    
    // Then open this one
    Animated.spring(pan, {
      toValue: -SWIPE_THRESHOLD,
      useNativeDriver: false
    }).start();
    setOpenItemId(item.id);
  };

  // Handle card press
  const handleCardPress = () => {
    if (isOpen) {
      resetPosition();
    } else {
      onPress(item);
    }
  };

  // Create pan responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal movements
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
      },
      onPanResponderGrant: () => {
        // Close other items first
        closeOthers();
        
        pan.setOffset(pan.__getValue());
        pan.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        // Only allow left swipe (negative values)
        if (gesture.dx <= 0) {
          pan.setValue(gesture.dx);
        } else if (isOpen) {
          // If already open, allow closing with right swipe
          pan.setValue(gesture.dx - SWIPE_THRESHOLD);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        
        if (gesture.dx < -SWIPE_THRESHOLD / 2) {
          openSwipe();
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  // Calculate the opacity of the delete button based on the pan value
  const deleteButtonOpacity = pan.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.itemContainer,
          { transform: [{ translateX: pan }] }
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.subscriptionCard}
          onPress={handleCardPress}
          activeOpacity={0.9}
        >
          <View style={styles.subscriptionHeader}>
            <View style={styles.iconContainer}>
              <Icon name={categoryIcons[item.category] || 'tag'} size={24} color="#007AFF" />
            </View>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionName}>{item.name}</Text>
              <View style={styles.renewalDateContainer}>
                <Icon name="refresh" size={12} color="#8E8E93" style={styles.renewalIcon} />
                <Text style={styles.subscriptionCategory}>
                  {formatDate(item.nextRenewal)}
                </Text>
              </View>
            </View>
            <View style={styles.rightContainer}>
              <View style={styles.subscriptionCost}>
                <Text style={styles.costAmount}>${item.cost.toFixed(2)}</Text>
                <Text style={styles.billingCycle}>/{formatBillingCycle(item.billingCycle)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.deleteButtonContainer,
          {
            opacity: deleteButtonOpacity,
            right: 0,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Icon name="trash-can-outline" size={24} color="#FFFFFF" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#FF3B30',
    marginBottom: 8,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4
  },
  subscriptionCategory: {
    fontSize: 14,
    color: '#8E8E93'
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  subscriptionCost: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  costAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  billingCycle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  renewalDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renewalIcon: {
    marginRight: 4,
  },
  deleteButtonContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SWIPE_THRESHOLD,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButton: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4
  }
});

export default SwipeableSubscriptionItem;
