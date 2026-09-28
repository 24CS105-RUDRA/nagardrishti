import type { AuditLogEntry } from './types';
const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000);
export const auditLogEntries: AuditLogEntry[] = [
  { id: 'AUD-001', timestamp: minutesAgo(5), userId: 'USR-001', userName: 'Rajesh Kumar Singh', action: 'Logged into NagarDrishti portal', ipAddress: '10.0.1.101', module: 'Authentication' },
  { id: 'AUD-002', timestamp: minutesAgo(15), userId: 'USR-003', userName: 'Amit Patel', action: 'Acknowledged alert ALT-005', ipAddress: '10.0.1.103', module: 'Alerts' },
  { id: 'AUD-003', timestamp: minutesAgo(30), userId: 'USR-002', userName: 'Priya Sharma', action: 'Generated Daily Traffic Summary', ipAddress: '10.0.1.102', module: 'Reports' },
  { id: 'AUD-004', timestamp: hoursAgo(1), userId: 'USR-001', userName: 'Rajesh Kumar Singh', action: 'Added GJ05YZ6789 to blacklist', ipAddress: '10.0.1.101', module: 'Blacklist' },
  { id: 'AUD-005', timestamp: hoursAgo(1.5), userId: 'USR-003', userName: 'Amit Patel', action: 'Escalated alert ALT-014', ipAddress: '10.0.1.103', module: 'Alerts' },
  { id: 'AUD-006', timestamp: hoursAgo(2), userId: 'USR-002', userName: 'Priya Sharma', action: 'Resolved alert ALT-010', ipAddress: '10.0.1.102', module: 'Alerts' },
  { id: 'AUD-007', timestamp: hoursAgo(3), userId: 'USR-004', userName: 'Sunita Desai', action: 'Viewed audit log', ipAddress: '10.0.1.104', module: 'Audit' },
  { id: 'AUD-008', timestamp: hoursAgo(4), userId: 'USR-001', userName: 'Rajesh Kumar Singh', action: 'Updated camera CAM-012 settings', ipAddress: '10.0.1.101', module: 'Camera Manager' },
  { id: 'AUD-009', timestamp: hoursAgo(5), userId: 'USR-003', userName: 'Amit Patel', action: 'Searched trajectory for GJ05CD5678', ipAddress: '10.0.1.103', module: 'Trajectory' },
  { id: 'AUD-010', timestamp: hoursAgo(6), userId: 'USR-002', userName: 'Priya Sharma', action: 'Confirmed OCR review REV-003', ipAddress: '10.0.1.102', module: 'Review Queue' },
  { id: 'AUD-011', timestamp: hoursAgo(8), userId: 'USR-001', userName: 'Rajesh Kumar Singh', action: 'Deactivated blacklist BL-008', ipAddress: '10.0.1.101', module: 'Blacklist' },
  { id: 'AUD-012', timestamp: hoursAgo(10), userId: 'USR-004', userName: 'Sunita Desai', action: 'Exported alerts CSV', ipAddress: '10.0.1.104', module: 'Reports' },
  { id: 'AUD-013', timestamp: hoursAgo(12), userId: 'USR-003', userName: 'Amit Patel', action: 'Disabled camera CAM-023', ipAddress: '10.0.1.103', module: 'Camera Manager' },
  { id: 'AUD-014', timestamp: hoursAgo(14), userId: 'USR-002', userName: 'Priya Sharma', action: 'Updated congestion threshold to 75%', ipAddress: '10.0.1.102', module: 'Settings' },
  { id: 'AUD-015', timestamp: hoursAgo(16), userId: 'USR-001', userName: 'Rajesh Kumar Singh', action: 'Added user Vikram Chauhan', ipAddress: '10.0.1.101', module: 'User Management' },
  { id: 'AUD-016', timestamp: hoursAgo(20), userId: 'USR-003', userName: 'Amit Patel', action: 'Bulk acknowledged 5 alerts', ipAddress: '10.0.1.103', module: 'Alerts' },
  { id: 'AUD-017', timestamp: hoursAgo(24), userId: 'USR-002', userName: 'Priya Sharma', action: 'Generated Congestion Analysis', ipAddress: '10.0.1.102', module: 'Reports' },
  { id: 'AUD-018', timestamp: hoursAgo(30), userId: 'USR-004', userName: 'Sunita Desai', action: 'Reviewed trajectory GJ23RS6789', ipAddress: '10.0.1.104', module: 'Trajectory' },
  { id: 'AUD-019', timestamp: hoursAgo(36), userId: 'USR-001', userName: 'Rajesh Kumar Singh', action: 'System settings backup', ipAddress: '10.0.1.101', module: 'Settings' },
  { id: 'AUD-020', timestamp: hoursAgo(48), userId: 'USR-003', userName: 'Amit Patel', action: 'Logged into portal', ipAddress: '10.0.1.103', module: 'Authentication' },
];
