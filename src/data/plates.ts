import type { Plate } from './types';

const indianNames = [
 'Rajesh Kumar','Priya Sharma','Amit Patel','Sunita Desai','Vikram Singh',
 'Anita Mehta','Suresh Joshi','Meena Agarwal','Deepak Trivedi','Kavita Rao',
 'Nikhil Shah','Pooja Verma','Rahul Chauhan','Sneha Iyer','Manish Pandey',
 'Ritu Kapoor','Arun Nair','Divya Pillai','Sanjay Mishra','Neha Gupta',
 'Harish Chauhan','Lakshmi Reddy','Gaurav Thakur','Anjali Bose','Kiran Malhotra',
 'Pankaj Dubey','Rashmi Kulkarni','Venkatesh Murthy','Sarita Tiwari','Bhavesh Modi',
];
const carMakes = ['Maruti Swift','Maruti Alto','Hyundai i20','Hyundai Creta','Tata Nexon','Tata Punch','Honda City','Kia Seltos','MG Hector','Toyota Fortuner'];
const bikeMakes = ['Hero Splendor','Hero HF Deluxe','Bajaj Pulsar','Honda Activa','TVS Jupiter','Royal Enfield Classic','Yamaha FZ','Suzuki Access'];
const truckMakes = ['Tata LPT','Ashok Leyland','Mahindra Bolero Pickup','BharatBenz','Eicher Pro'];
const busMakes = ['Tata Starbus','Ashok Leyland Viking','Volvo B8R','BharatBenz Bus'];
const autoMakes = ['Bajaj RE','TVS King','Piaggio Ape','Mahindra Treo'];
const colors = ['White','Silver','Black','Grey','Red','Blue','Maroon','Beige','Green','Yellow'];
const rtoSeries = ['GJ01','GJ05','GJ06','GJ18','GJ23','GJ27','GJ03'];
const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

function generatePlate(index: number): string {
  const rto = rtoSeries[index % rtoSeries.length];
  const l1 = letters[Math.floor(index / 26) % letters.length];
  const l2 = letters[index % letters.length];
  const num = String(1000 + (index * 7 + 13) % 9000).padStart(4, '0');
  return `${rto}${l1}${l2}${num}`;
}

function getVehicleType(i: number): Plate['vehicleType'] {
  const r = i % 100;
  if (r < 45) return 'Car';
  if (r < 70) return 'Bike';
  if (r < 82) return 'Truck';
  if (r < 90) return 'Bus';
  return 'Auto';
}

function getMake(vType: Plate['vehicleType'], i: number): string {
  switch (vType) {
    case 'Car': return carMakes[i % carMakes.length];
    case 'Bike': return bikeMakes[i % bikeMakes.length];
    case 'Truck': return truckMakes[i % truckMakes.length];
    case 'Bus': return busMakes[i % busMakes.length];
    case 'Auto': return autoMakes[i % autoMakes.length];
  }
}

const demoPlates: Plate[] = [
  { plate: 'GJ01AB1234', vehicleType: 'Car', color: 'White', make: 'Maruti Swift', ownerName: 'Rajesh Kumar', isBlacklisted: false },
  { plate: 'GJ05CD5678', vehicleType: 'Car', color: 'Black', make: 'Toyota Fortuner', ownerName: 'Vikram Singh', isBlacklisted: true },
  { plate: 'GJ18EF9012', vehicleType: 'Bike', color: 'Red', make: 'Bajaj Pulsar', ownerName: 'Deepak Trivedi', isBlacklisted: false },
  { plate: 'GJ01MN7890', vehicleType: 'Car', color: 'Silver', make: 'Hyundai Creta', ownerName: 'Anita Mehta', isBlacklisted: false },
  { plate: 'GJ06PQ2345', vehicleType: 'Truck', color: 'Blue', make: 'Tata LPT', ownerName: 'Suresh Joshi', isBlacklisted: false },
  { plate: 'GJ23RS6789', vehicleType: 'Car', color: 'Grey', make: 'Kia Seltos', ownerName: 'Kavita Rao', isBlacklisted: true },
  { plate: 'GJ01TU0123', vehicleType: 'Auto', color: 'Yellow', make: 'Bajaj RE', ownerName: 'Nikhil Shah', isBlacklisted: false },
  { plate: 'GJ05VW4567', vehicleType: 'Bus', color: 'Red', make: 'Tata Starbus', ownerName: 'Pooja Verma', isBlacklisted: false },
  { plate: 'GJ18XY8901', vehicleType: 'Bike', color: 'Black', make: 'Royal Enfield Classic', ownerName: 'Rahul Chauhan', isBlacklisted: false },
  { plate: 'GJ01ZZ3333', vehicleType: 'Car', color: 'Maroon', make: 'Honda City', ownerName: 'Sneha Iyer', isBlacklisted: true },
  { plate: 'GJ06AA7777', vehicleType: 'Car', color: 'White', make: 'MG Hector', ownerName: 'Manish Pandey', isBlacklisted: false },
  { plate: 'GJ23BB1111', vehicleType: 'Car', color: 'Beige', make: 'Tata Nexon', ownerName: 'Ritu Kapoor', isBlacklisted: false },
];

const generatedPlates: Plate[] = [...demoPlates];

for (let i = 0; i < 510; i++) {
  const vType = getVehicleType(i);
  const plateStr = generatePlate(i + 20);
  if (generatedPlates.some(p => p.plate === plateStr)) continue;
  generatedPlates.push({
    plate: plateStr,
    vehicleType: vType,
    color: colors[i % colors.length],
    make: getMake(vType, i),
    ownerName: indianNames[i % indianNames.length],
    isBlacklisted: i % 22 === 0,
  });
}

export const plates: Plate[] = generatedPlates;

export function searchPlates(query: string): Plate[] {
  const q = query.toUpperCase();
  return plates.filter(p => p.plate.includes(q)).slice(0, 10);
}
