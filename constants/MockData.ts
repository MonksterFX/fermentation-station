import { Ferment, FermentStatus } from './Ferment';

export const mockFerments: Ferment[] = [
  {
    id: '1',
    name: 'Kombucha Batch #1',
    startDate: new Date('2023-11-01'),
    notes: 'My first kombucha batch, using black tea.',
    status: FermentStatus.PLANNED,
    temperature: 78,
    ph: 3.2,
    images: [],
    reminders: []
  },
  {
    id: '2',
    name: 'Sauerkraut',
    startDate: new Date('2023-10-15'),
    notes: 'Traditional German-style sauerkraut.',
    status: FermentStatus.UNSTABLE,
    temperature: 68,
    images: [],
    reminders: []
  },
  {
    id: '3',
    name: 'Spicy Kimchi',
    startDate: new Date('2023-06-01'),
    notes: 'Extra spicy batch made with Napa cabbage, Korean chili flakes, garlic, and ginger.',
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
    startDate: new Date('2023-04-10'),
    endDate: new Date('2023-04-12'),
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
    startDate: new Date(Date.now() + 604800000), // Next week
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
    startDate: new Date('2023-05-01'),
    endDate: new Date('2023-06-01'),
    notes: 'Left too long, lost crispness',
    status: FermentStatus.EXPIRED,
    temperature: 65,
    images: [],
    reminders: [],
  },
]; 