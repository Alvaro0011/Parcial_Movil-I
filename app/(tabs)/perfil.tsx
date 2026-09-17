import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { useCargo } from '../../src/context/CargoContext';
import { Shadows } from '../../src/constants/colors';

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, accountType, switchAccountType, logout, updateUserAvatar } = useAuth();
  const { totalStats } = useCargo();

  const [liveNotifs, setLiveNotifs] = useState(true);
  const [ecoReports, setEcoReports] = useState(true);

  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permiso requerido',
          'Se necesita acceso a la galería para actualizar tu foto de perfil.'
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!pickerResult.canceled && pickerResult.assets[0]?.uri) {
        updateUserAvatar(pickerResult.assets[0].uri);
        Alert.alert('Foto actualizada', 'Tu foto de perfil se ha actualizado correctamente.');
      }
    } catch (error) {
      console.log('Error seleccionando imagen:', error);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión en UrbaCargo?');
      if (confirmed) {
        logout();
        router.replace('/login');
      }
    } else {
      Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir de UrbaCargo?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top + 8, 20), paddingBottom: insets.bottom + 90 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header del Perfil */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
          )}

          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user?.name || 'Álvaro José Gómez'}</Text>
        <Text style={styles.userPhone}>{user?.phone || '+57 300 123 4567'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'alvaro.gomez@uniguajira.edu.co'}</Text>

        <View style={styles.accountTypePill}>
          <Ionicons
            name={accountType === 'PARTICULAR' ? 'person' : 'business'}
            size={12}
            color="#047857"
          />
          <Text style={styles.accountTypePillText}>
            {accountType === 'PARTICULAR' ? 'Cuenta Particular' : 'Empresa B2B'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.switchAccountBtn}
          onPress={switchAccountType}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-horizontal" size={14} color="#059669" />
          <Text style={styles.switchAccountText}>
            Cambiar a {accountType === 'PARTICULAR' ? 'Empresa B2B' : 'Particular'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tarjeta Académica Uniguajira */}
      <View style={styles.academicCard}>
        <View style={styles.academicIconWrapper}>
          <FontAwesome6 name="graduation-cap" size={22} color="#047857" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.academicTitle}>Universidad de La Guajira</Text>
          <Text style={styles.academicDegree}>
            Facultad de Ingeniería • Ingeniería de Sistemas
          </Text>
          <Text style={styles.academicCourse}>
            Materia: Desarrollo de Aplicaciones Móviles
          </Text>
          <View style={styles.studentBadge}>
            <Ionicons name="code-slash" size={11} color="#047857" />
            <Text style={styles.studentBadgeText}>Estudiante: Álvaro José Gómez</Text>
          </View>
        </View>
      </View>

      {/* Tarjeta de Métricas Ecológicas */}
      <LinearGradient
        colors={['#047857', '#065F46']}
        style={styles.impactCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.impactTop}>
          <Ionicons name="leaf" size={20} color="#34D399" />
          <Text style={styles.impactTitle}>Balance de Impacto Ecológico</Text>
        </View>

        <View style={styles.impactGrid}>
          <View style={styles.impactGridCol}>
            <Text style={styles.impactGridVal}>{totalStats.totalCO2SavedKg} kg</Text>
            <Text style={styles.impactGridLabel}>CO2 Evitado</Text>
          </View>

          <View style={styles.impactGridCol}>
            <Text style={styles.impactGridVal}>{totalStats.totalCleanKm} km</Text>
            <Text style={styles.impactGridLabel}>Flota Eléctrica</Text>
          </View>

          <View style={styles.impactGridCol}>
            <Text style={styles.impactGridVal}>{totalStats.totalDeliveries}</Text>
            <Text style={styles.impactGridLabel}>Envíos Verdes</Text>
          </View>
        </View>

        <View style={styles.levelRow}>
          <Ionicons name="ribbon" size={16} color="#FEF3C7" />
          <Text style={styles.levelText}>Rango Actual: Guardián Verde Nivel 3</Text>
        </View>
      </LinearGradient>

      {/* Ajustes y Preferencias */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Preferencias del Servicio</Text>

        <View style={styles.prefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.prefTitle}>Notificaciones GPS en Vivo</Text>
            <Text style={styles.prefSub}>
              Alertas cuando el mensajero esté a 5 minutos
            </Text>
          </View>
          <Switch
            value={liveNotifs}
            onValueChange={setLiveNotifs}
            trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }}
            thumbColor={liveNotifs ? '#059669' : '#FFFFFF'}
          />
        </View>

        <View style={styles.prefDivider} />

        <View style={styles.prefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.prefTitle}>Reportes Mensuales de CO2</Text>
            <Text style={styles.prefSub}>
              Resumen digital de huella ecológica ahorrada
            </Text>
          </View>
          <Switch
            value={ecoReports}
            onValueChange={setEcoReports}
            trackColor={{ false: '#CBD5E1', true: '#A7F3D0' }}
            thumbColor={ecoReports ? '#059669' : '#FFFFFF'}
          />
        </View>

        <View style={styles.prefDivider} />

        <TouchableOpacity
          style={styles.prefLinkRow}
          onPress={() =>
            Alert.alert(
              'Flota Eléctrica',
              'Operamos con bicicletas de carga asistidas y motos eléctricas Super Soco con estaciones de carga solar en Riohacha.'
            )
          }
        >
          <Ionicons name="bicycle-outline" size={18} color="#047857" />
          <Text style={styles.prefLinkText}>Sobre nuestra flota eléctrica</Text>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.prefLinkRow}
          onPress={() =>
            Alert.alert(
              'Términos y Privacidad',
              'UrbaCargo garantiza la custodia de envíos y el cumplimiento de la ley de protección de datos personales (Habeas Data Colombia).'
            )
          }
        >
          <Ionicons name="document-text-outline" size={18} color="#047857" />
          <Text style={styles.prefLinkText}>Términos y Política de Privacidad</Text>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Botón Cerrar Sesión */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
        <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.versionNote}>
        UrbaCargo Móvil v1.0.0 • Riohacha, La Guajira
      </Text>
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
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    ...Shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#10B981',
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#059669',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  userPhone: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  accountTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
    gap: 5,
  },
  accountTypePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  switchAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 4,
    gap: 4,
  },
  switchAccountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  academicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 14,
    ...Shadows.sm,
  },
  academicIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  academicTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#047857',
  },
  academicDegree: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    marginTop: 2,
  },
  academicCourse: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
    gap: 4,
  },
  studentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  impactCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    ...Shadows.md,
  },
  impactTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    padding: 12,
  },
  impactGridCol: {
    alignItems: 'center',
    flex: 1,
  },
  impactGridVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  impactGridLabel: {
    fontSize: 10,
    color: '#D1FAE5',
    marginTop: 2,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FEF3C7',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  prefTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  prefSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  prefDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  prefLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  prefLinkText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 14,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
  versionNote: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 10,
  },
});
