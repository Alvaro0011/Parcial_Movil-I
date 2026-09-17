import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, G, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useCargo } from '../src/context/CargoContext';
import { Shadows } from '../src/constants/colors';

export default function ResumenEnvioScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shipments, getShipmentById, rateShipment } = useCargo();

  // Buscar el envío indicado o el último completado / activo
  const targetId = id || shipments.find((s) => s.status === 'ENTREGADO')?.id || shipments[0]?.id;
  const shipment = getShipmentById(targetId);

  const [rating, setRating] = useState(shipment?.rating || 5);
  const [comment, setComment] = useState(shipment?.ratingComment || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    shipment?.ratingTags || ['Puntualidad', '100% Ecológico']
  );
  const [isSubmitted, setIsSubmitted] = useState(!!shipment?.ratingComment);

  if (!shipment) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No hay envío seleccionado.</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.backBtnText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const feedbackTags = [
    'Puntualidad',
    '100% Ecológico',
    'Cuidado del Paquete',
    'Excelente Trato',
    'Conducción Segura',
    'Ruta Óptima',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitRating = () => {
    rateShipment(shipment.id, rating, comment, selectedTags);
    setIsSubmitted(true);
    Alert.alert(
      '¡Calificación Guardada!',
      'Muchas gracias por valorar a nuestro mensajero y apoyar la movilidad limpia en Riohacha.'
    );
  };

  const handleShareReceipt = async () => {
    try {
      await Share.share({
        message: `Comprobante Digital UrbaCargo\nEnvío: ${shipment.trackingCode}\nEstado: ${shipment.status}\nOrigen: ${shipment.originAddress}\nDestino: ${shipment.destinationAddress}\nAhorro CO2: ${shipment.co2SavedKg} kg\nTotal: $${shipment.cost.toLocaleString('es-CO')} COP\n¡Movilidad sostenible en Riohacha!`,
      });
    } catch (error) {
      console.log('Error compartiendo comprobante:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Tique / Comprobante Digital con Borde Perforado */}
      <View style={styles.receiptCard}>
        {/* Cabecera del Comprobante */}
        <View style={styles.receiptHeader}>
          <View style={styles.receiptLogoBox}>
            <MaterialCommunityIcons name="bicycle-cargo" size={24} color="#047857" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.receiptBrandTitle}>UrbaCargo Colombia</Text>
            <Text style={styles.receiptBrandSub}>
              Comprobante Oficial de Micro-Logística
            </Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#047857" />
            <Text style={styles.verifiedText}>Verificado</Text>
          </View>
        </View>

        {/* Código de barras simulado en SVG */}
        <View style={styles.barcodeWrapper}>
          <Svg width="100%" height={36}>
            {[
              4, 12, 18, 26, 32, 44, 52, 58, 68, 76, 82, 94, 106, 114, 122,
              134, 142, 150, 162, 170, 182, 190, 202, 214, 222, 230, 242,
              250, 258, 270, 280, 290,
            ].map((x, i) => (
              <Line
                key={i}
                x1={x}
                y1={4}
                x2={x}
                y2={32}
                stroke="#0F172A"
                strokeWidth={i % 3 === 0 ? 3 : 1.5}
              />
            ))}
          </Svg>
          <Text style={styles.barcodeText}>{shipment.trackingCode} • PIN {shipment.securityPin}</Text>
        </View>

        {/* Línea divisoria punteada */}
        <View style={styles.dottedDivider} />

        {/* Datos Principales del Envío */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>REMITENTE</Text>
            <Text style={styles.infoValue}>{shipment.senderName}</Text>
            <Text style={styles.infoSub}>{shipment.senderPhone}</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>DESTINATARIO</Text>
            <Text style={styles.infoValue}>{shipment.recipientName}</Text>
            <Text style={styles.infoSub}>{shipment.recipientPhone}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>DIRECCIÓN ORIGEN</Text>
            <Text style={styles.infoValue} numberOfLines={2}>{shipment.originAddress}</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>DIRECCIÓN DESTINO</Text>
            <Text style={styles.infoValue} numberOfLines={2}>{shipment.destinationAddress}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>VEHÍCULO FLOTA LIMPIA</Text>
            <Text style={styles.infoValue}>{shipment.driver?.vehicleName || 'Eco-Bici Cargo'}</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>MENSAJERO</Text>
            <Text style={styles.infoValue}>{shipment.driver?.name || 'Mateo Quintero'}</Text>
          </View>
        </View>

        <View style={styles.dottedDivider} />

        {/* Desglose Financiero */}
        <View style={styles.costBreakdown}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Distancia Recorrida</Text>
            <Text style={styles.costVal}>{shipment.distanceKm} km</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Tarifa Base y Kilometraje</Text>
            <Text style={styles.costVal}>${(shipment.cost + 1000).toLocaleString('es-CO')} COP</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.ecoDiscountLabel}>Incentivo Huella Verde</Text>
            <Text style={styles.ecoDiscountVal}>-$1.000 COP</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Pagado</Text>
            <Text style={styles.totalAmount}>${shipment.cost.toLocaleString('es-CO')} COP</Text>
          </View>
        </View>

        {/* Certificado de Ahorro Ambiental Verde */}
        <View style={styles.greenCertCard}>
          <View style={styles.greenCertIcon}>
            <Ionicons name="leaf" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.greenCertTitle}>Certificado de Cero Emisiones</Text>
            <Text style={styles.greenCertText}>
              Este despacho ahorró <Text style={{ fontWeight: '800' }}>{shipment.co2SavedKg} kg de CO2</Text> en Riohacha gracias a nuestra flota 100% eléctrica.
            </Text>
          </View>
        </View>

        {/* Botón de Compartir */}
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShareReceipt}
          activeOpacity={0.7}
        >
          <Ionicons name="share-social-outline" size={16} color="#047857" />
          <Text style={styles.shareBtnText}>Compartir Comprobante</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de Calificación del Mensajero */}
      <View style={styles.ratingCard}>
        <View style={styles.ratingHeader}>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.ratingCardTitle}>Califica tu Experiencia</Text>
        </View>
        <Text style={styles.ratingSub}>
          ¿Cómo fue el servicio de {shipment.driver?.name || 'tu mensajero'}?
        </Text>

        {/* Selector interactivo de 5 estrellas */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setRating(s)}
              style={styles.starBtn}
              activeOpacity={0.7}
            >
              <Ionicons
                name={s <= rating ? 'star' : 'star-outline'}
                size={32}
                color="#F59E0B"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Etiquetas Rápidas de Retroalimentación */}
        <Text style={styles.tagsTitle}>Aspectos destacados:</Text>
        <View style={styles.tagsContainer}>
          {feedbackTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, isSelected && styles.tagChipActive]}
                onPress={() => toggleTag(tag)}
              >
                <Ionicons
                  name={isSelected ? 'checkmark' : 'add'}
                  size={12}
                  color={isSelected ? '#047857' : '#64748B'}
                />
                <Text
                  style={[styles.tagText, isSelected && styles.tagTextActive]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Input de Comentarios */}
        <Text style={styles.commentLabel}>Comentario adicional:</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Escribe cómo fue la entrega o felicita al conductor..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
          value={comment}
          onChangeText={setComment}
        />

        {/* Botón Guardar Calificación */}
        <TouchableOpacity
          style={styles.submitRatingBtn}
          onPress={handleSubmitRating}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#059669', '#047857']}
            style={styles.submitRatingGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.submitRatingText}>
              {isSubmitted ? 'Actualizar Calificación' : 'Guardar Calificación'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Botón de Retorno al Inicio */}
      <TouchableOpacity
        style={styles.backToHomeBtn}
        onPress={() => router.replace('/(tabs)')}
      >
        <Ionicons name="home" size={16} color="#475569" />
        <Text style={styles.backToHomeText}>Volver al Panel Principal</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Shadows.md,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  receiptLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptBrandTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  receiptBrandSub: {
    fontSize: 11,
    color: '#64748B',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  barcodeWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  barcodeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1,
    marginTop: 4,
  },
  dottedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  infoSub: {
    fontSize: 10,
    color: '#64748B',
  },
  costBreakdown: {
    marginBottom: 12,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  costLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  costVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  ecoDiscountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  ecoDiscountVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857',
  },
  greenCertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#047857',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  greenCertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenCertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  greenCertText: {
    fontSize: 11,
    color: '#D1FAE5',
    marginTop: 2,
  },
  shareBtn: {
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
  shareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Shadows.sm,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  ratingSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
  },
  starBtn: {
    padding: 4,
  },
  tagsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  tagChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  tagText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  tagTextActive: {
    color: '#047857',
    fontWeight: '700',
  },
  commentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  commentInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  submitRatingBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitRatingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  submitRatingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  backToHomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  backToHomeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});
