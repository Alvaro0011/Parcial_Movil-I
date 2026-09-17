import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../src/context/AuthContext';
import { AccountType } from '../src/types/cargo';
import { Colors, Shadows, Radius } from '../src/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loginWithPhone, loginQuickDemo } = useAuth();

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [accountType, setAccountType] = useState<AccountType>('PARTICULAR');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleAuth = () => {
    if (!phone.trim()) {
      showAlert(
        'Celular Requerido',
        'Por favor ingresa tu número de celular (ej: 300 123 4567).'
      );
      return;
    }

    if (!password.trim()) {
      showAlert(
        'Contraseña Requerida',
        'Por favor ingresa tu contraseña de acceso (ej: 123456).'
      );
      return;
    }

    if (!acceptTerms) {
      showAlert(
        'Términos Requeridos',
        'Debes aceptar los Términos de Servicio y la Política de Privacidad de Entregas Ecológicas para continuar.'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginWithPhone(phone, password, accountType);
      setLoading(false);
      if (res.success) {
        router.replace('/(tabs)');
      } else {
        showAlert('Acceso Denegado', res.message || 'Verifica tus datos de acceso.');
      }
    }, 300);
  };

  const fillAndLogin = (type: AccountType) => {
    if (type === 'PARTICULAR') {
      setPhone('300 123 4567');
      setPassword('123456');
      setAccountType('PARTICULAR');
      loginQuickDemo('PARTICULAR');
    } else {
      setPhone('315 987 6543');
      setPassword('123456');
      setAccountType('EMPRESA');
      loginQuickDemo('EMPRESA');
    }
    router.replace('/(tabs)');
  };

  const fillOnly = (type: AccountType) => {
    if (type === 'PARTICULAR') {
      setPhone('300 123 4567');
      setPassword('123456');
      setAccountType('PARTICULAR');
    } else {
      setPhone('315 987 6543');
      setPassword('123456');
      setAccountType('EMPRESA');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top + 16, 36), paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de Marca UrbaCargo */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadgeContainer}>
            <LinearGradient
              colors={['#10B981', '#047857']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons name="bicycle-cargo" size={36} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.lightningPill}>
              <Ionicons name="flash" size={13} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.brandTitle}>UrbaCargo</Text>
          <Text style={styles.brandTagline}>
            Mensajería Exprés y Micro-Logística Sostenible
          </Text>

          {/* Badge Eco Riohacha */}
          <View style={styles.cityPill}>
            <Ionicons name="leaf" size={13} color="#047857" />
            <Text style={styles.cityPillText}>Flota 100% Eléctrica Riohacha</Text>
          </View>
        </View>

        {/* Card Principal de Autenticación */}
        <View style={styles.mainCard}>
          {/* Segmento: Iniciar Sesión / Registrarse */}
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[styles.segmentBtn, authMode === 'LOGIN' && styles.segmentBtnActive]}
              onPress={() => setAuthMode('LOGIN')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentBtnText,
                  authMode === 'LOGIN' && styles.segmentBtnTextActive,
                ]}
              >
                Iniciar Sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segmentBtn, authMode === 'REGISTER' && styles.segmentBtnActive]}
              onPress={() => setAuthMode('REGISTER')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentBtnText,
                  authMode === 'REGISTER' && styles.segmentBtnTextActive,
                ]}
              >
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selector Tipo de Cuenta: Particular vs Empresa */}
          <Text style={styles.fieldLabel}>Tipo de Cuenta</Text>
          <View style={styles.accountTypeRow}>
            <TouchableOpacity
              style={[
                styles.accountTypeCard,
                accountType === 'PARTICULAR' && styles.accountTypeCardActive,
              ]}
              onPress={() => setAccountType('PARTICULAR')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.accountIconBox,
                  accountType === 'PARTICULAR' && styles.accountIconBoxActive,
                ]}
              >
                <Ionicons
                  name="person"
                  size={18}
                  color={accountType === 'PARTICULAR' ? '#FFFFFF' : '#64748B'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.accountTypeTitle,
                    accountType === 'PARTICULAR' && styles.accountTypeTitleActive,
                  ]}
                >
                  Particular
                </Text>
                <Text style={styles.accountTypeDesc}>Envíos personales</Text>
              </View>
              {accountType === 'PARTICULAR' && (
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.accountTypeCard,
                accountType === 'EMPRESA' && styles.accountTypeCardActive,
              ]}
              onPress={() => setAccountType('EMPRESA')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.accountIconBox,
                  accountType === 'EMPRESA' && styles.accountIconBoxActive,
                ]}
              >
                <Ionicons
                  name="business"
                  size={18}
                  color={accountType === 'EMPRESA' ? '#FFFFFF' : '#64748B'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.accountTypeTitle,
                    accountType === 'EMPRESA' && styles.accountTypeTitleActive,
                  ]}
                >
                  Empresa (B2B)
                </Text>
                <Text style={styles.accountTypeDesc}>Comercios y logística</Text>
              </View>
              {accountType === 'EMPRESA' && (
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
              )}
            </TouchableOpacity>
          </View>

          {/* Campo Nombre Completo si es Registro */}
          {authMode === 'REGISTER' && (
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                {accountType === 'PARTICULAR' ? 'Nombre Completo' : 'Razón Social / Empresa'}
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name={accountType === 'PARTICULAR' ? 'person-outline' : 'business-outline'}
                  size={20}
                  color="#64748B"
                  style={styles.inputIconLeft}
                />
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder={
                    accountType === 'PARTICULAR'
                      ? 'Ej. Álvaro José Gómez'
                      : 'Ej. Logística Verde La Guajira S.A.S.'
                  }
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          )}

          {/* Campo Número de Celular con Bandera de Colombia */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Número de Celular</Text>
            <View style={styles.inputContainer}>
              {/* Prefijo Colombia +57 con Tricolor */}
              <View style={styles.prefixContainer}>
                <View style={styles.flagBadge}>
                  <View style={[styles.flagStripe, { backgroundColor: '#FCD116', height: 6 }]} />
                  <View style={[styles.flagStripe, { backgroundColor: '#003893', height: 3 }]} />
                  <View style={[styles.flagStripe, { backgroundColor: '#CE1126', height: 3 }]} />
                </View>
                <Text style={styles.prefixText}>+57</Text>
              </View>

              <TextInput
                style={[styles.textInput, { paddingLeft: 8 }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="300 123 4567"
                placeholderTextColor="#94A3B8"
              />

              <Ionicons
                name="call-outline"
                size={18}
                color="#64748B"
                style={styles.inputIconRight}
              />
            </View>
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Contraseña</Text>
              {authMode === 'LOGIN' && (
                <TouchableOpacity
                  onPress={() =>
                    showAlert(
                      'Recuperación de Clave',
                      'Te enviaremos un SMS con código OTP a tu número celular registrado.'
                    )
                  }
                >
                  <Text style={styles.forgotLink}>¿Olvidaste tu clave?</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#64748B"
                style={styles.inputIconLeft}
              />
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.inputIconRightBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Checkbox Términos y Condiciones */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAcceptTerms(!acceptTerms)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
              {acceptTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              Acepto los <Text style={styles.termsHighlight}>Términos de Servicio</Text> y la{' '}
              <Text style={styles.termsHighlight}>
                Política de Micro-Logística Sostenible
              </Text>
              .
            </Text>
          </TouchableOpacity>

          {/* Botón Principal de Ingreso */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#059669', '#047857']}
              style={styles.primaryBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryBtnText}>
                {authMode === 'LOGIN' ? 'Ingresar a UrbaCargo' : 'Crear Cuenta Ecológica'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Separador de accesos rápidos */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Accesos rápidos de evaluación</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botones de Demo 1-Tap para el docente */}
          <View style={styles.demoButtonsContainer}>
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => fillAndLogin('PARTICULAR')}
              activeOpacity={0.7}
            >
              <View style={styles.demoIconBox}>
                <Ionicons name="person" size={16} color="#047857" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.demoBtnTitle}>Ingresar como Álvaro (Particular)</Text>
                <Text style={styles.demoBtnSub}>+57 300 123 4567 • 123456</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => fillAndLogin('EMPRESA')}
              activeOpacity={0.7}
            >
              <View style={[styles.demoIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="business" size={16} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.demoBtnTitle}>Ingresar como B2B (Empresa)</Text>
                <Text style={styles.demoBtnSub}>+57 315 987 6543 • 123456</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Atajos de solo rellenar formulario */}
            <View style={styles.fillOnlyRow}>
              <TouchableOpacity
                style={styles.fillOnlyBtn}
                onPress={() => fillOnly('PARTICULAR')}
              >
                <Ionicons name="create-outline" size={13} color="#047857" />
                <Text style={styles.fillOnlyText}>Llenar campos Particular</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fillOnlyBtn}
                onPress={() => fillOnly('EMPRESA')}
              >
                <Ionicons name="create-outline" size={13} color="#0284C7" />
                <Text style={[styles.fillOnlyText, { color: '#0284C7' }]}>Llenar campos B2B</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Accesos Biométricos y Alternativos */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => {
                showAlert(
                  'Acceso Biométrico',
                  'Autenticación biométrica exitosa con FaceID / Huella dactilar.'
                );
                fillAndLogin(accountType);
              }}
            >
              <Ionicons name="finger-print" size={20} color="#059669" />
              <Text style={styles.socialBtnText}>Biometría</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => fillAndLogin('PARTICULAR')}
            >
              <Ionicons name="logo-google" size={18} color="#EA4335" />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => fillAndLogin('PARTICULAR')}
            >
              <Ionicons name="logo-apple" size={18} color="#0F172A" />
              <Text style={styles.socialBtnText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner Sostenible Inferior */}
        <View style={styles.ecoBanner}>
          <View style={styles.ecoBannerIcon}>
            <Ionicons name="leaf" size={20} color="#047857" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.ecoBannerTitle}>Compromiso Cero Emisiones</Text>
            <Text style={styles.ecoBannerText}>
              Cada kilómetro en nuestra flota eléctrica ahorra hasta 180g de CO2 en el aire de
              Riohacha y La Guajira.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadgeContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  lightningPill: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#F59E0B',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    marginTop: 10,
    gap: 6,
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Shadows.sm,
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    color: '#047857',
    fontWeight: '800',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  accountTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  accountTypeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  accountTypeCardActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  accountIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountIconBoxActive: {
    backgroundColor: '#059669',
  },
  accountTypeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  accountTypeTitleActive: {
    color: '#047857',
  },
  accountTypeDesc: {
    fontSize: 10,
    color: '#64748B',
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
    gap: 6,
  },
  flagBadge: {
    width: 18,
    height: 12,
    borderRadius: 2,
    overflow: 'hidden',
  },
  flagStripe: {
    width: '100%',
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  inputIconLeft: {
    marginRight: 8,
  },
  inputIconRight: {
    marginLeft: 6,
  },
  inputIconRightBtn: {
    padding: 6,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  termsHighlight: {
    color: '#047857',
    fontWeight: '700',
  },
  primaryBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 6,
    ...Shadows.md,
  },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  demoButtonsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    borderRadius: 12,
    gap: 10,
  },
  demoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  demoBtnSub: {
    fontSize: 11,
    color: '#64748B',
  },
  fillOnlyRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  fillOnlyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  fillOnlyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  ecoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    ...Shadows.sm,
  },
  ecoBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ecoBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  ecoBannerText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 15,
  },
});
