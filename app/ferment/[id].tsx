import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFerments } from '@/hooks/useFerments';
import { useReminderScheduling } from '@/hooks/useReminderScheduling';
import { FermentStatus, FermentType, Ferment, Reminder } from '@/constants/Ferment';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ActionButton } from '@/components/ui/ActionButton';

export default function FermentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getFermentById, updateFerment, deleteFerment, toggleReminder, addReminder } = useFerments();
  const { createRemindersForFerment } = useReminderScheduling();
  const colorScheme = useColorScheme();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Using TanStack Query to fetch and cache the ferment data
  const { data: ferment, isLoading, error } = useQuery({
    queryKey: ['ferment', id],
    queryFn: () => getFermentById(id || ''),
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>Loading...</Text>
      </View>
    );
  }

  if (error || !ferment) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Error loading ferment details
        </Text>
      </View>
    );
  }

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

  const handleUpdateStatus = (newStatus: FermentStatus) => {
    updateFerment(ferment.id, { status: newStatus });
  };

  const handleDeleteFerment = () => {
    Alert.alert(
      "Delete Ferment",
      "Are you sure you want to delete this ferment? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            deleteFerment(ferment.id);
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleToggleReminder = (reminderId: string) => {
    toggleReminder(ferment.id, reminderId);
  };

  const handleStartFermentation = () => {
    // Confirm with the user before starting the fermentation process
    Alert.alert(
      "Start Fermentation",
      "Are you sure you want to start this fermentation process? This will change the status to 'Unstable' and schedule reminders based on the fermentation type.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Start", 
          onPress: () => {
            // Update the ferment status to UNSTABLE
            const now = new Date();
            updateFerment(ferment.id, { 
              status: FermentStatus.UNSTABLE,
              startDate: now
            });
            
            // Schedule reminders based on fermentation type using the hook
            const reminders = createRemindersForFerment(ferment);
            
            // Add the reminders to the ferment
            reminders.forEach(reminder => {
              addReminder(ferment.id, reminder);
            });
            
            // Refresh the query to show updated data
            queryClient.invalidateQueries({ queryKey: ['ferment', id] });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: ferment.name,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(`/ferment/edit/${id}`)}>
              <IconSymbol name="square.and.pencil" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            {ferment.name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ferment.status) }]}>
            <IconSymbol name={getStatusIcon(ferment.status)} size={16} color="white" />
            <Text style={styles.statusText}>{ferment.status}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Type:</Text>
            <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>{ferment.type}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Started:</Text>
            <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              {formatDate(ferment.startDate)}
            </Text>
          </View>
          
          {ferment.endDate && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Ended:</Text>
              <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                {formatDate(ferment.endDate)}
              </Text>
            </View>
          )}
          
          {ferment.temperature && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Temperature:</Text>
              <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                {ferment.temperature}°F
              </Text>
            </View>
          )}
          
          {ferment.ph && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].text }]}>pH Level:</Text>
              <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                {ferment.ph}
              </Text>
            </View>
          )}
        </View>

        {/* Ingredients Section */}
        <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Ingredients</Text>
          
          {ferment.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <IconSymbol name="circle.fill" size={8} color={Colors[colorScheme ?? 'light'].tint} />
              <Text style={[styles.ingredientText, { color: Colors[colorScheme ?? 'light'].text }]}>
                {ingredient}
              </Text>
            </View>
          ))}
        </View>

        {/* Notes Section */}
        {ferment.notes && (
          <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Notes</Text>
            <Text style={[styles.notesText, { color: Colors[colorScheme ?? 'light'].text }]}>
              {ferment.notes}
            </Text>
          </View>
        )}

        {/* Reminders Section */}
        {ferment.reminders.length > 0 && (
          <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Reminders</Text>
            
            {ferment.reminders.map((reminder) => (
              <TouchableOpacity 
                key={reminder.id} 
                style={styles.reminderItem}
                onPress={() => handleToggleReminder(reminder.id)}
              >
                <IconSymbol 
                  name={reminder.completed ? "checkmark.circle.fill" : "circle"} 
                  size={24} 
                  color={reminder.completed ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text} 
                />
                <View style={styles.reminderContent}>
                  <Text 
                    style={[
                      styles.reminderText, 
                      { 
                        color: Colors[colorScheme ?? 'light'].text,
                        textDecorationLine: reminder.completed ? 'line-through' : 'none' 
                      }
                    ]}
                  >
                    {reminder.title || reminder.text}
                  </Text>
                  
                  {reminder.title && (
                    <Text 
                      style={[
                        styles.reminderDescription, 
                        { 
                          color: Colors[colorScheme ?? 'light'].text,
                          textDecorationLine: reminder.completed ? 'line-through' : 'none' 
                        }
                      ]}
                    >
                      {reminder.text}
                    </Text>
                  )}
                  
                  <Text style={[styles.reminderDate, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {formatDate(reminder.date)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Start Fermentation Button - Only show for PLANNED ferments */}
        {ferment.status === FermentStatus.PLANNED && (
          <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartFermentation}
            >
              <IconSymbol name="play.fill" size={20} color="white" />
              <Text style={styles.startButtonText}>Start Fermentation</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status Management */}
        <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Update Status</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.statusScrollView}
          >
            {Object.values(FermentStatus).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  { borderColor: getStatusColor(status) },
                  ferment.status === status && { backgroundColor: getStatusColor(status) }
                ]}
                onPress={() => handleUpdateStatus(status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    { color: ferment.status === status ? 'white' : getStatusColor(status) }
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <ActionButton
            icon="square.and.pencil"
            title="Edit"
            route={`/ferment/edit/${id}`}
            color={Colors[colorScheme ?? 'light'].tint}
          />
          <ActionButton
            icon="bell.badge"
            title="Add Reminder"
            route={`/ferment/reminder/${id}`}
            color="#FF9800"
          />
          <ActionButton
            icon="trash"
            title="Delete"
            color="#F44336"
            onPress={handleDeleteFerment}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
    width: 120,
  },
  detailValue: {
    flex: 1,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientText: {
    marginLeft: 8,
  },
  notesText: {
    lineHeight: 22,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderContent: {
    marginLeft: 12,
    flex: 1,
  },
  reminderText: {
    fontSize: 16,
    marginBottom: 2,
  },
  reminderDescription: {
    fontSize: 12,
  },
  reminderDate: {
    fontSize: 12,
  },
  statusScrollView: {
    marginVertical: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 2,
    borderRadius: 20,
  },
  statusButtonText: {
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 