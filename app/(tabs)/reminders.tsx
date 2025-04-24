import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFerments } from '@/hooks/useFerments';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ferment } from '@/constants/Ferment';

export default function RemindersScreen() {
  const { ferments, toggleReminder } = useFerments();
  const colorScheme = useColorScheme();

  // Extract all reminders from all ferments
  const allReminders = ferments.reduce((acc, ferment) => {
    const fermentReminders = ferment.reminders.map(reminder => ({
      ...reminder,
      fermentId: ferment.id,
      fermentName: ferment.name,
      fermentType: ferment.type,
    }));
    return [...acc, ...fermentReminders];
  }, [] as Array<{
    id: string;
    title?: string;
    date: Date;
    text: string;
    completed: boolean;
    fermentId: string;
    fermentName: string;
    fermentType: string;
  }>);

  // Sort reminders by date (upcoming first)
  const sortedReminders = [...allReminders].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isUpcoming = (date: Date) => {
    const now = new Date();
    return date > now;
  };

  const isPast = (date: Date) => {
    const now = new Date();
    return date < now;
  };

  const isToday = (date: Date) => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Reminders
        </Text>
      </View>

      {sortedReminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol name="bell.slash" size={60} color={Colors[colorScheme ?? 'light'].icon} />
          <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
            No reminders yet
          </Text>
          <Text style={[styles.emptySubtext, { color: Colors[colorScheme ?? 'light'].icon }]}>
            Add reminders to your fermentation projects to track important dates
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedReminders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
                item.completed && styles.completedCard,
              ]}
              onPress={() => {
                // Navigate to the ferments tab and highlight the ferment in a future implementation
                router.push('/(tabs)/ferments');
              }}
            >
              <View style={styles.cardContent}>
                <View style={styles.reminderHeader}>
                  <View style={styles.dateContainer}>
                    {isToday(item.date) && (
                      <View style={styles.todayBadge}>
                        <Text style={styles.todayText}>TODAY</Text>
                      </View>
                    )}
                    {isPast(item.date) && !isToday(item.date) && !item.completed && (
                      <View style={styles.overdueBadge}>
                        <Text style={styles.overdueText}>OVERDUE</Text>
                      </View>
                    )}
                    <Text
                      style={[
                        styles.dateText,
                        { color: Colors[colorScheme ?? 'light'].text },
                        item.completed && styles.completedText,
                      ]}
                    >
                      {formatDate(item.date)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.checkButton,
                      item.completed && styles.checkedButton,
                    ]}
                    onPress={() => toggleReminder(item.fermentId, item.id)}
                  >
                    <IconSymbol
                      name={item.completed ? "checkmark.circle.fill" : "circle"}
                      size={24}
                      color={item.completed ? "#4CAF50" : Colors[colorScheme ?? 'light'].icon}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.reminderText,
                    { color: Colors[colorScheme ?? 'light'].text },
                    item.completed && styles.completedText,
                  ]}
                >
                  {item.title || item.text}
                </Text>

                {item.title && (
                  <Text
                    style={[
                      styles.reminderDescription,
                      { color: Colors[colorScheme ?? 'light'].text },
                      item.completed && styles.completedText,
                    ]}
                  >
                    {item.text}
                  </Text>
                )}

                <View style={styles.fermentInfo}>
                  <IconSymbol
                    name="flask.fill"
                    size={14}
                    color={item.completed ? Colors[colorScheme ?? 'light'].icon : Colors[colorScheme ?? 'light'].tint}
                  />
                  <Text
                    style={[
                      styles.fermentText,
                      { color: item.completed ? Colors[colorScheme ?? 'light'].icon : Colors[colorScheme ?? 'light'].tint },
                    ]}
                  >
                    {item.fermentName} ({item.fermentType})
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  completedCard: {
    opacity: 0.7,
  },
  cardContent: {
    padding: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'column',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  todayBadge: {
    backgroundColor: '#FFD600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  todayText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  overdueBadge: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  overdueText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reminderText: {
    fontSize: 16,
    marginBottom: 12,
  },
  reminderDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  fermentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fermentText: {
    fontSize: 12,
    marginLeft: 4,
  },
  checkButton: {
    padding: 8,
    marginRight: -8,
    marginTop: -8,
  },
  checkedButton: {
    opacity: 0.8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
}); 