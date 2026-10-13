// Kannada phrasebook. Script uses Unicode Kannada characters.
// Pronunciations are simplified Roman approximations for travellers.

export const PHRASE_CATEGORIES = [
  'Greetings',
  'General help',
  'Directions',
  'Transportation',
  'Food',
  'Shopping',
];

export const PHRASES = [
  { id: 1, kannada: 'ನಮಸ್ಕಾರ', english: 'Hello / Greetings', pronunciation: 'Namaskara', category: 'Greetings' },
  { id: 2, kannada: 'ಹೇಗಿದ್ದೀರಾ?', english: 'How are you?', pronunciation: 'Hegiddira?', category: 'Greetings' },
  { id: 3, kannada: 'ಚೆನ್ನಾಗಿದ್ದೇನೆ', english: 'I am fine', pronunciation: 'Chennagiddene', category: 'Greetings' },
  { id: 4, kannada: 'ಧನ್ಯವಾದಗಳು', english: 'Thank you', pronunciation: 'Dhanyavadagalu', category: 'Greetings' },
  { id: 5, kannada: 'ಕ್ಷಮಿಸಿ', english: 'Sorry / Excuse me', pronunciation: 'Kshamisi', category: 'General help' },
  { id: 6, kannada: 'ಹೌದು', english: 'Yes', pronunciation: 'Haudu', category: 'General help' },
  { id: 7, kannada: 'ಇಲ್ಲ', english: 'No', pronunciation: 'Illa', category: 'General help' },
  { id: 8, kannada: 'ನನಗೆ ಕನ್ನಡ ಬರುವುದಿಲ್ಲ', english: 'I do not know Kannada', pronunciation: 'Nanage Kannada baruvudilla', category: 'General help' },
  { id: 9, kannada: 'ನಿಮಗೆ ಇಂಗ್ಲಿಷ್ ಬರುತ್ತಾ?', english: 'Do you speak English?', pronunciation: 'Nimage English barutta?', category: 'General help' },
  { id: 10, kannada: 'ಸ್ವಲ್ಪ ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ', english: 'Please speak a little slowly', pronunciation: 'Svalpa nidhanavaagi maatanaadi', category: 'General help' },
  { id: 11, kannada: 'ಸಹಾಯ ಮಾಡಿ', english: 'Please help', pronunciation: 'Sahaya maadi', category: 'General help' },
  { id: 12, kannada: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', english: 'Where is the bus stand?', pronunciation: 'Bus nildana ellide?', category: 'Directions' },
  { id: 13, kannada: 'ರೈಲು ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', english: 'Where is the railway station?', pronunciation: 'Railu nildana ellide?', category: 'Directions' },
  { id: 14, kannada: 'ಶೌಚಾಲಯ ಎಲ್ಲಿದೆ?', english: 'Where is the toilet?', pronunciation: 'Shauchalaya ellide?', category: 'Directions' },
  { id: 15, kannada: 'ಎಡಕ್ಕೆ', english: 'To the left', pronunciation: 'Edakke', category: 'Directions' },
  { id: 16, kannada: 'ಬಲಕ್ಕೆ', english: 'To the right', pronunciation: 'Balakke', category: 'Directions' },
  { id: 17, kannada: 'ನೇರವಾಗಿ', english: 'Straight ahead', pronunciation: 'Neravaagi', category: 'Directions' },
  { id: 18, kannada: 'ಈ ಬಸ್ ಹಂಪಿಗೆ ಹೋಗುತ್ತಾ?', english: 'Does this bus go to Hampi?', pronunciation: 'Ee bus Hampige hogutta?', category: 'Transportation', note: 'Replace Hampi with your destination; "-ge" means "to".' },
  { id: 19, kannada: 'ಟಿಕೆಟ್ ಎಷ್ಟು?', english: 'How much is the ticket?', pronunciation: 'Ticket eshtu?', category: 'Transportation' },
  { id: 20, kannada: 'ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ', english: 'Please stop here', pronunciation: 'Illi nillisi', category: 'Transportation' },
  { id: 21, kannada: 'ಮೀಟರ್ ಹಾಕಿ', english: 'Please use the meter (auto / taxi)', pronunciation: 'Meter haaki', category: 'Transportation' },
  { id: 22, kannada: 'ಊಟ ಸಿಗುತ್ತಾ?', english: 'Is a meal available?', pronunciation: 'Oota sigutta?', category: 'Food' },
  { id: 23, kannada: 'ಸಸ್ಯಾಹಾರಿ ಊಟ ಇದೆಯಾ?', english: 'Is vegetarian food available?', pronunciation: 'Sasyahari oota ideya?', category: 'Food' },
  { id: 24, kannada: 'ತುಂಬಾ ಖಾರ ಬೇಡ', english: 'Not too spicy, please', pronunciation: 'Tumba khara beda', category: 'Food' },
  { id: 25, kannada: 'ನೀರು ಬೇಕು', english: 'I need water', pronunciation: 'Neeru beku', category: 'Food' },
  { id: 26, kannada: 'ಬಿಲ್ ಕೊಡಿ', english: 'Please give the bill', pronunciation: 'Bill kodi', category: 'Food' },
  { id: 27, kannada: 'ಇದು ಎಷ್ಟು?', english: 'How much is this?', pronunciation: 'Idu eshtu?', category: 'Shopping' },
  { id: 28, kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ', english: 'Please reduce the price a little', pronunciation: 'Svalpa kadime maadi', category: 'Shopping' },
  { id: 29, kannada: 'ಇದು ಬೇಕು', english: 'I want this', pronunciation: 'Idu beku', category: 'Shopping' },
  { id: 30, kannada: 'ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ', english: 'Very nice / very good', pronunciation: 'Tumba chennagide', category: 'Greetings' },
];

/**
 * Picks a small, useful set of phrases for an itinerary: a couple of
 * greetings plus one from each practical category.
 */
export function pickTripPhrases() {
  const byCat = (cat) => PHRASES.filter((p) => p.category === cat);
  return [
    ...byCat('Greetings').slice(0, 2),
    byCat('General help').find((p) => p.id === 9),
    byCat('Directions')[0],
    byCat('Transportation')[0],
    byCat('Food')[1],
    byCat('Shopping')[0],
  ].filter(Boolean);
}
