import React from 'react';
import { StyleSheet, TextInput, Text, View, TextInputProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FormInputProps extends TextInputProps {
  label: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export function FormInput({
  label,
  multiline = false,
  numberOfLines = 1,
  ...props
}: FormInputProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.formGroup}>
      <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].icon
          }
        ]}
        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
}); 