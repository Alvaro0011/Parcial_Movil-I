export type AccountType = 'PARTICULAR' | 'EMPRESA';

export type VehicleType = 'BICI_CARGO' | 'MOTO_ELECTRICA' | 'VAN_ELECTRICA';

export type PackageCategory =
  | 'DOCUMENTOS'
  | 'PAQUETE_CHICO'
  | 'CARGA_MEDIANA'
  | 'ALIMENTOS_ECO';

export type ShipmentStatus =
  | 'SOLICITADO'
  | 'ASIGNADO'
  | 'EN_TRANSITO'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface EcoDriver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicleType: VehicleType;
  vehicleName: string;
  batteryPercent: number;
  rating: number;
  completedDeliveries: number;
  plate: string;
}

export interface RiohachaLocation {
  id: string;
  name: string;
  address: string;
  landmark: string;
  lat: number;
  lng: number;
}

export interface Shipment {
  id: string;
  trackingCode: string;
  senderId: string;
  senderName: string;
  senderPhone: string;
  originAddress: string;
  originDetails: string;
  originCoords: { lat: number; lng: number };
  destinationAddress: string;
  destinationDetails: string;
  destinationCoords: { lat: number; lng: number };
  recipientName: string;
  recipientPhone: string;
  packageCategory: PackageCategory;
  packageWeightKg: number;
  packageDescription: string;
  vehicleType: VehicleType;
  status: ShipmentStatus;
  driver?: EcoDriver;
  driverCurrentCoords?: { lat: number; lng: number };
  simulationStep: number; // 0: Recibido, 1: Asignado, 2: En tránsito, 3: Entregado
  estimatedMinutes: number;
  distanceKm: number;
  cost: number;
  co2SavedKg: number;
  securityPin: string;
  createdAt: string;
  deliveredAt?: string;
  rating?: number;
  ratingComment?: string;
  ratingTags?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  accountType: AccountType;
  companyName?: string;
  nit?: string;
  avatar: string;
  address: string;
  co2SavedTotalKg: number;
  cleanKmTraveled: number;
  deliveriesCount: number;
  ecoLevel: string;
}

export interface ChatMessage {
  id: string;
  shipmentId: string;
  sender: 'USER' | 'DRIVER';
  text: string;
  timestamp: string;
}
