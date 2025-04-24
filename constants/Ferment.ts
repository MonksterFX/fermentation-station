export interface Ferment {
  id: string;
  name: string;
  type: FermentType;
  startDate: Date;
  endDate?: Date;
  ingredients: string[];
  notes: string;
  status: FermentStatus;
  temperature?: number;
  ph?: number;
  images: string[];
  reminders: Reminder[];
}

export enum FermentType {
  KOMBUCHA = 'Kombucha',
  KIMCHI = 'Kimchi',
  SAUERKRAUT = 'Sauerkraut',
  KEFIR = 'Kefir',
  PICKLES = 'Pickles',
  SOURDOUGH = 'Sourdough',
  YOGURT = 'Yogurt',
  MISO = 'Miso',
  OTHER = 'Other'
}

export enum FermentStatus {
  PLANNED = 'Planned',
  UNSTABLE = 'Unstable',
  STABLE = 'Stable',
  EXPIRED = 'Expired',
  BAD = 'Bad'
}

export interface Reminder {
  id: string;
  title?: string;
  date: Date;
  text: string;
  completed: boolean;
}

export interface LogEntry {
  id: string;
  date: Date;
  note: string;
  temperature?: number;
  ph?: number;
  image?: string;
} 