import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCargo } from '../../src/context/CargoContext';
import { Shadows } from '../../src/constants/colors';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getShipmentById, getChatMessages, sendMessage } = useCargo();

  const shipment = getShipmentById(id || 'URB-8492');
  const messages = getChatMessages(id || 'URB-8492');
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    '¿A cuántos minutos vienes?',
    'Estoy esperando en la portería',
    'El timbre está averiado',
    'Tengo el PIN de entrega listo',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendMessage(id || 'URB-8492', text);
    if (!textToSend) {
      setInputText('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header Info Bar */}
      <View style={styles.topInfoBar}>
        {shipment?.driver ? (
          <View style={styles.driverRow}>
            <Image
              source={{ uri: shipment.driver.avatar }}
              style={styles.driverAvatar}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.driverName}>{shipment.driver.name}</Text>
              <Text style={styles.driverVehicle}>
                {shipment.driver.vehicleName} • Flota Verde Activa
              </Text>
            </View>
            <View style={styles.batteryBadge}>
              <Ionicons name="battery-charging" size={12} color="#047857" />
              <Text style={styles.batteryText}>
                {shipment.driver.batteryPercent}%
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.driverName}>Chat de Soporte y Entrega</Text>
        )}
      </View>

      {/* Lista de Mensajes */}
      <ScrollView
        contentContainerStyle={[styles.messagesContainer, { paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de Cero Emisiones en Chat */}
        <View style={styles.ecoChatNotice}>
          <Ionicons name="leaf" size={14} color="#047857" />
          <Text style={styles.ecoChatNoticeText}>
            Canal directo con tu mensajero ecológico para el envío {id}.
          </Text>
        </View>

        {messages.map((msg) => {
          const isUser = msg.sender === 'USER';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageBubbleWrapper,
                isUser ? styles.msgWrapperUser : styles.msgWrapperDriver,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.msgBubbleUser : styles.msgBubbleDriver,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.msgTextUser : styles.msgTextDriver,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    isUser ? styles.msgTimeUser : styles.msgTimeDriver,
                  ]}
                >
                  {msg.timestamp}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Respuestas Rápidas Predefinidas */}
      <View style={styles.quickRepliesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {quickReplies.map((qr) => (
            <TouchableOpacity
              key={qr}
              style={styles.quickReplyChip}
              onPress={() => handleSend(qr)}
            >
              <Text style={styles.quickReplyText}>{qr}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input de Texto Inferior */}
      <View
        style={[
          styles.inputBarContainer,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TextInput
          style={styles.chatTextInput}
          placeholder="Escribe un mensaje al mensajero..."
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topInfoBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  driverName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  driverVehicle: {
    fontSize: 11,
    color: '#64748B',
  },
  batteryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  batteryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  messagesContainer: {
    padding: 16,
  },
  ecoChatNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 10,
    marginBottom: 16,
    gap: 6,
  },
  ecoChatNoticeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
  },
  messageBubbleWrapper: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  msgWrapperUser: {
    justifyContent: 'flex-end',
  },
  msgWrapperDriver: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    ...Shadows.sm,
  },
  msgBubbleUser: {
    backgroundColor: '#059669',
    borderBottomRightRadius: 4,
  },
  msgBubbleDriver: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  msgTextUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  msgTextDriver: {
    color: '#0F172A',
    fontWeight: '500',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgTimeUser: {
    color: '#A7F3D0',
  },
  msgTimeDriver: {
    color: '#94A3B8',
  },
  quickRepliesSection: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  quickReplyChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickReplyText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  inputBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 42,
    fontSize: 13,
    color: '#0F172A',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
});
