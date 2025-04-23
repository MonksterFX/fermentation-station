import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActionButton } from './ActionButton';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ActionButtonsProps {
  /**
   * Whether to show the add new ferment button
   */
  showAdd?: boolean;
  
  /**
   * Whether to show the view all ferments button
   */
  showViewAll?: boolean;
  
  /**
   * Whether to show the reminders button
   */
  showReminders?: boolean;
}

/**
 * A container for action buttons that provides a standard layout
 */
export function ActionButtons({ 
  showAdd = true, 
  showViewAll = true, 
  showReminders = true 
}: ActionButtonsProps) {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.actionButtons}>
      {showAdd && (
        <ActionButton
          title="New Ferment"
          icon="plus"
          route="/(tabs)/add"
          color={Colors[colorScheme ?? 'light'].tint}
        />
      )}
      
      {showViewAll && (
        <ActionButton
          title="View All"
          icon="list.bullet"
          route="/(tabs)/ferments"
          color="#4CAF50"
        />
      )}
      
      {showReminders && (
        <ActionButton
          title="Reminders"
          icon="bell.fill"
          route="/(tabs)/reminders"
          color="#FFB300"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
}); 