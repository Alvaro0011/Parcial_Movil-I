# UrbaCargo: Mensajería Exprés y Micro-Logística Sostenible

Aplicación móvil desarrollada para el **Parcial Práctico de Desarrollo de Aplicaciones Móviles** en la **Universidad de La Guajira**, Facultad de Ingeniería, Programa de Ingeniería de Sistemas.

**Estudiante:** Álvaro José Gómez  
**Ubicación de Operación:** Riohacha, La Guajira  
**Tecnologías:** React Native, Expo SDK 57, TypeScript, Expo Router, React Native SVG, Vector Icons, Linear Gradient, Image Picker.

---

## 1. Visión y Propósito del Proyecto

**UrbaCargo** es una plataforma de mensajería exprés y micro-logística urbana sostenible. Su objetivo es optimizar los envíos dentro de Riohacha utilizando una **flota 100% eléctrica y ecológica** (Eco-Bicis de carga asistida, Motos eléctricas Super Soco y Micro-Vans de reparto).

La plataforma permite:
1. **Cotizar y solicitar envíos** calculando distancias, tiempos y ahorro de emisiones de CO2 en tiempo real.
2. **Seguimiento GPS interactivo** con mapa SVG urbano de Riohacha, visualización de ruta y progreso en 4 fases.
3. **Simulación paso a paso** para demostración y evaluación docente del estado del envío.
4. **Chat en vivo** con el mensajero ecológico asignado con respuestas simuladas automáticas.
5. **Comprobante digital de entrega** con código de barras, desglose de costos, certificado verde y sistema interactivo de calificación por estrellas.
6. **Doble rol de usuario** (Particular y Empresa B2B) con autenticación por número de celular (+57 Colombia).

---

## 2. Pantallas de la Aplicación

| Pantalla | Archivo | Descripción |
| :--- | :--- | :--- |
| **Inicio de Sesión** | `app/login.tsx` | Identidad UrbaCargo (paleta verde esmeralda `#047857`), selector Particular vs Empresa B2B, prefijo celular Colombia `+57`, contraseña con toggle, checkbox de términos, botones de demo 1-tap y acceso biométrico. |
| **Dashboard / Inicio** | `app/(tabs)/index.tsx` | Tarjeta de impacto ambiental (CO2 ahorrado, km limpios, entregas), botón de acción rápida, listado de envíos en curso con acceso a rastreo, flota activa en Riohacha y catálogo de paquetes. |
| **Cotizador y Envío** | `app/nuevo-envio.tsx` | Selector de puntos en Riohacha (Centro, San Martín, Malecón, CC Viva, Uniguajira), tipo de paquete (Documentos, Paquete Chico, Carga Mediana, Alimentos), selección de vehículo eléctrico, cotización dinámica en COP y cálculo de CO2 evitado. |
| **Rastreo GPS en Vivo** | `app/seguimiento/[id].tsx` | Mapa interactivo de Riohacha en SVG con origen, destino y mensajero en movimiento, stepper de 4 fases, botón de simulación de avance para evaluación, tarjeta de mensajero y llamadas/chat. |
| **Chat con Mensajero** | `app/chat/[id].tsx` | Conversación interactiva con respuestas rápidas sugeridas y respuestas simuladas del mensajero. |
| **Comprobante y Calificación** | `app/resumen-envio.tsx` | Tique digital con código de barras, desglose de tarifa, incentivo verde, certificado de ahorro de CO2 y sistema de 5 estrellas con etiquetas de retroalimentación. |
| **Historial de Envíos** | `app/(tabs)/envios.tsx` | Pestañas de filtrado (Todos, En Curso, Entregados), barra de búsqueda en tiempo real, códigos de tracking y accesos directos. |
| **Perfil Ecológico** | `app/(tabs)/perfil.tsx` | Datos del estudiante Álvaro José Gómez, Uniguajira, selector de avatar mediante `expo-image-picker`, estadísticas acumuladas y cierre de sesión. |

---

## 3. Credenciales de Evaluación y Acceso Rápido

Para facilitar la calificación al docente, la pantalla de login cuenta con botones de acceso directo:

### Perfil Particular (Álvaro José Gómez)
- **Celular:** `300 123 4567` (o `+57 300 123 4567`)
- **Contraseña:** `123456`
- **Enfoque:** Envíos personales, compras locales y documentos en Riohacha.

### Perfil Empresa B2B (Logística Guajira S.A.S.)
- **Celular:** `315 987 6543` (o `+57 315 987 6543`)
- **Contraseña:** `123456`
- **Enfoque:** Distribución urbana de suministros comerciales y micro-vans.

---

## 4. Guía de Ejecución

Desde la carpeta raíz del proyecto:

```bash
# 1. Instalar dependencias si no estuvieran instaladas
npm install

# 2. Comprobación estricta de TypeScript (0 errores)
npx tsc --noEmit

# 3. Iniciar el servidor Expo
npx expo start
```

### Opciones de visualización:
- **Navegador Web:** Presionar `w` en la consola de Expo.
- **Dispositivo Físico (Android/iOS):** Escanear el código QR con la aplicación **Expo Go**.
- **Emulador Android:** Presionar `a` con Android Studio ejecutándose.

---

## 5. Lineamientos Estéticos y de Diseño

- **Iconografía Profesional:** Cumpliendo con el requerimiento de no emplear emojis de texto, todos los elementos visuales utilizan `@expo/vector-icons` (`Ionicons`, `MaterialCommunityIcons`, `FontAwesome6`) y gráficos vectoriales nativos en SVG.
- **Paleta de Color Ecológica:**
  - Primario: `#047857` (Verde Esmeralda Profundo)
  - Acento: `#10B981` (Verde Esmeralda Claro)
  - Energético: `#F59E0B` (Ámbar) y `#0284C7` (Azul Eléctrico)
  - Superficies: `#FFFFFF` y `#F8FAFC` con sombras suaves y bordes de alta definición.
