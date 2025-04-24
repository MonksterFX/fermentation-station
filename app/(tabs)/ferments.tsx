import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useFerments } from '@/hooks/useFerments';
import { FermentStatus, FermentType } from '@/constants/Ferment';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function FermentsScreen() {
  const { ferments } = useFerments();
  const colorScheme = useColorScheme();
  const [filter, setFilter] = useState<FermentStatus | null>(null);

  const filteredFerments = filter
    ? ferments.filter((ferment) => ferment.status === filter)
    : ferments;

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          My Ferments
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              !filter && styles.filterButtonActive,
              { borderColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={() => setFilter(null)}>
            <Text
              style={[
                styles.filterButtonText,
                !filter && { color: Colors[colorScheme ?? 'light'].tint },
                { color: Colors[colorScheme ?? 'light'].text }
              ]}>
              All
            </Text>
          </TouchableOpacity>
          
          {Object.values(FermentStatus).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filter === status && styles.filterButtonActive,
                { borderColor: getStatusColor(status) }
              ]}
              onPress={() => setFilter(status)}>
              <Text
                style={[
                  styles.filterButtonText,
                  { color: getStatusColor(status) },
                ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredFerments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
            ]}
            onPress={() => router.push(`/ferment/${item.id}`)}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {item.name}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <IconSymbol 
                    name={getStatusIcon(item.status)} 
                    size={12} 
                    color="white" 
                    style={styles.statusIcon} 
                  />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <IconSymbol name="calendar" size={16} color={Colors[colorScheme ?? 'light'].text} />
                  <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    Started: {formatDate(item.startDate)}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <IconSymbol name="tag.fill" size={16} color={Colors[colorScheme ?? 'light'].text} />
                  <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {item.type}
                  </Text>
                </View>
                
                {item.temperature && (
                  <View style={styles.detailRow}>
                    <IconSymbol name="thermometer" size={16} color={Colors[colorScheme ?? 'light'].text} />
                    <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
                      {item.temperature}°F
                    </Text>
                  </View>
                )}
                
                {item.reminders.length > 0 && (
                  <View style={styles.detailRow}>
                    <IconSymbol name="bell.fill" size={16} color={Colors[colorScheme ?? 'light'].text} />
                    <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
                      {item.reminders.filter(r => !r.completed).length} reminder(s)
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
  filterScrollView: {
    marginBottom: 10,
  },
  filterContainer: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  filterButtonText: {
    fontWeight: '500',
  },
  list: {
    padding: 16,
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
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
}); 