import pool from './index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const barangays = [
  'Brgy. San Antonio', 'Brgy. San Jose', 'Brgy. San Isidro',
  'Brgy. Santo Niño', 'Brgy. San Pedro', 'Brgy. Del Pilar',
  'Brgy. Rizal', 'Brgy. Mabini',
];

const streets = [
  'Rizal St.', 'Mabini Ave.', 'Bonifacio Rd.', 'Aguinaldo St.',
  'Luna St.', 'Quezon Ave.', 'Magsaysay Blvd.', 'Garcia St.',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateReportNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'IR-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const incidentData: Record<string, { titles: string[]; descriptions: string[] }> = {
  theft: {
    titles: ['Motorcycle stolen from parking area', 'Cellphone snatching near market', 'Break-in at residential house'],
    descriptions: [
      'The victim reported that their motorcycle was stolen between 2AM-5AM. CCTV footage shows two unidentified individuals.',
      'A resident reported their cellphone was snatched by an unidentified male while walking near the public market.',
      'The house owner discovered the break-in when they returned home. The back door was forced open.',
    ],
  },
  assault: {
    titles: ['Physical altercation at basketball court', 'Bar fight near karaoke bar', 'Road rage incident'],
    descriptions: [
      'Two groups got into a physical altercation at the barangay basketball court during a game.',
      'An argument at a karaoke bar escalated into a physical fight. Barangay tanods responded.',
      'A road rage incident occurred when two drivers got into an argument after a near-collision.',
    ],
  },
  vandalism: {
    titles: ['Graffiti on barangay hall wall', 'Broken windows at community center', 'Damaged public property'],
    descriptions: [
      'Graffiti was found on the newly painted wall of the barangay hall.',
      'Multiple windows at the community center were found broken.',
      'Playground equipment at the public park was found damaged.',
    ],
  },
  noise_complaint: {
    titles: ['Loud karaoke past 10PM', 'Construction noise during rest hours', 'Party noise disturbing neighbors'],
    descriptions: [
      'Neighbors reported excessive noise from a karaoke session that continued past 10PM.',
      'Construction work started before 7AM, violating the barangay noise ordinance.',
      'A birthday celebration with loud music disturbed nearby residents until past midnight.',
    ],
  },
  traffic_accident: {
    titles: ['Motorcycle collision at intersection', 'Pedestrian hit near school zone', 'Tricycle overturned'],
    descriptions: [
      'A motorcycle and tricycle collided at the intersection. Both drivers sustained minor injuries.',
      'A pedestrian was hit by a speeding vehicle near the school zone.',
      'A tricycle overturned on the highway due to a pothole.',
    ],
  },
  fire: {
    titles: ['House fire on residential street', 'Electrical fire at market', 'Grass fire near subdivision'],
    descriptions: [
      'A residential house caught fire due to suspected electrical fault.',
      'An electrical fire broke out at the public market. Stall owners reported losses.',
      'A grass fire near the subdivision threatened nearby houses.',
    ],
  },
  domestic_violence: {
    titles: ['Domestic disturbance reported', 'Noise from household argument', 'Physical abuse reported'],
    descriptions: [
      'Neighbors reported loud shouting and sounds of disturbance from a household.',
      'Repeated sounds of argument reported from a residential unit.',
      'A neighbor reported witnessing physical abuse.',
    ],
  },
  drug_related: {
    titles: ['Suspected drug activity in alley', 'Drug dealing near school', 'Suspicious group activity'],
    descriptions: [
      'Residents reported suspicious activity in an alley behind the market.',
      'A concerned parent reported suspected drug dealing near the school.',
      'Residents reported a group gathering late at night with suspicious behavior.',
    ],
  },
  missing_person: {
    titles: ['Missing elderly person', 'Lost child at public market', 'Missing teenager'],
    descriptions: [
      'An elderly person with dementia was reported missing by their family.',
      'A child was separated from their parent at the public market.',
      'A teenager was reported missing by their parents.',
    ],
  },
  other: {
    titles: ['Stray dog menace', 'Illegal dumping in waterway', 'Power line down after storm'],
    descriptions: [
      'Residents reported stray dogs causing disturbance and posing threats.',
      'Illegal dumping of waste was observed in the waterway.',
      'A power line was brought down by strong winds, posing electrocution risk.',
    ],
  },
};

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM activity_logs');
    await client.query('DELETE FROM report_attachments');
    await client.query('DELETE FROM reports');
    await client.query('DELETE FROM users');

    console.log('🗑️  Cleared existing data');

    // Create users
    const passwordHash = await bcrypt.hash('admin123', 10);
    const userPasswordHash = await bcrypt.hash('user123', 10);

    const users = [
      {
        id: uuidv4(),
        name: 'Captain Maria Santos',
        email: 'captain@barangay.gov.ph',
        password_hash: passwordHash,
        phone: '09171234567',
        address: 'Barangay Hall, Rizal St.',
        barangay: 'Brgy. San Antonio',
        role: 'superadmin',
        is_verified: true,
      },
      {
        id: uuidv4(),
        name: 'Kagawad Juan dela Cruz',
        email: 'kagawad@barangay.gov.ph',
        password_hash: passwordHash,
        phone: '09181234567',
        address: '23 Mabini Ave.',
        barangay: 'Brgy. San Antonio',
        role: 'admin',
        is_verified: true,
      },
      {
        id: uuidv4(),
        name: 'Pedro Reyes',
        email: 'pedro@email.com',
        password_hash: userPasswordHash,
        phone: '09191234567',
        address: '45 Rizal St., Brgy. San Antonio',
        barangay: 'Brgy. San Antonio',
        role: 'citizen',
        is_verified: true,
      },
      {
        id: uuidv4(),
        name: 'Ana Garcia',
        email: 'ana@email.com',
        password_hash: userPasswordHash,
        phone: '09201234567',
        address: '12 Bonifacio Rd., Brgy. San Jose',
        barangay: 'Brgy. San Jose',
        role: 'citizen',
        is_verified: true,
      },
      {
        id: uuidv4(),
        name: 'Roberto Santos',
        email: 'roberto@email.com',
        password_hash: userPasswordHash,
        phone: '09211234567',
        address: '78 Luna St., Brgy. San Isidro',
        barangay: 'Brgy. San Isidro',
        role: 'citizen',
        is_verified: true,
      },
      {
        id: uuidv4(),
        name: 'Lucia Mendoza',
        email: 'lucia@email.com',
        password_hash: userPasswordHash,
        phone: '09221234567',
        address: '34 Quezon Ave., Brgy. Santo Niño',
        barangay: 'Brgy. Santo Niño',
        role: 'citizen',
        is_verified: false,
      },
    ];

    for (const user of users) {
      await client.query(
        `INSERT INTO users (id, name, email, password_hash, phone, address, barangay, role, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [user.id, user.name, user.email, user.password_hash, user.phone, user.address, user.barangay, user.role, user.is_verified]
      );
    }

    console.log('👥 Created 6 users');

    // Create reports
    const categories = Object.keys(incidentData);
    const citizenUsers = users.filter(u => u.role === 'citizen');
    const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'superadmin');
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 50; i++) {
      const category = randomItem(categories);
      const data = incidentData[category];
      const reporter = randomItem(citizenUsers);
      const titleIdx = Math.floor(Math.random() * data.titles.length);
      const descIdx = Math.floor(Math.random() * data.descriptions.length);
      const createdAt = randomDate(sixMonthsAgo, now);
      const isOlder = createdAt.getTime() < now.getTime() - 7 * 24 * 60 * 60 * 1000;

      const statuses = isOlder
        ? ['approved', 'rejected', 'resolved']
        : ['pending', 'under_review', 'approved'];
      const status = randomItem(statuses);
      const severities = ['low', 'medium', 'high', 'critical'];

      const report = {
        id: uuidv4(),
        report_number: generateReportNumber(),
        reporter_id: reporter.id,
        reporter_name: reporter.name,
        title: data.titles[titleIdx],
        description: data.descriptions[descIdx],
        category,
        severity: randomItem(severities),
        status,
        location: `${Math.floor(Math.random() * 200) + 1} ${randomItem(streets)}`,
        barangay: randomItem(barangays),
        is_anonymous: Math.random() < 0.15,
        reviewed_by: status !== 'pending' ? randomItem(adminUsers).id : null,
        reviewed_at: status !== 'pending' ? randomDate(createdAt, now) : null,
        review_notes: status === 'rejected' ? 'Insufficient evidence provided.' : status === 'approved' ? 'Verified by responding officer.' : null,
        resolution_notes: status === 'resolved' ? 'Case has been resolved and closed.' : null,
        created_at: createdAt,
      };

      await client.query(
        `INSERT INTO reports (id, report_number, reporter_id, reporter_name, title, description, 
         category, severity, status, location, barangay, is_anonymous, reviewed_by, reviewed_at, 
         review_notes, resolution_notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          report.id, report.report_number, report.reporter_id, report.reporter_name,
          report.title, report.description, report.category, report.severity, report.status,
          report.location, report.barangay, report.is_anonymous, report.reviewed_by,
          report.reviewed_at, report.review_notes, report.resolution_notes, report.created_at,
        ]
      );
    }

    console.log('📋 Created 50 incident reports');

    // Create activity logs
    const logActions = [
      { action: 'login', details: 'Logged in to admin dashboard', userId: adminUsers[0].id, userName: adminUsers[0].name },
      { action: 'report_submitted', details: 'Submitted new incident report', userId: citizenUsers[0].id, userName: citizenUsers[0].name },
      { action: 'report_approved', details: 'Approved incident report', userId: adminUsers[1].id, userName: adminUsers[1].name },
      { action: 'report_rejected', details: 'Rejected incident report', userId: adminUsers[0].id, userName: adminUsers[0].name },
      { action: 'report_submitted', details: 'Submitted new incident report', userId: citizenUsers[1].id, userName: citizenUsers[1].name },
      { action: 'report_resolved', details: 'Marked incident as resolved', userId: adminUsers[1].id, userName: adminUsers[1].name },
    ];

    for (let i = 0; i < logActions.length; i++) {
      const log = logActions[i];
      await client.query(
        `INSERT INTO activity_logs (action, user_id, user_name, details, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [log.action, log.userId, log.userName, log.details, new Date(now.getTime() - i * 3600000)]
      );
    }

    console.log('📝 Created activity logs');
    console.log('✅ Database seeded successfully!');
    console.log('\n📌 Demo Credentials:');
    console.log('   Admin: captain@barangay.gov.ph / admin123');
    console.log('   User:  pedro@email.com / user123');

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
