import { FermentType, Reminder, Ferment } from '@/constants/Ferment';

/**
 * Hook for generating reminder schedules based on fermentation types
 */
export function useReminderScheduling() {
  /**
   * Create reminders for a ferment based on its type
   * @param ferment The ferment to create reminders for
   * @returns An array of reminder objects (without IDs)
   */
  const createRemindersForFerment = (ferment: Ferment): Omit<Reminder, 'id'>[] => {
    const now = new Date();
    const newReminders: Omit<Reminder, 'id'>[] = [];
    
    switch(ferment.type) {
      case FermentType.KOMBUCHA:
        // Check after 5-7 days
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() + 5);
        newReminders.push({
          title: "Check Kombucha",
          text: "Taste your kombucha and see if it's reached desired sourness",
          date: checkDate,
          completed: false
        });
        
        // Bottle after 7-10 days
        const bottleDate = new Date(now);
        bottleDate.setDate(bottleDate.getDate() + 7);
        newReminders.push({
          title: "Bottle Kombucha",
          text: "Time to bottle your kombucha for second fermentation",
          date: bottleDate,
          completed: false
        });
        
        // Second fermentation typically takes 1-3 days
        const secondFermentDate = new Date(now);
        secondFermentDate.setDate(secondFermentDate.getDate() + 10);
        newReminders.push({
          title: "Kombucha Second Fermentation",
          text: "Check carbonation and refrigerate if at desired level",
          date: secondFermentDate,
          completed: false
        });
        break;
        
      case FermentType.SAUERKRAUT:
        // Check after 3-5 days
        const checkSauerkrautDate = new Date(now);
        checkSauerkrautDate.setDate(checkSauerkrautDate.getDate() + 3);
        newReminders.push({
          title: "Check Sauerkraut",
          text: "Check fermentation progress and release excess gas if needed",
          date: checkSauerkrautDate,
          completed: false
        });
        
        // Ready after 1-2 weeks
        const readySauerkrautDate = new Date(now);
        readySauerkrautDate.setDate(readySauerkrautDate.getDate() + 10);
        newReminders.push({
          title: "Sauerkraut Ready",
          text: "Your sauerkraut should be ready. Refrigerate to slow fermentation.",
          date: readySauerkrautDate,
          completed: false
        });
        break;
        
      case FermentType.KIMCHI:
        // Check after 2-3 days
        const checkKimchiDate = new Date(now);
        checkKimchiDate.setDate(checkKimchiDate.getDate() + 2);
        newReminders.push({
          title: "Check Kimchi",
          text: "Check fermentation progress and release excess gas if needed",
          date: checkKimchiDate,
          completed: false
        });
        
        // Ready after 1 week
        const readyKimchiDate = new Date(now);
        readyKimchiDate.setDate(readyKimchiDate.getDate() + 7);
        newReminders.push({
          title: "Kimchi Ready",
          text: "Your kimchi should be ready. Refrigerate to slow fermentation.",
          date: readyKimchiDate,
          completed: false
        });
        break;
        
      case FermentType.SOURDOUGH:
        // Feed starter reminder
        const feedDate = new Date(now);
        feedDate.setDate(feedDate.getDate() + 1);
        newReminders.push({
          title: "Feed Sourdough Starter",
          text: "Time to feed your sourdough starter",
          date: feedDate,
          completed: false
        });
        
        // Peak fermentation
        const peakDate = new Date(now);
        peakDate.setDate(peakDate.getDate() + 4);
        newReminders.push({
          title: "Sourdough Peak",
          text: "Your sourdough starter should be at peak activity",
          date: peakDate,
          completed: false
        });
        break;
        
      case FermentType.KEFIR:
        // Kefir fermentation usually takes 24-48 hours
        const kefirReadyDate = new Date(now);
        kefirReadyDate.setHours(kefirReadyDate.getHours() + 24);
        newReminders.push({
          title: "Check Kefir",
          text: "Check if your kefir has reached desired consistency",
          date: kefirReadyDate,
          completed: false
        });
        
        // Secondary fermentation for flavor development
        const kefirSecondaryDate = new Date(now);
        kefirSecondaryDate.setHours(kefirSecondaryDate.getHours() + 36);
        newReminders.push({
          title: "Kefir Secondary Fermentation",
          text: "Strain kefir grains and start secondary fermentation if desired",
          date: kefirSecondaryDate,
          completed: false
        });
        break;
        
      case FermentType.YOGURT:
        // Yogurt typically incubates for 6-12 hours
        const yogurtReadyDate = new Date(now);
        yogurtReadyDate.setHours(yogurtReadyDate.getHours() + 8);
        newReminders.push({
          title: "Check Yogurt",
          text: "Check if your yogurt has reached desired consistency",
          date: yogurtReadyDate,
          completed: false
        });
        
        // Refrigerate yogurt
        const yogurtRefrigerateDate = new Date(now);
        yogurtRefrigerateDate.setHours(yogurtRefrigerateDate.getHours() + 10);
        newReminders.push({
          title: "Refrigerate Yogurt",
          text: "Refrigerate your yogurt to stop fermentation",
          date: yogurtRefrigerateDate,
          completed: false
        });
        break;
        
      case FermentType.PICKLES:
        // Check after 3-5 days
        const checkPicklesDate = new Date(now);
        checkPicklesDate.setDate(checkPicklesDate.getDate() + 3);
        newReminders.push({
          title: "Check Pickles",
          text: "Check fermentation progress and taste a pickle",
          date: checkPicklesDate,
          completed: false
        });
        
        // Ready after 1-2 weeks
        const readyPicklesDate = new Date(now);
        readyPicklesDate.setDate(readyPicklesDate.getDate() + 10);
        newReminders.push({
          title: "Pickles Ready",
          text: "Your pickles should be ready. Refrigerate to slow fermentation.",
          date: readyPicklesDate,
          completed: false
        });
        break;
        
      case FermentType.MISO:
        // Miso takes months to ferment - long term reminder
        const checkMisoDate = new Date(now);
        checkMisoDate.setMonth(checkMisoDate.getMonth() + 1);
        newReminders.push({
          title: "Check Miso",
          text: "Check on your miso fermentation after 1 month",
          date: checkMisoDate,
          completed: false
        });
        
        // 3 month check
        const checkMiso3MonthDate = new Date(now);
        checkMiso3MonthDate.setMonth(checkMiso3MonthDate.getMonth() + 3);
        newReminders.push({
          title: "Miso 3-Month Check",
          text: "Check your miso fermentation at 3 months",
          date: checkMiso3MonthDate,
          completed: false
        });
        break;
      
      default:
        // Generic reminder for other types
        const checkGenericDate = new Date(now);
        checkGenericDate.setDate(checkGenericDate.getDate() + 5);
        newReminders.push({
          title: "Check Fermentation",
          text: "Check on your fermentation progress",
          date: checkGenericDate,
          completed: false
        });
        
        // Generic completion reminder
        const completionGenericDate = new Date(now);
        completionGenericDate.setDate(completionGenericDate.getDate() + 14);
        newReminders.push({
          title: "Fermentation Complete",
          text: "Your fermentation should be complete. Check results.",
          date: completionGenericDate,
          completed: false
        });
    }
    
    return newReminders;
  };

  return {
    createRemindersForFerment
  };
} 