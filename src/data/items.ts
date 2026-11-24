export type Item = { id: string; title: string; body: string };

const TOPICS = [
  'Morning run', 'Team standup', 'Design review', 'Grocery list', 'Flight to Pune',
  'Book club', 'Dentist', 'Quarterly report', 'Yoga class', 'Release notes',
  'Weekend trip', 'Bug bash', 'Coffee with Sam', 'Budget plan', 'Garden tasks',
  'Interview prep', 'Photo backup', 'Movie night', 'Car service', 'Birthday gift',
];

export const ITEMS: Item[] = TOPICS.map((title, i) => ({
  id: String(i + 1),
  title,
  body: `${title} — item ${i + 1}. Demo text so the detail pane has something to show. `.repeat(4).trim(),
}));
