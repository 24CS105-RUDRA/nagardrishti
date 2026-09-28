import type { DensityPoint, SpeedSegment, VehicleClassData, CongestionBottleneck } from './types';

export function getHourlyDensity(timeRange: '1h' | '6h' | '24h' | '7d'): DensityPoint[] {
  const points: DensityPoint[] = [];
  const now = new Date();

  if (timeRange === '1h') {
    for (let i = 12; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 5 * 60000);
      const hour = t.getHours();
      const base = getBaseTraffic(hour);
      points.push({ time: t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), density: base + Math.floor(Math.random() * 200 - 100) });
    }
  } else if (timeRange === '6h') {
    for (let i = 36; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 10 * 60000);
      const hour = t.getHours();
      const base = getBaseTraffic(hour);
      points.push({ time: t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), density: base + Math.floor(Math.random() * 300 - 150) });
    }
  } else if (timeRange === '24h') {
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 3600000);
      const hour = t.getHours();
      const base = getBaseTraffic(hour);
      points.push({ time: `${String(hour).padStart(2, '0')}:00`, density: base + Math.floor(Math.random() * 400 - 200) });
    }
  } else {
    for (let d = 6; d >= 0; d--) {
      for (let h = 0; h < 24; h += 3) {
        const t = new Date(now.getTime() - d * 86400000);
        t.setHours(h, 0, 0, 0);
        const isWeekend = t.getDay() === 0 || t.getDay() === 6;
        const base = getBaseTraffic(h) * (isWeekend ? 0.65 : 1);
        const dayLabel = t.toLocaleDateString('en-IN', { weekday: 'short' });
        points.push({ time: `${dayLabel} ${String(h).padStart(2, '0')}:00`, density: Math.floor(base + Math.random() * 500 - 250) });
      }
    }
  }
  return points;
}

function getBaseTraffic(hour: number): number {
  const pattern: Record<number, number> = {
    0: 800, 1: 500, 2: 350, 3: 300, 4: 400, 5: 900,
    6: 2200, 7: 4500, 8: 7200, 9: 7800, 10: 6500, 11: 5800,
    12: 5200, 13: 5500, 14: 5000, 15: 5300, 16: 6200, 17: 7500,
    18: 8000, 19: 7200, 20: 5500, 21: 3800, 22: 2200, 23: 1200,
  };
  return pattern[hour] ?? 3000;
}

export function getTrafficDensityByZone(zone: string, timeRange: '1h' | '6h' | '24h' | '7d'): DensityPoint[] {
  const zoneMultipliers: Record<string, number> = {
    'Zone-A': 1.2, 'Zone-B': 1.1, 'Zone-C': 1.0, 'Zone-D': 1.15,
    'Zone-E': 0.85, 'Zone-F': 0.75, 'Zone-G': 0.6, 'Zone-H': 0.5,
  };
  const multiplier = zoneMultipliers[zone] ?? 1;
  return getHourlyDensity(timeRange).map((p) => ({
    ...p,
    density: Math.floor(p.density * multiplier),
    zone,
  }));
}

export function getSpeedBySegment(): SpeedSegment[] {
  return [
    { segment: 'SG Highway (Thaltej–Sola)', avgSpeed: 42, maxSpeed: 68 },
    { segment: 'SG Highway (Sola–Gota)', avgSpeed: 45, maxSpeed: 72 },
    { segment: 'CG Road', avgSpeed: 22, maxSpeed: 45 },
    { segment: 'Ashram Road', avgSpeed: 28, maxSpeed: 52 },
    { segment: 'Satellite Road', avgSpeed: 35, maxSpeed: 55 },
    { segment: 'Ring Road (West)', avgSpeed: 38, maxSpeed: 62 },
    { segment: 'NH-48 (Gandhinagar)', avgSpeed: 55, maxSpeed: 85 },
    { segment: 'Naroda Highway', avgSpeed: 32, maxSpeed: 58 },
    { segment: 'Maninagar Main Rd', avgSpeed: 18, maxSpeed: 35 },
    { segment: 'Anand–Vidyanagar Rd', avgSpeed: 40, maxSpeed: 65 },
  ];
}

export function getVehicleClassSplit(): VehicleClassData[] {
  return [
    { name: 'Car', value: 45, color: '#1565C0' },
    { name: 'Bike', value: 25, color: '#2E7D32' },
    { name: 'Truck', value: 12, color: '#ED9B00' },
    { name: 'Bus', value: 8, color: '#C62828' },
    { name: 'Auto', value: 10, color: '#7B1FA2' },
  ];
}

export function getHourlyPeakPattern(): Array<{ hour: string; vehicles: number; avgSpeed: number }> {
  const data = [];
  for (let h = 0; h < 24; h++) {
    const base = getBaseTraffic(h);
    data.push({
      hour: `${String(h).padStart(2, '0')}:00`,
      vehicles: base + Math.floor(Math.random() * 300 - 150),
      avgSpeed: Math.floor(60 - (base / 250) + Math.random() * 5),
    });
  }
  return data;
}

export function getODMatrix(): { zones: string[]; matrix: number[][] } {
  const zones = ['Zone-A', 'Zone-B', 'Zone-C', 'Zone-D', 'Zone-E', 'Zone-F', 'Zone-G', 'Zone-H'];
  const matrix = [
    [0, 3200, 2100, 4500, 1200, 800, 1500, 300],
    [2800, 0, 3500, 2200, 1800, 600, 400, 200],
    [1900, 3100, 0, 1800, 2400, 900, 350, 150],
    [4200, 2500, 1600, 0, 1100, 700, 1200, 250],
    [1100, 1600, 2200, 900, 0, 1500, 300, 400],
    [750, 550, 800, 650, 1400, 0, 1800, 100],
    [1400, 380, 320, 1100, 280, 1700, 0, 600],
    [280, 180, 140, 230, 380, 90, 550, 0],
  ];
  return { zones, matrix };
}

export function getCongestionBottlenecks(): CongestionBottleneck[] {
  return [
    { cameraId: 'CAM-007', cameraName: 'CG Road – Swastik Crossroads', zone: 'Zone-B', densityScore: 92, avgSpeed: 12, status: 'gridlock' },
    { cameraId: 'CAM-009', cameraName: 'Ellis Bridge Junction', zone: 'Zone-B', densityScore: 88, avgSpeed: 15, status: 'congested' },
    { cameraId: 'CAM-024', cameraName: 'Maninagar Railway Crossing', zone: 'Zone-E', densityScore: 85, avgSpeed: 14, status: 'congested' },
    { cameraId: 'CAM-001', cameraName: 'SG Highway – Thaltej Crossroads', zone: 'Zone-A', densityScore: 78, avgSpeed: 22, status: 'congested' },
    { cameraId: 'CAM-018', cameraName: 'Satellite Crossroads', zone: 'Zone-D', densityScore: 72, avgSpeed: 25, status: 'moderate' },
    { cameraId: 'CAM-012', cameraName: 'Nehru Bridge', zone: 'Zone-C', densityScore: 68, avgSpeed: 28, status: 'moderate' },
    { cameraId: 'CAM-030', cameraName: 'Naroda Patiya Junction', zone: 'Zone-F', densityScore: 55, avgSpeed: 32, status: 'moderate' },
    { cameraId: 'CAM-042', cameraName: 'Anand Town Hall Junction', zone: 'Zone-H', densityScore: 45, avgSpeed: 35, status: 'free' },
    { cameraId: 'CAM-036', cameraName: 'Gandhinagar Sector 21 Circle', zone: 'Zone-G', densityScore: 38, avgSpeed: 42, status: 'free' },
    { cameraId: 'CAM-006', cameraName: 'SG Highway – Vaishnodevi Circle', zone: 'Zone-A', densityScore: 35, avgSpeed: 45, status: 'free' },
  ];
}
