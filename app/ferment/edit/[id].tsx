import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { useFerments } from '@/hooks/useFerments';
import { FermentStatus } from '@/constants/Ferment';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { FormInput } from '@/components/ui/FormInput';
import { FormPicker } from '@/components/ui/FormPicker';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { SubmitButton } from '@/components/ui/SubmitButton';

export default function EditFermentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getFermentById, updateFerment } = useFerments();
  const colorScheme = useColorScheme();

  // Using TanStack Query to fetch and cache the ferment data
  const { data: ferment, isLoading, error } = useQuery({
    queryKey: ['ferment', id],
    queryFn: () => getFermentById(id || ''),
  });

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [temperature, setTemperature] = useState('');
  const [ph, setPh] = useState('');
  const [status, setStatus] = useState(FermentStatus.PLANNED);

  // Load ferment data when available
  useEffect(() => {
    if (ferment) {
      setName(ferment.name);
      setStartDate(ferment.startDate);
      setEndDate(ferment.endDate || null);
      setNotes(ferment.notes);
      setTemperature(ferment.temperature ? ferment.temperature.toString() : '');
      setPh(ferment.ph ? ferment.ph.toString() : '');
      setStatus(ferment.status);
    }
  }, [ferment]);

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
    if (!name) {
      Alert.alert('Error', 'Please enter a name for your ferment');
      return;
    }

    const updatedFerment = {
      name,
      startDate,
      endDate: endDate || undefined,
      notes,
      status,
      temperature: temperature ? parseFloat(temperature) : undefined,
      ph: ph ? parseFloat(ph) : undefined,
    };

    updateFerment(id || '', updatedFerment);
    router.back();
  };

  const fermentStatusItems = Object.values(FermentStatus).map(status => ({
    label: status,
    value: status,
  }));

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Edit Ferment' }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <FormInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter ferment name"
          />

          <FormPicker
            label="Status"
            selectedValue={status}
            onValueChange={setStatus}
            items={fermentStatusItems}
          />

          <DatePickerField
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
          />

          {endDate ? (
            <DatePickerField
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          ) : (
            <TouchableOpacity onPress={() => setEndDate(new Date())}>
              <Text style={[styles.addEndDate, { color: Colors[colorScheme ?? 'light'].tint }]}>
                + Add End Date
              </Text>
            </TouchableOpacity>
          )}

          <FormInput
            label="Temperature (°F)"
            value={temperature}
            onChangeText={setTemperature}
            placeholder="Enter temperature"
            keyboardType="numeric"
          />

          <FormInput
            label="pH Level"
            value={ph}
            onChangeText={setPh}
            placeholder="Enter pH level"
            keyboardType="numeric"
          />

          <FormInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter notes"
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <SubmitButton title="Save Changes" onPress={handleSubmit} />
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
  form: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  buttonContainer: {
    marginVertical: 24,
  },
  addEndDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    marginTop: -10,
  },
}); 