export const orders = [
  { id: 'DLV-24001', customer: 'Astra Labs', area: 'BKC', location: 'BKC East', priority: 'High', window: '08:30-09:45', weight: 82, service: 18, mapX: 46, mapY: 42, vehicle: 'Vehicle 01', route: 'Route A', status: 'On schedule' },
  { id: 'DLV-24002', customer: 'Northside Cafe', area: 'Bandra West', location: 'Linking Road', priority: 'Standard', window: '09:00-10:15', weight: 35, service: 16, mapX: 26, mapY: 36, vehicle: 'Vehicle 02', route: 'Route B', status: 'On schedule' },
  { id: 'DLV-24003', customer: 'Mahim Medical', area: 'Mahim', location: 'Mahim Causeway', priority: 'High', window: '09:15-10:30', weight: 112, service: 20, mapX: 31, mapY: 66, vehicle: 'Vehicle 04', route: 'Route D', status: 'At risk' },
  { id: 'DLV-24004', customer: 'Urban Staples', area: 'Lower Parel', location: 'Parel Village', priority: 'Standard', window: '09:45-11:00', weight: 68, service: 18, mapX: 58, mapY: 56, vehicle: 'Vehicle 03', route: 'Route C', status: 'On schedule' },
  { id: 'DLV-24005', customer: 'Green Basket', area: 'Bandra East', location: 'Kalanagar', priority: 'High', window: '10:00-11:15', weight: 77, service: 17, mapX: 40, mapY: 28, vehicle: 'Vehicle 01', route: 'Route A', status: 'On schedule' },
  { id: 'DLV-24006', customer: 'Citi Pharma', area: 'Kurla', location: 'Kurla Station', priority: 'High', window: '10:15-11:30', weight: 132, service: 19, mapX: 68, mapY: 48, vehicle: 'Vehicle 03', route: 'Route C', status: 'On schedule' },
  { id: 'DLV-24007', customer: 'The Pantry Co.', area: 'BKC', location: 'BKC North', priority: 'Standard', window: '10:45-12:00', weight: 44, service: 15, mapX: 51, mapY: 38, vehicle: 'Vehicle 01', route: 'Route A', status: 'On schedule' },
  { id: 'DLV-24008', customer: 'Sion Essentials', area: 'Sion', location: 'Sion Koliwada', priority: 'Standard', window: '11:00-12:15', weight: 61, service: 16, mapX: 76, mapY: 69, vehicle: 'Vehicle 02', route: 'Route B', status: 'On schedule' },
  { id: 'DLV-24009', customer: 'Harbor Market', area: 'Chembur', location: 'Chembur East', priority: 'High', window: '11:30-12:45', weight: 95, service: 18, mapX: 86, mapY: 52, vehicle: 'Vehicle 03', route: 'Route C', status: 'On schedule' },
  { id: 'DLV-24010', customer: 'Worli Fresh', area: 'Worli', location: 'Worli Sea Face', priority: 'Standard', window: '11:45-13:00', weight: 52, service: 14, mapX: 54, mapY: 70, vehicle: 'Vehicle 04', route: 'Route D', status: 'At risk' },
  { id: 'DLV-24011', customer: 'Powai Foods', area: 'Powai', location: 'Hiranandani', priority: 'High', window: '12:00-13:15', weight: 118, service: 18, mapX: 72, mapY: 30, vehicle: 'Vehicle 02', route: 'Route B', status: 'On schedule' },
  { id: 'DLV-24012', customer: 'Bandra Fresh Mart', area: 'Bandra West', location: 'Santacruz', priority: 'Standard', window: '12:15-13:30', weight: 56, service: 16, mapX: 18, mapY: 46, vehicle: 'Vehicle 02', route: 'Route B', status: 'On schedule' },
  { id: 'DLV-24013', customer: 'Office Hub', area: 'Andheri East', location: 'MIDC', priority: 'High', window: '12:30-13:45', weight: 88, service: 20, mapX: 62, mapY: 26, vehicle: 'Vehicle 03', route: 'Route C', status: 'On schedule' },
  { id: 'DLV-24014', customer: 'Metro Meats', area: 'Lower Parel', location: 'Elphinstone Road', priority: 'Standard', window: '13:00-14:15', weight: 49, service: 15, mapX: 56, mapY: 62, vehicle: 'Vehicle 04', route: 'Route D', status: 'On schedule' },
  { id: 'DLV-24015', customer: 'BKC Express', area: 'BKC', location: 'BKC West', priority: 'High', window: '13:30-14:45', weight: 143, service: 19, mapX: 48, mapY: 44, vehicle: 'Vehicle 01', route: 'Route A', status: 'On schedule' },
  { id: 'DLV-24016', customer: 'QuickCare Pharmacy', area: 'Mahim', location: 'L.J. Road', priority: 'Standard', window: '14:00-15:15', weight: 74, service: 17, mapX: 36, mapY: 72, vehicle: 'Vehicle 04', route: 'Route D', status: 'On schedule' },
  { id: 'DLV-24017', customer: 'Tiffin Box', area: 'Bandra East', location: 'Carter Road', priority: 'Standard', window: '14:30-15:45', weight: 39, service: 16, mapX: 32, mapY: 22, vehicle: 'Vehicle 02', route: 'Route B', status: 'On schedule' },
  { id: 'DLV-24018', customer: 'Vile Parle Goods', area: 'Vile Parle', location: 'Vile Parle East', priority: 'High', window: '15:00-16:15', weight: 121, service: 18, mapX: 21, mapY: 58, vehicle: 'Vehicle 04', route: 'Route D', status: 'At risk' },
  { id: 'DLV-24019', customer: 'Mila Foods', area: 'Kurla', location: 'LBS Road', priority: 'Standard', window: '15:15-16:30', weight: 62, service: 16, mapX: 76, mapY: 58, vehicle: 'Vehicle 03', route: 'Route C', status: 'On schedule' },
  { id: 'DLV-24020', customer: 'Dream Dine', area: 'BKC', location: 'BKC South', priority: 'Standard', window: '15:45-17:00', weight: 57, service: 15, mapX: 52, mapY: 52, vehicle: 'Vehicle 01', route: 'Route A', status: 'On schedule' },
  { id: 'DLV-24021', customer: 'Kalanagar Grocers', area: 'Bandra East', location: 'Kalanagar', priority: 'High', window: '16:00-17:15', weight: 97, service: 18, mapX: 42, mapY: 30, vehicle: 'Vehicle 02', route: 'Route B', status: 'On schedule' },
  { id: 'DLV-24022', customer: 'Blue Crest Retail', area: 'Powai', location: 'Powai Lake', priority: 'Standard', window: '16:15-17:30', weight: 51, service: 15, mapX: 69, mapY: 33, vehicle: 'Vehicle 02', route: 'Route B', status: 'On schedule' },
  { id: 'DLV-24023', customer: 'Shree Care', area: 'Chembur', location: 'Tilak Nagar', priority: 'High', window: '16:30-17:45', weight: 110, service: 19, mapX: 84, mapY: 62, vehicle: 'Vehicle 03', route: 'Route C', status: 'On schedule' },
  { id: 'DLV-24024', customer: 'SafeNest Supplies', area: 'Worli', location: 'Prabhadevi', priority: 'Standard', window: '17:00-18:15', weight: 66, service: 17, mapX: 61, mapY: 79, vehicle: 'Vehicle 04', route: 'Route D', status: 'On schedule' },
  { id: 'DLV-24025', customer: 'PrimeMart India', area: 'Andheri East', location: 'Marol', priority: 'Standard', window: '17:15-18:30', weight: 43, service: 15, mapX: 71, mapY: 21, vehicle: 'Vehicle 02', route: 'Route B', status: 'On schedule' },
];

export const vehicleProfiles = [
  { name: 'Vehicle 01', driver: 'Amit Shah', type: 'EV van', capacity: 500, load: 412, color: '#18a38a', status: 'On schedule', zone: 'BKC · Bandra East', eta: '10:42', route: 'Route A', routeDistance: 19.2, routeMinutes: 142, stops: 7 },
  { name: 'Vehicle 02', driver: 'Riya Patel', type: 'Cargo van', capacity: 500, load: 384, color: '#428ad4', status: 'On schedule', zone: 'Bandra · Powai', eta: '11:09', route: 'Route B', routeDistance: 21.4, routeMinutes: 158, stops: 7 },
  { name: 'Vehicle 03', driver: 'Kabir Mehta', type: 'Box truck', capacity: 900, load: 702, color: '#d89243', status: 'On schedule', zone: 'Kurla · Chembur', eta: '12:14', route: 'Route C', routeDistance: 24.1, routeMinutes: 181, stops: 7 },
  { name: 'Vehicle 04', driver: 'Mira Rao', type: 'Mini truck', capacity: 600, load: 434, color: '#7c8f5f', status: 'At risk', zone: 'Mahim · Worli', eta: '12:28', route: 'Route D', routeDistance: 22.7, routeMinutes: 175, stops: 7 },
];

export const vehicles = vehicleProfiles;
export const baseline = { distance: 96, duration: 492, cost: 6540, routes: 4, onTime: 88, utilization: 68, violations: 2 };
export const optimized = { distance: 84, duration: 441, cost: 5740, routes: 4, onTime: 96, utilization: 77, violations: 0 };

export const scenarioProfiles = {
  traffic: ['Normal', 'Moderate', 'Heavy'],
  weather: ['Clear', 'Rain', 'Heavy rain'],
  windows: ['Balanced', 'Timely', 'Strict'],
};
