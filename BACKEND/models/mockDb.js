const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/mock_db.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial DB state
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { users: [], emissions: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading mock DB', err);
    return { users: [], emissions: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing mock DB', err);
  }
}

class MockQuery extends Array {
  sort(sortObj) {
    // Sort based on key. Typically we sort by date descending
    this.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return this;
  }
  limit(n) {
    return MockQuery.from(this.slice(0, n));
  }
}

const MockUser = {
  async findOne({ email }) {
    const db = readDb();
    const user = db.users.find(u => u.email === email);
    return user || null;
  },

  async findById(id) {
    const db = readDb();
    const user = db.users.find(u => String(u._id) === String(id));
    return user || null;
  },

  async create(userData) {
    const db = readDb();
    const newUser = {
      _id: 'usr_' + Math.random().toString(36).substring(2, 9),
      ecoScore: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  },

  async findByIdAndUpdate(id, updateFields) {
    const db = readDb();
    const index = db.users.findIndex(u => String(u._id) === String(id));
    if (index === -1) return null;

    db.users[index] = {
      ...db.users[index],
      ...updateFields,
      updatedAt: new Date().toISOString()
    };
    writeDb(db);
    return db.users[index];
  },

  async aggregate(pipeline) {
    const db = readDb();
    
    // Simple group by department
    const groups = {};
    db.users.forEach(user => {
      const dept = user.department || 'General';
      if (!groups[dept]) {
        groups[dept] = { sumScore: 0, count: 0 };
      }
      groups[dept].sumScore += (user.ecoScore || 0);
      groups[dept].count += 1;
    });

    const result = Object.keys(groups).map(dept => ({
      _id: dept,
      avgScore: parseFloat((groups[dept].sumScore / groups[dept].count).toFixed(1)),
      members: groups[dept].count
    }));

    // Sort by avgScore descending
    result.sort((a, b) => b.avgScore - a.avgScore);

    return result.slice(0, 10);
  }
};

const MockEmission = {
  async create(emissionData) {
    const db = readDb();
    const newEmission = {
      _id: 'ems_' + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...emissionData
    };
    db.emissions.push(newEmission);
    writeDb(db);
    return newEmission;
  },

  // Returns array subclass supporting .sort() and .limit()
  find({ userId }) {
    const db = readDb();
    const filtered = db.emissions.filter(e => String(e.userId) === String(userId));
    return MockQuery.from(filtered);
  }
};

module.exports = {
  MockUser,
  MockEmission
};
