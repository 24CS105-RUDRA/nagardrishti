import type { User } from './types';
const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
export const users: User[] = [
  { id: 'USR-001', name: 'Rajesh Kumar Singh', officerId: 'BEL2024001', role: 'Admin', email: 'rajesh.kumar@bel.gov.in', phone: '+91 79 2630 1001', lastLogin: hoursAgo(0.5), status: 'active' },
  { id: 'USR-002', name: 'Priya Sharma', officerId: 'BEL2024002', role: 'Traffic Analyst', email: 'priya.sharma@bel.gov.in', phone: '+91 79 2630 1002', lastLogin: hoursAgo(2), status: 'active' },
  { id: 'USR-003', name: 'Amit Patel', officerId: 'BEL2024003', role: 'Enforcement Officer', email: 'amit.patel@bel.gov.in', phone: '+91 79 2630 1003', lastLogin: hoursAgo(1), status: 'active' },
  { id: 'USR-004', name: 'Sunita Desai', officerId: 'BEL2024004', role: 'Auditor', email: 'sunita.desai@bel.gov.in', phone: '+91 79 2630 1004', lastLogin: hoursAgo(6), status: 'active' },
  { id: 'USR-005', name: 'Vikram Chauhan', officerId: 'BEL2024005', role: 'Traffic Analyst', email: 'vikram.chauhan@bel.gov.in', phone: '+91 79 2630 1005', lastLogin: hoursAgo(24), status: 'inactive' },
];
