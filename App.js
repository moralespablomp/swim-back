import React, { useEffect, useMemo, useState } from 'react';
import {
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

const C = {
  bg: '#F5F5F7', white: '#FFFFFF', soft: '#F2F2F7', text: '#1D1D1F', muted: '#6E6E73',
  line: '#E5E5EA', blue: '#007AFF', blueSoft: '#EAF3FF', green: '#34C759', greenSoft: '#EAF8EE',
  red: '#FF3B30', redSoft: '#FFF0EF', black: '#000000',
};
const KEY = 'swimapp-coach-mvp-v4';
const PHASES = ['Entrada en calor', 'Principal', 'Vuelta a la calma'];
const STROKES = ['Libre', 'Espalda', 'Pecho', 'Mariposa', 'Combinado', 'Patada', 'Técnica'];
const NAV = [['home', 'Inicio'], ['plan', 'Plan'], ['pool', 'Pileta'], ['team', 'Equipo'], ['history', 'Historial']];

const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const id = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const meters = (workout) => workout.sets.reduce((sum, set) => sum + set.reps * set.distance, 0);
const timerText = (ms) => {
  const value = Math.max(0, ms) / 1000;
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  const hundredths = Math.floor((value % 1) * 100);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
};
const timeText = (seconds) => {
  if (typeof seconds !== 'number') return '—';
  const minutes = Math.floor(seconds / 60);
  const rest = seconds - minutes * 60;
  return minutes ? `${minutes}:${rest.toFixed(2).padStart(5, '0')}` : `${rest.toFixed(2)} s`;
};

function demoData() {
  return {
    groups: [{ id: 'g1', name: 'Competición' }, { id: 'g2', name: 'Masters' }],
    swimmers: [
      { id: 's1', name: 'Sofía Méndez', groupId: 'g1', lane: 1, active: true },
      { id: 's2', name: 'Tomás Ríos', groupId: 'g1', lane: 2, active: true },
      { id: 's3', name: 'Malena Costa', groupId: 'g1', lane: 3, active: true },
      { id: 's4', name: 'Nicolás Paz', groupId: 'g1', lane: 4, active: true },
      { id: 's5', name: 'Julia Serra', groupId: 'g2', lane: 1, active: true },
    ],
    workouts: [{
      id: 'w1', title: 'Velocidad aeróbica', date: today(), groupId: 'g1', poolLength: 25, ready: true,
      sets: [
        { id: 'set1', phase: PHASES[0], reps: 1, distance: 600, stroke: 'Libre', interval: '', note: 'Suave + movilidad', timed: false },
        { id: 'set2', phase: PHASES[1], reps: 6, distance: 100, stroke: 'Libre', interval: '1:40', note: 'Ritmo controlado', timed: true },
        { id: 'set3', phase: PHASES[1], reps: 8, distance: 50, stroke: 'Libre', interval: '0:55', note: 'Progresivos', timed: true },
        { id: 'set4', phase: PHASES[2], reps: 1, distance: 300, stroke: 'Variado', interval: '', note: 'Muy suave', timed: false },
      ],
    }],
    sessions: [],
  };
}

function loadData() {
  if (Platform.OS !== 'web' || !globalThis.localStorage) return demoData();
  try {
    const saved = JSON.parse(globalThis.localStorage.getItem(KEY));
    return saved?.groups && saved?.swimmers && saved?.workouts && saved?.sessions ? saved : demoData();
  } catch { return demoData(); }
}

function Button({ label, onPress, primary, ghost, danger, disabled, small, full }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [
      s.button, primary && s.buttonPrimary, ghost && s.buttonGhost, danger && s.buttonDanger,
      small && s.buttonSmall, full && s.full, disabled && s.disabled, pressed && !disabled && s.pressed,
    ]}>
      <Text style={[s.buttonText, primary && s.buttonTextPrimary, ghost && s.blueText, danger && s.redText]}>{label}</Text>
    </Pressable>
  );
}

function Chip({ label, active, onPress }) {
  return <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}><Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text></Pressable>;
}

function Badge({ label, tone }) {
  return <View style={[s.badge, tone === 'green' && s.badgeGreen, tone === 'blue' && s.badgeBlue, tone === 'red' && s.badgeRed]}><Text style={s.badgeText}>{label}</Text></View>;
}

function Card({ children, style }) { return <View style={[s.card, style]}>{children}</View>; }
function Field({ label, value, setValue, placeholder, numeric, grow = true }) {
  return <View style={[s.field, grow && s.grow]}>{label ? <Text style={s.label}>{label}</Text> : null}<TextInput value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor="#AEAEB2" keyboardType={numeric ? 'numeric' : 'default'} style={s.input} /></View>;
}
function Title({ eyebrow, title, action }) {
  return <View style={s.titleRow}><View><Text style={s.eyebrow}>{eyebrow}</Text><Text style={s.title}>{title}</Text></View>{action}</View>;
}
function Empty({ text, action, onAction }) {
  return <Card style={s.empty}><Text style={s.muted}>{text}</Text>{action ? <Button primary small label={action} onPress={onAction} /> : null}</Card>;
}

function Header() {
  return <View style={s.header}><View style={s.logo}><Text style={s.logoText}>S</Text></View><View><Text style={s.brand}>SwimApp</Text><Text style={s.caption}>Entrenador</Text></View></View>;
}
function Navigation({ active, setActive, mobile }) {
  return <View style={mobile ? s.mobileNav : s.sidebar}>{NAV.map(([key, label]) => <Pressable key={key} onPress={() => setActive(key)} style={[mobile ? s.mobileItem : s.navItem, active === key && s.navActive]}><View style={[s.dot, active === key && s.dotActive]} /><Text style={[s.navText, active === key && s.navTextActive]}>{label}</Text></Pressable>)}</View>;
}

function Home({ data, go }) {
  const workout = data.workouts.find((item) => item.date === today()) || data.workouts[0];
  const group = workout && data.groups.find((item) => item.id === workout.groupId);
  const roster = workout ? data.swimmers.filter((item) => item.active && item.groupId === workout.groupId) : [];
  const live = workout && data.sessions.find((item) => item.workoutId === workout.id && item.status !== 'finished');
  return <View style={s.gap}>
    <Title eyebrow="HOY" title="Entrenamiento" action={<Button small label="Nuevo" onPress={() => go('plan')} />} />
    {workout ? <Card style={s.hero}>
      <View style={s.heroMain}><Badge label={live ? 'En curso' : 'Listo'} tone={live ? 'blue' : 'green'} /><Text style={s.heroTitle}>{workout.title}</Text><Text style={s.muted}>{group?.name} · {meters(workout).toLocaleString('es-AR')} m · {workout.poolLength} m</Text><View style={s.actions}><Button primary label={live ? 'Continuar sesión' : 'Preparar sesión'} onPress={() => go('pool')} /><Button label="Editar plan" onPress={() => go('plan')} /></View></View>
      <View style={s.heroStats}><View style={s.stat}><Text style={s.statValue}>{roster.length}</Text><Text style={s.caption}>nadadores</Text></View><View style={s.stat}><Text style={s.statValue}>{workout.sets.length}</Text><Text style={s.caption}>series</Text></View></View>
    </Card> : <Empty text="No hay entrenamiento para hoy" action="Crear" onAction={() => go('plan')} />}
    <View style={s.metrics}><Metric value={data.swimmers.filter((x) => x.active).length} label="Nadadores" /><Metric value={data.workouts.length} label="Planificados" /><Metric value={data.sessions.filter((x) => x.status === 'finished').length} label="Completados" /></View>
    <Card><Text style={s.sectionTitle}>Próximos</Text>{data.workouts.slice(0, 4).map((item, index) => <View key={item.id} style={[s.row, index === 0 && s.noBorder]}><View style={s.dateBox}><Text style={s.dateDay}>{item.date.slice(8)}</Text><Text style={s.caption}>{new Date(`${item.date}T12:00`).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')}</Text></View><View style={s.grow}><Text style={s.rowTitle}>{item.title}</Text><Text style={s.caption}>{meters(item).toLocaleString('es-AR')} m</Text></View><Badge label={item.ready ? 'Listo' : 'Borrador'} tone={item.ready ? 'green' : null} /></View>)}</Card>
  </View>;
}
function Metric({ value, label }) { return <Card style={s.metric}><Text style={s.metricValue}>{value}</Text><Text style={s.caption}>{label}</Text></Card>; }

function Plan({ groups, workouts, setWorkouts, useWorkout, notify }) {
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [pool, setPool] = useState('25');
  const [sets, setSets] = useState([]);
  const [draft, setDraft] = useState({ phase: PHASES[1], reps: '6', distance: '100', stroke: 'Libre', interval: '1:40', note: '', timed: true });

  const reset = () => { setEditing(null); setTitle(''); setDate(today()); setGroupId(groups[0]?.id || ''); setPool('25'); setSets([]); };
  const edit = (workout) => { setEditing(workout.id); setTitle(workout.title); setDate(workout.date); setGroupId(workout.groupId); setPool(String(workout.poolLength)); setSets(workout.sets); };
  const addSet = () => { setSets((current) => [...current, { ...draft, id: id('set'), reps: Math.max(1, Number(draft.reps) || 1), distance: Math.max(25, Number(draft.distance) || 25) }]); setDraft((current) => ({ ...current, note: '' })); };
  const save = (ready) => {
    if (!title.trim() || !groupId || !sets.length) return notify('Completá el nombre, grupo y al menos una serie.');
    const workout = { id: editing || id('workout'), title: title.trim(), date, groupId, poolLength: Number(pool) || 25, ready, sets };
    setWorkouts((current) => editing ? current.map((item) => item.id === editing ? workout : item) : [workout, ...current]);
    notify(ready ? 'Entrenamiento listo.' : 'Borrador guardado.'); reset();
  };

  if (editing !== null || title || sets.length) return <View style={s.gap}>
    <Title eyebrow="PLAN" title={editing ? 'Editar sesión' : 'Nueva sesión'} action={<Button small ghost label="Cancelar" onPress={reset} />} />
    <Card><View style={s.form}><Field label="Nombre" value={title} setValue={setTitle} placeholder="Velocidad aeróbica" /><Field label="Fecha" value={date} setValue={setDate} placeholder="AAAA-MM-DD" /><Field label="Pileta" value={pool} setValue={setPool} numeric grow={false} /></View><Text style={s.label}>Grupo</Text><View style={s.chips}>{groups.map((group) => <Chip key={group.id} label={group.name} active={groupId === group.id} onPress={() => setGroupId(group.id)} />)}</View></Card>
    <Card><View style={s.sectionHead}><View><Text style={s.sectionTitle}>Agregar serie</Text><Text style={s.caption}>{sets.reduce((sum, item) => sum + item.reps * item.distance, 0).toLocaleString('es-AR')} m</Text></View></View><Text style={s.label}>Fase</Text><View style={s.chips}>{PHASES.map((phase) => <Chip key={phase} label={phase} active={draft.phase === phase} onPress={() => setDraft((x) => ({ ...x, phase }))} />)}</View><View style={s.form}><Field label="Reps" value={String(draft.reps)} setValue={(value) => setDraft((x) => ({ ...x, reps: value }))} numeric grow={false} /><Field label="Metros" value={String(draft.distance)} setValue={(value) => setDraft((x) => ({ ...x, distance: value }))} numeric grow={false} /><Field label="Salida" value={draft.interval} setValue={(value) => setDraft((x) => ({ ...x, interval: value }))} placeholder="1:40" grow={false} /></View><Text style={s.label}>Estilo</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{STROKES.map((stroke) => <Chip key={stroke} label={stroke} active={draft.stroke === stroke} onPress={() => setDraft((x) => ({ ...x, stroke }))} />)}</ScrollView><Field label="Indicaciones" value={draft.note} setValue={(value) => setDraft((x) => ({ ...x, note: value }))} placeholder="Ritmo u objetivo" /><Pressable onPress={() => setDraft((x) => ({ ...x, timed: !x.timed }))} style={s.checkRow}><View style={[s.check, draft.timed && s.checkActive]}><Text style={s.checkText}>{draft.timed ? '✓' : ''}</Text></View><Text style={s.rowTitle}>Registrar tiempos individuales</Text></Pressable><Button primary label="Agregar serie" onPress={addSet} /></Card>
    {PHASES.map((phase) => { const list = sets.filter((item) => item.phase === phase); return list.length ? <Card key={phase}><Text style={s.sectionTitle}>{phase}</Text>{list.map((item, index) => <View key={item.id} style={[s.row, index === 0 && s.noBorder]}><View style={s.number}><Text style={s.caption}>{index + 1}</Text></View><View style={s.grow}><Text style={s.rowTitle}>{item.reps} × {item.distance} m {item.stroke}</Text><Text style={s.caption}>{item.interval ? `Salida ${item.interval}` : 'Sin salida'}{item.note ? ` · ${item.note}` : ''}</Text></View>{item.timed ? <Badge label="Tiempos" tone="blue" /> : null}<Button small ghost label="Quitar" onPress={() => setSets((current) => current.filter((set) => set.id !== item.id))} /></View>)}</Card> : null; })}
    <View style={s.actions}><Button full label="Guardar borrador" onPress={() => save(false)} /><Button full primary label="Guardar y usar" onPress={() => save(true)} /></View>
  </View>;

  return <View style={s.gap}><Title eyebrow="PLAN" title="Entrenamientos" action={<Button primary small label="Crear" onPress={() => setTitle('Nueva sesión')} />} />{!workouts.length ? <Empty text="No hay entrenamientos" action="Crear" onAction={() => setTitle('Nueva sesión')} /> : workouts.map((workout) => <Card key={workout.id}><View style={s.workoutHead}><View style={s.grow}><View style={s.badges}><Badge label={workout.date} /><Badge label={workout.ready ? 'Listo' : 'Borrador'} tone={workout.ready ? 'green' : null} /></View><Text style={s.workoutTitle}>{workout.title}</Text><Text style={s.caption}>{groups.find((g) => g.id === workout.groupId)?.name} · {meters(workout).toLocaleString('es-AR')} m · {workout.poolLength} m</Text></View><View style={s.actions}><Button primary small label="Usar" onPress={() => useWorkout(workout.id)} /><Button small label="Editar" onPress={() => edit(workout)} /><Button small ghost label="Eliminar" onPress={() => setWorkouts((current) => current.filter((item) => item.id !== workout.id))} /></View></View><View style={s.setSummary}>{PHASES.map((phase) => { const list = workout.sets.filter((set) => set.phase === phase); return list.length ? <View key={phase} style={s.summaryBlock}><Text style={s.rowTitle}>{phase}</Text><Text style={s.caption}>{list.map((set) => `${set.reps}×${set.distance}`).join(' · ')}</Text></View> : null; })}</View></Card>)}</View>;
}

function Team({ groups, setGroups, swimmers, setSwimmers, notify }) {
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [name, setName] = useState('');
  const [lane, setLane] = useState('1');
  const [groupName, setGroupName] = useState('');
  const roster = swimmers.filter((x) => x.active && x.groupId === groupId);
  const addGroup = () => { if (!groupName.trim()) return; const group = { id: id('group'), name: groupName.trim() }; setGroups((x) => [...x, group]); setGroupId(group.id); setGroupName(''); };
  const addSwimmer = () => { if (!name.trim()) return; setSwimmers((x) => [...x, { id: id('swimmer'), name: name.trim(), groupId, lane: Number(lane) || 1, active: true }]); setName(''); notify('Nadador agregado.'); };
  return <View style={s.gap}><Title eyebrow="EQUIPO" title="Nadadores" action={<Badge label={`${swimmers.filter((x) => x.active).length} activos`} tone="blue" />} /><Card><Text style={s.label}>Grupo</Text><View style={s.chips}>{groups.map((group) => <Chip key={group.id} label={group.name} active={groupId === group.id} onPress={() => setGroupId(group.id)} />)}</View><View style={s.form}><Field value={groupName} setValue={setGroupName} placeholder="Nuevo grupo" /><Button label="Agregar grupo" onPress={addGroup} /></View></Card><Card><Text style={s.sectionTitle}>Agregar nadador</Text><View style={s.form}><Field value={name} setValue={setName} placeholder="Nombre y apellido" /><Field value={lane} setValue={setLane} placeholder="Carril" numeric grow={false} /><Button primary label="Agregar" onPress={addSwimmer} /></View></Card><Card><Text style={s.sectionTitle}>{groups.find((g) => g.id === groupId)?.name}</Text>{roster.map((swimmer, index) => <View key={swimmer.id} style={[s.row, index === 0 && s.noBorder]}><View style={s.avatar}><Text style={s.avatarText}>{swimmer.name[0]}</Text></View><View style={s.grow}><Text style={s.rowTitle}>{swimmer.name}</Text><Text style={s.caption}>Carril {swimmer.lane}</Text></View><View style={s.lanes}>{[1,2,3,4,5,6].map((value) => <Pressable key={value} onPress={() => setSwimmers((x) => x.map((item) => item.id === swimmer.id ? { ...item, lane: value } : item))} style={[s.lane, swimmer.lane === value && s.laneActive]}><Text style={[s.laneText, swimmer.lane === value && s.whiteText]}>{value}</Text></Pressable>)}</View><Button small ghost label="Quitar" onPress={() => setSwimmers((x) => x.map((item) => item.id === swimmer.id ? { ...item, active: false } : item))} /></View>)}</Card></View>;
}

const makeSession = (workout, swimmers) => ({ id: id('session'), workoutId: workout.id, date: today(), status: 'attendance', presentIds: swimmers.filter((x) => x.active && x.groupId === workout.groupId).map((x) => x.id), setIndex: 0, repIndex: 0, splits: {}, completed: 0 });

function Pool({ data, setSessions, selectedWorkoutId, setSelectedWorkoutId, notify }) {
  const ready = data.workouts.filter((x) => x.ready);
  const workout = data.workouts.find((x) => x.id === selectedWorkoutId) || ready[0] || data.workouts[0];
  const activeSession = workout && data.sessions.find((x) => x.workoutId === workout.id && x.status !== 'finished');
  const [sessionId, setSessionId] = useState(activeSession?.id || null);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const session = data.sessions.find((x) => x.id === sessionId) || activeSession;
  const roster = workout ? data.swimmers.filter((x) => x.active && x.groupId === workout.groupId) : [];
  const group = workout && data.groups.find((x) => x.id === workout.groupId);

  useEffect(() => { if (running && startedAt) { const interval = setInterval(() => setElapsed(Date.now() - startedAt), 50); return () => clearInterval(interval); } return undefined; }, [running, startedAt]);
  const patch = (fn) => setSessions((list) => list.map((item) => item.id === session.id ? fn(item) : item));
  const select = (workoutId) => { setSelectedWorkoutId(workoutId); const found = data.sessions.find((x) => x.workoutId === workoutId && x.status !== 'finished'); setSessionId(found?.id || null); setRunning(false); setElapsed(0); };
  const create = () => { const next = makeSession(workout, data.swimmers); setSessions((x) => [...x, next]); setSessionId(next.id); };
  const resetTimer = () => { setRunning(false); setStartedAt(null); setElapsed(0); };

  if (!workout) return <View style={s.gap}><Title eyebrow="PILETA" title="Sesión" /><Empty text="Primero creá un entrenamiento" /></View>;
  if (!session) return <View style={s.gap}><Title eyebrow="PILETA" title="Elegir sesión" /><Card><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{ready.map((item) => <Chip key={item.id} label={item.title} active={workout.id === item.id} onPress={() => select(item.id)} />)}</ScrollView><View style={s.preview}><Badge label={workout.date} /><Text style={s.workoutTitle}>{workout.title}</Text><Text style={s.caption}>{group?.name} · {meters(workout).toLocaleString('es-AR')} m · {roster.length} nadadores</Text></View><Button primary label="Preparar asistencia" onPress={create} /></Card></View>;

  if (session.status === 'attendance') return <View style={s.gap}><Title eyebrow="ASISTENCIA" title={workout.title} action={<Badge label={`${session.presentIds.length}/${roster.length}`} tone="blue" />} /><Card><View style={s.sectionHead}><Text style={s.sectionTitle}>{group?.name}</Text><View style={s.actions}><Button small label="Todos" onPress={() => patch((x) => ({ ...x, presentIds: roster.map((r) => r.id) }))} /><Button small ghost label="Ninguno" onPress={() => patch((x) => ({ ...x, presentIds: [] }))} /></View></View><View style={s.attendance}>{roster.map((swimmer) => { const present = session.presentIds.includes(swimmer.id); return <Pressable key={swimmer.id} onPress={() => patch((x) => ({ ...x, presentIds: present ? x.presentIds.filter((value) => value !== swimmer.id) : [...x.presentIds, swimmer.id] }))} style={[s.attendanceCard, present && s.attendanceActive]}><View style={[s.check, present && s.checkActive]}><Text style={s.checkText}>{present ? '✓' : ''}</Text></View><Text style={s.attendanceName}>{swimmer.name}</Text><Text style={s.caption}>Carril {swimmer.lane}</Text></Pressable>; })}</View></Card><Button full primary disabled={!session.presentIds.length} label="Iniciar entrenamiento" onPress={() => patch((x) => ({ ...x, status: 'live' }))} /></View>;

  if (session.status === 'finished') return <SessionResult session={session} workout={workout} swimmers={data.swimmers} onBack={() => { setSessionId(null); setSelectedWorkoutId(null); }} />;
  const current = workout.sets[session.setIndex];
  if (!current) return null;
  const key = `${current.id}:${session.repIndex}`;
  const split = session.splits[key] || {};
  const present = roster.filter((x) => session.presentIds.includes(x.id));
  const totalReps = workout.sets.reduce((sum, set) => sum + set.reps, 0);
  const previous = workout.sets.slice(0, session.setIndex).reduce((sum, set) => sum + set.reps, 0);
  const progress = Math.round(((previous + session.repIndex) / Math.max(1, totalReps)) * 100);
  const record = (swimmerId) => { if (!running || !current.timed || split[swimmerId] !== undefined) return; patch((x) => ({ ...x, splits: { ...x.splits, [key]: { ...(x.splits[key] || {}), [swimmerId]: elapsed / 1000 } } })); };
  const advance = () => { let setIndex = session.setIndex; let repIndex = session.repIndex + 1; if (repIndex >= current.reps) { setIndex += 1; repIndex = 0; } resetTimer(); if (setIndex >= workout.sets.length) { patch((x) => ({ ...x, status: 'finished', completed: x.completed + 1 })); notify('Sesión guardada.'); } else patch((x) => ({ ...x, setIndex, repIndex, completed: x.completed + 1 })); };
  return <View style={s.gap}><Title eyebrow={current.phase.toUpperCase()} title={`${current.reps} × ${current.distance} m ${current.stroke}`} action={<Badge label={`${progress}%`} tone="blue" />} /><Text style={s.caption}>Repetición {session.repIndex + 1} de {current.reps}{current.interval ? ` · salida ${current.interval}` : ''}</Text><View style={s.progress}><View style={[s.progressFill, { width: `${progress}%` }]} /></View><Card style={s.timerCard}><Text style={s.timer}>{timerText(elapsed)}</Text><Text style={s.muted}>{current.note || (current.timed ? 'Tocá cada nadador cuando llegue.' : 'Completá el bloque y avanzá.')}</Text>{current.timed ? <View style={s.actions}><Button primary label={running ? 'Cronómetro activo' : 'Iniciar'} disabled={running} onPress={() => { setElapsed(0); setStartedAt(Date.now()); setRunning(true); }} /><Button label="Reiniciar" onPress={resetTimer} /></View> : null}</Card>{current.timed ? <View style={s.timerGrid}>{present.map((swimmer) => { const value = split[swimmer.id]; return <Pressable key={swimmer.id} disabled={!running || value !== undefined} onPress={() => record(swimmer.id)} style={[s.swimmerTimer, value !== undefined && s.recorded]}><Text style={s.eyebrow}>CARRIL {swimmer.lane}</Text><Text style={s.swimmerName}>{swimmer.name}</Text><Text style={[s.swimmerTime, value !== undefined && s.greenText]}>{value !== undefined ? timeText(value) : 'Tocar al llegar'}</Text></Pressable>; })}</View> : <Card><Text style={s.sectionTitle}>Bloque sin toma de tiempos</Text><Text style={s.caption}>{current.reps * current.distance} m · {current.note}</Text></Card>}<Button full primary label={current.timed ? `Continuar (${Object.keys(split).length}/${present.length})` : 'Marcar completado'} onPress={advance} /></View>;
}

function SessionResult({ session, workout, swimmers, onBack }) {
  const rows = swimmers.filter((x) => session.presentIds.includes(x.id)).map((swimmer) => { const times = Object.values(session.splits).map((split) => split[swimmer.id]).filter((x) => typeof x === 'number'); return { swimmer, times, best: times.length ? Math.min(...times) : null, avg: times.length ? times.reduce((a,b) => a+b, 0) / times.length : null }; });
  return <View style={s.gap}><Title eyebrow="GUARDADO" title="Resumen" action={<Badge label="Completado" tone="green" />} /><Card><Text style={s.workoutTitle}>{workout.title}</Text><Text style={s.caption}>{meters(workout).toLocaleString('es-AR')} m · {rows.length} presentes</Text></Card><Card>{rows.map((row, index) => <View key={row.swimmer.id} style={[s.row, index === 0 && s.noBorder]}><View style={s.avatar}><Text style={s.avatarText}>{row.swimmer.name[0]}</Text></View><View style={s.grow}><Text style={s.rowTitle}>{row.swimmer.name}</Text><Text style={s.caption}>{row.times.length} tiempos</Text></View><View style={s.result}><Text style={s.rowTitle}>{timeText(row.best)}</Text><Text style={s.caption}>mejor</Text></View><View style={s.result}><Text style={s.rowTitle}>{timeText(row.avg)}</Text><Text style={s.caption}>promedio</Text></View></View>)}</Card><Button primary label="Volver" onPress={onBack} /></View>;
}

function History({ data }) {
  const list = data.sessions.filter((x) => x.status === 'finished').slice().reverse();
  return <View style={s.gap}><Title eyebrow="HISTORIAL" title="Sesiones" action={<Badge label={String(list.length)} tone="blue" />} />{!list.length ? <Empty text="Todavía no hay sesiones terminadas" /> : list.map((session) => { const workout = data.workouts.find((x) => x.id === session.workoutId); if (!workout) return null; const times = Object.values(session.splits).reduce((sum, split) => sum + Object.keys(split).length, 0); return <Card key={session.id}><View style={s.workoutHead}><View style={s.grow}><Badge label={session.date} /><Text style={s.workoutTitle}>{workout.title}</Text><Text style={s.caption}>{session.presentIds.length} presentes · {times} tiempos · {session.completed} repeticiones</Text></View><Badge label="Completado" tone="green" /></View></Card>; })}</View>;
}

export default function App() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [data, setData] = useState(loadData);
  const [active, setActive] = useState('home');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [toast, setToast] = useState('');
  useEffect(() => { if (Platform.OS === 'web' && globalThis.localStorage) globalThis.localStorage.setItem(KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => { if (toast) { const timeout = setTimeout(() => setToast(''), 2400); return () => clearTimeout(timeout); } return undefined; }, [toast]);
  const listSetter = (field) => (updater) => setData((current) => ({ ...current, [field]: typeof updater === 'function' ? updater(current[field]) : updater }));
  const setGroups = listSetter('groups'), setSwimmers = listSetter('swimmers'), setWorkouts = listSetter('workouts'), setSessions = listSetter('sessions');
  const useWorkout = (workoutId) => { setWorkouts((list) => list.map((x) => x.id === workoutId ? { ...x, ready: true } : x)); setSelectedWorkoutId(workoutId); setActive('pool'); };
  const screen = useMemo(() => {
    if (active === 'home') return <Home data={data} go={setActive} />;
    if (active === 'plan') return <Plan groups={data.groups} workouts={data.workouts} setWorkouts={setWorkouts} useWorkout={useWorkout} notify={setToast} />;
    if (active === 'pool') return <Pool data={data} setSessions={setSessions} selectedWorkoutId={selectedWorkoutId} setSelectedWorkoutId={setSelectedWorkoutId} notify={setToast} />;
    if (active === 'team') return <Team groups={data.groups} setGroups={setGroups} swimmers={data.swimmers} setSwimmers={setSwimmers} notify={setToast} />;
    return <History data={data} />;
  }, [active, data, selectedWorkoutId]);
  return <SafeAreaView style={s.safe}><StatusBar barStyle="dark-content" backgroundColor={C.bg} /><View style={s.app}><Header /><View style={s.body}>{wide ? <Navigation active={active} setActive={setActive} /> : null}<ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{screen}<View style={{ height: 30 }} /></ScrollView></View>{!wide ? <Navigation active={active} setActive={setActive} mobile /> : null}{toast ? <View style={s.toast}><Text style={s.toastText}>{toast}</Text></View> : null}</View></SafeAreaView>;
}

const shadow = Platform.select({ web: { boxShadow: '0 10px 28px rgba(0,0,0,.055)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 7 }, shadowOpacity: .07, shadowRadius: 16, elevation: 3 } });
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg }, app: { flex: 1, backgroundColor: C.bg }, body: { flex: 1, flexDirection: 'row' }, scroll: { flex: 1 }, content: { width: '100%', maxWidth: 1100, alignSelf: 'center', padding: 22 }, gap: { gap: 16 }, grow: { flex: 1 }, full: { flex: 1, minWidth: 180 },
  header: { minHeight: 72, paddingHorizontal: 22, paddingVertical: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 10 }, logo: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.black, alignItems: 'center', justifyContent: 'center' }, logoText: { color: C.white, fontSize: 18, fontWeight: '800' }, brand: { color: C.text, fontSize: 16, fontWeight: '800' }, caption: { color: C.muted, fontSize: 11, lineHeight: 16 }, muted: { color: C.muted, fontSize: 12, lineHeight: 18 },
  sidebar: { width: 185, padding: 14, gap: 4, backgroundColor: C.white, borderRightWidth: 1, borderRightColor: C.line }, navItem: { minHeight: 44, borderRadius: 12, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 }, mobileNav: { minHeight: 68, padding: 8, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.line, flexDirection: 'row' }, mobileItem: { flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 5 }, navActive: { backgroundColor: C.soft }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#AEAEB2' }, dotActive: { backgroundColor: C.blue }, navText: { color: C.muted, fontSize: 12, fontWeight: '700' }, navTextActive: { color: C.text },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 }, eyebrow: { color: C.blue, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 5 }, title: { color: C.text, fontSize: 30, lineHeight: 34, fontWeight: '800', letterSpacing: -1 }, sectionTitle: { color: C.text, fontSize: 18, fontWeight: '800' }, rowTitle: { color: C.text, fontSize: 13, fontWeight: '700' }, workoutTitle: { color: C.text, fontSize: 22, lineHeight: 27, fontWeight: '800', marginTop: 9, marginBottom: 4 },
  card: { padding: 18, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 22, ...shadow }, hero: { minHeight: 225, padding: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 18 }, heroMain: { flex: 2, minWidth: 250, justifyContent: 'center', alignItems: 'flex-start' }, heroTitle: { color: C.text, fontSize: 32, lineHeight: 36, fontWeight: '800', letterSpacing: -1, marginTop: 12, marginBottom: 7 }, heroStats: { flex: 1, minWidth: 210, flexDirection: 'row', backgroundColor: C.soft, borderRadius: 18, alignItems: 'center' }, stat: { flex: 1, alignItems: 'center' }, statValue: { color: C.text, fontSize: 28, fontWeight: '800' }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, metric: { flexGrow: 1, flexBasis: 180, minWidth: 160 }, metricValue: { color: C.text, fontSize: 28, fontWeight: '800', marginBottom: 5 },
  button: { minHeight: 44, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 13, backgroundColor: C.soft, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }, buttonPrimary: { backgroundColor: C.blue, borderColor: C.blue }, buttonGhost: { backgroundColor: 'transparent', borderColor: 'transparent' }, buttonDanger: { backgroundColor: C.redSoft, borderColor: C.redSoft }, buttonSmall: { minHeight: 36, paddingHorizontal: 12, paddingVertical: 8 }, buttonText: { color: C.text, fontSize: 13, fontWeight: '700' }, buttonTextPrimary: { color: C.white }, blueText: { color: C.blue }, redText: { color: C.red }, whiteText: { color: C.white }, greenText: { color: C.green }, disabled: { opacity: .4 }, pressed: { opacity: .72, transform: [{ scale: .99 }] },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 18 }, sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }, badges: { flexDirection: 'row', gap: 7 }, badge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, backgroundColor: C.soft }, badgeGreen: { backgroundColor: C.greenSoft }, badgeBlue: { backgroundColor: C.blueSoft }, badgeRed: { backgroundColor: C.redSoft }, badgeText: { color: C.text, fontSize: 10, fontWeight: '800' },
  row: { minHeight: 64, paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.line, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 11 }, noBorder: { borderTopWidth: 0 }, dateBox: { width: 44, height: 48, borderRadius: 13, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }, dateDay: { color: C.text, fontSize: 16, fontWeight: '800' }, number: { width: 30, height: 30, borderRadius: 9, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }, avatar: { width: 38, height: 38, borderRadius: 13, backgroundColor: C.blueSoft, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: C.blue, fontWeight: '800' }, result: { minWidth: 75, alignItems: 'flex-end' },
  field: { minWidth: 105, marginTop: 12 }, label: { color: C.muted, fontSize: 11, fontWeight: '700', marginBottom: 7, marginTop: 10 }, input: { minHeight: 45, paddingHorizontal: 13, borderRadius: 13, borderWidth: 1, borderColor: C.line, color: C.text, backgroundColor: C.soft, fontSize: 13 }, form: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', gap: 10 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 8 }, chip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: C.white }, chipActive: { backgroundColor: C.blue, borderColor: C.blue }, chipText: { color: C.muted, fontSize: 12, fontWeight: '700' }, chipTextActive: { color: C.white }, checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14 }, check: { width: 23, height: 23, borderRadius: 7, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }, checkActive: { backgroundColor: C.blue, borderColor: C.blue }, checkText: { color: C.white, fontSize: 13, fontWeight: '900' },
  workoutHead: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 14 }, setSummary: { marginTop: 15, borderTopWidth: 1, borderTopColor: C.line }, summaryBlock: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line }, preview: { paddingVertical: 24, alignItems: 'flex-start' },
  lanes: { flexDirection: 'row', gap: 4 }, lane: { width: 28, height: 28, borderRadius: 9, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' }, laneActive: { backgroundColor: C.black }, laneText: { color: C.muted, fontSize: 10, fontWeight: '800' },
  attendance: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, attendanceCard: { flexGrow: 1, flexBasis: 200, minWidth: 165, minHeight: 112, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: C.line, backgroundColor: C.soft }, attendanceActive: { backgroundColor: C.greenSoft, borderColor: '#CDEFD6' }, attendanceName: { color: C.text, fontSize: 15, fontWeight: '800', marginTop: 10 },
  progress: { height: 8, borderRadius: 999, backgroundColor: C.line, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 999, backgroundColor: C.blue }, timerCard: { alignItems: 'center', paddingVertical: 28 }, timer: { color: C.text, fontSize: 58, lineHeight: 64, fontWeight: '700', letterSpacing: -2, fontVariant: ['tabular-nums'], marginBottom: 6 }, timerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, swimmerTimer: { flexGrow: 1, flexBasis: 225, minWidth: 185, minHeight: 140, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, ...shadow }, recorded: { backgroundColor: C.greenSoft, borderColor: '#CDEFD6', opacity: .8 }, swimmerName: { color: C.text, fontSize: 18, fontWeight: '800', marginTop: 7 }, swimmerTime: { color: C.muted, fontSize: 20, fontWeight: '700', marginTop: 20 },
  empty: { minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 13 }, toast: { position: 'absolute', left: 20, right: 20, bottom: 82, alignItems: 'center' }, toastText: { color: C.white, backgroundColor: C.black, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 999, overflow: 'hidden', fontSize: 12, fontWeight: '700', ...shadow },
});
