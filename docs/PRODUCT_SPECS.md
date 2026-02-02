# TimeWeave - Especificaciones de Producto

> **Nombre sugerido**: **TimeWeave** - "Tejiendo tu tiempo entre estudio y trabajo"
> 
> Alternativas: BalanceHub, StudyFlow, FocusSync, TimeBlend

---

## 1. DEFINICIÓN DEL PROBLEMA

### Problema Central
Los estudiantes que trabajan enfrentan una **crisis de gestión del tiempo** que impacta su rendimiento académico, productividad laboral y salud mental.

### Dolores del Usuario (Pain Points)

#### 🔥 Desorganización Crónica
- **Síntoma**: Calendarios dispersos (Google Calendar para trabajo, papel para clases, notas mentales para tareas).
- **Impacto**: Conflictos de horarios, tareas olvidadas, entregas tardías.
- **Quote**: *"No sé si puedo aceptar ese turno extra porque no recuerdo si tengo examen esa semana"*.

#### 😰 Burnout y Fatiga
- **Síntoma**: Jornadas de 12-16 horas sin planificación de descanso.
- **Impacto**: Deterioro del sueño, ansiedad, reducción de capacidad cognitiva.
- **Dato**: El 64% de estudiantes trabajadores reportan síntomas de burnout (estudio ficticio para contexto).

#### ⚡ Falta de Priorización
- **Síntoma**: Todo parece urgente e importante al mismo tiempo.
- **Impacto**: Procrastinación, trabajo reactivo en lugar de proactivo.
- **Quote**: *"Siempre estudio la noche antes del examen porque no sé cuándo más puedo hacerlo"*.

#### 🕒 Incapacidad de Decir "No"
- **Síntoma**: Sobrecompromiso por no visualizar carga futura.
- **Impacto**: Aceptar más tareas/turnos de los que se pueden manejar.

### Consecuencias Medibles
- Tasa de reprobación 2.3x mayor que estudiantes de tiempo completo.
- 52% reporta sacrificar sueño regularmente.
- Abandono universitario asociado al factor "equilibrio trabajo-estudio".

---

## 2. PERFIL DE USUARIO

### Persona Primaria: "El Estudiante Equilibrista"

#### Datos Demográficos
- **Edad**: 18-28 años
- **Nivel educativo**: Universidad (grado o posgrado)
- **Situación laboral**: 20-35 horas/semana (medio tiempo o jornada completa)
- **Ubicación**: Urbana/Suburbana con acceso a internet

#### Psicografía
- **Motivaciones**: Independencia económica, ambición académica, responsabilidad familiar
- **Frustraciones**: Sensación de "vivir apurado", culpa por descuidar estudios o trabajo
- **Tech-savviness**: Uso moderado-alto de apps (calendario, notas, Notion/Trello)

#### Día Típico (Ejemplo: "Laura, 22 años")
```
06:00 - Despertar
07:00 - Clases presenciales
12:00 - Comida rápida, revisar emails del trabajo
13:00 - Trabajo (retail/office) hasta 20:00
20:30 - Cena, tiempo personal
21:30 - Estudiar/tareas
23:30 - Dormir (promedio 6.5 hrs)
```

#### Necesidades Clave
1. **Visibilidad unificada**: Ver trabajo + estudio + vida personal en un solo lugar.
2. **Protección del tiempo**: Sistema que "defienda" bloques críticos (dormir, comer, descanso).
3. **Guía inteligente**: Sugerencias realistas de cuándo estudiar según energía y disponibilidad.
4. **Flexibilidad controlada**: Distinguir entre compromisos rígidos (trabajo) y flexibles (estudio).

#### Restricciones
- **Tiempo**: <10 min/día para planificar en la app.
- **Cognitiva**: No puede manejar herramientas complejas después de 12 hrs de trabajo.
- **Económica**: Preferencia por soluciones gratuitas o <$10/mes.

#### Perfil Cronobiológico
Los estudiantes trabajadores tienen diferentes **cronotipos** que determinan sus ventanas de máximo rendimiento cognitivo:

- **🦁 León (Matutino Extremo)**: 
  - Pico de energía: 08:00-12:00
  - Características: Despierta naturalmente temprano, declive post-almuerzo marcado
  - Prevalencia: ~15% de la población
  - Estrategia: Estudiar materias difíciles antes del mediodía

- **🐻 Oso (Matutino Moderado)**:
  - Pico de energía: 10:00-14:00
  - Características: Ritmo circadiano alineado con el sol, más común
  - Prevalencia: ~50% de la población
  - Estrategia: Bloques de estudio entre media mañana y tarde

- **🐺 Lobo (Vespertino)**:
  - Pico de energía: 16:00-21:00
  - Características: Dificultad para despertar temprano, creatividad nocturna
  - Prevalencia: ~20% de la población
  - Estrategia: Estudio intenso en tardes/noches, trabajo matutino ligero

- **🐬 Delfín (Irregular/Ansioso)**:
  - Pico de energía: Variable (generalmente 15:00-21:00)
  - Características: Sueño fragmentado, hipersensibles al entorno
  - Prevalencia: ~10-15% de la población
  - Estrategia: Flexibilidad máxima, evitar rigidez de horarios

**Aplicación en TimeWeave**: El sistema preguntará el cronotipo durante onboarding y ajustará sugerencias de estudio según ventanas óptimas de cada perfil.

---

## 3. FUNCIONALIDADES PRIORIZADAS (MoSCoW)

### 🟢 MUST HAVE - MVP (Fase 1)
**Objetivo**: App funcional en 1 semana de uso real que reduzca conflictos de horario y organice lo esencial.

#### F1.1: Autenticación Básica
- **Descripción**: Registro/Login con email + password.
- **Stack**: Firebase Auth o Supabase Auth.
- **Criterio de Éxito**: Usuario puede crear cuenta y volver a entrar sin perder datos.

#### F1.2: CRUD de Eventos (Modelo Dual)
- **Tipos de eventos**:
  - **Bloques Fijos** (Rígidos): Trabajo, clases presenciales, citas médicas.
    - Campos: Título, fecha/hora inicio/fin, recurrencia (semanal), tipo: "fixed".
  - **Bloques Flexibles** (Tareas): Estudiar para examen, hacer tarea X, revisar proyecto.
    - Campos: Título, duración estimada, deadline, prioridad (Alta/Media/Baja), tipo: "flexible".
- **UI**: Formulario simple, lista de eventos, calendario semanal básico (grid view).
- **Regla técnica**: Validar que bloques fijos no se solapen.

#### F1.3: Vista de Calendario Semanal
- **Descripción**: Grid interactivo que muestre:
  - Bloques fijos coloreados por categoría (trabajo=azul, clase=verde).
  - Espacios libres visibles.
  - Indicador de "sobrecarga" (>12 hrs comprometidas/día).
- **Interacción**: Click para ver detalles, arrastrar para reposicionar bloques flexibles.

#### F1.4: Sistema de Alertas Básico
- **Descripción**: Notificaciones simples:
  - "Tienes menos de 6 hrs libres entre ahora y tu próximo bloque fijo" → sugerir dormir.
  - "Tu tarea X vence en 24 hrs y no está programada" → recordatorio.
- **Implementación**: Checks locales, notificaciones browser (sin push móvil aún).

#### F1.5: Categorización Automática
- **Descripción**: Al crear evento, algoritmo simple sugiere categoría:
  - Si contiene "trabajo", "turno" → Trabajo.
  - Si contiene "examen", "clase" → Estudio.
- **Tech**: Regex básico + palabras clave.

---

### 🟡 SHOULD HAVE - Fase 2 (Optimización)
**Objetivo**: App proactiva que mejora la calidad del tiempo libre.

#### F2.1: Algoritmo de Sugerencia de Sueño
- **Descripción**: Basado en bloques fijos del día siguiente, calcular:
  - Hora ideal para dormir (7-8 hrs antes del primer bloque).
  - Alerta si el usuario está online después de esa hora.
- **Inputs**: Historial de eventos, configuración de horas de sueño deseadas (default: 8).

#### F2.2: Recomendador de Slots de Estudio
- **Descripción**: Algoritmo que:
  1. Identifica gaps libres de ≥60 min entre bloques fijos.
  2. Filtra horarios según "energía" (evitar 11 PM - 6 AM).
  3. Sugiere 3 slots óptimos para tareas flexibles pendientes.
- **UI**: "Sugerencias del día" en dashboard.

#### F2.3: Estadísticas Básicas
- **Métricas**:
  - Horas trabajadas vs. horas estudiadas (última semana).
  - Balance de sueño (promedio de horas libres nocturnas).
  - Tasa de cumplimiento de deadlines.
- **Visualización**: Gráficos de barras simples (Chart.js o Recharts).

#### F2.4: Plantillas de Bloques Recurrentes
- **Descripción**: Usuario puede crear "Templates":
  - Ej: "Semestre Otoño 2026" con clases L/M/V 8-11 AM.
  - Aplicar plantilla para evitar reingreso manual.

#### F2.5: Modo Oscuro y Temas
- **UX**: Reducción de fatiga visual para uso nocturno.

#### F2.6: Modo Desintoxicación Digital (Wind-Down)
- **Descripción**: Sistema de preparación para el sueño:
  - **Trigger**: 60 min antes de hora de dormir calculada (RN-12).
  - **Acciones**:
    - Notificación push: *"🌙 Comienza tu Wind-Down: 60 min para desconectar"*.
    - Cambiar tema UI a modo ámbar/sepia (reducir luz azul).
    - Bloquear acceso a funciones estimulantes (estadísticas, planificación nueva).
    - Mostrar "Ritual sugerido": Checklist de 3 actividades (ej: "Cerrar tabs", "Preparar ropa mañana", "5 min de respiración").
  - **Configuración**: Usuario puede ajustar ventana (30/60/90 min) o desactivar.
- **Tech**: LocalStorage para horarios, Service Worker para notificaciones persistentes.

#### F2.7: Study Toolkit (Técnicas Basadas en Evidencia)
- **Descripción**: Al crear evento de estudio flexible, permitir seleccionar metodología:
  - **🍅 Pomodoro Clásico**: 
    - 25 min estudio + 5 min descanso (4 ciclos → 15 min descanso largo).
    - Timer integrado, auto-switch entre fases.
  - **🧠 Active Recall**: 
    - Prompt de recordatorio: *"Antes de empezar: ¿Qué recuerdas de la última sesión?"*.
    - Al finalizar: *"Sin mirar notas, escribe 3 conceptos clave aprendidos hoy"*.
    - Campo de texto para respuestas (guardado en evento).
  - **👨‍🏫 Feynman Technique**:
    - Guía paso a paso:
      1. Elige concepto a aprender.
      2. Explícalo en términos simples (como a un niño de 12 años).
      3. Identifica gaps en tu explicación.
      4. Revisa material, simplifica más.
    - Checklist interactivo durante sesión.
- **UI**: Dropdown al crear evento tipo "Estudio" → *"Selecciona tu estrategia"*.
- **Métricas**: Registrar qué técnica usó el usuario y tasa de completado (para sugerencias futuras).

#### F2.8: Detección de Cronotipo Automática
- **Descripción**: Durante primera semana de uso:
  - Algoritmo analiza CUÁNDO crea eventos (horarios preferidos).
  - Patrón de actividad temprana (crear eventos 7-9 AM) → León.
  - Actividad nocturna consistente (crear/editar después de 8 PM) → Lobo.
  - Distribución uniforme → Oso.
- **Validación**: Después de 7 días, preguntar: *"Detectamos que eres Lobo 🐺. ¿Es correcto?"*.
- **Beneficio**: Evitar onboarding tedioso, personalización automática.

---

### 🟠 COULD HAVE - Fase 3 (IA Avanzada)
**Objetivo**: Coaching personalizado y automatización inteligente.

#### F3.1: Chatbot de Asistencia con LLM
- **Descripción**: Integración con OpenAI API (GPT-4) o Claude:
  - Usuario pregunta: *"¿Cuándo puedo estudiar para el examen del viernes?"*.
  - Bot analiza calendario y responde con 3 slots + razón.
- **Tech**: Envío de contexto (eventos JSON) al LLM, respuesta parseada.

#### F3.2: Detección de Patrones de Burnout
- **Descripción**: ML ligero que detecta:
  - Semanas con >70 hrs comprometidas.
  - Reducción progresiva de tiempo libre.
  - Alerta preventiva: *"Estás sobrecargado, considera posponer tareas no críticas"*.

#### F3.3: Gamificación
- **Descripción**: Streaks de cumplimiento de horarios, badges ("Dormiste 8 hrs 5 días seguidos").

#### F3.4: Integración con Pomodoro Timer
- **Descripción**: Temporizador integrado en cada tarea flexible, registro automático de tiempo trabajado.

---

### 🔴 WON'T HAVE (Fuera de Scope - Por Ahora)

#### App Móvil Nativa
- **Razón**: Complejidad de desarrollo dual (iOS/Android). PWA suficiente para MVP.
- **Alternativa**: Web responsive optimizada para móvil.

#### Integración Google Calendar API
- **Razón**: Autenticación OAuth compleja, límites de API, sincronización bidireccional frágil.
- **Alternativa**: Exportar eventos a .ics (Fase 2+).

#### Colaboración Multi-Usuario
- **Razón**: Caso de uso marginal (estudiantes trabajan solos mayormente).
- **Futuro**: Considerar para grupos de estudio (Fase 4).

#### Pago de Funciones Premium
- **Razón**: Monetización no es objetivo en MVP. Evaluar post-validación.

---

## 4. MODELO DE DATOS PRELIMINAR

### Stack Técnico: Firebase Firestore / Supabase PostgreSQL

### Entidad: `users`
```typescript
{
  id: string;              // UUID (auto-generado)
  email: string;           // único
  displayName: string;     
  createdAt: timestamp;
  preferences: {
    sleepGoalHours: number;      // default: 8 (deprecated - usar ciclos)
    sleepCycles: number;         // default: 5 (5 ciclos = 7.5h)
    studyEnergyPeakHours: [int, int]; // Ej: [9, 16] → 9 AM - 4 PM
    timezone: string;            // "America/Mexico_City"
    windDownMinutes: number;     // default: 60 (tiempo pre-sueño)
  };
  chronobiology: {
    chronotype: "LION" | "BEAR" | "WOLF" | "DOLPHIN"; // default: "BEAR"
    wakeupTime: string;          // HH:MM formato 24h (Ej: "06:00") - FIJO para consistencia
    isChronotypeConfirmed: boolean; // false si es auto-detectado, true si usuario validó
    detectedAt?: timestamp;      // fecha de detección automática
  };
  studyPreferences: {
    preferredTechnique?: "POMODORO" | "ACTIVE_RECALL" | "FEYNMAN"; // última usada
    pomodoroConfig?: {
      workMinutes: number;       // default: 25
      shortBreakMinutes: number; // default: 5
      longBreakMinutes: number;  // default: 15
      cyclesBeforeLongBreak: number; // default: 4
    };
  };
}
```

### Entidad: `events`
```typescript
{
  id: string;
  userId: string;          // FK → users.id
  title: string;
  type: "fixed" | "flexible";
  category: "work" | "study" | "personal" | "health";
  
  // Para bloques FIJOS
  startTime?: timestamp;   // ISO 8601
  endTime?: timestamp;
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly";
    daysOfWeek?: [int];    // 0=Sunday, 1=Monday... (si weekly)
    until?: timestamp;     // Fecha fin de recurrencia
  };
  
  // Para bloques FLEXIBLES
  durationMinutes?: number;
  deadline?: timestamp;
  priority?: "high" | "medium" | "low";
  completed?: boolean;
  
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Entidad: `sleep_logs` (Fase 2)
```typescript
{
  id: string;
  userId: string;
  date: date;              // "2026-02-02"
  hoursSlept: number;      // calculado o manual
  quality?: "poor" | "fair" | "good"; // auto o manual
}
```

### Entidad: `suggestions` (Fase 2 - Caché)
```typescript
{
  id: string;
  userId: string;
  date: date;
  slots: [{
    startTime: timestamp;
    endTime: timestamp;
    score: number;         // 0-100 (calidad del slot)
    reason: string;        // "Alta energía matutina"
  }];
  generatedAt: timestamp;
}
```

### Relaciones
- `users` 1:N `events`
- `users` 1:N `sleep_logs`
- `users` 1:N `suggestions`

### Índices Críticos (Firestore/Supabase)
- `events`: userId + startTime (queries de rango temporal)
- `events`: userId + deadline (tareas próximas a vencer)

---

## 5. REGLAS DE NEGOCIO CRÍTICAS

### RN-1: Protección de Bloques Fijos
- **Regla**: Un bloque fijo no puede ser modificado por el sistema automáticamente.
- **Validación**: Al crear/editar un bloque fijo, verificar que no se solape con otros bloques fijos.
- **Error**: `"Conflicto detectado: Ya tienes un evento fijo en ese horario"`.

### RN-2: Prohibición de Estudio Nocturno Intenso
- **Regla**: El sistema NO sugerirá slots de estudio entre 11 PM y 6 AM para tareas de alta prioridad.
- **Excepción**: Si el usuario MANUALMENTE programa algo ahí, mostrar advertencia: *"Estudiar tarde afecta tu sueño. ¿Seguro?"*.

### RN-3: Límite Diario de Carga
- **Regla**: Si la suma de bloques fijos + flexibles programados excede 14 hrs/día, bloquear creación de nuevos eventos.
- **Mensaje**: *"Has alcanzado el límite saludable de actividades para este día. Considera redistribuir tareas"*.

### RN-4: Priorización por Deadline
- **Regla**: Al sugerir slots de estudio, tareas con deadline ≤3 días tienen prioridad absoluta sobre otras.
- **Algoritmo**:
  ```
  score = (100 / days_until_deadline) * priority_weight
  priority_weight: high=3, medium=2, low=1
  ```

### RN-5: Mínimo de Descanso Entre Bloques
- **Regla**: Si dos bloques fijos están separados por <60 min, alertar:
  *"Tiempo insuficiente para desplazamiento/descanso entre Trabajo y Clase"*.
- **Implementación**: Check al guardar evento, sugerir ajustar horarios.

### RN-6: Respeto al Objetivo de Sueño
- **Regla**: Si el usuario tiene bloques programados que dejan <6 hrs para dormir (entre último evento y primer evento del día siguiente), mostrar alerta crítica.
- **UI**: Banner rojo en calendario con acción: *"Ajustar horario"* o *"Posponer tarea X"*.

### RN-7: Integridad de Tareas Completadas
- **Regla**: Una tarea flexible marcada como "completada" no puede volver a "pendiente" (evitar gamificación falsa).
- **Excepción**: Botón "Reabrir tarea" con confirmación explícita.

### RN-8: Recurrencia Inteligente
- **Regla**: Al crear un evento recurrente semanal (ej: clase los lunes 8-10 AM), el sistema debe:
  1. Generar instancias para las próximas 16 semanas (1 semestre).
  2. Si el usuario elimina UNA instancia, no afectar las demás.
  3. Si elimina la "serie", borrar todas las futuras.

### RN-9: Zona Horaria Consistente
- **Regla**: Todos los timestamps se almacenan en UTC en la DB, se convierten a timezone del usuario solo en UI.
- **Validación**: Al registrarse, detectar timezone automáticamente (JS `Intl.DateTimeFormat`).

### RN-10: Privacidad de Datos
- **Regla**: Los datos del usuario (eventos, logs) NUNCA se comparten con terceros ni se usan para entrenar modelos públicos.
- **Compliance**: Si se usa OpenAI API (Fase 3), enviar solo datos anónimos/agregados.

---

## REGLAS BIO-PSICOLÓGICAS (Basadas en Neurociencia)

### RN-11: Ritmos Ultradianos de 90 Minutos
- **Fundamento**: El cerebro opera en ciclos de 90-120 min (Basic Rest-Activity Cycle - BRAC).
- **Regla**: Al sugerir bloques de estudio intenso, limitar duración a **90 minutos máximo**.
- **Validación**: Si el usuario intenta crear tarea de estudio >90 min, sugerir dividir en 2 bloques con descanso de 15-20 min entre ellos.
- **Mensaje UI**: *"Estudios muestran que la concentración decae después de 90 min. ¿Dividir en 2 sesiones?"*
- **Excepción**: Tareas creativas/flow pueden extenderse si el usuario marca "modo flow".

### RN-12: Arquitectura de Sueño por Ciclos
- **Fundamento**: El sueño REM ocurre en ciclos de 90 minutos (5-6 ciclos = 7.5-9 hrs).
- **Regla**: Al calcular "hora de dormir ideal", NO usar números arbitrarios:
  - Si el usuario despierta a las 06:00, sugerir dormir a 21:00 (6 ciclos = 9h) o 22:30 (5 ciclos = 7.5h).
  - NUNCA sugerir 6.5h o 8h (despertaría en mitad de ciclo REM → grogginess).
- **Algoritmo**:
  ```
  wakeupTime = user.wakeupTime (fijo)
  targetCycles = [5, 6] // 7.5h o 9h
  for cycle in targetCycles:
    bedtime = wakeupTime - (cycle * 90min) - 15min (tiempo para dormir)
  ```
- **UI**: *"Para despertar fresco a las 6:00 AM, duerme a las 9:00 PM (6 ciclos) o 10:30 PM (5 ciclos)"*.

### RN-13: Valle de Energía Post-Almuerzo (Afternoon Dip)
- **Fundamento**: Entre 14:00-16:00, el cuerpo experimenta descenso natural de temperatura y alerta.
- **Regla**: Si el usuario tiene un gap libre en este horario:
  - NO sugerir estudio intenso (matemáticas, programación).
  - SÍ sugerir: NSDR (yoga nidra, meditación), siesta <20 min, tareas mecánicas (responder emails).
- **Detección**: Algoritmo identifica cronotipo:
  - León/Oso: Valle marcado 14:00-15:30
  - Lobo: Valle menor o inexistente
  - Delfín: Puede ser su mejor momento (paradoja)
- **Mensaje**: *"Este horario es ideal para descanso activo. ¿Programar una siesta de 20 min?"*

### RN-14: Presión Homeostática del Sueño
- **Fundamento**: Adenosina se acumula durante vigilia (16h → presión máxima).
- **Regla**: Si el usuario lleva >15h despierto sin dormir:
  - Bloquear creación de eventos de estudio intenso.
  - Mostrar alerta crítica: *"Riesgo de consolidación de memoria reducida. Dormir es prioridad"*.
- **Tracking**: Calcular tiempo despierto desde último `sleep_log` o desde `wakeupTime` configurado.

### RN-15: Desintoxicación Digital Pre-Sueño
- **Fundamento**: Luz azul (screens) suprime melatonina hasta 3h después de exposición.
- **Regla**: 60 minutos antes de la hora de dormir objetivo:
  - Notificación: *"Tiempo de Wind-Down: Evita pantallas para mejor sueño"*.
  - Opcional: Activar "modo lectura" en app (sepia, reducir brillo).
  - Sugerir actividades: Leer (físico), journaling, estiramiento.
- **Override**: Usuario puede silenciar si tiene tarea urgente (con recordatorio de consecuencias).

---

## MÉTRICAS DE ÉXITO (KPIs)

### MVP (Fase 1)
- **Activación**: 60% de usuarios crean ≥3 eventos en primera semana.
- **Retención D7**: 40% vuelven después de 7 días.
- **Reducción de conflictos**: Usuario detecta conflicto antes de comprometerse (encuesta cualitativa).

### Fase 2
- **Engagement**: 50% de usuarios revisan "Sugerencias del día" 3+ veces/semana.
- **Calidad de sueño**: Usuarios reportan incremento promedio de 30 min de sueño/noche (self-reported).

### Fase 3
- **Adopción IA**: 30% de usuarios interactúan con chatbot 2+ veces/semana.
- **NPS**: Net Promoter Score ≥50.

---

## CONSIDERACIONES TÉCNICAS FINALES

### Stack Propuesto
- **Frontend**: React 18 + Vite + TypeScript
- **Estilos**: TailwindCSS + shadcn/ui (componentes accesibles)
- **Backend**: Firebase (Firestore + Auth + Hosting) o Supabase (PostgreSQL + Auth + Storage)
- **Estado**: Zustand o React Context (evitar Redux en MVP)
- **Calendario**: `react-big-calendar` o `fullcalendar` (licencia MIT)
- **Deploy**: Vercel (frontend) + Firebase Functions (lógica serverless)

### Arquitectura
```
/src
  /components      (UI reutilizable: Button, EventCard, CalendarGrid)
  /features        (módulos por funcionalidad: auth, events, suggestions)
  /lib             (utils, firebase config, algoritmos)
  /hooks           (custom hooks: useEvents, useAuth)
  /types           (TypeScript interfaces)
  App.tsx
  main.tsx
```

### Seguridad
- **Auth**: Firebase Auth con email verification.
- **Firestore Rules**: Usuarios solo pueden leer/escribir sus propios documentos.
- **Environment Vars**: API keys en `.env.local` (nunca en repo).

### Performance
- **Lazy Loading**: Componentes de calendario solo se cargan al entrar a vista semanal.
- **Caché**: Queries de eventos se cachean con SWR o React Query.
- **Optimistic UI**: Al crear evento, UI se actualiza antes de confirmación del servidor.

---

## PRÓXIMOS PASOS

1. **Validación de Concepto**: Entrevistas con 10 estudiantes trabajadores (1 semana).
2. **Diseño UI/UX**: Wireframes de vistas críticas (login, calendario, creación evento).
3. **Setup Técnico**: Inicializar repo, configurar Firebase/Supabase.
4. **Sprint 1 (MVP)**: Implementar F1.1 - F1.5 (3-4 semanas).
5. **Beta Testing**: Lanzamiento privado con 20 usuarios (2 semanas).
6. **Iteración**: Ajustes basados en feedback antes de Fase 2.

---

**Documento creado**: 2 de febrero de 2026  
**Versión**: 1.0 - MVP Specifications  
**Autor**: Senior PM + Arquitecto de Software  
**Estado**: Aprobado para desarrollo
