import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from './IconSymbol';

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const colorScheme = useColorScheme();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.formGroup}>
      <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
        {label}
      </Text>
      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
            borderColor: Colors[colorScheme ?? 'light'].icon
          }
        ]}
        onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
          {formatDate(value)}
        </Text>
        <IconSymbol name="calendar" size={20} color={Colors[colorScheme ?? 'light'].text} />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
}); 