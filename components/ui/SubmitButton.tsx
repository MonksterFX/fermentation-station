import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
}

export function SubmitButton({ title, onPress, color }: SubmitButtonProps) {
  const colorScheme = useColorScheme();
  const buttonColor = color || Colors[colorScheme ?? 'light'].tint;

  return (
    <TouchableOpacity
      style={[styles.submitButton, { backgroundColor: buttonColor }]}
      onPress={onPress}>
      <Text style={styles.submitButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 