import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockFerments } from '@/constants/MockData';
import { Ferment, FermentStatus, Reminder } from '@/constants/Ferment';

interface FermentsContextType {
  ferments: Ferment[];
  addFerment: (ferment: Omit<Ferment, 'id'>) => void;
  updateFerment: (id: string, updates: Partial<Ferment>) => void;
  deleteFerment: (id: string) => void;
  addReminder: (fermentId: string, reminder: Omit<Reminder, 'id'>) => void;
  toggleReminder: (fermentId: string, reminderId: string) => void;
  getFermentById: (id: string) => Ferment | undefined;
}

const FermentsContext = createContext<FermentsContextType | undefined>(undefined);

export function FermentsProvider({ children }: { children: ReactNode }) {
  const [ferments, setFerments] = useState<Ferment[]>(mockFerments);

  const addFerment = (ferment: Omit<Ferment, 'id'>) => {
    const newFerment = {
      ...ferment,
      id: Date.now().toString(),
    };
    setFerments((prev) => [...prev, newFerment]);
  };

  const updateFerment = (id: string, updates: Partial<Ferment>) => {
    setFerments((prev) =>
      prev.map((ferment) => (ferment.id === id ? { ...ferment, ...updates } : ferment))
    );
  };

  const deleteFerment = (id: string) => {
    setFerments((prev) => prev.filter((ferment) => ferment.id !== id));
  };

  const addReminder = (fermentId: string, reminder: Omit<Reminder, 'id'>) => {
    const newReminder = {
      ...reminder,
      id: Date.now().toString(),
    };
    setFerments((prev) =>
      prev.map((ferment) =>
        ferment.id === fermentId
          ? { ...ferment, reminders: [...ferment.reminders, newReminder] }
          : ferment
      )
    );
  };

  const toggleReminder = (fermentId: string, reminderId: string) => {
    setFerments((prev) =>
      prev.map((ferment) =>
        ferment.id === fermentId
          ? {
              ...ferment,
              reminders: ferment.reminders.map((reminder) =>
                reminder.id === reminderId
                  ? { ...reminder, completed: !reminder.completed }
                  : reminder
              ),
            }
          : ferment
      )
    );
  };

  const getFermentById = (id: string) => {
    return ferments.find((ferment) => ferment.id === id);
  };

  return (
    <FermentsContext.Provider
      value={{
        ferments,
        addFerment,
        updateFerment,
        deleteFerment,
        addReminder,
        toggleReminder,
        getFermentById,
      }}>
      {children}
    </FermentsContext.Provider>
  );
}

export function useFerments() {
  const context = useContext(FermentsContext);
  if (context === undefined) {
    throw new Error('useFerments must be used within a FermentsProvider');
  }
  return context;
} 