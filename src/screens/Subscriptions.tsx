import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SubscriptionFormModal from '../components/subscriptions/SubscriptionFormModal';
import DeleteConfirmationModal from '../components/subscriptions/DeleteConfirmationModal';
import SwipeableSubscriptionItem from '../components/subscriptions/SwipeableSubscriptionItem';

// Define subscription interface
interface Subscription {
  id: string;
  name: string;
  category: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly';
  nextRenewal: string;
  icon: string;
}

// Category mapping for icons
const CATEGORY_ICONS = {
  'entertainment': 'television-play',
  'music': 'music',
  'shopping': 'shopping',
  'fitness': 'dumbbell',
  'software': 'code-tags',
  'news': 'newspaper',
  'food': 'food',
  'meds': 'pill',
  'other': 'tag'
};

// Sample subscription data
const SAMPLE_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    category: 'entertainment',
    cost: 15.99,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 2, 15).toISOString(),
    icon: CATEGORY_ICONS['entertainment']
  },
  {
    id: '2',
    name: 'Spotify',
    category: 'music',
    cost: 9.99,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 2, 7).toISOString(),
    icon: CATEGORY_ICONS['music']
  },
  {
    id: '3',
    name: 'Amazon Prime',
    category: 'shopping',
    cost: 139,
    billingCycle: 'yearly',
    nextRenewal: new Date(2025, 5, 22).toISOString(),
    icon: CATEGORY_ICONS['shopping']
  },
  {
    id: '4',
    name: 'Gym Membership',
    category: 'fitness',
    cost: 49.99,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 2, 1).toISOString(),
    icon: CATEGORY_ICONS['fitness']
  },
  {
    id: '5',
    name: 'iCloud',
    category: 'software',
    cost: 2.99,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 2, 10).toISOString(),
    icon: CATEGORY_ICONS['software']
  },
  {
    id: '6',
    name: 'YouTube Premium',
    category: 'entertainment',
    cost: 11.99,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 2, 20).toISOString(),
    icon: CATEGORY_ICONS['entertainment']
  },
  {
    id: '7',
    name: 'Microsoft 365',
    category: 'software',
    cost: 69.99,
    billingCycle: 'yearly',
    nextRenewal: new Date(2025, 5, 15).toISOString(),
    icon: CATEGORY_ICONS['software']
  },
  {
    id: '8',
    name: 'Disney+',
    category: 'entertainment',
    cost: 7.99,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 2, 25).toISOString(),
    icon: CATEGORY_ICONS['entertainment']
  },
  {
    id: '9',
    name: 'Adobe Creative Cloud',
    category: 'software',
    cost: 52.99,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 3, 5).toISOString(),
    icon: CATEGORY_ICONS['software']
  },
  {
    id: '10',
    name: 'New York Times',
    category: 'news',
    cost: 17.00,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 2, 18).toISOString(),
    icon: CATEGORY_ICONS['news']
  },
  {
    id: '11',
    name: 'HelloFresh',
    category: 'food',
    cost: 59.99,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 2, 12).toISOString(),
    icon: CATEGORY_ICONS['food']
  },
  {
    id: '12',
    name: 'Apple TV+',
    category: 'entertainment',
    cost: 6.99,
    billingCycle: 'monthly',
    nextRenewal: new Date(2025, 2, 28).toISOString(),
    icon: CATEGORY_ICONS['entertainment']
  }
];

// Category mapping for display names
const CATEGORY_DISPLAY_NAMES = {
  'entertainment': 'Entertainment',
  'music': 'Music',
  'shopping': 'Shopping',
  'fitness': 'Fitness',
  'software': 'Software',
  'news': 'News',
  'food': 'Food',
  'meds': 'Meds',
  'other': 'Other'
};

const Subscriptions: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Load subscriptions from storage on mount
  useEffect(() => {
    loadSubscriptions();
  }, []);

  // Load subscriptions from AsyncStorage
  const loadSubscriptions = async () => {
    try {
      const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
      if (storedSubscriptions) {
        setSubscriptions(JSON.parse(storedSubscriptions));
      } else {
        // If no stored subscriptions, use sample data
        setSubscriptions(SAMPLE_SUBSCRIPTIONS);
        // Save sample data to storage
        await AsyncStorage.setItem('subscriptions', JSON.stringify(SAMPLE_SUBSCRIPTIONS));
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      Alert.alert('Error', 'Failed to load your subscriptions');
    }
  };

  // Reset subscriptions to sample data
  const resetToSampleData = async () => {
    try {
      setSubscriptions(SAMPLE_SUBSCRIPTIONS);
      await AsyncStorage.setItem('subscriptions', JSON.stringify(SAMPLE_SUBSCRIPTIONS));
    } catch (error) {
      console.error('Error resetting subscriptions:', error);
    }
  };

  // For development purposes, reset to sample data on mount
  useEffect(() => {
    resetToSampleData();
  }, []);

  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'none', 'date-asc', 'date-desc', 'price-asc', 'price-desc'
  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  
  // Save subscriptions whenever they change
  const saveSubscriptions = async (updatedSubscriptions: Subscription[]) => {
    try {
      await AsyncStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
    } catch (error) {
      console.error('Error saving subscriptions:', error);
      Alert.alert('Error', 'Failed to save your subscription updates');
    }
  };

  // Update renewal dates automatically
  useEffect(() => {
    const checkAndUpdateRenewalDates = () => {
      const now = new Date();
      const updated = subscriptions.map(subscription => {
        const renewalDate = new Date(subscription.nextRenewal);
        
        // If the renewal date has passed
        if (renewalDate < now) {
          const newRenewalDate = new Date(renewalDate);
          
          // Calculate next renewal date based on billing cycle
          switch (subscription.billingCycle) {
            case 'monthly':
              // Keep incrementing by a month until we get a future date
              while (newRenewalDate < now) {
                newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
              }
              break;
            case 'yearly':
              // Keep incrementing by a year until we get a future date
              while (newRenewalDate < now) {
                newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
              }
              break;
            // Add other billing cycles here if needed
          }
          
          return {
            ...subscription,
            nextRenewal: newRenewalDate.toISOString().split('T')[0]
          };
        }
        
        return subscription;
      });
      
      // Update state if any dates were changed
      if (JSON.stringify(updated) !== JSON.stringify(subscriptions)) {
        setSubscriptions(updated);
        saveSubscriptions(updated);
      }
    };
    
    // Check immediately when component mounts
    checkAndUpdateRenewalDates();
    
    // Set up interval to check every hour
    const interval = setInterval(checkAndUpdateRenewalDates, 3600000); // 1 hour in milliseconds
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [subscriptions]);
  
  // Helper function to get monthly equivalent cost
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

  // Filter subscriptions by category
  const filteredSubscriptions = useMemo(() => {
    let filtered = [...subscriptions];
    
    // Apply category filter
    if (activeCategory) {
      filtered = filtered.filter(sub => {
        const categoryDisplayName = CATEGORY_DISPLAY_NAMES[sub.category] || 'Other';
        return categoryDisplayName === activeCategory;
      });
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime());
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.nextRenewal).getTime() - new Date(a.nextRenewal).getTime());
        break;
      case 'price-asc':
        filtered.sort((a, b) => getMonthlyEquivalent(a.cost, a.billingCycle) - getMonthlyEquivalent(b.cost, b.billingCycle));
        break;
      case 'price-desc':
        filtered.sort((a, b) => getMonthlyEquivalent(b.cost, b.billingCycle) - getMonthlyEquivalent(a.cost, a.billingCycle));
        break;
    }
    
    return filtered;
  }, [subscriptions, activeCategory, sortBy]);
  
  // Get unique categories from subscriptions
  const categories = useMemo(() => {
    // Get all unique categories from subscriptions
    const uniqueCategories = [...new Set(subscriptions.map(sub => CATEGORY_DISPLAY_NAMES[sub.category] || 'Other'))];
    // Sort them alphabetically
    return uniqueCategories.sort();
  }, [subscriptions]);
  
  // Calculate totals
  const calculateTotals = () => {
    let monthly = 0;
    let yearlySubscriptionsTotal = 0;
    let annualizedTotal = 0;
    
    subscriptions.forEach(sub => {
      switch (sub.billingCycle) {
        case 'monthly':
          monthly += sub.cost;
          annualizedTotal += sub.cost * 12;
          break;
        case 'yearly':
          monthly += sub.cost / 12;
          yearlySubscriptionsTotal += sub.cost;
          annualizedTotal += sub.cost;
          break;
        case 'quarterly':
          monthly += sub.cost / 3;
          annualizedTotal += sub.cost * 4;
          break;
        default:
          monthly += sub.cost;
          annualizedTotal += sub.cost * 12;
      }
    });
    
    return {
      monthly,
      yearly: yearlySubscriptionsTotal,
      annualized: annualizedTotal
    };
  };
  
  const { monthly, yearly, annualized } = calculateTotals();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    // Create a date object and adjust for timezone offset
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    
    // Format the date
    return adjustedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format billing cycle for display
  const formatBillingCycle = (cycle: string) => {
    if (cycle === 'monthly') return 'mo';
    if (cycle === 'yearly') return 'yr';
    return cycle;
  };

  // Handle adding a new subscription
  const handleAddSubscription = () => {
    setSelectedSubscription(null);
    setIsEditing(false);
    setIsFormModalVisible(true);
  };
  
  // Handle editing an existing subscription
  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditing(true);
    setIsFormModalVisible(true);
  };
  
  // Handle saving a subscription (new or edited)
  const handleSaveSubscription = async (subscriptionData: Subscription) => {
    let updatedSubscriptions;
    if (isEditing) {
      // Update existing subscription
      updatedSubscriptions = subscriptions.map(sub => 
        sub.id === subscriptionData.id ? subscriptionData : sub
      );
    } else {
      // Add new subscription
      updatedSubscriptions = [...subscriptions, subscriptionData];
    }
    
    setSubscriptions(updatedSubscriptions);
    await saveSubscriptions(updatedSubscriptions);
    
    setIsFormModalVisible(false);
    setSelectedSubscription(null);
    setIsEditing(false);
  };
  
  // Handle deleting a subscription
  const handleDeleteSubscription = async (subscriptionId: string) => {
    // Close the form modal first to prevent modal stacking issues
    setIsFormModalVisible(false);
    
    // Set a small timeout to ensure the first modal is fully closed
    // before showing the confirmation dialog
    setTimeout(() => {
      setSubscriptionToDelete(subscriptionId);
      setShowDeleteConfirmation(true);
    }, 300);
  };
  
  // Confirm delete subscription
  const confirmDeleteSubscription = async () => {
    if (subscriptionToDelete) {
      try {
        const updatedSubscriptions = subscriptions.filter(sub => sub.id !== subscriptionToDelete);
        setSubscriptions(updatedSubscriptions);
        await saveSubscriptions(updatedSubscriptions);
      } catch (error) {
        console.error('Error deleting subscription:', error);
        Alert.alert('Error', 'Failed to delete subscription. Please try again.');
      } finally {
        // Always reset all modal states regardless of success/failure
        setShowDeleteConfirmation(false);
        setSubscriptionToDelete(null);
        setSelectedSubscription(null);
        setIsEditing(false);
      }
    }
  };
  
  // Cancel delete subscription
  const cancelDeleteSubscription = () => {
    setShowDeleteConfirmation(false);
    setSubscriptionToDelete(null);
  };
  
  // Close all open swipe items
  const closeAllSwipeItems = () => {
    setOpenItemId(null);
  };
  
  // Render subscription item
  const renderSubscriptionItem = ({ item }: { item: Subscription }) => (
    <SwipeableSubscriptionItem
      item={item}
      onPress={handleEditSubscription}
      onDelete={handleDeleteSubscription}
      categoryNames={CATEGORY_DISPLAY_NAMES}
      categoryIcons={CATEGORY_ICONS}
      closeOthers={closeAllSwipeItems}
      isOpen={openItemId === item.id}
      setOpenItemId={setOpenItemId}
    />
  );
  
  return (
    <TouchableWithoutFeedback onPress={closeAllSwipeItems}>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Subscriptions</Text>
          </View>
            
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly</Text>
              <Text style={styles.summaryValue}>${monthly.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Yearly Subs</Text>
              <Text style={styles.summaryValue}>${yearly.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Annual Total</Text>
              <Text style={styles.summaryValue}>${annualized.toFixed(2)}</Text>
            </View>
          </View>
            
          <View style={styles.filtersSection}>
            <View style={styles.filterContainer}>
              <View style={styles.categoryIconsRow}>
                {Object.entries(CATEGORY_DISPLAY_NAMES).map(([key, displayName]) => {
                  const iconName = CATEGORY_ICONS[key] || 'tag';
                  const isActive = activeCategory === displayName;
                  
                  return (
                    <TouchableOpacity 
                      key={key}
                      style={[
                        styles.categoryIconButton,
                        isActive && styles.activeCategoryIconButton
                      ]}
                      onPress={() => {
                        // Toggle the filter - if already active, clear it
                        setActiveCategory(isActive ? '' : displayName);
                      }}
                    >
                      <Icon 
                        name={iconName} 
                        size={22} 
                        color={isActive ? '#FFFFFF' : '#8E8E93'} 
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
                
              <View style={styles.sortButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.sortButton, sortBy.startsWith('date') && styles.activeSortButton]}
                  onPress={() => setSortBy(sortBy === 'date-asc' ? 'date-desc' : 'date-asc')}
                >
                  <Text style={styles.sortButtonText}>Date</Text>
                  {sortBy.startsWith('date') && (
                    <Icon 
                      name={sortBy === 'date-asc' ? 'arrow-up' : 'arrow-down'} 
                      size={12} 
                      color="#8E8E93" 
                    />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.sortButton, sortBy.startsWith('price') && styles.activeSortButton]}
                  onPress={() => setSortBy(sortBy === 'price-asc' ? 'price-desc' : 'price-asc')}
                >
                  <Text style={styles.sortButtonText}>Price</Text>
                  {sortBy.startsWith('price') && (
                    <Icon 
                      name={sortBy === 'price-asc' ? 'arrow-up' : 'arrow-down'} 
                      size={12} 
                      color="#8E8E93" 
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
            
          <FlatList
            data={filteredSubscriptions}
            keyExtractor={(item) => item.id}
            renderItem={renderSubscriptionItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={closeAllSwipeItems}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <Icon name="playlist-remove" size={60} color="#CCCCCC" />
                <Text style={styles.emptyStateText}>No subscriptions found</Text>
                <Text style={styles.emptyStateSubText}>
                  {activeCategory 
                    ? `No subscriptions in the ${activeCategory} category`
                    : 'Add your first subscription by tapping the + button'
                  }
                </Text>
              </View>
            }
          />
            
          <TouchableOpacity 
            style={styles.fab}
            onPress={handleAddSubscription}
          >
            <Icon name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
            
          <SubscriptionFormModal
            visible={isFormModalVisible}
            onClose={() => setIsFormModalVisible(false)}
            onSave={handleSaveSubscription}
            onDelete={handleDeleteSubscription}
            subscription={selectedSubscription}
            isEditing={isEditing}
          />
            
          <DeleteConfirmationModal
            visible={showDeleteConfirmation}
            onCancel={cancelDeleteSubscription}
            onConfirm={confirmDeleteSubscription}
          />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: 0,
    backgroundColor: '#EAEAEA',
    paddingVertical: 10,
    borderRadius: 8,
    position: 'relative',
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
  },
  activeSortButton: {
    backgroundColor: '#E5E5EA',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#000000',
    marginRight: 4,
  },
  categoryIconButton: {
    width: 36,
    height: 36,
    backgroundColor: '#EFEFEF',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  activeCategoryIconButton: {
    backgroundColor: '#007AFF',
  },
  categoryIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    marginTop: 12,
    marginBottom: 6,
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'space-around',
  },
  summaryItem: {
    width: '33.33%', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  summaryDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E5E5EA',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    width: '100%',
  },
  filtersSection: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  listContainer: {
    padding: 8,
    paddingBottom: 20,
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E1F5FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  subscriptionCategory: {
    fontSize: 14,
    color: '#8E8E93',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  billingCycle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  renewalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renewalText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
});

export default Subscriptions;
