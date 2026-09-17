import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { CargoProvider } from '../src/context/CargoContext';
import { Colors } from '../src/constants/colors';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CargoProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: Colors.surface,
            },
            headerTintColor: Colors.primaryDark,
            headerTitleStyle: {
              fontWeight: '800',
              color: Colors.text,
              fontSize: 17,
            },
            headerShadowVisible: false,
          }}
        >
          {/* 1. Login y Registro UrbaCargo */}
          <Stack.Screen name="login" options={{ headerShown: false }} />

          {/* 2. Tabs principales (Dashboard, Envíos, Perfil) */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* 3. Nuevo Envío / Cotizador */}
          <Stack.Screen
            name="nuevo-envio"
            options={{
              headerShown: true,
              title: 'Nuevo Envío Ecológico',
              headerBackTitle: 'Atrás',
              headerTintColor: '#047857',
            }}
          />

          {/* 4. Seguimiento GPS en Tiempo Real */}
          <Stack.Screen
            name="seguimiento/[id]"
            options={{
              headerShown: true,
              title: 'Seguimiento en Vivo',
              headerBackTitle: 'Atrás',
              headerTintColor: '#047857',
            }}
          />

          {/* 5. Comprobante Digital y Calificación */}
          <Stack.Screen
            name="resumen-envio"
            options={{
              headerShown: true,
              title: 'Comprobante y Calificación',
              headerBackTitle: 'Atrás',
              headerTintColor: '#047857',
            }}
          />

          {/* 6. Chat en Vivo con el Mensajero */}
          <Stack.Screen
            name="chat/[id]"
            options={{
              headerShown: true,
              title: 'Chat con Mensajero',
              headerBackTitle: 'Atrás',
              headerTintColor: '#047857',
            }}
          />

          {/* Modal adicional */}
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Información del Sistema',
            }}
          />

          {/* 404 */}
          <Stack.Screen
            name="+not-found"
            options={{
              headerShown: true,
              title: 'Página no encontrada',
            }}
          />
        </Stack>
      </CargoProvider>
    </AuthProvider>
  );
}
