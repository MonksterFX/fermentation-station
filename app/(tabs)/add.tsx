import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFerments } from '@/hooks/useFerments';
import { FermentStatus } from '@/constants/Ferment';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FormInput } from '@/components/ui/FormInput';
import { DatePickerField } from '@/components/ui/DatePickerField';
import { SubmitButton } from '@/components/ui/SubmitButton';

export default function AddFermentScreen() {
  const { addFerment } = useFerments();
  const colorScheme = useColorScheme();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [temperature, setTemperature] = useState('');
  const [ph, setPh] = useState('');

  const handleSubmit = () => {
    if (!name) {
      alert('Please enter a name for your ferment');
      return;
    }

    const newFerment = {
      name,
      startDate,
      notes,
      status: FermentStatus.PLANNED,
      temperature: temperature ? parseFloat(temperature) : undefined,
      ph: ph ? parseFloat(ph) : undefined,
      images: [],
      reminders: [],
    };

    addFerment(newFerment);
    router.push('/ferments');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Add Ferment' }} />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
              Add New Ferment
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter ferment name"
            />

            <DatePickerField
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
            />

            <FormInput
              label="Temperature (°F) - Optional"
              value={temperature}
              onChangeText={setTemperature}
              placeholder="Enter temperature"
              keyboardType="numeric"
            />

            <FormInput
              label="pH Level - Optional"
              value={ph}
              onChangeText={setPh}
              placeholder="Enter pH level"
              keyboardType="numeric"
            />

            <FormInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter notes about your ferment"
              multiline={true}
              numberOfLines={4}
            />

            <SubmitButton 
              title="Create Ferment" 
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
}); 