import { Ferment, FermentStatus, FermentType } from './Ferment';

export const mockFerments: Ferment[] = [
  {
    id: '1',
    name: 'Summer Kombucha',
    type: FermentType.KOMBUCHA,
    startDate: new Date('2023-06-15'),
    ingredients: ['Black tea', 'Sugar', 'SCOBY'],
    notes: 'First fermentation with strawberry flavor',
    status: FermentStatus.UNSTABLE,
    temperature: 75,
    ph: 3.2,
    images: [],
    reminders: [
      {
        id: '101',
        date: new Date(Date.now() + 86400000), // Tomorrow
        text: 'Check carbonation',
        completed: false,
      },
    ],
  },
  {
    id: '2',
    name: 'Classic Sauerkraut',
    type: FermentType.SAUERKRAUT,
    startDate: new Date('2023-05-20'),
    endDate: new Date('2023-06-10'),
    ingredients: ['Cabbage', 'Salt'],
    notes: 'Traditional recipe with caraway seeds',
    status: FermentStatus.STABLE,
    temperature: 68,
    images: [],
    reminders: [],
  },
  {
    id: '3',
    name: 'Spicy Kimchi',
    type: FermentType.KIMCHI,
    startDate: new Date('2023-06-01'),
    ingredients: ['Napa cabbage', 'Korean chili flakes', 'Garlic', 'Ginger'],
    notes: 'Extra spicy batch',
    status: FermentStatus.UNSTABLE,
    temperature: 70,
    images: [],
    reminders: [
      {
        id: '102',
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        text: 'Taste test and refrigerate if ready',
        completed: false,
      },
    ],
  },
  {
    id: '4',
    name: 'Milk Kefir',
    type: FermentType.KEFIR,
    startDate: new Date('2023-04-10'),
    endDate: new Date('2023-04-12'),
    ingredients: ['Milk', 'Kefir grains'],
    notes: 'Turned too sour',
    status: FermentStatus.BAD,
    temperature: 72,
    ph: 4.0,
    images: [],
    reminders: [],
  },
  {
    id: '5',
    name: 'Sourdough Pizza Crust',
    type: FermentType.SOURDOUGH,
    startDate: new Date(Date.now() + 604800000), // Next week
    ingredients: ['Flour', 'Water', 'Salt', 'Sourdough starter'],
    notes: 'For weekend pizza night',
    status: FermentStatus.PLANNED,
    images: [],
    reminders: [
      {
        id: '103',
        date: new Date(Date.now() + 604800000 - 86400000), // Day before start
        text: 'Feed starter',
        completed: false,
      },
    ],
  },
  {
    id: '6',
    name: 'Pickle Experiment',
    type: FermentType.PICKLES,
    startDate: new Date('2023-05-01'),
    endDate: new Date('2023-06-01'),
    ingredients: ['Cucumbers', 'Salt', 'Dill', 'Garlic'],
    notes: 'Left too long, lost crispness',
    status: FermentStatus.EXPIRED,
    temperature: 65,
    images: [],
    reminders: [],
  },
]; 