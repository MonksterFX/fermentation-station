import { Reminder, Ferment } from '@/constants/Ferment';

/**
 * Hook for generating generic reminder schedules for fermentation
 */
export function useReminderScheduling() {
  /**
   * Create generic reminders for a ferment
   * @param ferment The ferment to create reminders for
   * @returns An array of reminder objects (without IDs)
   */
  const createRemindersForFerment = (ferment: Ferment): Omit<Reminder, 'id'>[] => {
    const newReminders: Omit<Reminder, 'id'>[] = [];
    return newReminders;
  };

  return {
    createRemindersForFerment
  };
} 