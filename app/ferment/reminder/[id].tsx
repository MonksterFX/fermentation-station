import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { useFerments } from '@/hooks/useFerments';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { FormInput } from '@/components/ui/FormInput';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { SubmitButton } from '@/components/ui/SubmitButton';

export default function AddReminderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getFermentById, addReminder } = useFerments();
  const colorScheme = useColorScheme();
  
  const [reminderText, setReminderText] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date());

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

  const handleSubmit = () => {
    if (!reminderText.trim()) {
      Alert.alert('Error', 'Please enter a reminder');
      return;
    }

    const newReminder = {
      date: reminderDate,
      text: reminderText,
      completed: false,
    };

    addReminder(ferment.id, newReminder);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Add Reminder' }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.form}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Add Reminder for {ferment.name}
          </Text>

          <FormInput
            label="Reminder"
            value={reminderText}
            onChangeText={setReminderText}
            placeholder="What needs to be done?"
            multiline
          />

          <DatePickerField
            label="Date"
            value={reminderDate}
            onChange={setReminderDate}
          />

          <View style={styles.buttonContainer}>
            <SubmitButton title="Add Reminder" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buttonContainer: {
    marginVertical: 24,
  },
}); 