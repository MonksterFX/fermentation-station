import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol, IconSymbolName } from './IconSymbol';

export interface ActionButtonProps {
  title: string;
  icon: IconSymbolName;
  route?: string | { pathname: string; params?: Record<string, string> };
  color: string;
  onPress?: () => void;
}

export function ActionButton({ title, icon, route, color, onPress }: ActionButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (route) {
      router.push(route as any);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={handlePress}>
      <IconSymbol name={icon} size={20} color="#FFF" />
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
}); 