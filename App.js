import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

const COLORS = {
  bg: '#06121F',
  panel: '#0C1F33',
  panelSoft: '#102A42',
  card: '#0F263D',
  line: '#1D3C57',
  text: '#F4F9FF',
  muted: '#91A9BE',
  cyan: '#42D9FF',
  mint: '#72F1B8',
  yellow: '#FFD166',
  red: '#FF7B7B',
  navy: '#04101B',
};

const INITIAL_ATHLETES = [
  { id: 'a1', name: 'Sofía Méndez', lane: 1, present: true, status: 'Lista', pb50: 29.84, last50: 30.21, weekMeters: 12800 },
  { id: 'a2', name: 'Tomás Ríos', lane: 2, present: true, status: 'Carga media', pb50: 27.42, last50: 27.88, weekMeters: 14200 },
  { id: 'a3', name: 'Malena Costa', lane: 3, present: true, status: 'Mejorando', pb50: 31.15, last50: 31.04, weekMeters: 11900 },
  { id: 'a4', name: 'Nicolás Paz', lane: 4, present: false, status: 'Ausente', pb50: 28.91, last50: 29.34, weekMeters: 9800 },
];

const INITIAL_WORKOUTS = [
  {
    id: 'w1',
    day: 'Hoy · 19:00',
    title: 'Velocidad + técnica de crol',
    distance: 3200,
    released: true,
    blocks: [
      { phase: 'Entrada en calor', detail: '600 m suave + movilidad de hombros' },
      { phase: 'Trabajo principal', detail: '8×50 progresivos + 12×25 velocidad' },
      { phase: 'Vuelta a la calma', detail: '400 m regenerativo' },
    ],
  },
  {
    id: 'w2',
    day: 'Miércoles · 19:00',
    title: 'Umbral aeróbico',
    distance: 4100,
    released: true,
    blocks: [
      { phase: 'Entrada en calor', detail: '800 m variado' },
      { phase: 'Trabajo principal', detail: '5×400 ritmo controlado' },
      { phase: 'Vuelta a la calma', detail: '300 m suave' },
    ],
  },
  {
    id: 'w3',
    day: 'Viernes · 18:30',
    title: 'Test 200 m',
    distance: 2800,
    released: false,
    blocks: [
      { phase: 'Entrada en calor', detail: '1000 m progresivos' },
      { phase: 'Trabajo principal', detail: '2×200 cronometrados' },
      { phase: 'Vuelta a la calma', detail: '600 m libre' },
    ],
  },
];

const PHASES = ['Entrada en calor', 'Trabajo principal', 'Vuelta a la calma'];

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function AppButton({ label, onPress, variant = 'secondary', small = false, disabled = false }) {
  const variants = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
    ghost: styles.buttonGhost,
    danger: styles.buttonDanger,
  };
  const textVariants = {
    primary: styles.buttonTextDark,
    secondary: styles.buttonText,
    ghost: styles.buttonText,
    danger: styles.buttonText,
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variants[variant],
        small && styles.buttonSmall,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonLabel, textVariants[variant]]}>{label}</Text>
    </Pressable>
  );
}

function Pill({ text, tone = 'cyan' }) {
  const toneStyle = tone === 'mint' ? styles.pillMint : tone === 'yellow' ? styles.pillYellow : tone === 'red' ? styles.pillRed : styles.pillCyan;
  return (
    <View style={[styles.pill, toneStyle]}>
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

function MetricCard({ label, value, note, accent = COLORS.cyan }) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricDot, { backgroundColor: accent }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricNote}>{note}</Text>
    </View>
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.flexOne}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

function RoleSelector({ role, onChange }) {
  return (
    <View style={styles.roleSelector}>
      {[
        ['coach', 'Entrenador'],
        ['swimmer', 'Nadador'],
      ].map(([value, label]) => (
        <Pressable
          key={value}
          onPress={() => onChange(value)}
          style={[styles.roleOption, role === value && styles.roleOptionActive]}
        >
          <Text style={[styles.roleOptionText, role === value && styles.roleOptionTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Navigation({ role, active, onChange, compact = false }) {
  const items = role === 'coach'
    ? [
        ['home', 'Inicio'],
        ['team', 'Equipo'],
        ['timer', 'Crono'],
        ['plan', 'Plan'],
        ['chat', 'Chat'],
      ]
    : [
        ['home', 'Inicio'],
        ['plan', 'Plan'],
        ['progress', 'Progreso'],
        ['chat', 'Equipo'],
      ];

  return (
    <View style={[styles.navigation, compact && styles.navigationMobile]}>
      {items.map(([key, label]) => (
        <Pressable key={key} onPress={() => onChange(key)} style={[styles.navItem, compact && styles.navItemMobile, active === key && styles.navItemActive]}>
          <Text style={[styles.navText, active === key && styles.navTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function CoachHome({ athletes, workouts, setActiveTab, isPremium, setIsPremium }) {
  const present = athletes.filter((athlete) => athlete.present).length;
  return (
    <View style={styles.pageGap}>
      <View style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>Entrenamiento de hoy</Text>
          <Text style={styles.heroTitle}>Velocidad y técnica</Text>
          <Text style={styles.heroDescription}>4 nadadores · 3.200 m · Pileta 25 m</Text>
          <View style={styles.inlineActions}>
            <AppButton label="Iniciar toma de tiempos" variant="primary" onPress={() => setActiveTab('timer')} />
            <AppButton label="Ver planificación" onPress={() => setActiveTab('plan')} />
          </View>
        </View>
        <View style={styles.heroScore}>
          <Text style={styles.heroScoreValue}>{present}/4</Text>
          <Text style={styles.heroScoreLabel}>presentes</Text>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <MetricCard label="Asistencia" value={`${Math.round((present / athletes.length) * 100)}%`} note="Sesión de hoy" accent={COLORS.mint} />
        <MetricCard label="Volumen semanal" value="48,7 km" note="Equipo completo" />
        <MetricCard label="Mejoras" value="3" note="Marcas personales" accent={COLORS.yellow} />
        <MetricCard label="Alertas" value="1" note="Carga a revisar" accent={COLORS.red} />
      </View>

      <View style={styles.twoColumnGrid}>
        <View style={styles.panel}>
          <SectionTitle eyebrow="Equipo" title="Estado rápido" action={<AppButton label="Abrir" small variant="ghost" onPress={() => setActiveTab('team')} />} />
          {athletes.map((athlete) => (
            <View key={athlete.id} style={styles.listRow}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{athlete.name.charAt(0)}</Text></View>
              <View style={styles.flexOne}>
                <Text style={styles.rowTitle}>{athlete.name}</Text>
                <Text style={styles.rowMeta}>Carril {athlete.lane} · {athlete.status}</Text>
              </View>
              <Pill text={athlete.present ? 'Presente' : 'Ausente'} tone={athlete.present ? 'mint' : 'red'} />
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <SectionTitle eyebrow="Semana" title="Próximas sesiones" />
          {workouts.map((workout) => (
            <View key={workout.id} style={styles.workoutMini}>
              <View style={styles.flexOne}>
                <Text style={styles.rowTitle}>{workout.title}</Text>
                <Text style={styles.rowMeta}>{workout.day} · {workout.distance.toLocaleString('es-AR')} m</Text>
              </View>
              <Pill text={workout.released ? 'Visible' : 'Borrador'} tone={workout.released ? 'cyan' : 'yellow'} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.premiumCard}>
        <View style={styles.flexOne}>
          <Text style={styles.eyebrow}>Plan {isPremium ? 'Premium activo' : 'Gratis'}</Text>
          <Text style={styles.sectionTitle}>{isPremium ? 'Comparativas y planificación avanzada habilitadas' : 'Desbloqueá análisis de competencia y reportes'}</Text>
          <Text style={styles.panelText}>El modo gratis permite un equipo, asistencia, planificación semanal y cronómetro. Premium suma históricos, múltiples equipos, benchmarks y exportación.</Text>
        </View>
        <AppButton label={isPremium ? 'Volver a demo gratis' : 'Probar Premium'} variant="primary" onPress={() => setIsPremium((value) => !value)} />
      </View>
    </View>
  );
}

function TeamScreen({ athletes, setAthletes }) {
  const [newName, setNewName] = useState('');

  const addAthlete = () => {
    const cleanName = newName.trim();
    if (!cleanName) return;
    setAthletes((current) => [
      ...current,
      {
        id: `a${Date.now()}`,
        name: cleanName,
        lane: current.length + 1,
        present: true,
        status: 'Nuevo',
        pb50: 0,
        last50: 0,
        weekMeters: 0,
      },
    ]);
    setNewName('');
  };

  const toggleAttendance = (id) => {
    setAthletes((current) => current.map((athlete) => athlete.id === id ? { ...athlete, present: !athlete.present } : athlete));
  };

  return (
    <View style={styles.pageGap}>
      <View style={styles.panel}>
        <SectionTitle eyebrow="Gestión simple" title="Agregar nadador" />
        <View style={styles.inputRow}>
          <TextInput
            accessibilityLabel="Nombre del nadador"
            placeholder="Nombre y apellido"
            placeholderTextColor={COLORS.muted}
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={addAthlete}
            style={styles.input}
          />
          <AppButton label="Agregar" variant="primary" onPress={addAthlete} />
        </View>
      </View>

      <View style={styles.panel}>
        <SectionTitle eyebrow="Asistencia de hoy" title={`${athletes.filter((a) => a.present).length} de ${athletes.length} presentes`} />
        {athletes.map((athlete) => (
          <View key={athlete.id} style={styles.athleteCard}>
            <View style={styles.avatarLarge}><Text style={styles.avatarTextLarge}>{athlete.name.charAt(0)}</Text></View>
            <View style={styles.flexOne}>
              <Text style={styles.rowTitle}>{athlete.name}</Text>
              <Text style={styles.rowMeta}>Carril {athlete.lane} · PB 50 m: {athlete.pb50 ? `${athlete.pb50.toFixed(2)} s` : 'sin datos'}</Text>
              <Text style={styles.rowMeta}>{athlete.weekMeters.toLocaleString('es-AR')} m esta semana</Text>
            </View>
            <AppButton
              small
              label={athlete.present ? 'Presente' : 'Ausente'}
              variant={athlete.present ? 'primary' : 'danger'}
              onPress={() => toggleAttendance(athlete.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

function TimerScreen({ athletes }) {
  const activeAthletes = athletes.filter((athlete) => athlete.present);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [splits, setSplits] = useState({});

  useEffect(() => {
    if (!sessionStarted || !startTimestamp) return undefined;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimestamp) / 1000));
    }, 250);
    return () => clearInterval(interval);
  }, [sessionStarted, startTimestamp]);

  const startRound = () => {
    setStartTimestamp(Date.now());
    setElapsed(0);
    setSessionStarted(true);
  };

  const registerSplit = (athleteId) => {
    if (!sessionStarted) return;
    const seconds = Math.max(1, (Date.now() - startTimestamp) / 1000);
    setSplits((current) => ({
      ...current,
      [athleteId]: [...(current[athleteId] || []), { round, phase: PHASES[phaseIndex], seconds }],
    }));
  };

  const nextRound = () => {
    setRound((value) => value + 1);
    setStartTimestamp(Date.now());
    setElapsed(0);
    setSessionStarted(true);
  };

  const saveSession = () => {
    setSessionStarted(false);
    const totalSplits = Object.values(splits).reduce((sum, list) => sum + list.length, 0);
    const message = `Sesión guardada con ${totalSplits} tiempos registrados.`;
    if (Platform.OS === 'web') {
      globalThis.alert?.(message);
    } else {
      Alert.alert('Sesión guardada', message);
    }
  };

  return (
    <View style={styles.pageGap}>
      <View style={styles.timerHero}>
        <Text style={styles.eyebrow}>Serie {round} · {PHASES[phaseIndex]}</Text>
        <Text style={styles.timerValue}>{formatTime(elapsed)}</Text>
        <Text style={styles.panelText}>Tocá a cada nadador cuando complete la serie. El orden se registra automáticamente.</Text>
        <View style={styles.inlineActions}>
          {!sessionStarted ? (
            <AppButton label="Iniciar serie" variant="primary" onPress={startRound} />
          ) : (
            <AppButton label="Nueva serie" variant="primary" onPress={nextRound} />
          )}
          <AppButton label="Guardar sesión" onPress={saveSession} />
        </View>
      </View>

      <View style={styles.phaseSelector}>
        {PHASES.map((phase, index) => (
          <Pressable key={phase} onPress={() => setPhaseIndex(index)} style={[styles.phaseOption, phaseIndex === index && styles.phaseOptionActive]}>
            <Text style={[styles.phaseText, phaseIndex === index && styles.phaseTextActive]}>{phase}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.panel}>
        <SectionTitle eyebrow="Toma rápida" title={`${activeAthletes.length} nadadores activos`} />
        <View style={styles.timerGrid}>
          {activeAthletes.map((athlete) => {
            const athleteSplits = splits[athlete.id] || [];
            const latest = athleteSplits[athleteSplits.length - 1];
            return (
              <Pressable
                key={athlete.id}
                disabled={!sessionStarted}
                onPress={() => registerSplit(athlete.id)}
                style={({ pressed }) => [styles.timerAthlete, pressed && styles.timerAthletePressed, !sessionStarted && styles.disabled]}
              >
                <Text style={styles.laneLabel}>CARRIL {athlete.lane}</Text>
                <Text style={styles.timerAthleteName}>{athlete.name}</Text>
                <Text style={styles.timerAthleteTime}>{latest ? `${latest.seconds.toFixed(2)} s` : '--.-- s'}</Text>
                <Text style={styles.rowMeta}>{athleteSplits.length} tiempos registrados</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.panel}>
        <SectionTitle eyebrow="Registro" title="Últimos tiempos" />
        {activeAthletes.map((athlete) => {
          const list = (splits[athlete.id] || []).slice(-3).reverse();
          return (
            <View key={athlete.id} style={styles.splitRow}>
              <Text style={styles.rowTitle}>{athlete.name}</Text>
              <Text style={styles.splitValues}>{list.length ? list.map((item) => `${item.seconds.toFixed(2)} s`).join(' · ') : 'Sin tiempos'}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function PlanScreen({ workouts, setWorkouts, role }) {
  const [title, setTitle] = useState('');
  const [distance, setDistance] = useState('');

  const addWorkout = () => {
    if (!title.trim()) return;
    setWorkouts((current) => [
      ...current,
      {
        id: `w${Date.now()}`,
        day: 'Próxima sesión',
        title: title.trim(),
        distance: Number(distance) || 3000,
        released: false,
        blocks: [
          { phase: 'Entrada en calor', detail: 'Definir bloque' },
          { phase: 'Trabajo principal', detail: 'Definir bloque' },
          { phase: 'Vuelta a la calma', detail: 'Definir bloque' },
        ],
      },
    ]);
    setTitle('');
    setDistance('');
  };

  const toggleRelease = (id) => {
    setWorkouts((current) => current.map((workout) => workout.id === id ? { ...workout, released: !workout.released } : workout));
  };

  const visibleWorkouts = role === 'swimmer' ? workouts.filter((workout) => workout.released) : workouts;

  return (
    <View style={styles.pageGap}>
      {role === 'coach' ? (
        <View style={styles.panel}>
          <SectionTitle eyebrow="Planificación" title="Crear entrenamiento" />
          <View style={styles.formGrid}>
            <TextInput
              placeholder="Nombre del entrenamiento"
              placeholderTextColor={COLORS.muted}
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Distancia total (m)"
              placeholderTextColor={COLORS.muted}
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
              style={styles.input}
            />
            <AppButton label="Crear borrador" variant="primary" onPress={addWorkout} />
          </View>
        </View>
      ) : null}

      {visibleWorkouts.map((workout) => (
        <View key={workout.id} style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <View style={styles.flexOne}>
              <Text style={styles.eyebrow}>{workout.day}</Text>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <Text style={styles.panelText}>{workout.distance.toLocaleString('es-AR')} m estimados</Text>
            </View>
            {role === 'coach' ? (
              <AppButton
                label={workout.released ? 'Liberado' : 'Liberar'}
                variant={workout.released ? 'secondary' : 'primary'}
                small
                onPress={() => toggleRelease(workout.id)}
              />
            ) : (
              <Pill text="Disponible" tone="mint" />
            )}
          </View>
          <View style={styles.blockList}>
            {workout.blocks.map((block, index) => (
              <View key={`${workout.id}-${block.phase}`} style={styles.blockRow}>
                <View style={styles.blockNumber}><Text style={styles.blockNumberText}>{index + 1}</Text></View>
                <View style={styles.flexOne}>
                  <Text style={styles.rowTitle}>{block.phase}</Text>
                  <Text style={styles.rowMeta}>{block.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function SwimmerHome({ workouts, setActiveTab, isPremium, setIsPremium }) {
  const nextWorkout = workouts.find((workout) => workout.released);
  return (
    <View style={styles.pageGap}>
      <View style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>Tu próxima sesión</Text>
          <Text style={styles.heroTitle}>{nextWorkout?.title || 'Sin entrenamiento liberado'}</Text>
          <Text style={styles.heroDescription}>{nextWorkout?.day} · {nextWorkout?.distance.toLocaleString('es-AR')} m</Text>
          <View style={styles.inlineActions}>
            <AppButton label="Ver entrenamiento" variant="primary" onPress={() => setActiveTab('plan')} />
            <AppButton label="Ver progreso" onPress={() => setActiveTab('progress')} />
          </View>
        </View>
        <View style={styles.heroScore}>
          <Text style={styles.heroScoreValue}>86</Text>
          <Text style={styles.heroScoreLabel}>estado</Text>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <MetricCard label="Volumen semanal" value="12,8 km" note="+8% vs. semana anterior" accent={COLORS.mint} />
        <MetricCard label="Mejor 50 m" value="29,84 s" note="Hace 12 días" />
        <MetricCard label="Asistencia" value="92%" note="Últimos 30 días" accent={COLORS.yellow} />
        <MetricCard label="Carga" value="Media" note="Recuperación correcta" accent={COLORS.cyan} />
      </View>

      <View style={styles.panel}>
        <SectionTitle eyebrow="Resumen" title="Tu progreso reciente" />
        <ProgressBar label="Velocidad" value={82} note="+4 puntos" />
        <ProgressBar label="Resistencia" value={74} note="+2 puntos" />
        <ProgressBar label="Técnica" value={88} note="Estable" />
      </View>

      <View style={styles.premiumCard}>
        <View style={styles.flexOne}>
          <Text style={styles.eyebrow}>{isPremium ? 'Premium activo' : 'Comparación Premium'}</Text>
          <Text style={styles.sectionTitle}>{isPremium ? 'Tus benchmarks de competencia están visibles' : 'Compará tus tiempos con objetivos y competencias'}</Text>
          <Text style={styles.panelText}>Visualizá la distancia frente a tus marcas objetivo, evolución por estilo y proyección de resultados.</Text>
        </View>
        <AppButton label={isPremium ? 'Desactivar demo' : 'Probar Premium'} variant="primary" onPress={() => setIsPremium((value) => !value)} />
      </View>
    </View>
  );
}

function ProgressBar({ label, value, note }) {
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressHeader}>
        <Text style={styles.rowTitle}>{label}</Text>
        <Text style={styles.rowMeta}>{note}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${value}%` }]} />
      </View>
    </View>
  );
}

function ProgressScreen({ isPremium, setIsPremium }) {
  const races = [
    { label: '50 m libre', current: 29.84, target: 29.2, percentile: 76 },
    { label: '100 m libre', current: 66.4, target: 64.9, percentile: 68 },
    { label: '200 m libre', current: 145.2, target: 141.0, percentile: 61 },
  ];

  return (
    <View style={styles.pageGap}>
      <View style={styles.panel}>
        <SectionTitle eyebrow="Histórico" title="Evolución de marcas" />
        <View style={styles.chartArea}>
          {[62, 70, 66, 78, 74, 88].map((height, index) => (
            <View key={index} style={styles.chartColumnWrap}>
              <View style={[styles.chartColumn, { height: `${height}%` }]} />
              <Text style={styles.chartLabel}>S{index + 1}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <SectionTitle eyebrow="Marcas" title="Objetivos por prueba" />
        {races.map((race) => (
          <View key={race.label} style={styles.raceRow}>
            <View style={styles.flexOne}>
              <Text style={styles.rowTitle}>{race.label}</Text>
              <Text style={styles.rowMeta}>Actual {race.current.toFixed(2)} s · Objetivo {race.target.toFixed(2)} s</Text>
            </View>
            <Pill text={`Top ${100 - race.percentile}%`} tone="cyan" />
          </View>
        ))}
      </View>

      <View style={[styles.panel, !isPremium && styles.lockedPanel]}>
        <SectionTitle eyebrow="Premium" title="Comparación con competencia" />
        {isPremium ? (
          <>
            <Text style={styles.panelText}>Estás a 0,64 s de tu objetivo en 50 m libre y mejoraste 0,37 s en las últimas seis semanas.</Text>
            <View style={styles.benchmarkRow}>
              <MetricCard label="Tu marca" value="29,84" note="50 m libre" />
              <MetricCard label="Objetivo" value="29,20" note="Próxima competencia" accent={COLORS.mint} />
            </View>
          </>
        ) : (
          <View style={styles.lockContent}>
            <Text style={styles.lockIcon}>◎</Text>
            <Text style={styles.rowTitle}>Funcionalidad Premium</Text>
            <Text style={styles.panelText}>Activá la demo para visualizar benchmarks, proyecciones y comparaciones.</Text>
            <AppButton label="Activar demo Premium" variant="primary" onPress={() => setIsPremium(true)} />
          </View>
        )}
      </View>
    </View>
  );
}

function ChatScreen({ role }) {
  const [messages, setMessages] = useState([
    { id: 'm1', author: 'Coach Martín', text: 'Hoy priorizamos técnica antes de la serie principal.', mine: role === 'coach' },
    { id: 'm2', author: 'Sofía', text: 'Perfecto. El hombro está mucho mejor.', mine: false },
    { id: 'm3', author: 'Tomás', text: '¿Llevamos paletas para la entrada en calor?', mine: false },
  ]);
  const [draft, setDraft] = useState('');

  const send = () => {
    const clean = draft.trim();
    if (!clean) return;
    setMessages((current) => [...current, { id: `m${Date.now()}`, author: role === 'coach' ? 'Coach Martín' : 'Sofía', text: clean, mine: true }]);
    setDraft('');
  };

  return (
    <View style={styles.pageGap}>
      <View style={styles.panel}>
        <SectionTitle eyebrow="Equipo Tiburones" title="Conversación del grupo" />
        <View style={styles.messageList}>
          {messages.map((message) => (
            <View key={message.id} style={[styles.messageBubble, message.mine && styles.messageMine]}>
              <Text style={styles.messageAuthor}>{message.author}</Text>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </View>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Escribí un mensaje"
            placeholderTextColor={COLORS.muted}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={send}
            style={styles.input}
          />
          <AppButton label="Enviar" variant="primary" onPress={send} />
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const [role, setRole] = useState('coach');
  const [activeTab, setActiveTab] = useState('home');
  const [isPremium, setIsPremium] = useState(false);
  const [athletes, setAthletes] = useState(INITIAL_ATHLETES);
  const [workouts, setWorkouts] = useState(INITIAL_WORKOUTS);

  useEffect(() => {
    setActiveTab('home');
  }, [role]);

  const content = useMemo(() => {
    if (role === 'coach') {
      if (activeTab === 'team') return <TeamScreen athletes={athletes} setAthletes={setAthletes} />;
      if (activeTab === 'timer') return <TimerScreen athletes={athletes} />;
      if (activeTab === 'plan') return <PlanScreen workouts={workouts} setWorkouts={setWorkouts} role={role} />;
      if (activeTab === 'chat') return <ChatScreen role={role} />;
      return <CoachHome athletes={athletes} workouts={workouts} setActiveTab={setActiveTab} isPremium={isPremium} setIsPremium={setIsPremium} />;
    }

    if (activeTab === 'plan') return <PlanScreen workouts={workouts} setWorkouts={setWorkouts} role={role} />;
    if (activeTab === 'progress') return <ProgressScreen isPremium={isPremium} setIsPremium={setIsPremium} />;
    if (activeTab === 'chat') return <ChatScreen role={role} />;
    return <SwimmerHome workouts={workouts} setActiveTab={setActiveTab} isPremium={isPremium} setIsPremium={setIsPremium} />;
  }, [activeTab, athletes, isPremium, role, workouts]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={[styles.appShell, width < 760 && styles.appShellMobile]}>
        <View style={[styles.sidebar, width < 900 && styles.sidebarNarrow, width < 760 && styles.sidebarMobile]}>
          <View style={styles.brandBlock}>
            <View style={styles.logoMark}><Text style={styles.logoText}>S</Text></View>
            <View>
              <Text style={styles.brandName}>SwimApp</Text>
              <Text style={styles.brandTagline}>Entrená con datos</Text>
            </View>
          </View>

          <RoleSelector role={role} onChange={setRole} />
          <Navigation role={role} active={activeTab} onChange={setActiveTab} compact={width < 760} />

          {width >= 900 ? (
            <View style={styles.sidebarFooter}>
              <Pill text={isPremium ? 'Premium' : 'Demo local'} tone={isPremium ? 'mint' : 'yellow'} />
              <Text style={styles.sidebarNote}>Sin backend ni cuentas reales en esta primera versión.</Text>
            </View>
          ) : null}
        </View>

        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topHeader}>
            <View>
              <Text style={styles.eyebrow}>{role === 'coach' ? 'Modo entrenador' : 'Modo nadador'}</Text>
              <Text style={styles.pageTitle}>{role === 'coach' ? 'Buenas tardes, Martín' : 'Buenas tardes, Sofía'}</Text>
            </View>
            <View style={styles.headerRight}>
              <Pill text={isPremium ? 'Premium' : 'Plan gratis'} tone={isPremium ? 'mint' : 'cyan'} />
              <View style={styles.profileCircle}><Text style={styles.profileText}>{role === 'coach' ? 'M' : 'S'}</Text></View>
            </View>
          </View>
          {content}
          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  appShell: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.bg },
  appShellMobile: { flexDirection: 'column' },
  sidebar: { width: 250, padding: 22, borderRightWidth: 1, borderRightColor: COLORS.line, backgroundColor: '#081827' },
  sidebarNarrow: { width: 180, paddingHorizontal: 12, paddingVertical: 16 },
  sidebarMobile: { width: '100%', borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: COLORS.line, paddingHorizontal: 14, paddingVertical: 12 },
  brandBlock: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 22 },
  logoMark: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.cyan },
  logoText: { color: COLORS.navy, fontSize: 22, fontWeight: '900' },
  brandName: { color: COLORS.text, fontSize: 20, fontWeight: '900' },
  brandTagline: { color: COLORS.muted, fontSize: 11 },
  roleSelector: { flexDirection: 'row', borderRadius: 14, backgroundColor: COLORS.panel, padding: 4, marginBottom: 18 },
  roleOption: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  roleOptionActive: { backgroundColor: COLORS.cyan },
  roleOptionText: { color: COLORS.muted, fontSize: 11, fontWeight: '800' },
  roleOptionTextActive: { color: COLORS.navy },
  navigation: { gap: 7 },
  navigationMobile: { flexDirection: 'row', flexWrap: 'wrap' },
  navItem: { paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14 },
  navItemMobile: { flexGrow: 1, alignItems: 'center', paddingVertical: 9, paddingHorizontal: 10 },
  navItemActive: { backgroundColor: COLORS.panelSoft, borderWidth: 1, borderColor: COLORS.line },
  navText: { color: COLORS.muted, fontSize: 14, fontWeight: '800' },
  navTextActive: { color: COLORS.text },
  sidebarFooter: { marginTop: 'auto', gap: 10 },
  sidebarNote: { color: COLORS.muted, fontSize: 11, lineHeight: 16 },
  mainScroll: { flex: 1 },
  mainContent: { width: '100%', maxWidth: 1180, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 22 },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 22 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pageTitle: { color: COLORS.text, fontSize: 28, fontWeight: '900', marginTop: 3 },
  profileCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.panelSoft, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  profileText: { color: COLORS.text, fontWeight: '900' },
  eyebrow: { color: COLORS.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  pageGap: { gap: 16 },
  heroCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 18, padding: 24, borderRadius: 24, backgroundColor: COLORS.panelSoft, borderWidth: 1, borderColor: COLORS.line },
  heroCopy: { flex: 1, gap: 7 },
  heroTitle: { color: COLORS.text, fontSize: 30, fontWeight: '900' },
  heroDescription: { color: COLORS.muted, fontSize: 14 },
  heroScore: { width: 112, height: 112, borderRadius: 56, backgroundColor: COLORS.cyan, alignItems: 'center', justifyContent: 'center' },
  heroScoreValue: { color: COLORS.navy, fontSize: 28, fontWeight: '900' },
  heroScoreLabel: { color: COLORS.navy, fontSize: 11, fontWeight: '800' },
  inlineActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 8 },
  button: { minHeight: 42, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  buttonSmall: { minHeight: 34, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 10 },
  buttonPrimary: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  buttonSecondary: { backgroundColor: COLORS.panel, borderColor: COLORS.line },
  buttonGhost: { backgroundColor: 'transparent', borderColor: COLORS.line },
  buttonDanger: { backgroundColor: '#4B1F29', borderColor: '#71303D' },
  buttonLabel: { fontSize: 12, fontWeight: '900' },
  buttonText: { color: COLORS.text },
  buttonTextDark: { color: COLORS.navy },
  pressed: { opacity: 0.74, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.38 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { flexGrow: 1, flexBasis: 180, minWidth: 160, padding: 17, borderRadius: 18, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line },
  metricDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 12 },
  metricLabel: { color: COLORS.muted, fontSize: 12 },
  metricValue: { color: COLORS.text, fontSize: 25, fontWeight: '900', marginTop: 5 },
  metricNote: { color: COLORS.muted, fontSize: 11, marginTop: 4 },
  twoColumnGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  panel: { flexGrow: 1, flexBasis: 320, padding: 20, borderRadius: 22, backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.line },
  panelText: { color: COLORS.muted, fontSize: 13, lineHeight: 19 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionTitle: { color: COLORS.text, fontSize: 19, fontWeight: '900', marginTop: 3 },
  flexOne: { flex: 1 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.line },
  avatar: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.panelSoft },
  avatarText: { color: COLORS.cyan, fontWeight: '900' },
  rowTitle: { color: COLORS.text, fontSize: 13, fontWeight: '800' },
  rowMeta: { color: COLORS.muted, fontSize: 11, marginTop: 3, lineHeight: 16 },
  pill: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 9, borderRadius: 999, borderWidth: 1 },
  pillCyan: { backgroundColor: '#12364A', borderColor: '#1F5870' },
  pillMint: { backgroundColor: '#153B32', borderColor: '#276250' },
  pillYellow: { backgroundColor: '#43391D', borderColor: '#705E28' },
  pillRed: { backgroundColor: '#49232A', borderColor: '#70343E' },
  pillText: { color: COLORS.text, fontSize: 10, fontWeight: '900' },
  workoutMini: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: COLORS.line },
  premiumCard: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 16, padding: 22, borderRadius: 22, backgroundColor: '#102E3C', borderWidth: 1, borderColor: '#24516A' },
  inputRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  input: { flexGrow: 1, flexBasis: 210, minHeight: 44, paddingHorizontal: 13, paddingVertical: 11, borderRadius: 13, color: COLORS.text, backgroundColor: '#071827', borderWidth: 1, borderColor: COLORS.line },
  athleteCard: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, paddingVertical: 14, borderTopWidth: 1, borderTopColor: COLORS.line },
  avatarLarge: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.panelSoft },
  avatarTextLarge: { color: COLORS.cyan, fontSize: 18, fontWeight: '900' },
  timerHero: { alignItems: 'center', padding: 28, borderRadius: 24, backgroundColor: COLORS.panelSoft, borderWidth: 1, borderColor: COLORS.line },
  timerValue: { color: COLORS.text, fontSize: 62, fontWeight: '900', letterSpacing: 2, marginVertical: 8 },
  phaseSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 6, borderRadius: 16, backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.line },
  phaseOption: { flexGrow: 1, flexBasis: 160, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 11, alignItems: 'center' },
  phaseOptionActive: { backgroundColor: COLORS.cyan },
  phaseText: { color: COLORS.muted, fontSize: 11, fontWeight: '900' },
  phaseTextActive: { color: COLORS.navy },
  timerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  timerAthlete: { flexGrow: 1, flexBasis: 220, minWidth: 190, padding: 18, borderRadius: 18, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line },
  timerAthletePressed: { backgroundColor: '#17405A', borderColor: COLORS.cyan },
  laneLabel: { color: COLORS.cyan, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  timerAthleteName: { color: COLORS.text, fontSize: 18, fontWeight: '900', marginTop: 5 },
  timerAthleteTime: { color: COLORS.mint, fontSize: 28, fontWeight: '900', marginTop: 12 },
  splitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderTopWidth: 1, borderTopColor: COLORS.line },
  splitValues: { color: COLORS.cyan, fontSize: 12, fontWeight: '800' },
  formGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  workoutCard: { padding: 20, borderRadius: 22, backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.line },
  workoutHeader: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' },
  workoutTitle: { color: COLORS.text, fontSize: 23, fontWeight: '900', marginVertical: 4 },
  blockList: { marginTop: 15 },
  blockRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, borderTopWidth: 1, borderTopColor: COLORS.line },
  blockNumber: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.panelSoft },
  blockNumberText: { color: COLORS.cyan, fontSize: 11, fontWeight: '900' },
  progressRow: { marginTop: 15 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
  progressTrack: { height: 9, borderRadius: 999, backgroundColor: '#071827', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: COLORS.cyan },
  chartArea: { height: 180, flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingTop: 16 },
  chartColumnWrap: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center', gap: 7 },
  chartColumn: { width: '74%', minHeight: 16, borderRadius: 9, backgroundColor: COLORS.cyan },
  chartLabel: { color: COLORS.muted, fontSize: 10 },
  raceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderTopWidth: 1, borderTopColor: COLORS.line },
  lockedPanel: { minHeight: 220 },
  lockContent: { alignItems: 'center', gap: 10, paddingVertical: 14 },
  lockIcon: { color: COLORS.cyan, fontSize: 40, fontWeight: '900' },
  benchmarkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14 },
  messageList: { gap: 10, marginBottom: 16 },
  messageBubble: { alignSelf: 'flex-start', maxWidth: '82%', padding: 13, borderRadius: 16, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line },
  messageMine: { alignSelf: 'flex-end', backgroundColor: '#153B4B', borderColor: '#28647B' },
  messageAuthor: { color: COLORS.cyan, fontSize: 10, fontWeight: '900', marginBottom: 4 },
  messageText: { color: COLORS.text, fontSize: 13, lineHeight: 18 },
  bottomSpace: { height: 34 },
});
