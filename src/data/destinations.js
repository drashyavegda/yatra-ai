// Curated sample dataset of Karnataka destinations used by the demo itinerary
// generator and the Explore page. Coordinates are approximate (used only for
// rough distance estimates). Practical details such as timings, fees and
// facilities are NOT included on purpose: they change and must be verified.

export const INTERESTS = [
  'Nature',
  'Heritage',
  'Beaches',
  'Culture',
  'Food',
  'Adventure',
  'Wildlife',
  'Architecture',
  'Spiritual tourism',
];

export const CATEGORIES = [
  'Heritage',
  'Hill station',
  'Beach',
  'Nature',
  'Wildlife',
  'Spiritual',
  'City',
  'Adventure',
];

const UNVERIFIED = {
  status: 'unverified',
  note: 'Information not verified. Please confirm accessibility and facilities with local sources before travelling.',
};

export const DESTINATIONS = [
  {
    id: 'hampi',
    name: 'Hampi',
    district: 'Vijayanagara district',
    region: 'North Karnataka',
    category: 'Heritage',
    lat: 15.335,
    lon: 76.46,
    image: '/images/hampi.jpg',
    tagline: 'Ruins of the Vijayanagara capital amid a granite boulder landscape.',
    description:
      'Hampi was the capital of the Vijayanagara Empire. Its temples, royal enclosures, market streets and the famous stone chariot of the Vittala Temple are spread across a dramatic landscape of boulders and the Tungabhadra river.',
    context:
      'The Group of Monuments at Hampi is a UNESCO World Heritage Site. The nearest town with rail connections is Hosapete (Hospet).',
    interests: ['Heritage', 'Architecture', 'Culture', 'Spiritual tourism', 'Adventure'],
    activities: [
      { title: 'Virupaksha Temple and Hampi Bazaar', detail: 'Begin at the living temple that anchors the heritage area and walk the old bazaar street.', interests: ['Heritage', 'Spiritual tourism', 'Culture'] },
      { title: 'Vittala Temple complex and the stone chariot', detail: 'See the iconic stone chariot and the carved pillared halls.', interests: ['Heritage', 'Architecture'] },
      { title: 'Royal Enclosure, Lotus Mahal and Elephant Stables', detail: 'Explore the ceremonial and royal zone of the old city.', interests: ['Heritage', 'Architecture'] },
      { title: 'Sunset from Hemakuta or Matanga Hill', detail: 'Short climbs with wide views over the boulder landscape.', interests: ['Nature', 'Adventure'] },
      { title: 'Coracle ride and Anegundi village', detail: 'Cross the Tungabhadra to the quieter Anegundi side; banana-fibre craft units are found here.', interests: ['Culture', 'Adventure', 'Nature'] },
    ],
    practicalNotes: 'The site is large and hot in the middle of the day; plan early and late visits. Bicycles and autos are commonly used to move between monument clusters.',
    accessibility: UNVERIFIED,
    verification: 'Location, district and monument names checked against public reference sources. Timings, fees and transport details not verified.',
  },
  {
    id: 'mysuru',
    name: 'Mysuru',
    district: 'Mysuru district',
    region: 'South Karnataka',
    category: 'Heritage',
    lat: 12.295,
    lon: 76.639,
    image: '/images/mysuru.jpg',
    tagline: 'Palace city known for Dasara, silk, sandalwood and Mysore pak.',
    description:
      'Mysuru is the former seat of the Wadiyar dynasty. The Mysore Palace (Amba Vilas Palace), Chamundi Hill, Devaraja Market and the city\'s food culture make it one of the most visited places in Karnataka.',
    context:
      'The city hosts the Mysuru Dasara festival each autumn. It is a convenient base for Srirangapatna and the Bandipur region.',
    interests: ['Heritage', 'Culture', 'Food', 'Architecture', 'Spiritual tourism'],
    activities: [
      { title: 'Mysore Palace', detail: 'Visit the Indo-Saracenic palace at the heart of the city.', interests: ['Heritage', 'Architecture'] },
      { title: 'Chamundi Hill and the Nandi statue', detail: 'Drive or climb the steps to the hilltop temple and viewpoint.', interests: ['Spiritual tourism', 'Nature'] },
      { title: 'Devaraja Market', detail: 'A lively market for flowers, fruit, incense and local produce.', interests: ['Culture', 'Food'] },
      { title: 'Taste Mysore pak and a traditional thali', detail: 'Sample the city\'s famous sweet and South Karnataka vegetarian meals.', interests: ['Food', 'Culture'] },
      { title: 'Srirangapatna day excursion', detail: 'Tipu Sultan-era monuments on an island in the Kaveri, a short trip from the city.', interests: ['Heritage', 'Architecture'] },
    ],
    practicalNotes: 'Well connected by road and rail from Bengaluru. Palace illumination happens on scheduled evenings; check current schedules locally.',
    accessibility: UNVERIFIED,
    verification: 'Location and major landmarks checked against public reference sources. Timings, fees and illumination schedules not verified.',
  },
  {
    id: 'coorg',
    name: 'Coorg (Kodagu)',
    district: 'Kodagu district',
    region: 'Western Ghats',
    category: 'Hill station',
    lat: 12.42,
    lon: 75.74,
    image: '/images/coorg.jpg',
    tagline: 'Misty coffee country in the Western Ghats.',
    description:
      'Kodagu, popularly called Coorg, is a hill district of coffee and spice plantations, waterfalls and forested ridges. Madikeri is the district headquarters and the usual base.',
    context:
      'Home to the Kodava community with distinct traditions and cuisine. Talakaveri, the source of the river Kaveri, lies in the district.',
    interests: ['Nature', 'Food', 'Culture', 'Adventure', 'Wildlife'],
    activities: [
      { title: 'Coffee plantation walk', detail: 'Walk through an estate and learn how coffee and pepper are grown and processed.', interests: ['Nature', 'Food', 'Culture'] },
      { title: 'Abbey Falls', detail: 'A waterfall set among plantations near Madikeri.', interests: ['Nature'] },
      { title: 'Raja\'s Seat viewpoint', detail: 'A garden viewpoint in Madikeri known for sunset views.', interests: ['Nature'] },
      { title: 'Talakaveri and Bhagamandala', detail: 'The source of the Kaveri and a riverside temple town.', interests: ['Spiritual tourism', 'Nature', 'Culture'] },
      { title: 'Kodava cuisine', detail: 'Try regional dishes such as kadubu and pandi curry where available.', interests: ['Food', 'Culture'] },
      { title: 'Dubare elephant camp', detail: 'A forest camp on the Kaveri run by the Forest Department; verify current visiting rules.', interests: ['Wildlife', 'Nature'] },
    ],
    practicalNotes: 'Roads are winding; allow extra time. The monsoon season (roughly June to September) brings heavy rain.',
    accessibility: UNVERIFIED,
    verification: 'District, base town and landmark names checked against public reference sources. Entry rules and timings not verified.',
  },
  {
    id: 'gokarna',
    name: 'Gokarna',
    district: 'Uttara Kannada district',
    region: 'Coastal Karnataka',
    category: 'Beach',
    lat: 14.55,
    lon: 74.32,
    image: '/images/gokarna.jpg',
    tagline: 'Temple town with a string of quiet beaches.',
    description:
      'Gokarna combines an important Shiva temple town with a series of beaches - Kudle, Om, Half Moon and Paradise - linked by coastal footpaths.',
    context:
      'The Mahabaleshwar Temple draws pilgrims throughout the year, while the beaches attract travellers looking for a calmer coast.',
    interests: ['Beaches', 'Spiritual tourism', 'Nature', 'Adventure', 'Culture'],
    activities: [
      { title: 'Om Beach and Kudle Beach', detail: 'The two most accessible beaches, with cafes and sunset views.', interests: ['Beaches', 'Nature'] },
      { title: 'Beach trek to Half Moon and Paradise beaches', detail: 'A coastal walk over headlands; carry water and check conditions.', interests: ['Adventure', 'Beaches', 'Nature'] },
      { title: 'Mahabaleshwar Temple and the old town', detail: 'Experience the temple town atmosphere and traditional streets.', interests: ['Spiritual tourism', 'Culture'] },
      { title: 'Coastal seafood and local snacks', detail: 'Try coastal Karnataka food in the town and beach shacks.', interests: ['Food'] },
    ],
    practicalNotes: 'Sea conditions can be rough, especially in the monsoon; follow local advice before swimming.',
    accessibility: UNVERIFIED,
    verification: 'Location and beach names checked against public reference sources. Facilities and safety conditions not verified.',
  },
  {
    id: 'chikkamagaluru',
    name: 'Chikkamagaluru',
    district: 'Chikkamagaluru district',
    region: 'Western Ghats',
    category: 'Hill station',
    lat: 13.316,
    lon: 75.772,
    image: '/images/chikkamagaluru.jpg',
    tagline: 'Coffee estates and Karnataka\'s highest peak.',
    description:
      'Chikkamagaluru is known as the birthplace of coffee cultivation in India. The surrounding hills include Mullayanagiri, the highest peak in Karnataka, and the Baba Budangiri range.',
    context:
      'A good base for trekking, estate stays and the Hoysala temples at Belur and Halebidu, which are a short drive away.',
    interests: ['Nature', 'Adventure', 'Food', 'Wildlife'],
    activities: [
      { title: 'Mullayanagiri peak', detail: 'Drive and short climb to the summit viewpoint.', interests: ['Nature', 'Adventure'] },
      { title: 'Baba Budangiri range', detail: 'Hills associated with the origin story of Indian coffee.', interests: ['Nature', 'Culture'] },
      { title: 'Coffee estate visit', detail: 'Learn about cultivation and taste freshly brewed filter coffee.', interests: ['Food', 'Nature'] },
      { title: 'Hebbe or Kalhatti falls (seasonal)', detail: 'Waterfalls in the hills; access depends on season and forest permissions.', interests: ['Nature', 'Adventure'] },
      { title: 'Bhadra Wildlife Sanctuary edge', detail: 'Forest safaris are organised by authorised operators; verify availability.', interests: ['Wildlife', 'Nature'] },
    ],
    practicalNotes: 'Mornings are often misty and cool; carry a light jacket even in summer.',
    accessibility: UNVERIFIED,
    verification: 'Location and peak names checked against public reference sources. Trek permissions and timings not verified.',
  },
  {
    id: 'belur',
    name: 'Belur',
    district: 'Hassan district',
    region: 'Malnad',
    category: 'Heritage',
    lat: 13.165,
    lon: 75.865,
    image: '/images/belur.jpg',
    tagline: 'The Chennakesava Temple, a Hoysala masterpiece.',
    description:
      'Belur\'s Chennakesava Temple, commissioned in the 12th century by the Hoysala king Vishnuvardhana, is celebrated for its bracket figures (madanikas) and detailed soapstone carving.',
    context:
      'Belur and nearby Halebidu are usually visited together. The Sacred Ensembles of the Hoysalas (Belur, Halebidu and Somanathapura) were inscribed as a UNESCO World Heritage Site in 2023.',
    interests: ['Architecture', 'Heritage', 'Spiritual tourism', 'Culture'],
    activities: [
      { title: 'Chennakesava Temple', detail: 'Study the carved brackets, friezes and the star-shaped platform; a local guide adds a lot of context.', interests: ['Architecture', 'Heritage'] },
      { title: 'Temple courtyard and smaller shrines', detail: 'Walk the enclosure to see the Kappe Chennigaraya and other shrines.', interests: ['Heritage', 'Spiritual tourism'] },
      { title: 'Combine with Halebidu', detail: 'The Hoysaleswara Temple is roughly a 30-minute drive away.', interests: ['Architecture', 'Heritage'] },
    ],
    practicalNotes: 'Footwear is removed at the temple; the stone can be hot by midday.',
    accessibility: UNVERIFIED,
    verification: 'Historical attribution and UNESCO status checked against public reference sources. Timings not verified.',
  },
  {
    id: 'halebidu',
    name: 'Halebidu',
    district: 'Hassan district',
    region: 'Malnad',
    category: 'Heritage',
    lat: 13.213,
    lon: 75.995,
    image: '/images/halebidu.jpg',
    tagline: 'Hoysaleswara Temple and the old Hoysala capital.',
    description:
      'Halebidu (meaning "old city") was the Hoysala capital, Dwarasamudra. The Hoysaleswara Temple is covered in continuous bands of sculpture depicting epics, animals and daily life.',
    context:
      'Part of the Sacred Ensembles of the Hoysalas UNESCO World Heritage Site together with Belur and Somanathapura.',
    interests: ['Architecture', 'Heritage', 'Culture', 'Spiritual tourism'],
    activities: [
      { title: 'Hoysaleswara Temple', detail: 'Walk the outer walls to follow the sculpted friezes.', interests: ['Architecture', 'Heritage'] },
      { title: 'Archaeological museum (ASI)', detail: 'Sculptures recovered from the site; verify opening days.', interests: ['Heritage', 'Culture'] },
      { title: 'Kedareshwara Temple and Jain basadis', detail: 'Quieter monuments a short walk or ride from the main temple.', interests: ['Architecture', 'Spiritual tourism'] },
    ],
    practicalNotes: 'Best combined with Belur in a single day from Hassan or Chikkamagaluru.',
    accessibility: UNVERIFIED,
    verification: 'Historical facts and UNESCO status checked against public reference sources. Museum timings not verified.',
  },
  {
    id: 'badami',
    name: 'Badami',
    district: 'Bagalkot district',
    region: 'North Karnataka',
    category: 'Heritage',
    lat: 15.92,
    lon: 75.68,
    image: '/images/badami.jpg',
    tagline: 'Rock-cut cave temples above a red sandstone gorge.',
    description:
      'Badami, the early Chalukya capital, is famous for four rock-cut cave temples carved into a sandstone cliff overlooking the Agastya lake, along with fort structures and the Bhutanatha temples.',
    context:
      'Badami, Aihole and Pattadakal together show the evolution of early Indian temple architecture and are commonly visited as a circuit.',
    interests: ['Heritage', 'Architecture', 'Adventure', 'Culture'],
    activities: [
      { title: 'Badami cave temples', detail: 'Four caves with Hindu and Jain sculpture, reached by steps cut into the cliff.', interests: ['Heritage', 'Architecture'] },
      { title: 'Bhutanatha temples by Agastya lake', detail: 'Lakeside temples with views back to the caves.', interests: ['Architecture', 'Nature'] },
      { title: 'North fort and museum', detail: 'A climb through the fort to viewpoints over the town.', interests: ['Heritage', 'Adventure'] },
      { title: 'Rock climbing (with licensed operators)', detail: 'The sandstone cliffs are a known climbing area; use experienced guides.', interests: ['Adventure'] },
    ],
    practicalNotes: 'Monkeys are common around the caves; keep food packed away.',
    accessibility: UNVERIFIED,
    verification: 'Location and monument names checked against public reference sources. Timings and fees not verified.',
  },
  {
    id: 'pattadakal',
    name: 'Pattadakal',
    district: 'Bagalkot district',
    region: 'North Karnataka',
    category: 'Heritage',
    lat: 15.948,
    lon: 75.816,
    image: '/images/pattadakal.jpg',
    tagline: 'A UNESCO site where northern and southern temple styles meet.',
    description:
      'Pattadakal, on the banks of the Malaprabha river, has a group of 8th-century Chalukya temples that combine Nagara (northern) and Dravida (southern) architectural styles.',
    context:
      'The Group of Monuments at Pattadakal is a UNESCO World Heritage Site and was a coronation site for Chalukya kings.',
    interests: ['Heritage', 'Architecture', 'Culture'],
    activities: [
      { title: 'Virupaksha and Mallikarjuna temples', detail: 'The largest temples in the group, with detailed narrative carvings.', interests: ['Heritage', 'Architecture'] },
      { title: 'Compare Nagara and Dravida shikharas', detail: 'Walk the compound to see both tower styles side by side.', interests: ['Architecture'] },
      { title: 'Combine with Aihole', detail: 'Aihole lies a short drive further along the river.', interests: ['Heritage'] },
    ],
    practicalNotes: 'The complex is compact and flat compared with Badami; carry water and sun protection.',
    accessibility: UNVERIFIED,
    verification: 'UNESCO status and temple names checked against public reference sources. Timings not verified.',
  },
  {
    id: 'aihole',
    name: 'Aihole',
    district: 'Bagalkot district',
    region: 'North Karnataka',
    category: 'Heritage',
    lat: 16.02,
    lon: 75.88,
    image: '/images/aihole.jpg',
    tagline: 'An early laboratory of Indian temple architecture.',
    description:
      'Aihole has more than a hundred temples from the Chalukya period spread through and around the village, including the apsidal Durga Temple and the Lad Khan Temple.',
    context:
      'Often described as a cradle of temple architecture because so many early experimental forms survive here.',
    interests: ['Heritage', 'Architecture', 'Culture'],
    activities: [
      { title: 'Durga Temple complex and museum', detail: 'The best-known monument group, with an on-site museum.', interests: ['Heritage', 'Architecture'] },
      { title: 'Lad Khan and Huchimalli temples', detail: 'Early temple forms a short walk from the main complex.', interests: ['Architecture'] },
      { title: 'Ravanaphadi cave and Meguti hill', detail: 'A rock-cut cave and a hilltop Jain temple with views.', interests: ['Heritage', 'Adventure'] },
    ],
    practicalNotes: 'Temples are scattered through the village; a local guide or auto helps cover them.',
    accessibility: UNVERIFIED,
    verification: 'Location and monument names checked against public reference sources. Timings not verified.',
  },
  {
    id: 'jogfalls',
    name: 'Jog Falls',
    district: 'Shivamogga district',
    region: 'Malnad',
    category: 'Nature',
    lat: 14.229,
    lon: 74.812,
    image: '/images/jogfalls.jpg',
    tagline: 'The Sharavathi river plunges in four streams.',
    description:
      'Jog Falls, on the Sharavathi river, is among the highest plunge waterfalls in India. The four segments - Raja, Rani, Rover and Rocket - are most powerful during and just after the monsoon.',
    context:
      'Flow depends on the season and on releases from the Linganamakki dam upstream, so the view varies greatly through the year.',
    interests: ['Nature', 'Adventure'],
    activities: [
      { title: 'Main viewpoint', detail: 'The developed viewing area opposite the falls.', interests: ['Nature'] },
      { title: 'Steps to the base of the falls', detail: 'A long staircase descends into the gorge; demanding on the way back up and sometimes closed.', interests: ['Adventure', 'Nature'] },
      { title: 'Sharavathi valley drive', detail: 'Forested roads towards Honnavar or Sagara.', interests: ['Nature'] },
    ],
    practicalNotes: 'Water volume is highest roughly from July to October; in dry months the falls can be thin.',
    accessibility: UNVERIFIED,
    verification: 'Location, river and segment names checked against public reference sources. Access rules not verified.',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    district: 'Bengaluru Urban district',
    region: 'South Karnataka',
    category: 'City',
    lat: 12.972,
    lon: 77.594,
    image: '/images/bengaluru.jpg',
    tagline: 'Karnataka\'s capital: gardens, markets and modern city life.',
    description:
      'Bengaluru is the state capital and the usual gateway to Karnataka. Beyond its technology reputation it has large gardens, colonial-era landmarks, old markets and a varied food scene.',
    context:
      'Vidhana Soudha, Lalbagh Botanical Garden, Cubbon Park, Bangalore Palace and the KR Market area are among its well-known places.',
    interests: ['Culture', 'Food', 'Architecture', 'Heritage'],
    activities: [
      { title: 'Lalbagh Botanical Garden and Cubbon Park', detail: 'The city\'s two large green spaces.', interests: ['Nature', 'Culture'] },
      { title: 'Vidhana Soudha and Cubbon Park heritage buildings', detail: 'The legislature building is viewed from outside; nearby museums and library buildings.', interests: ['Architecture', 'Heritage'] },
      { title: 'KR Market and Basavanagudi', detail: 'The old city\'s flower market and the Bull Temple area.', interests: ['Culture', 'Spiritual tourism'] },
      { title: 'Food trail: darshinis and Malleshwaram', detail: 'Filter coffee, masala dosa and traditional tiffin.', interests: ['Food', 'Culture'] },
      { title: 'Bangalore Palace', detail: 'A Tudor-style palace of the Wadiyar family.', interests: ['Heritage', 'Architecture'] },
    ],
    practicalNotes: 'Traffic is heavy; use the Namma Metro where routes allow and plan fewer stops per day.',
    accessibility: UNVERIFIED,
    verification: 'Landmark names checked against public reference sources. Timings and fees not verified.',
  },
  {
    id: 'udupi',
    name: 'Udupi',
    district: 'Udupi district',
    region: 'Coastal Karnataka',
    category: 'Spiritual',
    lat: 13.34,
    lon: 74.745,
    image: '/images/udupi.jpg',
    tagline: 'Temple town, coastal cuisine and nearby beaches.',
    description:
      'Udupi is known for the Sri Krishna Matha, founded by the philosopher Madhvacharya, and for the Udupi style of vegetarian cooking that spread across India.',
    context:
      'Malpe beach and St. Mary\'s Island (reached by boat from Malpe, subject to sea conditions) are nearby; Manipal is the adjoining university town.',
    interests: ['Spiritual tourism', 'Food', 'Beaches', 'Culture'],
    activities: [
      { title: 'Sri Krishna Matha and Car Street', detail: 'The temple complex and the surrounding mathas and streets.', interests: ['Spiritual tourism', 'Culture'] },
      { title: 'Udupi cuisine', detail: 'Traditional meals served on banana leaves, plus the local goli baje and neer dosa.', interests: ['Food', 'Culture'] },
      { title: 'Malpe beach', detail: 'A broad beach and fishing harbour a few kilometres from town.', interests: ['Beaches', 'Nature'] },
      { title: 'St. Mary\'s Island boat trip', detail: 'Columnar basalt rock formations; boats operate only when conditions allow.', interests: ['Nature', 'Adventure'] },
    ],
    practicalNotes: 'Boat services to St. Mary\'s Island are suspended in rough weather and the monsoon.',
    accessibility: UNVERIFIED,
    verification: 'Location and landmark names checked against public reference sources. Boat schedules not verified.',
  },
  {
    id: 'murudeshwar',
    name: 'Murudeshwar',
    district: 'Uttara Kannada district',
    region: 'Coastal Karnataka',
    category: 'Spiritual',
    lat: 14.094,
    lon: 74.485,
    image: '/images/murudeshwar.jpg',
    tagline: 'A towering Shiva statue on the Arabian Sea.',
    description:
      'Murudeshwar is a coastal temple town known for its very tall Shiva statue and temple gopura set on a headland surrounded by the sea on three sides.',
    context:
      'Netrani Island, offshore from Murudeshwar, is used for scuba diving by licensed operators in season.',
    interests: ['Spiritual tourism', 'Beaches', 'Adventure', 'Architecture'],
    activities: [
      { title: 'Murudeshwar Temple and Shiva statue', detail: 'The temple, the gopura and the statue on the headland.', interests: ['Spiritual tourism', 'Architecture'] },
      { title: 'Beach walk', detail: 'Beaches on both sides of the temple headland.', interests: ['Beaches', 'Nature'] },
      { title: 'Scuba or snorkelling at Netrani Island', detail: 'Seasonal and operator-dependent; book with certified providers.', interests: ['Adventure'] },
    ],
    practicalNotes: 'Murudeshwar has a railway station on the Konkan line, making it reachable from Gokarna and Udupi.',
    accessibility: UNVERIFIED,
    verification: 'Location checked against public reference sources. Dive operations and timings not verified.',
  },
  {
    id: 'bandipur',
    name: 'Bandipur',
    district: 'Chamarajanagar district',
    region: 'South Karnataka',
    category: 'Wildlife',
    lat: 11.67,
    lon: 76.63,
    image: '/images/bandipur.jpg',
    tagline: 'Tiger reserve on the Karnataka-Tamil Nadu border.',
    description:
      'Bandipur National Park and Tiger Reserve protects deciduous forest that is home to elephants, gaur, deer, and tigers. It forms part of the larger Nilgiri Biosphere Reserve.',
    context:
      'Safaris are run by the Forest Department and authorised resorts. Night traffic through the park on the main highways is restricted to protect wildlife.',
    interests: ['Wildlife', 'Nature', 'Adventure'],
    activities: [
      { title: 'Forest Department safari', detail: 'Early morning or late afternoon safaris; booking rules change, so verify in advance.', interests: ['Wildlife', 'Nature'] },
      { title: 'Birdwatching at the forest edge', detail: 'Resorts and buffer areas are good for birds early in the day.', interests: ['Wildlife', 'Nature'] },
      { title: 'Himavad Gopalaswamy Betta', detail: 'A hilltop temple inside the reserve with views; access is by Forest Department bus.', interests: ['Nature', 'Spiritual tourism'] },
    ],
    practicalNotes: 'Wildlife sightings are never guaranteed. Follow forest rules and keep noise low.',
    accessibility: UNVERIFIED,
    verification: 'Park status and location checked against public reference sources. Safari timings and fees not verified.',
  },
  {
    id: 'dandeli',
    name: 'Dandeli',
    district: 'Uttara Kannada district',
    region: 'Western Ghats',
    category: 'Adventure',
    lat: 15.27,
    lon: 74.62,
    image: '/images/dandeli.jpg',
    tagline: 'River rafting and forest trails on the Kali river.',
    description:
      'Dandeli is an adventure hub in the forests of Uttara Kannada. White-water rafting on the Kali river, kayaking, and nature walks in the Dandeli-Anshi (Kali) Tiger Reserve area are the main draws.',
    context:
      'The region is known for hornbills and other forest birds. Activities are run by private operators and the Forest Department.',
    interests: ['Adventure', 'Nature', 'Wildlife'],
    activities: [
      { title: 'Kali river rafting', detail: 'Rafting stretches depend on dam water release; book with licensed operators.', interests: ['Adventure'] },
      { title: 'Kayaking or coracle ride', detail: 'Calmer water activities on the river.', interests: ['Adventure', 'Nature'] },
      { title: 'Birdwatching and forest walk', detail: 'Look for hornbills in the early morning.', interests: ['Wildlife', 'Nature'] },
      { title: 'Syntheri Rocks', detail: 'A large monolithic rock formation beside the Kaneri river inside the forest.', interests: ['Nature', 'Adventure'] },
    ],
    practicalNotes: 'Water activities depend on season and dam releases; confirm with operators before travelling.',
    accessibility: UNVERIFIED,
    verification: 'Location and river names checked against public reference sources. Activity availability not verified.',
  },
];

export function getDestinationById(id) {
  return DESTINATIONS.find((d) => d.id === id) || null;
}

export function findDestinationByName(name) {
  if (!name || typeof name !== 'string') return null;
  const n = name.trim().toLowerCase();
  return (
    DESTINATIONS.find((d) => d.name.toLowerCase() === n) ||
    DESTINATIONS.find((d) => n.includes(d.name.toLowerCase().split(' ')[0]) || d.name.toLowerCase().includes(n)) ||
    null
  );
}
