import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCargo } from '../../src/context/CargoContext';
import { Shipment, ShipmentStatus } from '../../src/types/cargo';
import { VEHICLE_CONFIG } from '../../src/data/mockCargo';
import { Shadows } from '../../src/constants/colors';

type FilterTab = 'TODOS' | 'EN_CURSO' | 'ENTREGADOS';

export default function EnviosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shipments, activeShipments, deliveredShipments } = useCargo();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShipments = shipments.filter((s) => {
    // Filtro de pestaña
    if (activeFilter === 'EN_CURSO' && (s.status === 'ENTREGADO' || s.status === 'CANCELADO')) {
      return false;
    }
    if (activeFilter === 'ENTREGADOS' && s.status !== 'ENTREGADO') {
      return false;
    }

    // Filtro de búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = s.trackingCode.toLowerCase().includes(q);
      const matchDest = s.destinationAddress.toLowerCase().includes(q);
      const matchRecip = s.recipientName.toLowerCase().includes(q);
      return matchCode || matchDest || matchRecip;
    }

    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.headerContainer,
          { paddingTop: Math.max(insets.top + 8, 20) },
        ]}
      >
        <View>
          <Text style={styles.headerSubtitle}>GESTIÓN Y HISTORIAL</Text>
          <Text style={styles.headerTitle}>Mis Envíos Ecológicos</Text>
        </View>

        <TouchableOpacity
          style={styles.newShipmentHeaderBtn}
          onPress={() => router.push('/nuevo-envio')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.newShipmentHeaderText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Búsqueda */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por código (ej: URB-8492) o receptor..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Pestañas de Filtro */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'TODOS' && styles.filterTabActive]}
          onPress={() => setActiveFilter('TODOS')}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === 'TODOS' && styles.filterTabTextActive,
            ]}
          >
            Todos ({shipments.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === 'EN_CURSO' && styles.filterTabActive,
          ]}
          onPress={() => setActiveFilter('EN_CURSO')}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === 'EN_CURSO' && styles.filterTabTextActive,
            ]}
          >
            En Curso ({activeShipments.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === 'ENTREGADOS' && styles.filterTabActive,
          ]}
          onPress={() => setActiveFilter('ENTREGADOS')}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === 'ENTREGADOS' && styles.filterTabTextActive,
            ]}
          >
            Entregados ({deliveredShipments.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Envíos */}
      <ScrollView
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredShipments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="file-tray-outline" size={42} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No hay envíos en este filtro</Text>
            <Text style={styles.emptySub}>
              Crea un nuevo envío ecológico para comenzar a rastrearlo.
            </Text>
            <TouchableOpacity
              style={styles.emptyCtaBtn}
              onPress={() => router.push('/nuevo-envio')}
            >
              <Text style={styles.emptyCtaBtnText}>Crear Envío</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredShipments.map((s) => {
            const isDelivered = s.status === 'ENTREGADO';
            const vConfig = VEHICLE_CONFIG[s.vehicleType];

            return (
              <View key={s.id} style={styles.shipmentCard}>
                {/* Cabecera del Card */}
                <View style={styles.cardTopRow}>
                  <View style={styles.codeRow}>
                    <Ionicons name="barcode-outline" size={16} color="#047857" />
                    <Text style={styles.trackingCodeText}>{s.trackingCode}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      isDelivered
                        ? styles.statusPillDelivered
                        : styles.statusPillActive,
                    ]}
                  >
                    <Ionicons
                      name={
                        isDelivered
                          ? 'checkmark-circle'
                          : s.status === 'EN_TRANSITO'
                          ? 'bicycle'
                          : 'time-outline'
                      }
                      size={12}
                      color={isDelivered ? '#047857' : '#0284C7'}
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        isDelivered
                          ? styles.statusPillTextDelivered
                          : styles.statusPillTextActive,
                      ]}
                    >
                      {isDelivered
                        ? 'Entregado'
                        : s.status === 'EN_TRANSITO'
                        ? 'En Ruta'
                        : 'Solicitado'}
                    </Text>
                  </View>
                </View>

                {/* Ruta Origen y Destino */}
                <View style={styles.routeContainer}>
                  <View style={styles.routeRow}>
                    <Ionicons name="radio-button-on" size={13} color="#059669" />
                    <Text style={styles.routeAddress} numberOfLines={1}>
                      {s.originAddress}
                    </Text>
                  </View>
                  <View style={styles.routeConnector} />
                  <View style={styles.routeRow}>
                    <Ionicons name="location" size={13} color="#EF4444" />
                    <Text style={styles.routeAddress} numberOfLines={1}>
                      {s.destinationAddress}
                    </Text>
                  </View>
                </View>

                {/* Receptor y Vehículo */}
                <View style={styles.metaRow}>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>DESTINATARIO</Text>
                    <Text style={styles.metaValue}>{s.recipientName}</Text>
                  </View>

                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>VEHÍCULO LIMPIO</Text>
                    <View style={styles.vehicleBadgeRow}>
                      <Ionicons
                        name={vConfig?.iconName as any || 'flash'}
                        size={12}
                        color="#047857"
                      />
                      <Text style={styles.vehicleBadgeText}>
                        {vConfig?.name || 'Eléctrico'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>TARIFA</Text>
                    <Text style={styles.costText}>
                      ${s.cost.toLocaleString('es-CO')}
                    </Text>
                  </View>
                </View>

                {/* Badges de impacto verde */}
                <View style={styles.ecoBadgeRow}>
                  <View style={styles.ecoBadge}>
                    <Ionicons name="leaf" size={11} color="#047857" />
                    <Text style={styles.ecoBadgeText}>
                      -{s.co2SavedKg} kg CO2
                    </Text>
                  </View>
                  <Text style={styles.distanceMeta}>{s.distanceKm} km recorridos</Text>
                </View>

                {/* Botones de Acción */}
                <View style={styles.cardActionsRow}>
                  {!isDelivered ? (
                    <>
                      <TouchableOpacity
                        style={styles.chatActionBtn}
                        onPress={() => router.push(`/chat/${s.id}`)}
                      >
                        <Ionicons name="chatbubble-outline" size={14} color="#047857" />
                        <Text style={styles.chatActionText}>Chat</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.trackActionBtn}
                        onPress={() => router.push(`/seguimiento/${s.id}`)}
                      >
                        <Ionicons name="navigate" size={14} color="#FFFFFF" />
                        <Text style={styles.trackActionText}>Rastrear GPS</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.receiptActionBtn}
                      onPress={() => router.push(`/resumen-envio?id=${s.id}`)}
                    >
                      <Ionicons name="receipt-outline" size={14} color="#047857" />
                      <Text style={styles.receiptActionText}>
                        Ver Comprobante y Calificación
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  newShipmentHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  newShipmentHeaderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  searchBarWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  filterTabActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#047857',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyCtaBtn: {
    marginTop: 16,
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyCtaBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  shipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    ...Shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trackingCodeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  statusPillActive: {
    backgroundColor: '#E0F2FE',
  },
  statusPillDelivered: {
    backgroundColor: '#ECFDF5',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusPillTextActive: {
    color: '#0284C7',
  },
  statusPillTextDelivered: {
    color: '#047857',
  },
  routeContainer: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeAddress: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  routeConnector: {
    width: 2,
    height: 10,
    backgroundColor: '#CBD5E1',
    marginLeft: 5,
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  vehicleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  vehicleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  costText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857',
    marginTop: 2,
  },
  ecoBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 8,
  },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ecoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  distanceMeta: {
    fontSize: 10,
    color: '#64748B',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chatActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  chatActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  trackActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  trackActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  receiptActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 6,
  },
  receiptActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
});
