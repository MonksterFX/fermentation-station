import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import { useFerments } from '@/hooks/useFerments';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { FormInput } from '@/components/ui/FormInput';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { FormPicker } from '@/components/ui/FormPicker';
import { IconSymbol } from '@/components/ui/IconSymbol';

type IntervalUnit = 'minutes' | 'hours' | 'days' | 'weeks';

export default function AddReminderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getFermentById, addReminder } = useFerments();
  const colorScheme = useColorScheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [useInterval, setUseInterval] = useState(true);
  const [intervalAmount, setIntervalAmount] = useState('1');
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>('days');
  const [specificDate, setSpecificDate] = useState(new Date());

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

  const calculateReminderDate = (): Date => {
    if (!useInterval) {
      return specificDate;
    }

    const interval = parseInt(intervalAmount) || 1;
    const startDate = new Date(ferment.startDate);
    const reminderDate = new Date(startDate);

    switch (intervalUnit) {
      case 'minutes':
        reminderDate.setMinutes(startDate.getMinutes() + interval);
        break;
      case 'hours':
        reminderDate.setHours(startDate.getHours() + interval);
        break;
      case 'days':
        reminderDate.setDate(startDate.getDate() + interval);
        break;
      case 'weeks':
        reminderDate.setDate(startDate.getDate() + (interval * 7));
        break;
    }

    return reminderDate;
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a reminder title');
      return;
    }

    const reminderDate = calculateReminderDate();

    // Schedule local notification
    schedulePushNotification(title, description, reminderDate);

    const newReminder = {
      title: title,
      date: reminderDate,
      text: description,
      completed: false,
    };

    addReminder(ferment.id, newReminder);
    router.back();
  };

  const schedulePushNotification = async (title: string, body: string, date: Date) => {
    try {
      // Request permission first
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'You need to grant notification permissions to set reminders');
        return;
      }
      
      // Calculate the trigger date (seconds from now until the target date)
      const trigger = date.getTime() - Date.now();
      
      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: { fermentId: ferment.id },
        },
        trigger: { seconds: Math.max(1, Math.floor(trigger / 1000)) },
      });
      
      Alert.alert('Reminder set', `Reminder "${title}" scheduled for ${date.toLocaleString()}`);
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      Alert.alert('Error', 'Failed to schedule the notification');
    }
  };

  const intervalItems = [
    { label: 'Minutes', value: 'minutes' },
    { label: 'Hours', value: 'hours' },
    { label: 'Days', value: 'days' },
    { label: 'Weeks', value: 'weeks' },
  ];

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
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter reminder title"
          />

          <FormInput
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add more details about this reminder"
            multiline
            numberOfLines={3}
          />

          <View style={styles.reminderTypeContainer}>
            <Text style={[styles.reminderTypeLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Reminder Type
            </Text>
            
            <View style={styles.reminderTypeOptions}>
              <TouchableOpacity 
                style={[
                  styles.reminderTypeOption,
                  useInterval && styles.selectedReminderType,
                  { borderColor: Colors[colorScheme ?? 'light'].tint }
                ]}
                onPress={() => setUseInterval(true)}
              >
                <IconSymbol 
                  name="timer" 
                  size={18} 
                  color={useInterval ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text} 
                />
                <Text 
                  style={[
                    styles.reminderTypeText,
                    { color: useInterval ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text }
                  ]}
                >
                  Interval
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.reminderTypeOption,
                  !useInterval && styles.selectedReminderType,
                  { borderColor: Colors[colorScheme ?? 'light'].tint }
                ]}
                onPress={() => setUseInterval(false)}
              >
                <IconSymbol 
                  name="calendar" 
                  size={18} 
                  color={!useInterval ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text} 
                />
                <Text 
                  style={[
                    styles.reminderTypeText,
                    { color: !useInterval ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text }
                  ]}
                >
                  Specific Date
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {useInterval ? (
            <View style={styles.intervalContainer}>
              <Text style={[styles.intervalLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
                Remind me after:
              </Text>
              
              <View style={styles.intervalInputs}>
                <View style={styles.amountInput}>
                  <FormInput
                    label=""
                    value={intervalAmount}
                    onChangeText={setIntervalAmount}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>
                
                <View style={styles.unitInput}>
                  <FormPicker
                    label=""
                    selectedValue={intervalUnit}
                    onValueChange={(value) => setIntervalUnit(value as IntervalUnit)}
                    items={intervalItems}
                  />
                </View>
              </View>
              
              <View style={styles.timePreview}>
                <Text style={[styles.previewLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                  Your reminder will be set for:
                </Text>
                <Text style={[styles.previewValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {calculateReminderDate().toLocaleString()}
                </Text>
              </View>
            </View>
          ) : (
            <DatePickerField
              label="Reminder Date and Time"
              value={specificDate}
              onChange={setSpecificDate}
            />
          )}

          <View style={styles.buttonContainer}>
            <SubmitButton title="Set Reminder" onPress={handleSubmit} />
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
  reminderTypeContainer: {
    marginBottom: 20,
  },
  reminderTypeLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  reminderTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reminderTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    width: '48%',
  },
  selectedReminderType: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  reminderTypeText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  intervalContainer: {
    marginBottom: 20,
  },
  intervalLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  intervalInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountInput: {
    width: '30%',
  },
  unitInput: {
    width: '65%',
  },
  timePreview: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  previewLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 