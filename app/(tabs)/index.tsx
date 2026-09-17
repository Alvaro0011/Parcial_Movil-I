import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { useCargo } from '../../src/context/CargoContext';
import { PackageCategory } from '../../src/types/cargo';
import { PACKAGE_CATEGORIES } from '../../src/data/mockCargo';
import { Colors, Shadows } from '../../src/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, accountType, switchAccountType } = useAuth();
  const { activeShipments, totalStats } = useCargo();

  const handleStartShipment = (category?: PackageCategory) => {
    if (category) {
      router.push({
        pathname: '/nuevo-envio',
        params: { initialCategory: category },
      });
    } else {
      router.push('/nuevo-envio');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View
        style={[
          styles.headerContainer,
          { paddingTop: Math.max(insets.top + 8, 20) },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrapper}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={20} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.onlineDot} />
          </View>

          <View style={{ marginLeft: 12 }}>
            <View style={styles.userTypeBadge}>
              <Ionicons
                name={accountType === 'PARTICULAR' ? 'person' : 'business'}
                size={11}
                color="#047857"
              />
              <Text style={styles.userTypeText}>
                {accountType === 'PARTICULAR' ? 'Cuenta Particular' : 'Empresa B2B'}
              </Text>
            </View>
            <Text style={styles.greetingTitle}>
              Hola, {user?.name.split(' ')[0] || 'Álvaro'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.switchRoleBtn}
            onPress={switchAccountType}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-horizontal" size={16} color="#047857" />
            <Text style={styles.switchRoleText}>Cambiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push('/(tabs)/envios')}
          >
            <Ionicons name="notifications-outline" size={20} color="#0F172A" />
            {activeShipments.length > 0 && <View style={styles.notifBadge} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta Principal de Impacto Ecológico */}
        <LinearGradient
          colors={['#047857', '#065F46']}
          style={styles.impactCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.impactCardTop}>
            <View style={styles.leafIconContainer}>
              <Ionicons name="leaf" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.impactHeaderSubtitle}>MICRO-LOGÍSTICA SOSTENIBLE</Text>
              <Text style={styles.impactHeaderTitle}>Tu Huella Positiva en Riohacha</Text>
            </View>
            <View style={styles.levelBadge}>
              <Ionicons name="shield-checkmark" size={13} color="#FEF3C7" />
              <Text style={styles.levelBadgeText}>Nivel 3</Text>
            </View>
          </View>

          {/* Estadísticas de 3 columnas */}
          <View style={styles.impactStatsRow}>
            <View style={styles.impactStatCol}>
              <View style={styles.impactStatValueRow}>
                <Text style={styles.impactStatNumber}>
                  {totalStats.totalCO2SavedKg}
                </Text>
                <Text style={styles.impactStatUnit}>kg</Text>
              </View>
              <Text style={styles.impactStatLabel}>CO2 Ahorrado</Text>
            </View>

            <View style={styles.impactStatDivider} />

            <View style={styles.impactStatCol}>
              <View style={styles.impactStatValueRow}>
                <Text style={styles.impactStatNumber}>
                  {totalStats.totalCleanKm}
                </Text>
                <Text style={styles.impactStatUnit}>km</Text>
              </View>
              <Text style={styles.impactStatLabel}>Flota Eléctrica</Text>
            </View>

            <View style={styles.impactStatDivider} />

            <View style={styles.impactStatCol}>
              <View style={styles.impactStatValueRow}>
                <Text style={styles.impactStatNumber}>
                  {totalStats.totalDeliveries}
                </Text>
              </View>
              <Text style={styles.impactStatLabel}>Entregas Cero Emisión</Text>
            </View>
          </View>

          {/* Barra de progreso de meta ecológica */}
          <View style={styles.ecoProgressBox}>
            <View style={styles.ecoProgressLabelRow}>
              <Text style={styles.ecoProgressLabel}>Meta mensual: 20 kg CO2</Text>
              <Text style={styles.ecoProgressPercent}>74% alcanzado</Text>
            </View>
            <View style={styles.ecoProgressBarBg}>
              <View style={[styles.ecoProgressBarFill, { width: '74%' }]} />
            </View>
          </View>
        </LinearGradient>

        {/* Botón CTA Grande: Nuevo Envío */}
        <TouchableOpacity
          style={styles.mainCtaBtn}
          onPress={() => handleStartShipment()}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.mainCtaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.mainCtaIconBox}>
              <MaterialCommunityIcons name="bike-fast" size={26} color="#047857" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.mainCtaTitle}>Solicitar Envío Exprés</Text>
              <Text style={styles.mainCtaSubtitle}>
                Cotiza en segundos y pide un mensajero eléctrico
              </Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={30} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Sección: Envíos en Curso */}
        {activeShipments.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithDot}>
                <View style={styles.pulseDot} />
                <Text style={styles.sectionTitle}>Envíos en Curso ({activeShipments.length})</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/envios')}>
                <Text style={styles.sectionLink}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {activeShipments.map((shipment) => (
              <TouchableOpacity
                key={shipment.id}
                style={styles.activeShipmentCard}
                onPress={() => router.push(`/seguimiento/${shipment.id}`)}
                activeOpacity={0.85}
              >
                <View style={styles.activeShipmentTop}>
                  <View style={styles.codePill}>
                    <Ionicons name="barcode-outline" size={14} color="#047857" />
                    <Text style={styles.codePillText}>{shipment.trackingCode}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      shipment.status === 'EN_TRANSITO'
                        ? styles.statusPillTransit
                        : styles.statusPillPending,
                    ]}
                  >
                    <Ionicons
                      name={
                        shipment.status === 'EN_TRANSITO'
                          ? 'bicycle'
                          : 'hourglass-outline'
                      }
                      size={13}
                      color={
                        shipment.status === 'EN_TRANSITO' ? '#047857' : '#B45309'
                      }
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        shipment.status === 'EN_TRANSITO'
                          ? styles.statusPillTextTransit
                          : styles.statusPillTextPending,
                      ]}
                    >
                      {shipment.status === 'EN_TRANSITO'
                        ? 'En Ruta de Entrega'
                        : 'Buscando Mensajero'}
                    </Text>
                  </View>
                </View>

                {/* Ruta origen -> destino */}
                <View style={styles.routeBox}>
                  <View style={styles.routeItem}>
                    <Ionicons name="radio-button-on" size={14} color="#059669" />
                    <Text style={styles.routeText} numberOfLines={1}>
                      {shipment.originAddress}
                    </Text>
                  </View>
                  <View style={styles.routeItem}>
                    <Ionicons name="location" size={14} color="#EF4444" />
                    <Text style={styles.routeText} numberOfLines={1}>
                      {shipment.destinationAddress}
                    </Text>
                  </View>
                </View>

                {/* Footer del card con mensajero y botón de rastreo */}
                <View style={styles.activeShipmentFooter}>
                  {shipment.driver ? (
                    <View style={styles.driverSnippet}>
                      <Image
                        source={{ uri: shipment.driver.avatar }}
                        style={styles.driverThumb}
                      />
                      <View style={{ marginLeft: 8 }}>
                        <Text style={styles.driverSnippetName}>
                          {shipment.driver.name}
                        </Text>
                        <Text style={styles.driverSnippetVehicle}>
                          {shipment.driver.vehicleName}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.assigningText}>Asignando el más cercano...</Text>
                  )}

                  <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => router.push(`/seguimiento/${shipment.id}`)}
                  >
                    <Ionicons name="navigate" size={14} color="#FFFFFF" />
                    <Text style={styles.trackBtnText}>Rastrear GPS</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Sección: Categorías de Envíos Rápidos */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>¿Qué deseas enviar hoy?</Text>
          <Text style={styles.sectionSub}>
            Selecciona el tipo de paquete y te asignamos el vehículo ideal
          </Text>

          <View style={styles.categoriesGrid}>
            {(
              Object.keys(PACKAGE_CATEGORIES) as PackageCategory[]
            ).map((catKey) => {
              const cat = PACKAGE_CATEGORIES[catKey];
              return (
                <TouchableOpacity
                  key={catKey}
                  style={styles.categoryCard}
                  onPress={() => handleStartShipment(catKey)}
                  activeOpacity={0.75}
                >
                  <View style={styles.categoryIconBox}>
                    <Ionicons
                      name={cat.iconName as any}
                      size={24}
                      color="#047857"
                    />
                  </View>
                  <Text style={styles.categoryTitle}>{cat.name}</Text>
                  <Text style={styles.categorySub}>{cat.subtitle}</Text>
                  <View style={styles.categoryFooter}>
                    <Text style={styles.categoryAction}>Cotizar</Text>
                    <Ionicons name="arrow-forward" size={12} color="#059669" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sección: Estado de la Flota en Riohacha */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Flota Activa en Riohacha</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveGreenDot} />
              <Text style={styles.liveText}>En tiempo real</Text>
            </View>
          </View>

          <View style={styles.fleetRow}>
            <View style={styles.fleetCard}>
              <View style={styles.fleetIconRow}>
                <Ionicons name="bicycle" size={20} color="#059669" />
                <View style={styles.batteryPill}>
                  <Ionicons name="battery-charging" size={11} color="#047857" />
                  <Text style={styles.batteryText}>96%</Text>
                </View>
              </View>
              <Text style={styles.fleetCount}>8 Bicis Cargo</Text>
              <Text style={styles.fleetEta}>Llegada en 4-6 min</Text>
            </View>

            <View style={styles.fleetCard}>
              <View style={styles.fleetIconRow}>
                <Ionicons name="flash" size={20} color="#0284C7" />
                <View style={[styles.batteryPill, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="battery-charging" size={11} color="#0284C7" />
                  <Text style={[styles.batteryText, { color: '#0284C7' }]}>88%</Text>
                </View>
              </View>
              <Text style={styles.fleetCount}>12 Motos Eco</Text>
              <Text style={styles.fleetEta}>Llegada en 6-9 min</Text>
            </View>

            <View style={styles.fleetCard}>
              <View style={styles.fleetIconRow}>
                <Ionicons name="car" size={20} color="#D97706" />
                <View style={[styles.batteryPill, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="battery-charging" size={11} color="#D97706" />
                  <Text style={[styles.batteryText, { color: '#D97706' }]}>92%</Text>
                </View>
              </View>
              <Text style={styles.fleetCount}>4 Micro-Vans</Text>
              <Text style={styles.fleetEta}>Llegada en 12 min</Text>
            </View>
          </View>
        </View>

        {/* Tarjeta Informativa de Estudiante / Parcial */}
        <View style={styles.academicCard}>
          <View style={styles.academicIcon}>
            <FontAwesome6 name="graduation-cap" size={20} color="#047857" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.academicTitle}>Proyecto Parcial Desarrollo Móvil</Text>
            <Text style={styles.academicSub}>
              Álvaro José Gómez • Ing. de Sistemas • Universidad de La Guajira
            </Text>
          </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
    alignSelf: 'flex-start',
  },
  userTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  switchRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  impactCard: {
    borderRadius: 20,
    padding: 18,
    ...Shadows.md,
    marginBottom: 16,
  },
  impactCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  leafIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactHeaderSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 0.8,
  },
  impactHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FEF3C7',
  },
  impactStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  impactStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  impactStatValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  impactStatNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  impactStatUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A7F3D0',
    marginLeft: 2,
  },
  impactStatLabel: {
    fontSize: 10,
    color: '#D1FAE5',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  impactStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  ecoProgressBox: {
    marginTop: 14,
  },
  ecoProgressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ecoProgressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D1FAE5',
  },
  ecoProgressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ecoProgressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  ecoProgressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  mainCtaBtn: {
    borderRadius: 18,
    overflow: 'hidden',
    ...Shadows.md,
    marginBottom: 20,
  },
  mainCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mainCtaIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  mainCtaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mainCtaSubtitle: {
    fontSize: 12,
    color: '#ECFDF5',
    marginTop: 2,
  },
  sectionContainer: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  activeShipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#A7F3D0',
    ...Shadows.sm,
    marginBottom: 10,
  },
  activeShipmentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  codePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  statusPillTransit: {
    backgroundColor: '#D1FAE5',
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPillTextTransit: {
    color: '#047857',
  },
  statusPillTextPending: {
    color: '#B45309',
  },
  routeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  activeShipmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  driverSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  driverSnippetName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  driverSnippetVehicle: {
    fontSize: 10,
    color: '#64748B',
  },
  assigningText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.sm,
  },
  categoryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  categorySub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    height: 28,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  categoryAction: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  fleetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fleetCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.sm,
  },
  fleetIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  batteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    gap: 2,
  },
  batteryText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#047857',
  },
  fleetCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  fleetEta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  academicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginTop: 4,
  },
  academicIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  academicTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  academicSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});
