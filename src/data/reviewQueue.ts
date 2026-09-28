import type { ReviewQueueItem } from './types';
const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000);
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
export const reviewQueueItems: ReviewQueueItem[] = [
  { id: 'REV-001', cameraId: 'CAM-008', cameraName: 'CG Road – Municipal Market', plate: 'GJ01A81234', confidence: 79.5, timestamp: minutesAgo(12), vehicleType: 'Car', status: 'pending' },
  { id: 'REV-002', cameraId: 'CAM-010', cameraName: 'Panchvati Circle', plate: 'GJ18EF90I2', confidence: 81.2, timestamp: minutesAgo(25), vehicleType: 'Bike', status: 'pending' },
  { id: 'REV-003', cameraId: 'CAM-014', cameraName: 'Ashram Road – Usmanpura', plate: 'GJ1BEF9012', confidence: 82.3, timestamp: minutesAgo(40), vehicleType: 'Bike', status: 'pending' },
  { id: 'REV-004', cameraId: 'CAM-031', cameraName: 'Naroda GIDC Gate', plate: 'GJ06PQ234S', confidence: 82.1, timestamp: hoursAgo(1), vehicleType: 'Truck', status: 'pending' },
  { id: 'REV-005', cameraId: 'CAM-027', cameraName: 'Kankaria Lake Gate', plate: 'GJ06P02345', confidence: 80.5, timestamp: hoursAgo(1.5), vehicleType: 'Truck', status: 'pending' },
  { id: 'REV-006', cameraId: 'CAM-015', cameraName: 'Riverfront – Flower Park Gate', plate: 'GJ01LM33A5', confidence: 78.9, timestamp: hoursAgo(2), vehicleType: 'Car', status: 'pending' },
  { id: 'REV-007', cameraId: 'CAM-029', cameraName: 'Vastral BRTS Terminal', plate: 'GJ05VW45G7', confidence: 83.1, timestamp: hoursAgo(2.5), vehicleType: 'Bus', status: 'pending' },
  { id: 'REV-008', cameraId: 'CAM-034', cameraName: 'Sabarmati Overbridge', plate: 'GJ23R56789', confidence: 84.5, timestamp: hoursAgo(3), vehicleType: 'Car', status: 'pending' },
  { id: 'REV-009', cameraId: 'CAM-026', cameraName: 'Isanpur Circle', plate: 'GJ01TU01Z3', confidence: 79.8, timestamp: hoursAgo(3.5), vehicleType: 'Auto', status: 'pending' },
  { id: 'REV-010', cameraId: 'CAM-005', cameraName: 'SG Highway – Gota', plate: 'GJ01AB12B4', confidence: 85.2, timestamp: hoursAgo(4), vehicleType: 'Car', status: 'pending' },
  { id: 'REV-011', cameraId: 'CAM-038', cameraName: 'Gandhinagar Kudasan', plate: 'GJ23881111', confidence: 86.8, timestamp: hoursAgo(5), vehicleType: 'Car', status: 'pending' },
  { id: 'REV-012', cameraId: 'CAM-044', cameraName: 'Vidyanagar Four Roads', plate: 'GJ18XY890L', confidence: 78.3, timestamp: hoursAgo(6), vehicleType: 'Bike', status: 'pending' },
  { id: 'REV-013', cameraId: 'CAM-012', cameraName: 'Nehru Bridge', plate: 'GJ01ZZ33B3', confidence: 84.7, timestamp: hoursAgo(7), vehicleType: 'Car', status: 'pending' },
  { id: 'REV-014', cameraId: 'CAM-022', cameraName: 'Gurukul Road Junction', plate: 'GJ06AA77T7', confidence: 81.9, timestamp: hoursAgo(8), vehicleType: 'Car', status: 'pending' },
  { id: 'REV-015', cameraId: 'CAM-033', cameraName: 'Motera Stadium Gate', plate: 'GJ05C05678', confidence: 83.6, timestamp: hoursAgo(9), vehicleType: 'Car', status: 'pending' },
];
