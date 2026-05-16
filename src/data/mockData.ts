import {
  User,
  IncidentReport,
  ActivityLog,
  IncidentCategory,
  IncidentStatus,
  IncidentSeverity,
} from '../types';

const barangays = [
  'Brgy. San Antonio',
  'Brgy. San Jose',
  'Brgy. San Isidro',
  'Brgy. Santo Niño',
  'Brgy. San Pedro',
  'Brgy. Del Pilar',
  'Brgy. Rizal',
  'Brgy. Mabini',
];

const streets = [
  'Rizal St.', 'Mabini Ave.', 'Bonifacio Rd.', 'Aguinaldo St.',
  'Luna St.', 'Quezon Ave.', 'Magsaysay Blvd.', 'Garcia St.',
  'Santos St.', 'Reyes Ave.', 'Cruz St.', 'Torres Rd.',
];

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString();
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const mockUsers: User[] = [
  {
    id: 'admin001',
    name: 'Captain Maria Santos',
    email: 'captain@barangay.gov.ph',
    phone: '09171234567',
    address: 'Barangay Hall, Rizal St.',
    role: 'superadmin',
    createdAt: '2024-01-01T00:00:00.000Z',
    isVerified: true,
  },
  {
    id: 'admin002',
    name: 'Kagawad Juan dela Cruz',
    email: 'kagawad@barangay.gov.ph',
    phone: '09181234567',
    address: '23 Mabini Ave.',
    role: 'admin',
    createdAt: '2024-01-15T00:00:00.000Z',
    isVerified: true,
  },
  {
    id: 'user001',
    name: 'Pedro Reyes',
    email: 'pedro@email.com',
    phone: '09191234567',
    address: '45 Rizal St., Brgy. San Antonio',
    role: 'citizen',
    createdAt: '2024-02-01T00:00:00.000Z',
    isVerified: true,
  },
  {
    id: 'user002',
    name: 'Ana Garcia',
    email: 'ana@email.com',
    phone: '09201234567',
    address: '12 Bonifacio Rd., Brgy. San Jose',
    role: 'citizen',
    createdAt: '2024-02-15T00:00:00.000Z',
    isVerified: true,
  },
  {
    id: 'user003',
    name: 'Roberto Santos',
    email: 'roberto@email.com',
    phone: '09211234567',
    address: '78 Luna St., Brgy. San Isidro',
    role: 'citizen',
    createdAt: '2024-03-01T00:00:00.000Z',
    isVerified: true,
  },
  {
    id: 'user004',
    name: 'Lucia Mendoza',
    email: 'lucia@email.com',
    phone: '09221234567',
    address: '34 Quezon Ave., Brgy. Santo Niño',
    role: 'citizen',
    createdAt: '2024-03-10T00:00:00.000Z',
    isVerified: false,
  },
];

const incidentTitles: Record<IncidentCategory, string[]> = {
  theft: [
    'Motorcycle stolen from parking area',
    'Cellphone snatching near market',
    'Break-in at residential house',
    'Bicycle theft at school premises',
    'Shoplifting at sari-sari store',
  ],
  assault: [
    'Physical altercation at basketball court',
    'Bar fight near karaoke bar',
    'Road rage incident on main road',
    'Assault near public park',
    'Fighting between neighbors',
  ],
  vandalism: [
    'Graffiti on barangay hall wall',
    'Broken windows at community center',
    'Damaged public property at park',
    'Street lights vandalized',
    'Car scratched in parking lot',
  ],
  noise_complaint: [
    'Loud karaoke past 10PM',
    'Construction noise during rest hours',
    'Party noise disturbing neighbors',
    'Dog barking all night',
    'Loud music from videoke bar',
  ],
  traffic_accident: [
    'Motorcycle collision at intersection',
    'Pedestrian hit near school zone',
    'Tricycle overturned on highway',
    'Car accident at intersection',
    'Bicycle collision with pedestrian',
  ],
  fire: [
    'House fire on residential street',
    'Electrical fire at market',
    'Grass fire near subdivision',
    'Kitchen fire in apartment',
    'Vehicle fire on roadside',
  ],
  domestic_violence: [
    'Domestic disturbance reported',
    'Noise from household argument',
    'Physical abuse reported by neighbor',
    'Child welfare concern',
    'Elderly abuse reported',
  ],
  drug_related: [
    'Suspected drug activity in alley',
    'Drug dealing near school',
    'Suspicious group in vacant lot',
    'Drug use reported in park',
    'Unknown substance found',
  ],
  missing_person: [
    'Missing elderly person',
    'Lost child at public market',
    'Missing teenager since yesterday',
    'Person not returning home',
    'Lost person with medical condition',
  ],
  other: [
    'Stray dog menace in neighborhood',
    'Illegal dumping in waterway',
    'Power line down after storm',
    'Flooding on main road',
    'Suspicious activity reported',
  ],
};

const descriptions: Record<IncidentCategory, string[]> = {
  theft: [
    'The victim reported that their motorcycle, parked in front of their house, was stolen between 2AM-5AM. CCTV footage from a nearby store shows two unidentified individuals taking the vehicle.',
    'A resident reported their cellphone was snatched by an unidentified male while walking near the public market at around 6PM. The suspect fled on foot towards the alley.',
    'The house owner discovered the break-in when they returned home from work. The back door was forced open and several items including electronics and jewelry were taken.',
    'The school security guard reported a bicycle was stolen from the parking area during class hours. The bicycle was locked but the chain was cut.',
    'A store owner reported shoplifting incident. The suspect was caught on CCTV hiding items in their bag before leaving without paying.',
  ],
  assault: [
    'Two groups of young men got into a physical altercation at the barangay basketball court during a recreational game. Several individuals sustained minor injuries.',
    'An argument between patrons at a nearby karaoke bar escalated into a physical fight. Barangay tanods were called to separate the parties involved.',
    'A road rage incident occurred when two drivers got into an argument after a near-collision. One driver struck the other\'s vehicle with a pipe.',
    'A jogger was assaulted by an unknown individual at the public park. The victim sustained bruises and reported the incident to barangay officials.',
    'Long-standing neighbor dispute escalated into physical confrontation. Both parties have previous complaints on file.',
  ],
  vandalism: [
    'Graffiti was found on the newly painted wall of the barangay hall. The damage was discovered early morning by security personnel.',
    'Multiple windows at the community center were found broken. Evidence suggests the damage was caused by thrown rocks.',
    'Playground equipment at the public park was found damaged. Parts were broken off and scattered around the area.',
    'Several street lights along the main road were found with their covers removed and wiring damaged.',
    'A resident reported finding deep scratches on their car that was parked in the communal parking area overnight.',
  ],
  noise_complaint: [
    'Neighbors reported excessive noise from a karaoke session that continued well past 10PM on a weekday. Multiple households were affected.',
    'Construction work on a residential building started before 7AM, violating the barangay noise ordinance. Workers were using heavy machinery.',
    'A birthday celebration with loud music and speakers disturbed nearby residents. The noise continued until past midnight.',
    'A resident reported a neighbor\'s dog has been barking continuously throughout the night for several consecutive nights.',
    'A videoke bar was reported for playing music at excessive volume during prohibited hours.',
  ],
  traffic_accident: [
    'A motorcycle and a tricycle collided at the intersection of Rizal St. and Mabini Ave. Both drivers sustained minor injuries. Traffic was disrupted for about 30 minutes.',
    'A pedestrian was hit by a speeding vehicle near the school zone area. The victim was rushed to the nearby health center for treatment.',
    'A tricycle carrying passengers overturned on the national highway due to a pothole. Minor injuries reported among passengers.',
    'Two cars collided at the intersection due to a malfunctioning traffic light. No injuries reported but both vehicles sustained damage.',
    'A bicycle and pedestrian collision occurred on the sidewalk near the market. Both parties sustained minor injuries.',
  ],
  fire: [
    'A residential house caught fire due to suspected electrical fault. The fire spread to an adjacent structure before being contained by the BFP.',
    'An electrical fire broke out at the public market. Stall owners reported losing merchandise. The fire was quickly contained.',
    'A grass fire near the subdivision threatened nearby houses. BFP and volunteers responded to prevent spread.',
    'A kitchen fire in a second-floor apartment caused panic among residents. The fire was contained using fire extinguishers before BFP arrived.',
    'A parked vehicle caught fire on the roadside. The cause is under investigation. No injuries reported.',
  ],
  domestic_violence: [
    'Neighbors reported loud shouting and sounds of a disturbance from a household. Barangay tanods responded to check on the welfare of the residents.',
    'Repeated sounds of argument and possible physical altercation reported from a residential unit. Social worker referral initiated.',
    'A neighbor reported witnessing physical abuse. The victim was reluctant to file a formal complaint but was counseled by barangay officials.',
    'Concerns about a child\'s welfare were raised by a teacher. The child showed signs of neglect and possible abuse.',
    'A visiting relative reported concerns about the treatment of an elderly family member by their caregiver.',
  ],
  drug_related: [
    'Residents reported suspicious activity in an alley behind the public market, with groups of individuals gathering late at night.',
    'A concerned parent reported suspected drug dealing activity near the school premises during after-school hours.',
    'Residents reported a group of unidentified individuals regularly gathering in a vacant lot with suspicious behavior.',
    'Park-goers reported finding drug paraphernalia scattered in a secluded area of the public park.',
    'A maintenance worker found an unknown substance in a public restroom that was suspected to be illegal drugs.',
  ],
  missing_person: [
    'An elderly person with dementia was reported missing by their family. They were last seen at their home early in the morning.',
    'A child was separated from their parent at the public market. The child was described as wearing a blue shirt and shorts.',
    'A 15-year-old was reported missing by their parents. They were last seen leaving for school but did not return home.',
    'A family member reported their relative has not returned home since yesterday evening and cannot be reached by phone.',
    'An elderly person with diabetes and heart condition was reported missing. They were last seen going for a morning walk.',
  ],
  other: [
    'Residents reported a pack of stray dogs causing disturbance and posing a threat to pedestrians, especially children.',
    'Illegal dumping of waste was observed in the waterway behind the residential area, causing foul odor and potential health hazards.',
    'A power line was brought down by strong winds during the recent storm, posing electrocution risk to passersby.',
    'Heavy rains caused severe flooding on the main road, making it impassable for vehicles and dangerous for pedestrians.',
    'Suspicious individuals were seen loitering around the neighborhood during late hours, causing concern among residents.',
  ],
};

function generateReports(): IncidentReport[] {
  const reports: IncidentReport[] = [];
  const categories: IncidentCategory[] = [
    'theft', 'assault', 'vandalism', 'noise_complaint', 'traffic_accident',
    'fire', 'domestic_violence', 'drug_related', 'missing_person', 'other',
  ];
  const users = mockUsers.filter(u => u.role === 'citizen');

  // Generate 50 reports over the last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 50; i++) {
    const category = randomItem(categories);
    const reporter = randomItem(users);
    const titles = incidentTitles[category];
    const descs = descriptions[category];
    const idx = Math.floor(Math.random() * titles.length);

    const severityWeights: Record<IncidentCategory, IncidentSeverity[]> = {
      theft: ['medium', 'high', 'high', 'critical'],
      assault: ['medium', 'high', 'high', 'critical'],
      vandalism: ['low', 'low', 'medium', 'medium'],
      noise_complaint: ['low', 'low', 'low', 'medium'],
      traffic_accident: ['medium', 'medium', 'high', 'critical'],
      fire: ['high', 'high', 'critical', 'critical'],
      domestic_violence: ['medium', 'high', 'high', 'critical'],
      drug_related: ['medium', 'high', 'high', 'critical'],
      missing_person: ['high', 'high', 'critical', 'critical'],
      other: ['low', 'low', 'medium', 'medium'],
    };

    const createdAt = randomDate(sixMonthsAgo, now);
    const isOlder = new Date(createdAt).getTime() < now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const status = isOlder
      ? randomItem(['approved', 'rejected', 'resolved'] as IncidentStatus[])
      : randomItem(['pending', 'under_review', 'approved'] as IncidentStatus[]);

    const report: IncidentReport = {
      id: `IR-${generateId()}`,
      reporterId: reporter.id,
      reporterName: reporter.name,
      title: titles[idx],
      description: descs[idx],
      category,
      severity: randomItem(severityWeights[category]),
      status,
      location: `${Math.floor(Math.random() * 200) + 1} ${randomItem(streets)}`,
      barangay: randomItem(barangays),
      isAnonymous: Math.random() < 0.15,
      createdAt,
      updatedAt: status !== 'pending' ? randomDate(new Date(createdAt), now) : createdAt,
      reviewedBy: status !== 'pending' ? randomItem(['admin001', 'admin002']) : undefined,
      reviewedAt: status !== 'pending' ? randomDate(new Date(createdAt), now) : undefined,
      reviewNotes: status === 'rejected' ? 'Insufficient evidence provided.' : status === 'approved' ? 'Verified by responding officer.' : undefined,
      resolutionNotes: status === 'resolved' ? 'Case has been resolved and closed.' : undefined,
    };

    reports.push(report);
  }

  return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const mockReports = generateReports();

export const mockActivityLogs: ActivityLog[] = [
  { id: '1', action: 'login', userId: 'admin001', userName: 'Captain Maria Santos', details: 'Logged in to admin dashboard', timestamp: new Date().toISOString() },
  { id: '2', action: 'report_submitted', userId: 'user001', userName: 'Pedro Reyes', reportId: mockReports[0]?.id, details: 'Submitted new incident report', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', action: 'report_approved', userId: 'admin002', userName: 'Kagawad Juan dela Cruz', reportId: mockReports[2]?.id, details: 'Approved incident report', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '4', action: 'report_rejected', userId: 'admin001', userName: 'Captain Maria Santos', reportId: mockReports[4]?.id, details: 'Rejected incident report - insufficient evidence', timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: '5', action: 'report_submitted', userId: 'user002', userName: 'Ana Garcia', reportId: mockReports[1]?.id, details: 'Submitted new incident report', timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: '6', action: 'report_resolved', userId: 'admin002', userName: 'Kagawad Juan dela Cruz', reportId: mockReports[5]?.id, details: 'Marked incident as resolved', timestamp: new Date(Date.now() - 18000000).toISOString() },
  { id: '7', action: 'login', userId: 'user003', userName: 'Roberto Santos', details: 'Logged in', timestamp: new Date(Date.now() - 21600000).toISOString() },
  { id: '8', action: 'report_submitted', userId: 'user003', userName: 'Roberto Santos', reportId: mockReports[3]?.id, details: 'Submitted new incident report', timestamp: new Date(Date.now() - 25200000).toISOString() },
];

export const demoCredentials = {
  admin: { email: 'captain@barangay.gov.ph', password: 'admin123' },
  user: { email: 'pedro@email.com', password: 'user123' },
};
