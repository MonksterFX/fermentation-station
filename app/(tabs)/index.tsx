import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useFerments } from '@/hooks/useFerments';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FermentStatus } from '@/constants/Ferment';
import { ActionButton } from '@/components/ui/ActionButton';
import { ActionButtons } from '@/components/ui/ActionButtons';

export default function HomeScreen() {
  const { ferments } = useFerments();
  const colorScheme = useColorScheme();
  const [stats, setStats] = useState({
    active: 0,
    planned: 0,
    total: 0,
    reminders: 0,
  });

  useEffect(() => {
    const active = ferments.filter(f => 
      f.status === FermentStatus.UNSTABLE || 
      f.status === FermentStatus.STABLE
    ).length;
    const planned = ferments.filter(f => f.status === FermentStatus.PLANNED).length;
    const total = ferments.length;
    
    const reminders = ferments.reduce(
      (count, ferment) => count + ferment.reminders.filter(r => !r.completed).length,
      0
    );

    setStats({ active, planned, total, reminders });
  }, [ferments]);

  // Get upcoming reminders (limited to 3)
  const upcomingReminders = ferments.reduce((acc, ferment) => {
    const fermentReminders = ferment.reminders
      .filter(r => !r.completed)
      .map(reminder => ({
        ...reminder,
        fermentName: ferment.name,
      }));
    return [...acc, ...fermentReminders];
  }, [] as Array<{
    id: string;
    date: Date;
    text: string;
    completed: boolean;
    fermentName: string;
  }>)
  .sort((a, b) => a.date.getTime() - b.date.getTime())
  .slice(0, 3);

  // Get most recent ferments (limited to 3)
  const recentFerments = [...ferments]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: FermentStatus) => {
    switch (status) {
      case FermentStatus.PLANNED:
        return '#9C27B0'; // Purple
      case FermentStatus.UNSTABLE:
        return '#FF9800'; // Orange
      case FermentStatus.STABLE:
        return '#4CAF50'; // Green
      case FermentStatus.EXPIRED:
        return '#607D8B'; // Blue Grey
      case FermentStatus.BAD:
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  const getStatusIcon = (status: FermentStatus) => {
    switch (status) {
      case FermentStatus.PLANNED:
        return "calendar.badge.clock";
      case FermentStatus.UNSTABLE:
        return "exclamationmark.triangle";
      case FermentStatus.STABLE:
        return "checkmark.seal.fill";
      case FermentStatus.EXPIRED:
        return "clock.arrow.circlepath";
      case FermentStatus.BAD:
        return "xmark.circle.fill";
      default:
        return "questionmark.circle";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Fermentation Station
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statsCard,
              { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
            ]}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <IconSymbol name="flask.fill" size={20} color="#FF9800" />
              </View>
              <View>
                <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {stats.active}
                </Text>
                <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                  Active
                </Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
                <IconSymbol name="calendar.badge.clock" size={20} color="#9C27B0" />
              </View>
              <View>
                <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {stats.planned}
                </Text>
                <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                  Planned
                </Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF8E1' }]}>
                <IconSymbol name="bell.fill" size={20} color="#FFB300" />
              </View>
              <View>
                <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {stats.reminders}
                </Text>
                <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                  Reminders
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Quick Actions
          </Text>
        </View>

        <ActionButtons />

        {upcomingReminders.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Upcoming Reminders
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/reminders')}>
                <Text style={[styles.seeAllText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.remindersList}>
              {upcomingReminders.map((reminder) => (
                <View 
                  key={reminder.id}
                  style={[
                    styles.reminderCard,
                    { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
                  ]}>
                  <View style={styles.reminderContent}>
                    <View style={styles.reminderIcon}>
                      <IconSymbol name="bell.fill" size={16} color="#FFB300" />
                    </View>
                    <View style={styles.reminderDetails}>
                      <Text style={[styles.reminderText, { color: Colors[colorScheme ?? 'light'].text }]}>
                        {reminder.text}
                      </Text>
                      <Text style={[styles.reminderSubtext, { color: Colors[colorScheme ?? 'light'].icon }]}>
                        {reminder.fermentName} • {formatDate(reminder.date)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {recentFerments.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Recent Ferments
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/ferments')}>
                <Text style={[styles.seeAllText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fermentsList}>
              {recentFerments.map((ferment) => (
                <TouchableOpacity
                  key={ferment.id}
                  style={[
                    styles.fermentCard,
                    { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
                  ]}
                  onPress={() => router.push('/(tabs)/ferments')}>
                  <View style={styles.fermentContent}>
                    <View style={styles.fermentInfo}>
                      <Text style={[styles.fermentName, { color: Colors[colorScheme ?? 'light'].text }]}>
                        {ferment.name}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(ferment.status) }
                    ]}>
                      <IconSymbol 
                        name={getStatusIcon(ferment.status)} 
                        size={12} 
                        color="white" 
                        style={styles.statusIcon} 
                      />
                      <Text style={styles.statusText}>{ferment.status}</Text>
                    </View>
                  </View>
                  <View style={styles.fermentMeta}>
                    <View style={styles.metaItem}>
                      <IconSymbol name="calendar" size={14} color={Colors[colorScheme ?? 'light'].icon} />
                      <Text style={[styles.metaText, { color: Colors[colorScheme ?? 'light'].icon }]}>
                        Started: {formatDate(ferment.startDate)}
                      </Text>
                    </View>
                    {ferment.ingredients.length > 0 && (
                      <View style={styles.metaItem}>
                        <IconSymbol name="list.bullet" size={14} color={Colors[colorScheme ?? 'light'].icon} />
                        <Text style={[styles.metaText, { color: Colors[colorScheme ?? 'light'].icon }]}>
                          {ferment.ingredients.length} ingredients
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={styles.footer} />
      </ScrollView>
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
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  remindersList: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  reminderCard: {
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    marginRight: 10,
  },
  reminderDetails: {
    flex: 1,
  },
  reminderText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  reminderSubtext: {
    fontSize: 12,
  },
  fermentsList: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  fermentCard: {
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fermentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  fermentInfo: {
    flex: 1,
  },
  fermentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fermentMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  footer: {
    height: 40,
  },
  statusIcon: {
    marginRight: 4,
  },
});
