import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FinancialHealthScoreProps {
  score: number; // Score from 0-100
  factors: {
    label: string;
    score: number; // Individual factor score from 0-100
    icon: string;
  }[];
}

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({ score, factors }) => {
  // Determine score color and label
  const getScoreColor = (value: number) => {
    if (value >= 80) return '#34C759'; // Excellent - Green
    if (value >= 60) return '#66B3FF'; // Good - Blue
    if (value >= 40) return '#FFCC00'; // Fair - Yellow
    return '#FF3B30'; // Poor - Red
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Financial Health</Text>
        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color: scoreColor }]}>{score}</Text>
          <Text style={[styles.scoreLabel, { color: scoreColor }]}>{scoreLabel}</Text>
        </View>
      </View>

      <View style={styles.factorsContainer}>
        {factors.map((factor, index) => (
          <View key={index} style={styles.factorRow}>
            <View style={styles.factorLabelContainer}>
              <Icon name={factor.icon} size={16} color="#555" style={styles.factorIcon} />
              <Text style={styles.factorLabel}>{factor.label}</Text>
            </View>
            <View style={styles.factorScoreContainer}>
              <View style={styles.scoreBar}>
                <View 
                  style={[
                    styles.scoreBarFill, 
                    { 
                      width: `${factor.score}%`,
                      backgroundColor: getScoreColor(factor.score)
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  scoreContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 6,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  factorsContainer: {
    marginTop: 2,
  },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  factorLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  factorIcon: {
    marginRight: 4,
  },
  factorLabel: {
    fontSize: 12,
    color: '#333333',
  },
  factorScoreContainer: {
    width: '55%',
  },
  scoreBar: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default FinancialHealthScore;
