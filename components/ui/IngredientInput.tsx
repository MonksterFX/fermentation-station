import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from './IconSymbol';

interface IngredientInputProps {
  label: string;
  ingredients: string[];
  onAddIngredient: () => void;
  onChangeIngredient: (text: string, index: number) => void;
  onRemoveIngredient: (index: number) => void;
}

export function IngredientInput({
  label,
  ingredients,
  onAddIngredient,
  onChangeIngredient,
  onRemoveIngredient
}: IngredientInputProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.formGroup}>
      <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
        {label}
      </Text>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <TextInput
            style={[
              styles.input,
              styles.ingredientInput,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].icon
              }
            ]}
            value={ingredient}
            onChangeText={(text) => onChangeIngredient(text, index)}
            placeholder="Enter ingredient"
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemoveIngredient(index)}>
            <IconSymbol name="minus.circle.fill" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={onAddIngredient}>
        <IconSymbol name="plus.circle.fill" size={20} color={Colors[colorScheme ?? 'light'].tint} />
        <Text style={[styles.addButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
          Add Ingredient
        </Text>
      </TouchableOpacity>
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
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  ingredientInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
}); 