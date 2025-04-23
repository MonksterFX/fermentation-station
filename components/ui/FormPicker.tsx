import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FormPickerProps<T> {
  label: string;
  selectedValue: T;
  onValueChange: (itemValue: T) => void;
  items: { label: string; value: T }[];
}

export function FormPicker<T>({
  label,
  selectedValue,
  onValueChange,
  items
}: FormPickerProps<T>) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.formGroup}>
      <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
        {label}
      </Text>
      <View
        style={[
          styles.pickerContainer,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
            borderColor: Colors[colorScheme ?? 'light'].icon
          }
        ]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={{ color: Colors[colorScheme ?? 'light'].text }}
          dropdownIconColor={Colors[colorScheme ?? 'light'].text}>
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
}); 