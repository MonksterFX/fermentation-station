export interface Ferment {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  notes: string;
  status: FermentStatus;
  temperature?: number;
  ph?: number;
  images: string[];
  reminders: Reminder[];
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