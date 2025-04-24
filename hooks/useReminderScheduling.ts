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
    const now = new Date();
    const newReminders: Omit<Reminder, 'id'>[] = [];
    
    // Generic reminder schedule for all ferments
    
    // First check - 3 days after start
    const firstCheckDate = new Date(now);
    firstCheckDate.setDate(firstCheckDate.getDate() + 3);
    newReminders.push({
      title: "Initial Check",
      text: `Check the initial fermentation progress of ${ferment.name}`,
      date: firstCheckDate,
      completed: false
    });
    
    // Mid-process check - 7 days after start
    const midCheckDate = new Date(now);
    midCheckDate.setDate(midCheckDate.getDate() + 7);
    newReminders.push({
      title: "Mid-Process Check",
      text: `Check if ${ferment.name} is progressing well`,
      date: midCheckDate,
      completed: false
    });
    
    // Final check - 14 days after start
    const finalCheckDate = new Date(now);
    finalCheckDate.setDate(finalCheckDate.getDate() + 14);
    newReminders.push({
      title: "Final Check",
      text: `Your ${ferment.name} should be ready to evaluate`,
      date: finalCheckDate,
      completed: false
    });
    
    return newReminders;
  };

  return {
    createRemindersForFerment
  };
} 