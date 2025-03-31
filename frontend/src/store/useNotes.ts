import { create } from 'zustand';

type Note = {
  id: string;
  content: string;
  summary?: string;
  tags?: string[];
};

type State = {
  notes: Note[];
  addNote: (note: Note) => void;
};

export const useNotes = create<State>((set) => ({
  notes: [],
  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),
}));

