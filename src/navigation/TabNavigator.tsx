import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FinancialOverview from '../screens/FinancialOverview';
import Budget from '../screens/Budget';
import CreditCardsLoans from '../screens/CreditCardsLoans';
import Savings from '../screens/Savings';
import Subscriptions from '../screens/Subscriptions';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5EA',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          color: '#000000',
          fontSize: 17,
        },
      }}
    >
      <Tab.Screen
        name="Overview"
        component={FinancialOverview}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-pie" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Budget"
        component={Budget}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cards & Loans"
        component={CreditCardsLoans}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="credit-card" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Subscriptions"
        component={Subscriptions}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-sync" color={color} size={size} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Savings"
        component={Savings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="piggy-bank" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
