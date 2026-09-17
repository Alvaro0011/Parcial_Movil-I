import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../src/context/AuthContext';
import { useCargo } from '../src/context/CargoContext';
import { PackageCategory, VehicleType } from '../src/types/cargo';
import {
  PACKAGE_CATEGORIES,
  VEHICLE_CONFIG,
  RIOHACHA_LOCATIONS,
} from '../src/data/mockCargo';
import { Colors, Shadows } from '../src/constants/colors';

export default function NuevoEnvioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { createShipment } = useCargo();

  // Origen y Destino
  const [originIndex, setOriginIndex] = useState(0); // Por defecto Centro
  const [destinationIndex, setDestinationIndex] = useState(2); // Por defecto San Martín
  const [originDetails, setOriginDetails] = useState('');
  const [destinationDetails, setDestinationDetails] = useState('');

  // Datos del Destinatario
  const [recipientName, setRecipientName] = useState('Mariana Rosado');
  const [recipientPhone, setRecipientPhone] = useState('301 992 4110');

  // Categoría del Paquete
  const initialCat = (params.initialCategory as PackageCategory) || 'DOCUMENTOS';
  const [category, setCategory] = useState<PackageCategory>(initialCat);
  const [packageWeight, setPackageWeight] = useState('1.5');
  const [description, setDescription] = useState('Documentación legal y contrato');

  // Tipo de Vehículo Eléctrico
  const [vehicle, setVehicle] = useState<VehicleType>(
    PACKAGE_CATEGORIES[initialCat]?.suggestedVehicle || 'BICI_CARGO'
  );

  const originLoc = RIOHACHA_LOCATIONS[originIndex] || RIOHACHA_LOCATIONS[0];
  const destLoc = RIOHACHA_LOCATIONS[destinationIndex] || RIOHACHA_LOCATIONS[1];

  // Cálculo de distancia euclidiana simulada en Riohacha
  const distanceKm = useMemo(() => {
    const latDiff = Math.abs(originLoc.lat - destLoc.lat) * 111;
    const lngDiff = Math.abs(originLoc.lng - destLoc.lng) * 105;
    const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) + 0.8;
    return Number(dist.toFixed(1));
  }, [originLoc, destLoc]);

  // Cálculos dinámicos de cotización
  const vConfig = VEHICLE_CONFIG[vehicle];
  const basePrice = vConfig.basePrice;
  const distancePrice = Math.round(distanceKm * vConfig.pricePerKm);
  const ecoDiscount = 1000; // Descuento de incentivo verde
  const totalPrice = Math.max(5000, basePrice + distancePrice - ecoDiscount);
  const co2SavedKg = Number((distanceKm * vConfig.co2SavedPerKmKg).toFixed(2));
  const estimatedMinutes = Math.max(8, Math.round(distanceKm * 4));

  const handleConfirmShipment = () => {
    if (!recipientName.trim()) {
      Alert.alert('Faltan datos', 'Por favor ingresa el nombre de la persona que recibe.');
      return;
    }
    if (!recipientPhone.trim()) {
      Alert.alert('Faltan datos', 'Por favor ingresa el celular de contacto.');
      return;
    }

    const newShipment = createShipment({
      senderId: user?.id || 'usr-alvaro',
      senderName: user?.name || 'Álvaro José Gómez',
      senderPhone: user?.phone || '+57 300 123 4567',
      originAddress: originLoc.address,
      originDetails: originDetails.trim() || originLoc.landmark,
      originCoords: { lat: originLoc.lat, lng: originLoc.lng },
      destinationAddress: destLoc.address,
      destinationDetails: destinationDetails.trim() || destLoc.landmark,
      destinationCoords: { lat: destLoc.lat, lng: destLoc.lng },
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      packageCategory: category,
      packageWeightKg: parseFloat(packageWeight) || 1,
      packageDescription: description.trim() || 'Paquete UrbaCargo',
      vehicleType: vehicle,
      estimatedMinutes,
      distanceKm,
      cost: totalPrice,
      co2SavedKg,
    });

    Alert.alert(
      '¡Envío Solicitado!',
      `Se ha asignado el código ${newShipment.trackingCode}. Un mensajero en ${vConfig.name} va en camino a recolectar tu paquete.`,
      [
        {
          text: 'Rastrear en Vivo',
          onPress: () => router.replace(`/seguimiento/${newShipment.id}`),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner de Sostenibilidad */}
      <View style={styles.ecoPillHeader}>
        <Ionicons name="leaf" size={16} color="#047857" />
        <Text style={styles.ecoPillHeaderText}>
          Cotización con Cero Emisiones en Riohacha
        </Text>
      </View>

      {/* 1. Direcciones de Origen y Destino */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="map-outline" size={18} color="#047857" />
          <Text style={styles.cardTitle}>Puntos de Recolección y Entrega</Text>
        </View>

        {/* Origen */}
        <Text style={styles.inputLabel}>Punto de Origen (Recolección)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.locationsScroll}
        >
          {RIOHACHA_LOCATIONS.map((loc, idx) => (
            <TouchableOpacity
              key={`orig-${loc.id}`}
              style={[
                styles.locationChip,
                originIndex === idx && styles.locationChipActive,
              ]}
              onPress={() => setOriginIndex(idx)}
            >
              <Ionicons
                name="radio-button-on"
                size={14}
                color={originIndex === idx ? '#047857' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.locationChipText,
                  originIndex === idx && styles.locationChipTextActive,
                ]}
              >
                {loc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.addressSubtext}>{originLoc.address} ({originLoc.landmark})</Text>

        <TextInput
          style={styles.noteInput}
          placeholder="Indicaciones de recolección (ej: Oficina 201, timbre 3)"
          placeholderTextColor="#94A3B8"
          value={originDetails}
          onChangeText={setOriginDetails}
        />

        <View style={styles.locationsDivider}>
          <View style={styles.locationsDividerLine} />
          <View style={styles.distanceBadge}>
            <Ionicons name="navigate-outline" size={12} color="#047857" />
            <Text style={styles.distanceBadgeText}>{distanceKm} km estimados</Text>
          </View>
          <View style={styles.locationsDividerLine} />
        </View>

        {/* Destino */}
        <Text style={styles.inputLabel}>Punto de Destino (Entrega)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.locationsScroll}
        >
          {RIOHACHA_LOCATIONS.map((loc, idx) => (
            <TouchableOpacity
              key={`dest-${loc.id}`}
              style={[
                styles.locationChip,
                destinationIndex === idx && styles.locationChipActiveDest,
              ]}
              onPress={() => setDestinationIndex(idx)}
            >
              <Ionicons
                name="location"
                size={14}
                color={destinationIndex === idx ? '#EF4444' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.locationChipText,
                  destinationIndex === idx && styles.locationChipTextActiveDest,
                ]}
              >
                {loc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.addressSubtext}>{destLoc.address} ({destLoc.landmark})</Text>

        <TextInput
          style={styles.noteInput}
          placeholder="Indicaciones de entrega (ej: Recibe vigilante o piso 2)"
          placeholderTextColor="#94A3B8"
          value={destinationDetails}
          onChangeText={setDestinationDetails}
        />
      </View>

      {/* 2. Tipo de Paquete */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="cube-outline" size={18} color="#047857" />
          <Text style={styles.cardTitle}>Tipo de Paquete</Text>
        </View>

        <View style={styles.categoriesRow}>
          {(Object.keys(PACKAGE_CATEGORIES) as PackageCategory[]).map((catKey) => {
            const cat = PACKAGE_CATEGORIES[catKey];
            const isSelected = category === catKey;
            return (
              <TouchableOpacity
                key={catKey}
                style={[styles.catOption, isSelected && styles.catOptionActive]}
                onPress={() => {
                  setCategory(catKey);
                  setVehicle(cat.suggestedVehicle);
                }}
              >
                <Ionicons
                  name={cat.iconName as any}
                  size={20}
                  color={isSelected ? '#047857' : '#64748B'}
                />
                <Text
                  style={[styles.catOptionText, isSelected && styles.catOptionTextActive]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.rowInputs}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Peso estimado (kg)</Text>
            <View style={styles.miniInputBox}>
              <Ionicons name="scale-outline" size={16} color="#64748B" />
              <TextInput
                style={styles.miniTextInput}
                value={packageWeight}
                onChangeText={setPackageWeight}
                keyboardType="numeric"
              />
              <Text style={styles.inputUnit}>kg</Text>
            </View>
          </View>

          <View style={{ flex: 2, marginLeft: 12 }}>
            <Text style={styles.inputLabel}>Descripción breve</Text>
            <View style={styles.miniInputBox}>
              <Ionicons name="document-text-outline" size={16} color="#64748B" />
              <TextInput
                style={styles.miniTextInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Ej: Contrato, caja de zapatos"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>
      </View>

      {/* 3. Selección de Vehículo Eléctrico */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flash-outline" size={18} color="#047857" />
          <Text style={styles.cardTitle}>Vehículo Ecológico Asignado</Text>
        </View>

        {(Object.keys(VEHICLE_CONFIG) as VehicleType[]).map((vKey) => {
          const v = VEHICLE_CONFIG[vKey];
          const isSelected = vehicle === vKey;
          return (
            <TouchableOpacity
              key={vKey}
              style={[styles.vehicleOptionCard, isSelected && styles.vehicleOptionActive]}
              onPress={() => setVehicle(vKey)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.vehicleIconBox,
                  isSelected && styles.vehicleIconBoxActive,
                ]}
              >
                <Ionicons
                  name={v.iconName as any}
                  size={24}
                  color={isSelected ? '#FFFFFF' : '#047857'}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.vehicleTitleRow}>
                  <Text style={[styles.vehicleName, isSelected && styles.vehicleNameActive]}>
                    {v.name}
                  </Text>
                  <View style={styles.zeroEmissionsTag}>
                    <Ionicons name="leaf" size={10} color="#047857" />
                    <Text style={styles.zeroEmissionsText}>0% Emisión</Text>
                  </View>
                </View>
                <Text style={styles.vehicleDesc}>{v.description}</Text>
                <Text style={styles.vehicleMeta}>
                  Capacidad: hasta {v.maxWeightKg} kg • Batería promedio: {v.batteryAvg}%
                </Text>
              </View>

              <Ionicons
                name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={isSelected ? '#059669' : '#CBD5E1'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. Datos del Destinatario */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-outline" size={18} color="#047857" />
          <Text style={styles.cardTitle}>Persona que Recibe en Destino</Text>
        </View>

        <View style={styles.recipientRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Nombre completo</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={16} color="#64748B" />
              <TextInput
                style={styles.inputField}
                value={recipientName}
                onChangeText={setRecipientName}
                placeholder="Nombre del receptor"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.inputLabel}>Teléfono móvil</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={16} color="#64748B" />
              <TextInput
                style={styles.inputField}
                value={recipientPhone}
                onChangeText={setRecipientPhone}
                placeholder="300 000 0000"
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>
      </View>

      {/* 5. Resumen de Cotización y Ahorro Verde */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <View>
            <Text style={styles.summaryLabel}>TIEMPO ESTIMADO</Text>
            <Text style={styles.summaryValue}>{estimatedMinutes} minutos</Text>
          </View>
          <View style={styles.co2HighlightBox}>
            <Ionicons name="leaf" size={14} color="#047857" />
            <Text style={styles.co2HighlightText}>Ahorras {co2SavedKg} kg CO2</Text>
          </View>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Tarifa base ({vConfig.name})</Text>
          <Text style={styles.priceValue}>${basePrice.toLocaleString('es-CO')} COP</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Kilometraje ({distanceKm} km)</Text>
          <Text style={styles.priceValue}>${distancePrice.toLocaleString('es-CO')} COP</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.ecoDiscountLabel}>Bono Incentivo Eco (0% Emisiones)</Text>
          <Text style={styles.ecoDiscountValue}>-${ecoDiscount.toLocaleString('es-CO')} COP</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a Pagar</Text>
          <Text style={styles.totalValue}>${totalPrice.toLocaleString('es-CO')} COP</Text>
        </View>
      </View>

      {/* Botón de Confirmación y Despacho */}
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={handleConfirmShipment}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#059669', '#047857']}
          style={styles.confirmBtnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MaterialCommunityIcons name="bike-fast" size={24} color="#FFFFFF" />
          <Text style={styles.confirmBtnText}>Confirmar y Solicitar Mensajero Verde</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
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
  ecoPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D1FAE5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  ecoPillHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  locationsScroll: {
    marginBottom: 6,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginRight: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locationChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  locationChipActiveDest: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  locationChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  locationChipTextActive: {
    color: '#047857',
    fontWeight: '800',
  },
  locationChipTextActiveDest: {
    color: '#DC2626',
    fontWeight: '800',
  },
  addressSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  noteInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A',
    marginBottom: 10,
  },
  locationsDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  locationsDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  distanceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  catOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 10,
    borderRadius: 12,
    gap: 8,
  },
  catOptionActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  catOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  catOptionTextActive: {
    color: '#047857',
  },
  rowInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
  },
  miniTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  inputUnit: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  vehicleOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  vehicleOptionActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  vehicleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleIconBoxActive: {
    backgroundColor: '#059669',
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehicleName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  vehicleNameActive: {
    color: '#047857',
  },
  zeroEmissionsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  zeroEmissionsText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  vehicleDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  vehicleMeta: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
    marginTop: 3,
  },
  recipientRow: {
    flexDirection: 'row',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    gap: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 16,
    ...Shadows.md,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  co2HighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  co2HighlightText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  priceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  ecoDiscountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  ecoDiscountValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#047857',
  },
  confirmBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.md,
  },
  confirmBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
