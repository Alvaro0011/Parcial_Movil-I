import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useCargo } from '../../src/context/CargoContext';
import { Shadows } from '../../src/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SeguimientoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getShipmentById, advanceSimulationStep } = useCargo();

  const shipment = getShipmentById(id || 'URB-8492');

  if (!shipment) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.notFoundTitle}>Envío no encontrado</Text>
        <Text style={styles.notFoundSub}>El código {id} no existe en el sistema.</Text>
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.backHomeBtnText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStep = shipment.simulationStep; // 0, 1, 2, 3
  const isDelivered = shipment.status === 'ENTREGADO';

  const handleSimulateAdvance = () => {
    advanceSimulationStep(shipment.id);
  };

  // Posiciones calculadas para el mapa SVG interactivo
  // Paso 0: Mensajero en origen
  // Paso 1: Mensajero saliendo hacia origen
  // Paso 2: Mensajero a mitad de camino
  // Paso 3: Mensajero en destino
  const mapWidth = SCREEN_WIDTH - 40;
  const mapHeight = 220;

  const originX = 60;
  const originY = 160;
  const destX = mapWidth - 60;
  const destY = 60;

  let courierX = originX;
  let courierY = originY;

  if (currentStep === 0) {
    courierX = originX;
    courierY = originY;
  } else if (currentStep === 1) {
    courierX = originX + 50;
    courierY = originY - 30;
  } else if (currentStep === 2) {
    courierX = (originX + destX) / 2;
    courierY = (originY + destY) / 2;
  } else if (currentStep === 3) {
    courierX = destX;
    courierY = destY;
  }

  const stepsData = [
    { title: 'Solicitud Recibida', desc: 'Confirmado por UrbaCargo' },
    { title: 'Mensajero Asignado', desc: 'En camino a recoger paquete' },
    { title: 'En Tránsito Exprés', desc: 'Ruta activa hacia destino' },
    { title: 'Entregado con Éxito', desc: 'Firma y PIN validado' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Card */}
        <View style={styles.topCard}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.topLabel}>CÓDIGO DE SEGUIMIENTO</Text>
              <Text style={styles.trackingTitle}>{shipment.trackingCode}</Text>
            </View>

            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>PIN DE ENTREGA</Text>
              <View style={styles.pinPill}>
                <Ionicons name="key" size={12} color="#047857" />
                <Text style={styles.pinCode}>{shipment.securityPin}</Text>
              </View>
            </View>
          </View>

          {/* Banner de Estado */}
          <View
            style={[
              styles.statusBanner,
              isDelivered ? styles.statusBannerDelivered : styles.statusBannerActive,
            ]}
          >
            <Ionicons
              name={
                isDelivered
                  ? 'checkmark-circle'
                  : currentStep === 2
                  ? 'bicycle'
                  : 'time'
              }
              size={18}
              color={isDelivered ? '#047857' : '#0284C7'}
            />
            <Text
              style={[
                styles.statusBannerText,
                isDelivered ? styles.statusBannerTextDelivered : styles.statusBannerTextActive,
              ]}
            >
              {isDelivered
                ? '¡Paquete Entregado con Éxito en Riohacha!'
                : `Tiempo estimado de llegada: ${shipment.estimatedMinutes} minutos`}
            </Text>
          </View>
        </View>

        {/* Mapa GPS Interactivo SVG */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeaderRow}>
            <View style={styles.mapLiveBadge}>
              <View style={styles.livePulse} />
              <Text style={styles.mapLiveText}>GPS EN TIEMPO REAL</Text>
            </View>
            <Text style={styles.mapLocationNote}>Riohacha, La Guajira</Text>
          </View>

          <View style={styles.svgWrapper}>
            <Svg width={mapWidth} height={mapHeight}>
              {/* Fondo del plano urbano */}
              <Rect width={mapWidth} height={mapHeight} fill="#F1F5F9" rx={14} />

              {/* Red de calles de Riohacha */}
              {/* Cuadrículas y avenidas principales */}
              <Line x1={0} y1={50} x2={mapWidth} y2={50} stroke="#E2E8F0" strokeWidth={10} />
              <Line x1={0} y1={110} x2={mapWidth} y2={110} stroke="#E2E8F0" strokeWidth={12} />
              <Line x1={0} y1={170} x2={mapWidth} y2={170} stroke="#E2E8F0" strokeWidth={10} />
              <Line x1={80} y1={0} x2={80} y2={mapHeight} stroke="#E2E8F0" strokeWidth={12} />
              <Line x1={180} y1={0} x2={180} y2={mapHeight} stroke="#E2E8F0" strokeWidth={14} />
              <Line x1={280} y1={0} x2={280} y2={mapHeight} stroke="#E2E8F0" strokeWidth={10} />

              {/* Rótulos urbanos */}
              <SvgText x={14} y={38} fill="#94A3B8" fontSize={9} fontWeight="bold">
                Av. Primera / Malecón
              </SvgText>
              <SvgText x={14} y={100} fill="#94A3B8" fontSize={9} fontWeight="bold">
                Calle 15 (Eje Comercial)
              </SvgText>
              <SvgText x={14} y={162} fill="#94A3B8" fontSize={9} fontWeight="bold">
                Calle 27 (San Martín)
              </SvgText>

              {/* Ruta del envío (Línea discontinua verde) */}
              <Path
                d={`M ${originX} ${originY} Q ${(originX + destX) / 2 - 20} ${
                  (originY + destY) / 2 + 30
                } ${destX} ${destY}`}
                stroke="#059669"
                strokeWidth={4}
                strokeDasharray="6, 6"
                fill="none"
              />

              {/* Punto de Origen A */}
              <G>
                <Circle cx={originX} cy={originY} r={14} fill="#ECFDF5" stroke="#059669" strokeWidth={3} />
                <SvgText
                  x={originX - 4}
                  y={originY + 4}
                  fill="#047857"
                  fontSize={11}
                  fontWeight="bold"
                >
                  A
                </SvgText>
                <SvgText x={originX - 30} y={originY + 26} fill="#0F172A" fontSize={9} fontWeight="bold">
                  Origen
                </SvgText>
              </G>

              {/* Punto de Destino B */}
              <G>
                <Circle cx={destX} cy={destY} r={14} fill="#FEF2F2" stroke="#EF4444" strokeWidth={3} />
                <SvgText
                  x={destX - 4}
                  y={destY + 4}
                  fill="#DC2626"
                  fontSize={11}
                  fontWeight="bold"
                >
                  B
                </SvgText>
                <SvgText x={destX - 35} y={destY - 18} fill="#0F172A" fontSize={9} fontWeight="bold">
                  Destino
                </SvgText>
              </G>

              {/* Marcador en Vivo del Mensajero Eléctrico */}
              <G>
                {/* Aura de pulso */}
                <Circle cx={courierX} cy={courierY} r={22} fill="rgba(16, 185, 129, 0.25)" />
                <Circle cx={courierX} cy={courierY} r={16} fill="#059669" stroke="#FFFFFF" strokeWidth={3} />
                {/* Rayo eléctrico en SVG sin emojis */}
                <Path
                  d={`M ${courierX + 1} ${courierY - 7} L ${courierX - 4} ${courierY + 1} L ${courierX} ${courierY + 1} L ${courierX - 1} ${courierY + 7} L ${courierX + 4} ${courierY - 1} L ${courierX} ${courierY - 1} Z`}
                  fill="#FFFFFF"
                />
              </G>
            </Svg>
          </View>

          {/* Botón de Simulación de Paso (Para docentes/calificación) */}
          <TouchableOpacity
            style={styles.simulateBtn}
            onPress={handleSimulateAdvance}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#059669', '#047857']}
              style={styles.simulateBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="play-forward" size={16} color="#FFFFFF" />
              <Text style={styles.simulateBtnText}>
                {isDelivered
                  ? 'Reiniciar Simulación de Ruta'
                  : `Simular Avance GPS (Fase ${currentStep + 1}/4)`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stepper de Entrega (4 Fases) */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Progreso de Entrega</Text>

          <View style={styles.stepperContainer}>
            {stepsData.map((step, idx) => {
              const isCompleted = idx < currentStep || isDelivered;
              const isCurrent = idx === currentStep && !isDelivered;
              const isPending = idx > currentStep && !isDelivered;

              return (
                <View key={step.title} style={styles.stepItemRow}>
                  {/* Icono / Check del Paso */}
                  <View style={styles.stepIndicatorCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isCompleted && styles.stepDotCompleted,
                        isCurrent && styles.stepDotCurrent,
                        isPending && styles.stepDotPending,
                      ]}
                    >
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                      ) : isCurrent ? (
                        <View style={styles.stepInnerPulse} />
                      ) : (
                        <View style={styles.stepInnerEmpty} />
                      )}
                    </View>
                    {idx < stepsData.length - 1 && (
                      <View
                        style={[
                          styles.stepConnector,
                          isCompleted && styles.stepConnectorActive,
                        ]}
                      />
                    )}
                  </View>

                  {/* Textos del Paso */}
                  <View style={styles.stepContentCol}>
                    <Text
                      style={[
                        styles.stepTitle,
                        (isCompleted || isCurrent) && styles.stepTitleActive,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tarjeta del Mensajero Asignado */}
        {shipment.driver && (
          <View style={styles.card}>
            <View style={styles.driverCardHeader}>
              <Image
                source={{ uri: shipment.driver.avatar }}
                style={styles.driverAvatar}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.driverNameRow}>
                  <Text style={styles.driverName}>{shipment.driver.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>{shipment.driver.rating}</Text>
                  </View>
                </View>
                <Text style={styles.driverVehicleName}>
                  {shipment.driver.vehicleName} • Placa: {shipment.driver.plate}
                </Text>
                <View style={styles.driverMetaRow}>
                  <View style={styles.batteryPill}>
                    <Ionicons name="battery-charging" size={12} color="#047857" />
                    <Text style={styles.batteryPillText}>
                      {shipment.driver.batteryPercent}% Batería
                    </Text>
                  </View>
                  <Text style={styles.deliveriesBadge}>
                    {shipment.driver.completedDeliveries} entregas
                  </Text>
                </View>
              </View>
            </View>

            {/* Botones de Contacto: Llamar y Chat */}
            <View style={styles.contactActionsRow}>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() =>
                  Alert.alert(
                    'Llamar Mensajero',
                    `Conectando llamada telefónica al número ${shipment.driver?.phone}...`
                  )
                }
              >
                <Ionicons name="call" size={16} color="#047857" />
                <Text style={styles.callBtnText}>Llamar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chatBtn}
                onPress={() => router.push(`/chat/${shipment.id}`)}
              >
                <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
                <Text style={styles.chatBtnText}>Chat en Vivo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Botón Comprobante Digital si está entregado o disponible */}
        <TouchableOpacity
          style={styles.receiptCtaBtn}
          onPress={() => router.push(`/resumen-envio?id=${shipment.id}`)}
          activeOpacity={0.8}
        >
          <View style={styles.receiptIconBox}>
            <Ionicons name="receipt-outline" size={22} color="#047857" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.receiptTitle}>Comprobante Digital y Calificación</Text>
            <Text style={styles.receiptSub}>
              {isDelivered
                ? 'Ver comprobante oficial y calificar el servicio'
                : 'Ver desglose ecológico y detalles del envío'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Tag de Ahorro Ambiental */}
        <View style={styles.ecoSummaryTag}>
          <Ionicons name="leaf" size={14} color="#047857" />
          <Text style={styles.ecoSummaryTagText}>
            Con este envío ecológico ahorraste {shipment.co2SavedKg} kg de CO2 en Riohacha.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  notFoundSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  backHomeBtn: {
    marginTop: 18,
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backHomeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  topCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    ...Shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  trackingTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  pinContainer: {
    alignItems: 'flex-end',
  },
  pinLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  pinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 2,
  },
  pinCode: {
    fontSize: 13,
    fontWeight: '900',
    color: '#047857',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  statusBannerActive: {
    backgroundColor: '#E0F2FE',
  },
  statusBannerDelivered: {
    backgroundColor: '#ECFDF5',
  },
  statusBannerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBannerTextActive: {
    color: '#0284C7',
  },
  statusBannerTextDelivered: {
    color: '#047857',
  },
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    ...Shadows.sm,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  mapLiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  mapLocationNote: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  svgWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
  },
  simulateBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },
  simulateBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  simulateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    ...Shadows.sm,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  stepperContainer: {
    paddingLeft: 4,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotCompleted: {
    backgroundColor: '#059669',
  },
  stepDotCurrent: {
    backgroundColor: '#0284C7',
    borderWidth: 3,
    borderColor: '#BAE6FD',
  },
  stepDotPending: {
    backgroundColor: '#E2E8F0',
  },
  stepInnerPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  stepInnerEmpty: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  stepConnector: {
    width: 2,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  stepConnectorActive: {
    backgroundColor: '#059669',
  },
  stepContentCol: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  stepTitleActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  driverCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  driverNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  driverVehicleName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  driverMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  batteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  batteryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  deliveriesBadge: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  contactActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 6,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  chatBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  receiptCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    ...Shadows.sm,
  },
  receiptIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ecoSummaryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 8,
  },
  ecoSummaryTagText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
    lineHeight: 16,
  },
});
