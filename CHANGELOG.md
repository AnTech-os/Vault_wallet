# Changelog

All notable changes to the Secure DIY Budget App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup using React Native CLI
- Basic project structure with TypeScript support
- Bottom tab navigation with five main screens:
  - Financial Overview
  - Budget
  - Credit Cards & Loans
  - Subscriptions
  - Savings
- Custom navigation icons using react-native-vector-icons
- Basic screen components for all five main sections
- Updated README.md with project description and setup instructions
- Development environment setup:
  - React Navigation installation
  - Vector Icons integration
  - Safe Area Context implementation

### Financial Overview Dashboard
- Integrated Victory Native for data visualization
- Added SpendingPieChart component for category-wise spending visualization
- Added MonthlySpendingChart component for tracking spending trends
- Created FinancialMetricCard component for key financial metrics
- Implemented responsive dashboard layout with:
  - Total Balance card with trend indicator
  - Monthly Spending card with trend indicator
  - Category-wise spending breakdown
  - 6-month spending trend chart
- Added Financial Health Score component with:
  - Overall score calculation based on key financial factors
  - Visual indicators for Savings Rate, Debt Ratio, Emergency Fund, and Budget Adherence
  - Color-coded progress bars for each factor
- Optimized Financial Overview screen for single-page view:
  - Condensed metrics display
  - Removed charts in favor of inline data
  - Streamlined debt and savings trends section

### Subscriptions Management
- Created new Subscriptions tab in the main navigation
- Implemented Subscriptions screen with:
  - Monthly, yearly, and annualized subscription cost summaries
  - Category filtering for subscription types
  - Detailed subscription cards showing:
    - Subscription name and icon
    - Category
    - Cost and billing cycle
    - Next renewal date
  - Add subscription button for manual entry
- Added comprehensive subscription form modal:
  - Input fields for subscription name and cost
  - Category selection with visual icons including Entertainment, Software, Fitness, Shopping, Music, News, Food, Meds, and Other
  - Frequency options (monthly, quarterly, yearly)
  - Date picker for renewal dates with improved iOS and Android compatibility
  - Form validation for required fields
  - Empty state handling for filtered categories
- Added subscription editing functionality:
  - Tap on existing subscription to edit details
  - Update subscription name, cost, category, billing cycle, renewal date, and notes
  - Automatic recalculation of monthly and yearly totals after edits
- Enhanced Subscriptions UI:
  - Improved layout with financial summary at the top
  - Added category filters with horizontal scrolling
  - Added date and price sorting options
  - Abbreviated billing cycles to "mo" and "yr" for cleaner display
  - Optimized vertical spacing for better information density
  - Balanced layout with proper alignment of financial summaries
  - Replaced category dropdown with intuitive icon-based filter row
  - Added floating action button (FAB) in bottom right corner for adding new subscriptions
  - Simplified delete confirmation modal by removing unnecessary subtext
  - Improved category filtering with toggle functionality for easier selection

### Budget Management
- Created BudgetSummaryCard component with:
  - Visual representation of total budget utilization
  - Overview of total budget, spent amount, and remaining balance
- Implemented BudgetCategoryCard component featuring:
  - Category-specific budget tracking
  - Progress bars for visual spending representation
  - Over-budget indicators
- Added floating action button for expense input
- Integrated sample budget data structure
- Implemented basic expense tracking interface

### Security
- Implemented local-only data storage approach
- No external account linking functionality

### Technical
- Project initialized with React Native CLI (no Expo)
- TypeScript configuration
- Navigation setup with @react-navigation/native and @react-navigation/bottom-tabs
- iOS setup with CocoaPods dependencies
- Added @react-native-community/datetimepicker for date selection
