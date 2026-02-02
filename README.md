# ⏰ TimeWeave - Optimizador Biológico para Estudiantes

> 🚀 **v1.0.0 Alpha** - MVP Completo

Un calendario inteligente que sincroniza tu agenda académica con tus ritmos biológicos naturales para maximizar tu rendimiento y bienestar.

---

## 🧬 ¿Qué es TimeWeave?

TimeWeave es una aplicación web que analiza tu **cronotipo** (León, Oso, Lobo, Delfín) y genera automáticamente sugerencias de estudio optimizadas para tus momentos de mayor energía mental. Basado en ciencia del sueño y ritmos ultradianos, te ayuda a estudiar más inteligentemente, no más duro.

### ✨ Features Clave

- **🤖 Auto-Scheduling Inteligente**: Algoritmo heurístico que detecta huecos libres y propone bloques de estudio en tus picos de energía
- **📊 Sincronización con Cronotipos**: 4 perfiles biológicos (León, Oso, Lobo, Delfín) con horarios peak personalizados
- **⏰ Calendario Pixel-Perfect**: Grid de 24 horas con alineación matemática exacta (CSS background + offset calibration)
- **🌙 Zonas de Sueño Inteligentes**: Respeta ciclos de 90 minutos y calcula bedtime óptimo
- **🎯 Vista Semanal Sticky**: Header que permanece visible al hacer scroll con indicador del día actual
- **⚡ Tiempo Real**: Línea roja actualizada cada minuto mostrando la hora exacta
- **✅ Gestión de Eventos**: CRUD completo (crear, editar, confirmar, eliminar) con modal intuitivo
- **🎨 UI Moderna**: TailwindCSS con gradientes, shadows, y transiciones suaves

---

## 🛠️ Tech Stack

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.3.1 | UI Library con hooks y context |
| **Vite** | 6.0.5 | Build tool con HMR ultrarrápido |
| **TailwindCSS** | 3.4.17 | Utility-first CSS framework |
| **Firebase** | 11.1.0 | Authentication (Google OAuth) + Firestore DB |
| **date-fns** | 4.1.0 | Manipulación de fechas y zonas horarias |
| **React Router** | 7.1.1 | Client-side routing |
| **Lucide React** | 0.469.0 | Icon library moderna |

---

## 🚀 Instalación Local

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta de Firebase (gratuita)
- Git

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Caspian258/typeschedule.git
   cd typeschedule
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase** ⚠️ **CRÍTICO**
   
   Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Firebase:
   
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```
   
   > 📝 **Nota**: Estos valores se obtienen de la consola de Firebase → Project Settings → General → Your apps → SDK setup and configuration

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   
   La app estará disponible en `http://localhost:5173`

5. **Build para producción**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📁 Arquitectura del Proyecto

```
src/
├── core/
│   ├── bio-algorithms/     # Algoritmos de scheduling + cronotipos
│   └── router/             # Configuración de React Router
├── features/
│   ├── auth/               # Login con Google OAuth
│   ├── profile/            # Gestión de cronotipo y preferencias
│   ├── events/             # CRUD de eventos + Firestore sync
│   ├── calendar/           # Vista semanal + Grid system
│   │   ├── components/
│   │   │   ├── WeeklyView.jsx           # Grid principal con capas z-index
│   │   │   ├── EventCard.jsx            # Tarjeta de evento individual
│   │   │   ├── AddEventModal.jsx        # Modal CRUD
│   │   │   ├── CurrentTimeLine.jsx      # Línea roja de tiempo actual
│   │   │   └── CalendarControls.jsx     # Botón de auto-scheduling
│   │   ├── utils/
│   │   │   └── gridHelpers.js           # Cálculos de posicionamiento
│   │   └── constants.js                  # HOUR_HEIGHT, offsets, etc.
│   └── suggestions/        # Lógica de auto-scheduling
└── lib/                    # Utilidades (cn, firebase config)
```

---

## 🧬 Algoritmo de Scheduling

### Cronotipos Soportados

| Cronotipo | Horario Peak | Características |
|-----------|--------------|-----------------|
| 🦁 **León** | 08:00 - 12:00 | Madrugadores extremos, pico matutino |
| 🐻 **Oso** | 10:00 - 14:00 | Mayoría de la población, ritmo solar |
| 🐺 **Lobo** | 16:00 - 21:00 | Noctámbulos, creatividad vespertina |
| 🐬 **Delfín** | 10:00 - 12:00 | Sueño ligero, focus matutino corto |

### Heurística de Sugerencias

1. **Detección de Huecos**: Encuentra espacios libres ≥45 min entre eventos existentes
2. **Filtrado por Zona Peak**: Prioriza slots dentro del horario de pico de energía del cronotipo
3. **Respeto del Sueño**: Excluye automáticamente horarios dentro de la ventana de bedtime calculada
4. **Generación de Bloques**:
   - **Deep Focus**: 90 minutos (ciclo ultradiano completo) en horario peak
   - **Review Sessions**: 60 minutos fuera del horario peak
5. **Validación de Overlaps**: Verifica que no se superpongan con eventos confirmados

---

## 🎨 Características de UI/UX

### Grid System Avanzado

- **CSS Background Grid**: Líneas horizontales dibujadas con `linear-gradient` para evitar acumulación de borders
- **Header Sticky**: Permanece visible con `z-40` usando `position: sticky` dentro del scroll container
- **Offset Calibration**: Constantes `EVENT_OFFSET_Y` y `TIMELINE_OFFSET_Y` para alineación pixel-perfect
- **Layering z-index**:
  - z-0: Background grid lines (CSS)
  - z-10: Zonas de sueño/energía
  - z-20: Eventos
  - z-30: Timeline roja
  - z-40: Header sticky

### Responsive Design

- Grid adaptativo con `minmax(0, 1fr)` para evitar overflow horizontal
- Altura dinámica: `h-[calc(100vh-200px)]` ajustada al viewport
- Scroll suave con `scroll-smooth` y auto-scroll a hora de despertar

---

## 🔐 Seguridad

- ✅ `.env.local` en `.gitignore` (API keys nunca en el repo)
- ✅ Firebase Auth con Google OAuth (no passwords custom)
- ✅ Firestore Rules configuradas para acceso por userId
- ✅ HTTPS obligatorio en producción (Vercel)

---

## 🚢 Deployment en Vercel

1. **Conectar repositorio**: Importa desde GitHub en Vercel dashboard
2. **Variables de entorno**: Agrega las mismas keys de `.env.local` en Vercel → Project Settings → Environment Variables
3. **Build settings** (auto-detectadas):
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy**: Vercel hace build automático en cada push a `main`

> 📝 El archivo `vercel.json` ya está configurado para manejar React Router correctamente

---

## 📊 Estado del Proyecto

### ✅ Completado (v1.0.0 Alpha)

- [x] Autenticación con Google
- [x] Perfil de cronotipo y preferencias
- [x] CRUD completo de eventos
- [x] Calendario semanal con grid pixel-perfect
- [x] Auto-scheduling con algoritmo heurístico
- [x] Zonas de sueño y energía visualizadas
- [x] Timeline en tiempo real
- [x] Sincronización con Firestore
- [x] UI responsive y moderna

### 🔮 Roadmap (Futuras Versiones)

- [ ] Vista mensual y diaria
- [ ] Estadísticas de productividad
- [ ] Integración con Google Calendar
- [ ] Notificaciones push para sesiones de estudio
- [ ] Modo oscuro
- [ ] Exportar calendario a PDF/iCal
- [ ] Machine Learning para ajuste de algoritmo
- [ ] App móvil nativa (React Native)

---

## 🤝 Contribuir

Este proyecto es parte de un MVP académico. Pull requests son bienvenidos para:

- Reportes de bugs (Issues)
- Mejoras de performance
- Nuevos cronotipos o algoritmos
- Tests unitarios y E2E

### Guidelines

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m 'feat: descripción'` (Conventional Commits)
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Libre de usar para proyectos académicos y comerciales.

---

## 👨‍💻 Autor

**Caspian** - [GitHub](https://github.com/Caspian258)

---

## 🙏 Agradecimientos

- Investigación en cronobiología: Dr. Michael Breus (The Power of When)
- Algoritmos de scheduling: Principios de Operating Systems y CPU Scheduling
- Comunidad de React y Firebase por las excelentes librerías

---

**🎓 Construido con pasión para estudiantes que quieren optimizar su tiempo sin sacrificar su salud.**
