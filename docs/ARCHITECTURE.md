# TimeWeave - Arquitectura Frontend

> **Patrón**: Feature-Based Architecture (Arquitectura por Características)
> **Stack**: React 18 + Vite + TypeScript + TailwindCSS

---

## Estructura de Carpetas

```
src/
├── features/              # 🎯 Características principales (Dominios de negocio)
│   ├── auth/             # Autenticación y onboarding
│   │   ├── components/   # LoginForm, RegisterForm, ChronotypeQuiz
│   │   ├── hooks/        # useAuth, useSignIn, useSignUp
│   │   └── utils/        # validateEmail, authErrors
│   │
│   ├── calendar/         # Vista de calendario semanal
│   │   ├── components/   # WeeklyGrid, DayColumn, TimeSlot
│   │   ├── hooks/        # useCalendarView, useDragAndDrop
│   │   └── utils/        # dateFormatters, gridCalculations
│   │
│   ├── events/           # Gestión de eventos (CRUD)
│   │   ├── components/   # EventForm, EventCard, EventList, RecurrenceModal
│   │   ├── hooks/        # useEvents, useCreateEvent, useEventValidation
│   │   └── utils/        # eventValidation, conflictDetection
│   │
│   ├── sleep/            # Tracking y optimización de sueño
│   │   ├── components/   # SleepDashboard, BedtimeAlert, SleepCycleChart
│   │   ├── hooks/        # useSleepCalculator, useSleepLogs
│   │   └── utils/        # sleepMetrics
│   │
│   ├── study-tracker/    # Técnicas de estudio (Pomodoro, Feynman, etc.)
│   │   ├── components/   # PomodoroTimer, ActiveRecallPrompt, StudyToolkitModal
│   │   ├── hooks/        # usePomodoro, useStudySession
│   │   └── utils/        # pomodoroLogic, studyStats
│   │
│   ├── suggestions/      # Algoritmo de sugerencias de slots
│   │   ├── components/   # SuggestionCard, SuggestionsPanel
│   │   ├── hooks/        # useSuggestions, useSlotRecommendations
│   │   └── utils/        # scoringAlgorithm
│   │
│   └── wind-down/        # Modo desintoxicación digital
│       ├── components/   # WindDownBanner, NightRitualChecklist
│       ├── hooks/        # useWindDown, useBluelightMode
│       └── utils/        # windDownTrigger
│
├── core/                 # 🧠 Lógica de negocio pura (Business Logic)
│   ├── bio-algorithms/   # Algoritmos bio-psicológicos
│   │   ├── chronotypes.ts          # Detección y cálculo de cronotipos
│   │   ├── sleep-cycles.ts         # Cálculo de ciclos de 90min (RN-12)
│   │   ├── ultradian-rhythms.ts    # Bloques de 90min de estudio (RN-11)
│   │   ├── energy-valleys.ts       # Detección de afternoon dip (RN-13)
│   │   └── homeostatic-pressure.ts # Tracking de adenosina (RN-14)
│   │
│   ├── types/            # TypeScript interfaces globales
│   │   ├── user.types.ts
│   │   ├── event.types.ts
│   │   ├── sleep.types.ts
│   │   └── index.ts
│   │
│   └── constants/        # Configuraciones inmutables
│       ├── chronotype-configs.ts  # Ventanas óptimas por cronotipo
│       ├── study-techniques.ts    # Configuración de Pomodoro, etc.
│       └── validation-rules.ts    # Reglas de negocio (RN-1 a RN-15)
│
├── components/           # 🎨 UI Components (Reutilizables y "tontos")
│   └── ui/               # Componentes de diseño sin lógica
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Alert.tsx
│       └── index.ts      # Barrel export
│
├── services/             # 🔌 Capa de servicios externos (Backend/API)
│   └── firebase/
│       ├── config.ts     # Firebase init (API keys, etc.)
│       ├── auth.service.ts
│       ├── events.service.ts
│       ├── users.service.ts
│       ├── sleep-logs.service.ts
│       └── index.ts
│
├── layouts/              # 📐 Estructuras de página
│   ├── MainLayout.tsx    # Layout principal (Sidebar + Header + Content)
│   ├── AuthLayout.tsx    # Layout para login/register (centrado, sin nav)
│   └── index.ts
│
├── hooks/                # 🪝 Custom Hooks globales (cross-cutting)
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useNotifications.ts
│
├── lib/                  # 🛠️ Utilidades globales (helpers puros)
│   ├── date-utils.ts     # Formateo de fechas (date-fns wrappers)
│   ├── validation.ts     # Funciones de validación genéricas
│   ├── cn.ts             # clsx + tailwind-merge
│   └── firebase-errors.ts
│
├── assets/               # 🖼️ Recursos estáticos
│   ├── images/
│   └── icons/
│
├── App.tsx               # Root component (Router principal)
├── main.tsx              # Entry point (React DOM render)
└── index.css             # Tailwind directives + estilos globales
```

---

## Principios de Diseño

### 1. **Feature-Based Architecture (FBA)**
- **Por qué**: Escalabilidad horizontal. Cada feature es un módulo autónomo.
- **Beneficio**: 
  - Fácil onboarding de nuevos devs (todo lo de "auth" está en `/features/auth`).
  - Evita "God folders" como `/components` con 100+ archivos.
  - Permite tree-shaking eficiente (Vite solo empaqueta lo usado).

### 2. **Separation of Concerns (SoC)**
```
UI Layer          → /features/*/components (React components)
Logic Layer       → /features/*/hooks + /core/bio-algorithms (Business logic)
Data Layer        → /services/firebase (API calls)
Shared Utilities  → /lib, /hooks (Pure functions)
```

### 3. **Colocación de Código (Colocation)**
- **Regla**: "El código que cambia junto, vive junto".
- **Ejemplo**: `EventForm.tsx` usa `useEventValidation.ts` → ambos en `/features/events`.
- **Excepción**: Si 3+ features usan el mismo hook, elevarlo a `/hooks` global.

### 4. **Core vs Features**
| `/core` | `/features` |
|---------|-------------|
| Lógica pura (sin React) | Componentes + Hooks React |
| Testeable sin DOM | Depende de contexto UI |
| Algoritmos matemáticos | Interacción usuario |
| **Ejemplo**: `calculateSleepCycles()` | **Ejemplo**: `<SleepDashboard />` |

---

## Flujo de Datos

### Ejemplo: Usuario crea un evento de estudio

```typescript
// 1. USER ACTION (UI Layer)
<EventForm onSubmit={handleCreate} />

// 2. FEATURE HOOK (Logic Layer)
const { createEvent } = useCreateEvent(); // en /features/events/hooks

function handleCreate(eventData: EventInput) {
  // 3. VALIDACIÓN con Core Logic
  const conflicts = detectConflicts(eventData, existingEvents); // /features/events/utils
  
  if (conflicts.length > 0) {
    showAlert("Conflicto detectado"); // Regla RN-1
    return;
  }
  
  // 4. ALGORITMO BIO-PSICOLÓGICO (Core Layer)
  if (eventData.type === "study") {
    const { durationMinutes } = eventData;
    if (durationMinutes > 90) {
      // Regla RN-11: Ritmos Ultradianos
      suggestBlockSplit(); // /core/bio-algorithms/ultradian-rhythms.ts
    }
  }
  
  // 5. LLAMADA A SERVICIO (Data Layer)
  await EventsService.create(eventData); // /services/firebase/events.service.ts
  
  // 6. ACTUALIZACIÓN LOCAL (Optimistic UI)
  queryClient.invalidateQueries(['events']);
}
```

---

## Nomenclatura de Archivos

### Componentes React
- **PascalCase**: `EventCard.tsx`, `WeeklyGrid.tsx`
- **Sufijo opcional**: `.component.tsx` si hay ambigüedad (ej: `auth.service.ts` vs `Auth.component.tsx`)

### Hooks Personalizados
- **camelCase con prefijo "use"**: `useAuth.ts`, `useSleepCalculator.ts`
- **Un hook por archivo** (evitar `hooks/index.ts` con 20 hooks)

### Utilidades/Helpers
- **kebab-case**: `date-utils.ts`, `sleep-cycles.ts`
- **Funciones puras** (sin side effects)

### Servicios
- **kebab-case + sufijo ".service"**: `auth.service.ts`, `events.service.ts`
- **Pattern**: Un servicio por entidad de datos

### Tipos TypeScript
- **kebab-case + sufijo ".types"**: `user.types.ts`, `event.types.ts`
- **Interfaces en PascalCase**: `User`, `Event`, `SleepLog`

---

## Reglas de Importación

### Orden de imports (ESLint enforced)
```typescript
// 1. Externos (React, bibliotecas)
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// 2. Aliases (@/ paths)
import { Button, Modal } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks';
import { calculateSleepCycles } from '@/core/bio-algorithms/sleep-cycles';

// 3. Relativos (mismo feature)
import { EventCard } from './components/EventCard';
import { useEventValidation } from './hooks/useEventValidation';

// 4. Tipos
import type { Event, User } from '@/core/types';

// 5. Estilos (si no es Tailwind)
import './styles.css';
```

### Path Aliases (Vite config)
```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': '/src',
    '@features': '/src/features',
    '@core': '/src/core',
    '@components': '/src/components',
    '@services': '/src/services',
  }
}
```

---

## Gestión de Estado

### Estado Local (Component State)
- **Cuándo**: UI temporal (modal abierto/cerrado, input value)
- **Herramienta**: `useState`, `useReducer`

### Estado de Feature (Feature State)
- **Cuándo**: Compartido entre componentes de la misma feature
- **Herramienta**: Context API (ej: `AuthContext`, `CalendarContext`)
- **Ubicación**: `/features/auth/context/AuthContext.tsx`

### Estado Global (Application State)
- **Cuándo**: Datos del usuario, configuración, notificaciones
- **Herramienta**: Zustand (ligero, sin boilerplate)
- **Ubicación**: `/store/useUserStore.ts`, `/store/useNotificationStore.ts`

### Estado del Servidor (Server State)
- **Cuándo**: Datos de Firebase (eventos, logs de sueño)
- **Herramienta**: React Query (TanStack Query)
- **Beneficios**: Cache automático, invalidación, optimistic updates

```typescript
// Ejemplo: Hook de eventos usando React Query
export function useEvents() {
  return useQuery({
    queryKey: ['events', userId],
    queryFn: () => EventsService.getAll(userId),
    staleTime: 5 * 60 * 1000, // Cache 5 min
  });
}
```

---

## Mapping de Features a Funcionalidades del PRD

| Feature Folder | Funcionalidades PRD |
|----------------|---------------------|
| `/auth` | F1.1: Autenticación Básica |
| `/events` | F1.2: CRUD de Eventos (bloques fijos/flexibles) |
| `/calendar` | F1.3: Vista de Calendario Semanal |
| `/sleep` | F2.1: Algoritmo de Sugerencia de Sueño, RN-12 (ciclos) |
| `/suggestions` | F2.2: Recomendador de Slots de Estudio |
| `/study-tracker` | F2.7: Study Toolkit (Pomodoro, Active Recall, Feynman) |
| `/wind-down` | F2.6: Modo Desintoxicación Digital, RN-15 |
| `/core/bio-algorithms` | RN-11 a RN-15: Lógica bio-psicológica |

---

## Testing Strategy

### Unit Tests (Vitest)
- **Target**: `/core/bio-algorithms`, `/lib`, `/features/*/utils`
- **Ejemplo**: 
  ```typescript
  // core/bio-algorithms/sleep-cycles.test.ts
  describe('calculateOptimalBedtime', () => {
    it('sugiere 21:00 para despertar a 06:00 (6 ciclos)', () => {
      const bedtime = calculateOptimalBedtime('06:00', 6);
      expect(bedtime).toBe('21:00');
    });
  });
  ```

### Integration Tests (React Testing Library)
- **Target**: `/features/*/components` (componentes que usan hooks)
- **Ejemplo**: `EventForm.test.tsx` → validar que muestra error en conflicto

### E2E Tests (Playwright)
- **Target**: Flujos críticos (registro → crear evento → ver calendario)

---

## Performance Optimizations

### Code Splitting
```typescript
// App.tsx - Lazy loading de features
const Calendar = lazy(() => import('@/features/calendar/Calendar'));
const StudyTracker = lazy(() => import('@/features/study-tracker/StudyTracker'));
```

### Memoization
- **Components**: `React.memo()` para componentes pesados (`WeeklyGrid`)
- **Values**: `useMemo()` para cálculos costosos (algoritmo de sugerencias)
- **Callbacks**: `useCallback()` para funciones pasadas como props

### Bundle Size
- **Tree-shaking**: Importar solo funciones necesarias (`import { format } from 'date-fns/format'`)
- **Dynamic imports**: Cargar features bajo demanda
- **Vite chunks**: Configurar `manualChunks` para vendor splitting

---

## Seguridad

### Firebase Security Rules
```javascript
// firestore.rules
match /events/{eventId} {
  allow read, write: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}
```

### Environment Variables
```env
# .env.local (NO subir a git)
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
```

### XSS Prevention
- **Sanitización**: Usar DOMPurify para contenido HTML de usuario
- **Content Security Policy**: Headers en `index.html`

---

## Próximos Pasos (Implementación)

### Sprint 1: Foundation (Semana 1)
1. ✅ Setup Vite + TailwindCSS + TypeScript
2. ✅ Configurar Firebase Auth + Firestore
3. ✅ Implementar `/core/types` (interfaces)
4. ✅ Crear componentes UI base (`/components/ui`)

### Sprint 2: Auth + Core (Semana 2)
1. Implementar `/features/auth` (login/register)
2. Desarrollar `/core/bio-algorithms/chronotypes.ts`
3. Crear onboarding de cronotipo

### Sprint 3: Calendar + Events (Semana 3-4)
1. Implementar `/features/events` (CRUD completo)
2. Desarrollar `/features/calendar` (vista semanal)
3. Integrar algoritmo de detección de conflictos (RN-1)

---

**Documento creado**: 2 de febrero de 2026  
**Versión**: 1.0  
**Autor**: Senior React Software Architect  
**Estado**: Aprobado para implementación
