import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Shipment,
  EcoDriver,
  ChatMessage,
  ShipmentStatus,
} from '../types/cargo';
import {
  INITIAL_SHIPMENTS,
  MOCK_DRIVERS,
  INITIAL_CHAT_MESSAGES,
} from '../data/mockCargo';

interface CreateShipmentInput {
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
  packageCategory: import('../types/cargo').PackageCategory;
  packageWeightKg: number;
  packageDescription: string;
  vehicleType: import('../types/cargo').VehicleType;
  estimatedMinutes: number;
  distanceKm: number;
  cost: number;
  co2SavedKg: number;
}

interface CargoContextType {
  shipments: Shipment[];
  activeShipments: Shipment[];
  deliveredShipments: Shipment[];
  drivers: EcoDriver[];
  getShipmentById: (id: string) => Shipment | undefined;
  createShipment: (input: CreateShipmentInput) => Shipment;
  advanceSimulationStep: (shipmentId: string) => void;
  rateShipment: (
    shipmentId: string,
    rating: number,
    comment: string,
    tags: string[]
  ) => void;
  getChatMessages: (shipmentId: string) => ChatMessage[];
  sendMessage: (shipmentId: string, text: string) => void;
  totalStats: {
    totalCO2SavedKg: number;
    totalCleanKm: number;
    totalDeliveries: number;
  };
}

const CargoContext = createContext<CargoContextType | undefined>(undefined);

export function CargoProvider({ children }: { children: React.ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [drivers] = useState<EcoDriver[]>(MOCK_DRIVERS);
  const [chatMessages, setChatMessages] = useState<
    Record<string, ChatMessage[]>
  >(INITIAL_CHAT_MESSAGES);

  const activeShipments = useMemo(
    () => shipments.filter((s) => s.status !== 'ENTREGADO' && s.status !== 'CANCELADO'),
    [shipments]
  );

  const deliveredShipments = useMemo(
    () => shipments.filter((s) => s.status === 'ENTREGADO'),
    [shipments]
  );

  const totalStats = useMemo(() => {
    const totalCO2SavedKg = shipments.reduce(
      (acc, s) => acc + (s.status === 'ENTREGADO' || s.status === 'EN_TRANSITO' ? s.co2SavedKg : 0),
      14.8
    );
    const totalCleanKm = shipments.reduce(
      (acc, s) => acc + (s.status === 'ENTREGADO' || s.status === 'EN_TRANSITO' ? s.distanceKm : 0),
      86.4
    );
    const totalDeliveries = shipments.filter((s) => s.status === 'ENTREGADO').length + 16;
    return {
      totalCO2SavedKg: Number(totalCO2SavedKg.toFixed(1)),
      totalCleanKm: Number(totalCleanKm.toFixed(1)),
      totalDeliveries,
    };
  }, [shipments]);

  const getShipmentById = (id: string) => {
    return shipments.find((s) => s.id === id || s.trackingCode === id);
  };

  const createShipment = (input: CreateShipmentInput): Shipment => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const newId = `URB-${randomCode}`;

    // Seleccionar mensajero adecuado según el vehículo
    const assignedDriver =
      drivers.find((d) => d.vehicleType === input.vehicleType) || drivers[0];

    const newShipment: Shipment = {
      ...input,
      id: newId,
      trackingCode: newId,
      status: 'SOLICITADO',
      driver: assignedDriver,
      driverCurrentCoords: { ...input.originCoords },
      simulationStep: 0,
      securityPin: pin,
      createdAt: new Date().toISOString(),
    };

    setShipments((prev) => [newShipment, ...prev]);

    // Iniciar mensaje de bienvenida en el chat
    setChatMessages((prev) => ({
      ...prev,
      [newId]: [
        {
          id: `msg-${Date.now()}-0`,
          shipmentId: newId,
          sender: 'DRIVER',
          text: `Hola, recibimos tu solicitud de envío ${newId}. Estamos coordinando la recolección en ${input.originAddress}.`,
          timestamp: new Date().toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
    }));

    return newShipment;
  };

  const advanceSimulationStep = (shipmentId: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id !== shipmentId && s.trackingCode !== shipmentId) return s;

        const nextStep = (s.simulationStep + 1) % 4;
        let newStatus: ShipmentStatus = 'SOLICITADO';
        let newEstimated = s.estimatedMinutes;
        let newCoords = s.driverCurrentCoords || s.originCoords;

        if (nextStep === 0) {
          newStatus = 'SOLICITADO';
          newEstimated = 15;
          newCoords = { ...s.originCoords };
        } else if (nextStep === 1) {
          newStatus = 'ASIGNADO';
          newEstimated = 12;
          // Mensajero cerca del origen
          newCoords = {
            lat: (s.originCoords.lat * 0.8 + s.destinationCoords.lat * 0.2),
            lng: (s.originCoords.lng * 0.8 + s.destinationCoords.lng * 0.2),
          };
        } else if (nextStep === 2) {
          newStatus = 'EN_TRANSITO';
          newEstimated = 6;
          // Mensajero a mitad de ruta
          newCoords = {
            lat: (s.originCoords.lat + s.destinationCoords.lat) / 2,
            lng: (s.originCoords.lng + s.destinationCoords.lng) / 2,
          };
        } else if (nextStep === 3) {
          newStatus = 'ENTREGADO';
          newEstimated = 0;
          newCoords = { ...s.destinationCoords };
        }

        return {
          ...s,
          simulationStep: nextStep,
          status: newStatus,
          estimatedMinutes: newEstimated,
          driverCurrentCoords: newCoords,
          deliveredAt:
            nextStep === 3 ? new Date().toISOString() : s.deliveredAt,
        };
      })
    );
  };

  const rateShipment = (
    shipmentId: string,
    rating: number,
    comment: string,
    tags: string[]
  ) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === shipmentId || s.trackingCode === shipmentId
          ? { ...s, rating, ratingComment: comment, ratingTags: tags }
          : s
      )
    );
  };

  const getChatMessages = (shipmentId: string): ChatMessage[] => {
    return chatMessages[shipmentId] || [];
  };

  const sendMessage = (shipmentId: string, text: string) => {
    if (!text.trim()) return;
    const timeNow = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      shipmentId,
      sender: 'USER',
      text: text.trim(),
      timestamp: timeNow,
    };

    setChatMessages((prev) => ({
      ...prev,
      [shipmentId]: [...(prev[shipmentId] || []), userMsg],
    }));

    // Simular respuesta rápida del mensajero
    setTimeout(() => {
      const driverReplies = [
        '¡Listo! Tomo nota de la indicación, voy avanzando con cuidado.',
        'Perfecto, ya estoy doblando en la esquina indicada.',
        'Excelente, recuerda tener a mano el código PIN de entrega para validar.',
        'Gracias por avisar, nos vemos en pocos minutos.',
      ];
      const randomReply =
        driverReplies[Math.floor(Math.random() * driverReplies.length)];

      const driverMsg: ChatMessage = {
        id: `msg-${Date.now()}-d`,
        shipmentId,
        sender: 'DRIVER',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setChatMessages((prev) => ({
        ...prev,
        [shipmentId]: [...(prev[shipmentId] || []), driverMsg],
      }));
    }, 1200);
  };

  return (
    <CargoContext.Provider
      value={{
        shipments,
        activeShipments,
        deliveredShipments,
        drivers,
        getShipmentById,
        createShipment,
        advanceSimulationStep,
        rateShipment,
        getChatMessages,
        sendMessage,
        totalStats,
      }}
    >
      {children}
    </CargoContext.Provider>
  );
}

export function useCargo() {
  const context = useContext(CargoContext);
  if (!context) {
    throw new Error('useCargo must be used within a CargoProvider');
  }
  return context;
}
