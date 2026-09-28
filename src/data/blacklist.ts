import type { BlacklistEntry } from './types';
const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000);
export const blacklistEntries: BlacklistEntry[] = [
  { id: 'BL-001', plate: 'GJ05CD5678', reason: 'Stolen Vehicle', addedBy: 'Rajesh Kumar', addedDate: daysAgo(45), expiryDate: null, status: 'active', sightingCount: 12, lastSeen: daysAgo(0), notes: 'Toyota Fortuner reported stolen' },
  { id: 'BL-002', plate: 'GJ23RS6789', reason: 'Court Order', addedBy: 'Amit Patel', addedDate: daysAgo(30), expiryDate: daysFromNow(60), status: 'active', sightingCount: 10, lastSeen: daysAgo(0), notes: 'Court order ref: HC/2026/CR/4521' },
  { id: 'BL-003', plate: 'GJ01ZZ3333', reason: 'Suspicious Activity', addedBy: 'Priya Sharma', addedDate: daysAgo(15), expiryDate: daysFromNow(30), status: 'active', sightingCount: 6, lastSeen: daysAgo(0) },
  { id: 'BL-004', plate: 'GJ01HK2091', reason: 'Insurance Expired', addedBy: 'Sunita Desai', addedDate: daysAgo(60), expiryDate: daysFromNow(120), status: 'active', sightingCount: 3, lastSeen: daysAgo(5) },
  { id: 'BL-005', plate: 'GJ06FG4567', reason: 'Registration Expired', addedBy: 'Rajesh Kumar', addedDate: daysAgo(90), expiryDate: null, status: 'active', sightingCount: 7, lastSeen: daysAgo(2) },
  { id: 'BL-006', plate: 'GJ18JK8901', reason: 'Wanted by Police', addedBy: 'Amit Patel', addedDate: daysAgo(20), expiryDate: null, status: 'active', sightingCount: 2, lastSeen: daysAgo(8), notes: 'FIR No. 234/2026' },
  { id: 'BL-007', plate: 'GJ05LM2345', reason: 'Stolen Vehicle', addedBy: 'Rajesh Kumar', addedDate: daysAgo(10), expiryDate: null, status: 'active', sightingCount: 1, lastSeen: daysAgo(7) },
  { id: 'BL-008', plate: 'GJ01NP6789', reason: 'Court Order', addedBy: 'Sunita Desai', addedDate: daysAgo(120), expiryDate: daysAgo(10), status: 'inactive', sightingCount: 15, notes: 'Case dismissed' },
  { id: 'BL-009', plate: 'GJ23QR0123', reason: 'Suspicious Activity', addedBy: 'Priya Sharma', addedDate: daysAgo(25), expiryDate: daysFromNow(45), status: 'active', sightingCount: 4, lastSeen: daysAgo(3) },
  { id: 'BL-010', plate: 'GJ06ST4567', reason: 'Insurance Expired', addedBy: 'Amit Patel', addedDate: daysAgo(180), expiryDate: null, status: 'active', sightingCount: 9, lastSeen: daysAgo(1) },
  { id: 'BL-011', plate: 'GJ01UV8901', reason: 'Wanted by Police', addedBy: 'Rajesh Kumar', addedDate: daysAgo(5), expiryDate: null, status: 'active', sightingCount: 0, notes: 'Fresh alert' },
  { id: 'BL-012', plate: 'GJ18WX2345', reason: 'Registration Expired', addedBy: 'Sunita Desai', addedDate: daysAgo(75), expiryDate: daysFromNow(90), status: 'active', sightingCount: 5, lastSeen: daysAgo(12) },
  { id: 'BL-013', plate: 'GJ05YZ6789', reason: 'Stolen Vehicle', addedBy: 'Priya Sharma', addedDate: daysAgo(3), expiryDate: null, status: 'active', sightingCount: 0, notes: 'Stolen from Gandhinagar' },
  { id: 'BL-014', plate: 'GJ23AB0123', reason: 'Court Order', addedBy: 'Amit Patel', addedDate: daysAgo(200), expiryDate: daysAgo(50), status: 'inactive', sightingCount: 22, notes: 'Case closed' },
  { id: 'BL-015', plate: 'GJ06CD4567', reason: 'Suspicious Activity', addedBy: 'Rajesh Kumar', addedDate: daysAgo(40), expiryDate: daysFromNow(20), status: 'active', sightingCount: 8, lastSeen: daysAgo(0) },
  { id: 'BL-016', plate: 'GJ01EF8901', reason: 'Insurance Expired', addedBy: 'Sunita Desai', addedDate: daysAgo(100), expiryDate: null, status: 'inactive', sightingCount: 11, notes: 'Insurance renewed' },
  { id: 'BL-017', plate: 'GJ18GH2345', reason: 'Wanted by Police', addedBy: 'Amit Patel', addedDate: daysAgo(8), expiryDate: null, status: 'active', sightingCount: 1, lastSeen: daysAgo(6) },
  { id: 'BL-018', plate: 'GJ05IJ6789', reason: 'Registration Expired', addedBy: 'Priya Sharma', addedDate: daysAgo(55), expiryDate: daysFromNow(150), status: 'active', sightingCount: 6, lastSeen: daysAgo(4) },
  { id: 'BL-019', plate: 'GJ23KL0123', reason: 'Stolen Vehicle', addedBy: 'Rajesh Kumar', addedDate: daysAgo(1), expiryDate: null, status: 'active', sightingCount: 0, notes: 'Hyundai i20 silver' },
  { id: 'BL-020', plate: 'GJ06MN4567', reason: 'Court Order', addedBy: 'Sunita Desai', addedDate: daysAgo(35), expiryDate: daysFromNow(25), status: 'active', sightingCount: 3, lastSeen: daysAgo(9) },
  { id: 'BL-021', plate: 'GJ01OP8901', reason: 'Suspicious Activity', addedBy: 'Amit Patel', addedDate: daysAgo(150), expiryDate: daysAgo(30), status: 'inactive', sightingCount: 18, notes: 'Surveillance concluded' },
  { id: 'BL-022', plate: 'GJ18QR2345', reason: 'Insurance Expired', addedBy: 'Priya Sharma', addedDate: daysAgo(70), expiryDate: null, status: 'active', sightingCount: 4, lastSeen: daysAgo(15) },
  { id: 'BL-023', plate: 'GJ05ST6789', reason: 'Wanted by Police', addedBy: 'Rajesh Kumar', addedDate: daysAgo(12), expiryDate: null, status: 'active', sightingCount: 2, lastSeen: daysAgo(10) },
  { id: 'BL-024', plate: 'GJ23UV0123', reason: 'Registration Expired', addedBy: 'Sunita Desai', addedDate: daysAgo(85), expiryDate: daysFromNow(100), status: 'active', sightingCount: 7, lastSeen: daysAgo(3) },
  { id: 'BL-025', plate: 'GJ06WX4567', reason: 'Stolen Vehicle', addedBy: 'Amit Patel', addedDate: daysAgo(2), expiryDate: null, status: 'active', sightingCount: 0, notes: 'Tata Nexon white – stolen from Anand' },
];
