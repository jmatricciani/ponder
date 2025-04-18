import { JournalEntry } from '../types/db-objects';

export const baseUrl = 'http://localhost:3000';

export const postJournalEntry = async (entry: JournalEntry) => {
  return await fetch(`${baseUrl}/journal-entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
};
