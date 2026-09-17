import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../src/constants/colors';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.handle} />

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="bicycle-cargo" size={36} color="#047857" />
          </View>

          <Text style={styles.title}>UrbaCargo Riohacha</Text>
          <Text style={styles.sub}>
            Mensajería Exprés y Micro-Logística Sostenible
          </Text>

          {/* Academic Info */}
          <View style={styles.credsBox}>
            <Text style={styles.credsTitle}>Proyecto Parcial de Desarrollo Móvil</Text>
            <View style={styles.credRow}>
              <Ionicons name="person" size={14} color="#047857" />
              <Text style={styles.credLabel}>ESTUDIANTE:</Text>
              <Text style={styles.credValue}>Álvaro José Gómez</Text>
            </View>
            <View style={styles.credRow}>
              <Ionicons name="school" size={14} color="#047857" />
              <Text style={styles.credLabel}>UNIVERSIDAD:</Text>
              <Text style={styles.credValue}>Universidad de La Guajira</Text>
            </View>
            <View style={styles.credRow}>
              <Ionicons name="code-slash" size={14} color="#047857" />
              <Text style={styles.credLabel}>CARRERA:</Text>
              <Text style={styles.credValue}>Ingeniería de Sistemas</Text>
            </View>
          </View>

          {/* Flujo de Estados del Envío */}
          <View style={styles.statesBox}>
            <Text style={styles.statesTitle}>Ciclo de Vida de los Envíos Ecológicos</Text>
            <Text style={styles.statesText}>
              1. <Text style={styles.bold}>SOLICITADO</Text>: Cotización confirmada y búsqueda de mensajero.{'\n'}
              2. <Text style={styles.bold}>ASIGNADO</Text>: Mensajero eléctrico en camino a la dirección de recolección.{'\n'}
              3. <Text style={styles.bold}>EN TRÁNSITO</Text>: Paquete recogido y ruta GPS en vivo hacia el destino.{'\n'}
              4. <Text style={styles.bold}>ENTREGADO</Text>: Validación de PIN de entrega, comprobante y calificación.
            </Text>
          </View>

          {/* Flota Verde */}
          <View style={styles.statesBox}>
            <Text style={styles.statesTitle}>Flota 100% Cero Emisiones</Text>
            <Text style={styles.statesText}>
              • <Text style={styles.bold}>Eco-Bici Cargo</Text>: Hasta 20 kg, ideal zona centro e histórico.{'\n'}
              • <Text style={styles.bold}>Moto Eléctrica</Text>: Hasta 35 kg, mayor radio urbano en Riohacha.{'\n'}
              • <Text style={styles.bold}>Micro-Van Eléctrica</Text>: Carga B2B hasta 150 kg para empresas.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.closeBtnText}>Entendido, Volver a la App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 36,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  credsBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: Radius.md,
    padding: 12,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 6,
  },
  credsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 2,
  },
  credRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  credLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  credValue: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  statesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.md,
    padding: 12,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  statesText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
