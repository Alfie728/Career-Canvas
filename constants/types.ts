export type Entry = {
  id: string;
  title: string;
  subtitle?: string;
  location?: string;
  date?: string;
  details: string[];
};

export type Section = {
  id: string;
  title: string;
  entries: Entry[];
};