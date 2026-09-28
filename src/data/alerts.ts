import type { Alert } from './types';

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000);

export const initialAlerts: Alert[] = [
  { id: 'ALT-001', timestamp: minutesAgo(3), plate: 'GJ05CD5678', cameraId: 'CAM-036', cameraName: 'Gandhinagar Sector 21 Circle', location: 'Gandhinagar', type: 'blacklist_hit', severity: 'critical', status: 'new', description: 'Blacklisted vehicle (Stolen) detected at Gandhinagar Sector 21' },
  { id: 'ALT-002', timestamp: minutesAgo(8), plate: 'GJ23RS6789', cameraId: 'CAM-001', cameraName: 'SG Highway – Thaltej Crossroads', location: 'SG Highway', type: 'blacklist_hit', severity: 'critical', status: 'new', description: 'Blacklisted vehicle (Court Order) detected at SG Highway' },
  { id: 'ALT-003', timestamp: minutesAgo(15), plate: 'GJ01ZZ3333', cameraId: 'CAM-012', cameraName: 'Nehru Bridge', location: 'Ashram Road', type: 'blacklist_hit', severity: 'high', status: 'new', description: 'Blacklisted vehicle (Suspicious Activity) detected at Nehru Bridge' },
  { id: 'ALT-004', timestamp: minutesAgo(22), plate: 'GJ01AB1234', cameraId: 'CAM-005', cameraName: 'SG Highway – Gota Junction', location: 'SG Highway', type: 'speed_violation', severity: 'medium', status: 'new', description: 'Vehicle exceeded speed limit (72 km/h in 50 zone)' },
  { id: 'ALT-005', timestamp: minutesAgo(30), plate: 'GJ06PQ2345', cameraId: 'CAM-030', cameraName: 'Naroda Patiya Junction', location: 'Naroda', type: 'route_anomaly', severity: 'medium', status: 'acknowledged', description: 'Unusual route pattern detected for commercial vehicle', assignedTo: 'Amit Patel' },
  { id: 'ALT-006', timestamp: minutesAgo(45), plate: '', cameraId: 'CAM-015', cameraName: 'Riverfront – Flower Park Gate', location: 'Riverfront', type: 'system_alert', severity: 'high', status: 'new', description: 'Camera CAM-015 OCR accuracy dropped below 90%' },
  { id: 'ALT-007', timestamp: hoursAgo(1), plate: 'GJ05CD5678', cameraId: 'CAM-040', cameraName: 'Adalaj Trimandir Junction', location: 'Adalaj', type: 'blacklist_hit', severity: 'critical', status: 'acknowledged', description: 'Blacklisted vehicle heading towards Gandhinagar', assignedTo: 'Vikram Singh' },
  { id: 'ALT-008', timestamp: hoursAgo(1.5), plate: 'GJ01HA4013', cameraId: 'CAM-002', cameraName: 'SG Highway – Bodakdev Junction', location: 'SG Highway', type: 'speed_violation', severity: 'low', status: 'acknowledged', description: 'Minor speed violation (56 km/h in 50 zone)' },
  { id: 'ALT-009', timestamp: hoursAgo(2), plate: '', cameraId: 'CAM-023', cameraName: 'Drive-In Road Circle', location: 'Drive-In', type: 'system_alert', severity: 'critical', status: 'new', description: 'Camera CAM-023 offline for more than 4 hours' },
  { id: 'ALT-010', timestamp: hoursAgo(2.5), plate: 'GJ18EF9012', cameraId: 'CAM-008', cameraName: 'CG Road – Municipal Market', location: 'CG Road', type: 'route_anomaly', severity: 'low', status: 'resolved', description: 'Multiple low-confidence reads – possible plate tampering' },
  { id: 'ALT-011', timestamp: hoursAgo(3), plate: 'GJ05CD5678', cameraId: 'CAM-033', cameraName: 'Motera Stadium Gate', location: 'Motera', type: 'blacklist_hit', severity: 'critical', status: 'acknowledged', description: 'Blacklisted vehicle continuing northward' },
  { id: 'ALT-012', timestamp: hoursAgo(3.5), plate: 'GJ01BE2039', cameraId: 'CAM-006', cameraName: 'SG Highway – Vaishnodevi Circle', location: 'SG Highway', type: 'speed_violation', severity: 'medium', status: 'new', description: 'Vehicle exceeded speed limit (68 km/h in 50 zone)' },
  { id: 'ALT-013', timestamp: hoursAgo(4), plate: '', cameraId: 'CAM-029', cameraName: 'Vastral BRTS Terminal', location: 'Vastral', type: 'system_alert', severity: 'high', status: 'acknowledged', description: 'Camera CAM-029 intermittent connectivity' },
  { id: 'ALT-014', timestamp: hoursAgo(4.5), plate: 'GJ23RS6789', cameraId: 'CAM-032', cameraName: 'Chandkheda Circle', location: 'Chandkheda', type: 'blacklist_hit', severity: 'critical', status: 'escalated', description: 'Blacklisted vehicle in north Ahmedabad', assignedTo: 'Rajesh Kumar' },
  { id: 'ALT-015', timestamp: hoursAgo(5), plate: 'GJ01JK5501', cameraId: 'CAM-018', cameraName: 'Satellite Crossroads', location: 'Satellite', type: 'route_anomaly', severity: 'medium', status: 'new', description: 'Commercial vehicle in restricted residential zone' },
  { id: 'ALT-016', timestamp: hoursAgo(5.5), plate: 'GJ06PQ2345', cameraId: 'CAM-024', cameraName: 'Maninagar Railway Crossing', location: 'Maninagar', type: 'speed_violation', severity: 'high', status: 'resolved', description: 'Heavy vehicle speed violation near railway crossing' },
  { id: 'ALT-017', timestamp: hoursAgo(6), plate: 'GJ01ZZ3333', cameraId: 'CAM-017', cameraName: 'Law Garden Crossroads', location: 'Law Garden', type: 'blacklist_hit', severity: 'high', status: 'new', description: 'Blacklisted vehicle in busy commercial area' },
  { id: 'ALT-018', timestamp: hoursAgo(6.5), plate: '', cameraId: 'CAM-035', cameraName: 'New Ranip Junction', location: 'Ranip', type: 'system_alert', severity: 'critical', status: 'acknowledged', description: 'Camera CAM-035 offline – possible hardware failure' },
  { id: 'ALT-019', timestamp: hoursAgo(7), plate: 'GJ01MN7890', cameraId: 'CAM-020', cameraName: 'IIM Crossroads', location: 'Vastrapur', type: 'route_anomaly', severity: 'low', status: 'resolved', description: 'Vehicle at unusual hours in educational zone' },
  { id: 'ALT-020', timestamp: hoursAgo(7.5), plate: 'GJ05VW4567', cameraId: 'CAM-036', cameraName: 'Gandhinagar Sector 21 Circle', location: 'Gandhinagar', type: 'speed_violation', severity: 'medium', status: 'new', description: 'Bus exceeded speed limit (65 km/h in 40 zone)' },
  { id: 'ALT-021', timestamp: hoursAgo(8), plate: 'GJ05CD5678', cameraId: 'CAM-014', cameraName: 'Ashram Road – Usmanpura', location: 'Ashram Road', type: 'blacklist_hit', severity: 'critical', status: 'resolved', description: 'Blacklisted vehicle tracked through Ashram Road' },
  { id: 'ALT-022', timestamp: hoursAgo(9), plate: 'GJ18DF7821', cameraId: 'CAM-007', cameraName: 'CG Road – Swastik Crossroads', location: 'CG Road', type: 'route_anomaly', severity: 'medium', status: 'new', description: 'Repeated looping pattern – possible surveillance' },
  { id: 'ALT-023', timestamp: hoursAgo(10), plate: '', cameraId: 'CAM-047', cameraName: 'Anand Railway Station Gate', location: 'Anand', type: 'system_alert', severity: 'high', status: 'new', description: 'Camera CAM-047 offline for extended period' },
  { id: 'ALT-024', timestamp: hoursAgo(11), plate: 'GJ01TU0123', cameraId: 'CAM-026', cameraName: 'Isanpur Circle', location: 'Isanpur', type: 'speed_violation', severity: 'low', status: 'acknowledged', description: 'Auto-rickshaw minor speed violation' },
  { id: 'ALT-025', timestamp: hoursAgo(12), plate: 'GJ23RS6789', cameraId: 'CAM-034', cameraName: 'Sabarmati Railway Overbridge', location: 'Sabarmati', type: 'blacklist_hit', severity: 'critical', status: 'resolved', description: 'Blacklisted vehicle crossed Sabarmati area' },
  { id: 'ALT-026', timestamp: hoursAgo(13), plate: 'GJ06CJ1489', cameraId: 'CAM-010', cameraName: 'Panchvati Circle', location: 'Panchvati', type: 'route_anomaly', severity: 'high', status: 'new', description: 'Unregistered route for goods carrier' },
  { id: 'ALT-027', timestamp: hoursAgo(14), plate: '', cameraId: 'CAM-004', cameraName: 'SG Highway – Hebatpur Circle', location: 'SG Highway', type: 'system_alert', severity: 'medium', status: 'resolved', description: 'Brief power interruption – restored' },
  { id: 'ALT-028', timestamp: hoursAgo(15), plate: 'GJ05CD5678', cameraId: 'CAM-009', cameraName: 'Ellis Bridge Junction', location: 'Ellis Bridge', type: 'blacklist_hit', severity: 'critical', status: 'resolved', description: 'Blacklisted vehicle tracked at Ellis Bridge' },
  { id: 'ALT-029', timestamp: hoursAgo(16), plate: 'GJ01LM3345', cameraId: 'CAM-001', cameraName: 'SG Highway – Thaltej Crossroads', location: 'SG Highway', type: 'speed_violation', severity: 'high', status: 'new', description: 'Motorcycle exceeded speed limit (85 km/h)' },
  { id: 'ALT-030', timestamp: hoursAgo(18), plate: 'GJ18XY8901', cameraId: 'CAM-042', cameraName: 'Anand Town Hall Junction', location: 'Anand', type: 'route_anomaly', severity: 'low', status: 'resolved', description: 'Vehicle far from registered zone' },
  { id: 'ALT-031', timestamp: hoursAgo(20), plate: 'GJ01ZZ3333', cameraId: 'CAM-049', cameraName: 'Mithakhali Six Roads', location: 'Mithakhali', type: 'blacklist_hit', severity: 'high', status: 'new', description: 'Blacklisted vehicle at Mithakhali' },
  { id: 'ALT-032', timestamp: hoursAgo(22), plate: '', cameraId: 'CAM-011', cameraName: 'Income Tax Circle', location: 'Income Tax', type: 'system_alert', severity: 'low', status: 'resolved', description: 'Maintenance completed on CAM-011' },
  { id: 'ALT-033', timestamp: hoursAgo(24), plate: 'GJ06AA7777', cameraId: 'CAM-004', cameraName: 'SG Highway – Hebatpur Circle', location: 'SG Highway', type: 'route_anomaly', severity: 'medium', status: 'acknowledged', description: 'Vehicle exceeded dwell time at junction' },
  { id: 'ALT-034', timestamp: hoursAgo(26), plate: 'GJ05CD5678', cameraId: 'CAM-016', cameraName: 'Paldi Junction', location: 'Paldi', type: 'blacklist_hit', severity: 'critical', status: 'resolved', description: 'Blacklisted vehicle through Paldi' },
  { id: 'ALT-035', timestamp: hoursAgo(28), plate: 'GJ23GH5612', cameraId: 'CAM-019', cameraName: 'Vastrapur Lake Junction', location: 'Vastrapur', type: 'speed_violation', severity: 'medium', status: 'new', description: 'Speed violation in residential zone' },
  { id: 'ALT-036', timestamp: hoursAgo(30), plate: '', cameraId: 'CAM-037', cameraName: 'Gandhinagar InfoCity Gate', location: 'InfoCity', type: 'system_alert', severity: 'low', status: 'resolved', description: 'Firmware update applied' },
  { id: 'ALT-037', timestamp: hoursAgo(32), plate: 'GJ01AB1234', cameraId: 'CAM-050', cameraName: 'Shivranjani Crossroads', location: 'Shivranjani', type: 'route_anomaly', severity: 'low', status: 'resolved', description: 'Route deviation from typical commute' },
  { id: 'ALT-038', timestamp: hoursAgo(34), plate: 'GJ23RS6789', cameraId: 'CAM-039', cameraName: 'Gandhinagar CH-0 Circle', location: 'Gandhinagar', type: 'blacklist_hit', severity: 'critical', status: 'resolved', description: 'Blacklisted vehicle first detected in Gandhinagar' },
  { id: 'ALT-039', timestamp: hoursAgo(36), plate: 'GJ01NP9927', cameraId: 'CAM-013', cameraName: 'Ashram Road – Gandhi Bridge', location: 'Ashram Road', type: 'speed_violation', severity: 'high', status: 'acknowledged', description: 'Speed violation near pedestrian zone' },
  { id: 'ALT-040', timestamp: hoursAgo(38), plate: '', cameraId: 'CAM-025', cameraName: 'Maninagar BRTS Stop', location: 'Maninagar', type: 'system_alert', severity: 'medium', status: 'resolved', description: 'Network latency spike resolved' },
  { id: 'ALT-041', timestamp: hoursAgo(40), plate: 'GJ05CD5678', cameraId: 'CAM-027', cameraName: 'Kankaria Lake Gate', location: 'Kankaria', type: 'blacklist_hit', severity: 'critical', status: 'resolved', description: 'Blacklisted vehicle near Kankaria' },
  { id: 'ALT-042', timestamp: hoursAgo(42), plate: 'GJ06BB2244', cameraId: 'CAM-031', cameraName: 'Naroda GIDC Gate', location: 'Naroda', type: 'route_anomaly', severity: 'high', status: 'new', description: 'Unauthorized vehicle in industrial zone' },
  { id: 'ALT-043', timestamp: hoursAgo(44), plate: 'GJ01HA4013', cameraId: 'CAM-003', cameraName: 'SG Highway – Sola Bridge', location: 'SG Highway', type: 'speed_violation', severity: 'medium', status: 'resolved', description: 'Repeat speed offender flagged' },
  { id: 'ALT-044', timestamp: hoursAgo(46), plate: '', cameraId: 'CAM-041', cameraName: 'Gandhinagar Railway Station', location: 'Gandhinagar', type: 'system_alert', severity: 'low', status: 'resolved', description: 'Routine camera calibration completed' },
  { id: 'ALT-045', timestamp: hoursAgo(48), plate: 'GJ01ZZ3333', cameraId: 'CAM-048', cameraName: 'Navrangpura Junction', location: 'Navrangpura', type: 'blacklist_hit', severity: 'high', status: 'resolved', description: 'Blacklisted vehicle at Navrangpura' },
];

const alertTypes: Alert['type'][] = ['blacklist_hit', 'route_anomaly', 'system_alert', 'speed_violation'];
const severities: Alert['severity'][] = ['critical', 'high', 'medium', 'low'];
const samplePlates = ['GJ05CD5678', 'GJ23RS6789', 'GJ01ZZ3333', 'GJ18EF9012', 'GJ06PQ2345', 'GJ01AB1234'];
const sampleCameras = [
  { id: 'CAM-001', name: 'SG Highway – Thaltej', location: 'SG Highway' },
  { id: 'CAM-007', name: 'CG Road – Swastik', location: 'CG Road' },
  { id: 'CAM-018', name: 'Satellite Crossroads', location: 'Satellite' },
  { id: 'CAM-036', name: 'Gandhinagar Sec 21', location: 'Gandhinagar' },
  { id: 'CAM-042', name: 'Anand Town Hall', location: 'Anand' },
];
const descriptions: Record<Alert['type'], string[]> = {
  blacklist_hit: ['Blacklisted vehicle detected', 'Wanted vehicle spotted', 'Flagged vehicle sighting'],
  route_anomaly: ['Unusual route pattern', 'Vehicle in restricted zone', 'Abnormal travel pattern'],
  system_alert: ['Camera connectivity issue', 'OCR accuracy below threshold', 'Storage warning'],
  speed_violation: ['Speed limit exceeded', 'Dangerous speed detected', 'Speed violation in school zone'],
};
let alertCounter = 46;
export function generateRandomAlert(): Alert {
  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const cam = sampleCameras[Math.floor(Math.random() * sampleCameras.length)];
  const plate = type === 'system_alert' ? '' : samplePlates[Math.floor(Math.random() * samplePlates.length)];
  const desc = descriptions[type][Math.floor(Math.random() * descriptions[type].length)];
  return {
    id: `ALT-${String(alertCounter++).padStart(3, '0')}`,
    timestamp: new Date(),
    plate, cameraId: cam.id, cameraName: cam.name, location: cam.location,
    type, severity, status: 'new', description: `${desc} at ${cam.name}`,
  };
}
