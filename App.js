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

const COLORS = {
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F2F7',
  text: '#1D1D1F',
  secondary: '#6E6E73',
  tertiary: '#AEAEB2',
  line: '#E5E5EA',
  blue: '#007AFF',
  blueSoft: '#EAF3FF',
  green: '#34C759',
  greenSoft: '#EAF8EE',
  orange: '#FF9500',
  orangeSoft: '#FFF4E5',
  red: '#FF3B30',
  redSoft: '#FFF0EF',
};

const INITIAL_GROUPS = [
  { id: 'g1', name: 'Competición', schedule: 'Lun · Mié · Vie · 19:00' },
  { id: 'g2', name: 'Masters', schedule: 'Mar · Jue · 20:00' },
];

const INITIAL_ATHLETES = [
  {
    id: 'a1',
    name: 'Sofía Méndez',
    groupId: 'g1',
    lane: 1,
    age: 19,
    stroke: 'Libre',
    present: true,
    attendance: 92,
    pb50: 29.84,
    weekMeters: 12800,
  },
  {
    id: 'a2',
    name: 'Tomás Ríos',
    groupId: 'g1',
    lane: 2,
    age: 22,
    stroke: 'Mariposa',
    present: true,
    attendance: 88,
    pb50: 27.42,
    weekMeters: 14200,
  },
  {
    id: 'a3',
    name: 'Malena Costa',
    groupId: 'g1',
    lane: 3,
    age: 18,
    stroke: 'Espalda',
    present: true,
    attendance: 95,
    pb50: 31.15,
    weekMeters: 11900,
  },
  {
    id: 'a4',
    name: 'Nicolás Paz',
    groupId: 'g2',
    lane: 1,
    age: 31,
    stroke: 'Libre',
    present: false,
    attendance: 81,
    pb50: 28.91,
    weekMeters: 9800,
  },
];

const INITIAL_WORKOUTS = [
  {
    id: 'w1',
    title: 'Velocidad y técnica',
    date: 'Hoy',
    time: '19:00',
    distance: 3200,
    groupId: 'g1',
    released: true,
    blocks: [
      { name: 'Entrada en calor', detail: '600 m suave + movilidad' },
      { name: 'Trabajo principal', detail: '8×50 progresivos + 12×25 velocidad' },
      { name: 'Vuelta a la calma', detail: '400 m regenerativo' },
    ],
  },
  {
    id: 'w2',
    title: 'Umbral aeróbico',
    date: 'Miércoles',
    time: '19:00',
    distance: 4100,
    groupId: 'g1',
    released: true,
    blocks: [
      { name: 'Entrada en calor', detail: '800 m variado' },
      { name: 'Trabajo principal', detail: '5×400 ritmo controlado' },
      { name: 'Vuelta a la calma', detail: '300 m suave' },
    ],
  },
  {
    id: 'w3',
    title: 'Técnica de estilos',
    date: 'Jueves',
    time: '20:00',
    distance: 2600,
    groupId: 'g2',
    released: false,
    blocks: [
      { name: 'Entrada en calor', detail: '600 m libre' },
      { name: 'Trabajo principal', detail: '12×100 combinados' },
      { name: 'Vuelta a la calma', detail: '400 m suave' },
    ],
  },
];

const STORAGE_KEY = 'swimapp-stage-one';

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Button({ label, onPress, variant = 'primary', small = false, disabled = false }) {
  const buttonStyle = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
    subtle: styles.buttonSubtle,
    danger: styles.buttonDanger,
  }[variant];
  const textStyle = variant === 'primary' ? styles.buttonTextPrimary : variant === 'danger' ? styles.buttonTextDanger : styles.buttonText;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        small && styles.buttonSmall,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonLabel, textStyle]}>{label}</Text>
    </Pressable>
  );
}

function Chip({ label, active = false, onPress, tone = 'blue' }) {
  const toneStyle = tone === 'green' ? styles.chipGreen : tone === 'orange' ? styles.chipOrange : styles.chipBlue;
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={[styles.chip, active ? toneStyle : styles.chipNeutral]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Avatar({ name, size = 'medium' }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
  return (
    <View style={[styles.avatar, size === 'large' && styles.avatarLarge]}>
      <Text style={[styles.avatarText, size === 'large' && styles.avatarTextLarge]}>{initials}</Text>
    </View>
  );
}

function EmptyState({ title, action }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {action}
    </View>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.flexOne}>
        <Text style={styles.pageTitle}>{title}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

function Metric({ value, label }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <View style={styles.segmentedControl}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[styles.segment, value === option.value && styles.segmentActive]}
        >
          <Text style={[styles.segmentText, value === option.value && styles.segmentTextActive]}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function RoleEntry({ athletes, onEnter }) {
  const [role, setRole] = useState('coach');
  const [athleteId, setAthleteId] = useState(athletes[0]?.id || '');

  return (
    <SafeAreaView style={styles.entrySafeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.entryContainer}>
        <View style={styles.brandMark}><View style={styles.brandWave} /></View>
        <Text style={styles.brandName}>SwimApp</Text>
        <Text style={styles.entryTitle}>Tu equipo, en un solo lugar.</Text>

        <Card style={styles.entryCard}>
          <SegmentedControl
            value={role}
            onChange={setRole}
            options={[
              { value: 'coach', label: 'Entrenador' },
              { value: 'swimmer', label: 'Nadador' },
            ]}
          />

          {role === 'swimmer' ? (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Perfil de prueba</Text>
              <View style={styles.chipWrap}>
                {athletes.map((athlete) => (
                  <Chip
                    key={athlete.id}
                    label={athlete.name}
                    active={athleteId === athlete.id}
                    onPress={() => setAthleteId(athlete.id)}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.entryPreview}>
              <Text style={styles.entryPreviewTitle}>Club Demo</Text>
              <Text style={styles.entryPreviewMeta}>{athletes.length} nadadores · 2 grupos</Text>
            </View>
          )}

          <Button label="Entrar" onPress={() => onEnter(role, athleteId)} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Navigation({ role, active, onChange, wide }) {
  const coachItems = [
    ['home', 'Inicio'],
    ['team', 'Equipo'],
    ['workouts', 'Entrenamientos'],
    ['attendance', 'Asistencia'],
    ['profile', 'Perfil'],
  ];
  const swimmerItems = [
    ['home', 'Inicio'],
    ['workouts', 'Entrenamientos'],
    ['progress', 'Progreso'],
    ['profile', 'Perfil'],
  ];
  const items = role === 'coach' ? coachItems : swimmerItems;

  return (
    <View style={wide ? styles.sideNavigation : styles.bottomNavigation}>
      {items.map(([key, label]) => (
        <Pressable
          key={key}
          onPress={() => onChange(key)}
          style={[wide ? styles.sideNavItem : styles.bottomNavItem, active === key && (wide ? styles.sideNavItemActive : styles.bottomNavItemActive)]}
        >
          <View style={[styles.navDot, active === key && styles.navDotActive]} />
          <Text style={[styles.navLabel, active === key && styles.navLabelActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function AppHeader({ role, onExit }) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.headerBrand}>
        <View style={styles.headerMark}><View style={styles.headerWave} /></View>
        <Text style={styles.headerTitle}>SwimApp</Text>
      </View>
      <View style={styles.headerActions}>
        <Chip label={role === 'coach' ? 'Entrenador' : 'Nadador'} active />
        <Button label="Salir" variant="subtle" small onPress={onExit} />
      </View>
    </View>
  );
}

function CoachHome({ athletes, groups, workouts, setActive }) {
  const nextWorkout = workouts[0];
  const present = athletes.filter((athlete) => athlete.present).length;
  const released = workouts.filter((workout) => workout.released).length;

  return (
    <View style={styles.pageStack}>
      <PageHeader title="Inicio" subtitle="Hoy" />

      <Card style={styles.featureCard}>
        <View style={styles.featureContent}>
          <Text style={styles.overline}>PRÓXIMA SESIÓN</Text>
          <Text style={styles.featureTitle}>{nextWorkout?.title}</Text>
          <Text style={styles.featureMeta}>{nextWorkout?.date} · {nextWorkout?.time} · {nextWorkout?.distance.toLocaleString('es-AR')} m</Text>
          <View style={styles.actionRow}>
            <Button label="Ver sesión" onPress={() => setActive('workouts')} />
            <Button label="Pasar asistencia" variant="secondary" onPress={() => setActive('attendance')} />
          </View>
        </View>
        <View style={styles.featureBadge}>
          <Text style={styles.featureBadgeValue}>{present}</Text>
          <Text style={styles.featureBadgeLabel}>presentes</Text>
        </View>
      </Card>

      <View style={styles.metricsGrid}>
        <Card style={styles.metricCard}><Metric value={athletes.length} label="Nadadores" /></Card>
        <Card style={styles.metricCard}><Metric value={groups.length} label="Grupos" /></Card>
        <Card style={styles.metricCard}><Metric value={released} label="Sesiones visibles" /></Card>
      </View>

      <View style={styles.homeGrid}>
        <Card style={styles.homePanel}>
          <PageHeader title="Equipo" action={<Button label="Abrir" variant="subtle" small onPress={() => setActive('team')} />} />
          {athletes.slice(0, 4).map((athlete) => (
            <View key={athlete.id} style={styles.listRow}>
              <Avatar name={athlete.name} />
              <View style={styles.flexOne}>
                <Text style={styles.rowTitle}>{athlete.name}</Text>
                <Text style={styles.rowMeta}>Carril {athlete.lane}</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: athlete.present ? COLORS.green : COLORS.tertiary }]} />
            </View>
          ))}
        </Card>

        <Card style={styles.homePanel}>
          <PageHeader title="Semana" action={<Button label="Abrir" variant="subtle" small onPress={() => setActive('workouts')} />} />
          {workouts.slice(0, 3).map((workout) => (
            <View key={workout.id} style={styles.workoutRow}>
              <View style={styles.dateTile}>
                <Text style={styles.dateTileDay}>{workout.date.slice(0, 3)}</Text>
                <Text style={styles.dateTileTime}>{workout.time}</Text>
              </View>
              <View style={styles.flexOne}>
                <Text style={styles.rowTitle}>{workout.title}</Text>
                <Text style={styles.rowMeta}>{workout.distance.toLocaleString('es-AR')} m</Text>
              </View>
              <Chip label={workout.released ? 'Visible' : 'Borrador'} active={workout.released} tone={workout.released ? 'green' : 'orange'} />
            </View>
          ))}
        </Card>
      </View>
    </View>
  );
}

function TeamScreen({ athletes, setAthletes, groups, setGroups }) {
  const [section, setSection] = useState('athletes');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [lane, setLane] = useState('1');
  const [groupName, setGroupName] = useState('');
  const [schedule, setSchedule] = useState('');

  const addAthlete = () => {
    if (!name.trim()) return;
    setAthletes((current) => [
      ...current,
      {
        id: `a${Date.now()}`,
        name: name.trim(),
        groupId,
        lane: Number(lane) || 1,
        age: 0,
        stroke: 'Libre',
        present: true,
        attendance: 100,
        pb50: 0,
        weekMeters: 0,
      },
    ]);
    setName('');
    setLane('1');
    setShowForm(false);
  };

  const addGroup = () => {
    if (!groupName.trim()) return;
    const newId = `g${Date.now()}`;
    setGroups((current) => [...current, { id: newId, name: groupName.trim(), schedule: schedule.trim() || 'Horario a definir' }]);
    setGroupName('');
    setSchedule('');
    setGroupId(newId);
    setShowForm(false);
  };

  const removeAthlete = (id) => setAthletes((current) => current.filter((athlete) => athlete.id !== id));
  const removeGroup = (id) => {
    if (athletes.some((athlete) => athlete.groupId === id)) return;
    setGroups((current) => current.filter((group) => group.id !== id));
  };

  return (
    <View style={styles.pageStack}>
      <PageHeader
        title="Equipo"
        subtitle={`${athletes.length} nadadores · ${groups.length} grupos`}
        action={<Button label={showForm ? 'Cancelar' : 'Agregar'} small onPress={() => setShowForm((value) => !value)} />}
      />

      <SegmentedControl
        value={section}
        onChange={(value) => { setSection(value); setShowForm(false); }}
        options={[
          { value: 'athletes', label: 'Nadadores' },
          { value: 'groups', label: 'Grupos' },
        ]}
      />

      {showForm ? (
        <Card>
          {section === 'athletes' ? (
            <View style={styles.formStack}>
              <Text style={styles.formTitle}>Nuevo nadador</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre y apellido" placeholderTextColor={COLORS.tertiary} />
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Grupo</Text>
                <View style={styles.chipWrap}>
                  {groups.map((group) => <Chip key={group.id} label={group.name} active={groupId === group.id} onPress={() => setGroupId(group.id)} />)}
                </View>
              </View>
              <TextInput style={styles.input} value={lane} onChangeText={setLane} placeholder="Carril" placeholderTextColor={COLORS.tertiary} keyboardType="numeric" />
              <Button label="Guardar nadador" onPress={addAthlete} />
            </View>
          ) : (
            <View style={styles.formStack}>
              <Text style={styles.formTitle}>Nuevo grupo</Text>
              <TextInput style={styles.input} value={groupName} onChangeText={setGroupName} placeholder="Nombre del grupo" placeholderTextColor={COLORS.tertiary} />
              <TextInput style={styles.input} value={schedule} onChangeText={setSchedule} placeholder="Días y horario" placeholderTextColor={COLORS.tertiary} />
              <Button label="Guardar grupo" onPress={addGroup} />
            </View>
          )}
        </Card>
      ) : null}

      {section === 'athletes' ? (
        <Card style={styles.listCard}>
          {athletes.length ? athletes.map((athlete, index) => {
            const group = groups.find((item) => item.id === athlete.groupId);
            return (
              <View key={athlete.id} style={[styles.personRow, index > 0 && styles.rowDivider]}>
                <Avatar name={athlete.name} size="large" />
                <View style={styles.flexOne}>
                  <Text style={styles.personName}>{athlete.name}</Text>
                  <Text style={styles.rowMeta}>{group?.name || 'Sin grupo'} · Carril {athlete.lane}</Text>
                  <View style={styles.miniStats}>
                    <Text style={styles.miniStat}>{athlete.attendance}% asistencia</Text>
                    <Text style={styles.miniStat}>{athlete.pb50 ? `${athlete.pb50.toFixed(2)} s · 50 m` : 'Sin marcas'}</Text>
                  </View>
                </View>
                <Button label="Eliminar" variant="subtle" small onPress={() => removeAthlete(athlete.id)} />
              </View>
            );
          }) : <EmptyState title="Todavía no hay nadadores" />}
        </Card>
      ) : (
        <View style={styles.cardGrid}>
          {groups.map((group) => {
            const members = athletes.filter((athlete) => athlete.groupId === group.id).length;
            return (
              <Card key={group.id} style={styles.groupCard}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupSchedule}>{group.schedule}</Text>
                <View style={styles.groupFooter}>
                  <Text style={styles.groupMembers}>{members} nadadores</Text>
                  <Button label="Eliminar" variant="subtle" small disabled={members > 0} onPress={() => removeGroup(group.id)} />
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </View>
  );
}

function WorkoutForm({ groups, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Próxima sesión');
  const [time, setTime] = useState('19:00');
  const [distance, setDistance] = useState('3000');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [warmup, setWarmup] = useState('600 m suave');
  const [main, setMain] = useState('8×100 ritmo controlado');
  const [cooldown, setCooldown] = useState('400 m suave');

  const submit = () => {
    if (!title.trim()) return;
    onSave({
      id: `w${Date.now()}`,
      title: title.trim(),
      date: date.trim() || 'Próxima sesión',
      time: time.trim() || '19:00',
      distance: Number(distance) || 3000,
      groupId,
      released: false,
      blocks: [
        { name: 'Entrada en calor', detail: warmup.trim() || 'A definir' },
        { name: 'Trabajo principal', detail: main.trim() || 'A definir' },
        { name: 'Vuelta a la calma', detail: cooldown.trim() || 'A definir' },
      ],
    });
  };

  return (
    <Card>
      <View style={styles.formStack}>
        <PageHeader title="Nueva sesión" action={<Button label="Cerrar" variant="subtle" small onPress={onCancel} />} />
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Nombre" placeholderTextColor={COLORS.tertiary} />
        <View style={styles.formRow}>
          <TextInput style={[styles.input, styles.flexInput]} value={date} onChangeText={setDate} placeholder="Día" placeholderTextColor={COLORS.tertiary} />
          <TextInput style={[styles.input, styles.flexInput]} value={time} onChangeText={setTime} placeholder="Hora" placeholderTextColor={COLORS.tertiary} />
          <TextInput style={[styles.input, styles.flexInput]} value={distance} onChangeText={setDistance} placeholder="Metros" placeholderTextColor={COLORS.tertiary} keyboardType="numeric" />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Grupo</Text>
          <View style={styles.chipWrap}>
            {groups.map((group) => <Chip key={group.id} label={group.name} active={groupId === group.id} onPress={() => setGroupId(group.id)} />)}
          </View>
        </View>
        <TextInput style={styles.input} value={warmup} onChangeText={setWarmup} placeholder="Entrada en calor" placeholderTextColor={COLORS.tertiary} />
        <TextInput style={styles.input} value={main} onChangeText={setMain} placeholder="Trabajo principal" placeholderTextColor={COLORS.tertiary} />
        <TextInput style={styles.input} value={cooldown} onChangeText={setCooldown} placeholder="Vuelta a la calma" placeholderTextColor={COLORS.tertiary} />
        <Button label="Crear borrador" onPress={submit} />
      </View>
    </Card>
  );
}

function WorkoutCard({ workout, group, role, onToggleRelease }) {
  return (
    <Card style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View style={styles.flexOne}>
          <Text style={styles.overline}>{workout.date.toUpperCase()} · {workout.time}</Text>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          <Text style={styles.workoutMeta}>{group?.name || 'Sin grupo'} · {workout.distance.toLocaleString('es-AR')} m</Text>
        </View>
        {role === 'coach' ? (
          <Button label={workout.released ? 'Visible' : 'Liberar'} variant={workout.released ? 'secondary' : 'primary'} small onPress={() => onToggleRelease(workout.id)} />
        ) : (
          <Chip label="Disponible" active tone="green" />
        )}
      </View>
      <View style={styles.blocks}>
        {workout.blocks.map((block, index) => (
          <View key={`${workout.id}-${block.name}`} style={[styles.blockRow, index > 0 && styles.rowDivider]}>
            <View style={styles.blockNumber}><Text style={styles.blockNumberText}>{index + 1}</Text></View>
            <View style={styles.flexOne}>
              <Text style={styles.blockName}>{block.name}</Text>
              <Text style={styles.blockDetail}>{block.detail}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

function WorkoutsScreen({ role, workouts, setWorkouts, groups, selectedAthlete }) {
  const [showForm, setShowForm] = useState(false);
  const visibleWorkouts = role === 'coach'
    ? workouts
    : workouts.filter((workout) => workout.released && workout.groupId === selectedAthlete?.groupId);

  const addWorkout = (workout) => {
    setWorkouts((current) => [workout, ...current]);
    setShowForm(false);
  };

  const toggleRelease = (id) => setWorkouts((current) => current.map((workout) => workout.id === id ? { ...workout, released: !workout.released } : workout));

  return (
    <View style={styles.pageStack}>
      <PageHeader
        title="Entrenamientos"
        subtitle={role === 'coach' ? `${workouts.length} sesiones` : 'Plan del equipo'}
        action={role === 'coach' ? <Button label="Nueva sesión" small onPress={() => setShowForm(true)} /> : null}
      />
      {showForm ? <WorkoutForm groups={groups} onSave={addWorkout} onCancel={() => setShowForm(false)} /> : null}
      {visibleWorkouts.length ? visibleWorkouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          group={groups.find((group) => group.id === workout.groupId)}
          role={role}
          onToggleRelease={toggleRelease}
        />
      )) : <EmptyState title="No hay sesiones disponibles" />}
    </View>
  );
}

function AttendanceScreen({ athletes, setAthletes, workouts, groups }) {
  const [workoutId, setWorkoutId] = useState(workouts[0]?.id || '');
  const workout = workouts.find((item) => item.id === workoutId);
  const groupAthletes = athletes.filter((athlete) => athlete.groupId === workout?.groupId);
  const present = groupAthletes.filter((athlete) => athlete.present).length;

  const toggle = (id) => setAthletes((current) => current.map((athlete) => athlete.id === id ? { ...athlete, present: !athlete.present } : athlete));
  const markAll = (value) => setAthletes((current) => current.map((athlete) => athlete.groupId === workout?.groupId ? { ...athlete, present: value } : athlete));

  return (
    <View style={styles.pageStack}>
      <PageHeader title="Asistencia" subtitle={workout ? `${workout.date} · ${workout.time}` : ''} />
      <View style={styles.horizontalChips}>
        {workouts.map((item) => <Chip key={item.id} label={item.title} active={workoutId === item.id} onPress={() => setWorkoutId(item.id)} />)}
      </View>

      <Card style={styles.attendanceSummary}>
        <View>
          <Text style={styles.overline}>{groups.find((group) => group.id === workout?.groupId)?.name || 'Grupo'}</Text>
          <Text style={styles.attendanceValue}>{present} de {groupAthletes.length}</Text>
          <Text style={styles.pageSubtitle}>presentes</Text>
        </View>
        <View style={styles.actionRow}>
          <Button label="Todos" variant="secondary" small onPress={() => markAll(true)} />
          <Button label="Ninguno" variant="subtle" small onPress={() => markAll(false)} />
        </View>
      </Card>

      <Card style={styles.listCard}>
        {groupAthletes.map((athlete, index) => (
          <Pressable key={athlete.id} onPress={() => toggle(athlete.id)} style={[styles.attendanceRow, index > 0 && styles.rowDivider]}>
            <Avatar name={athlete.name} />
            <View style={styles.flexOne}>
              <Text style={styles.personName}>{athlete.name}</Text>
              <Text style={styles.rowMeta}>Carril {athlete.lane}</Text>
            </View>
            <View style={[styles.checkCircle, athlete.present && styles.checkCircleActive]}>
              {athlete.present ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
          </Pressable>
        ))}
      </Card>
    </View>
  );
}

function SwimmerHome({ athlete, group, workouts, setActive }) {
  const nextWorkout = workouts.find((workout) => workout.released && workout.groupId === athlete?.groupId);
  if (!athlete) return <EmptyState title="Perfil no disponible" />;

  return (
    <View style={styles.pageStack}>
      <PageHeader title={`Hola, ${athlete.name.split(' ')[0]}`} subtitle={group?.name} />
      <Card style={styles.featureCard}>
        <View style={styles.featureContent}>
          <Text style={styles.overline}>PRÓXIMA SESIÓN</Text>
          <Text style={styles.featureTitle}>{nextWorkout?.title || 'Sin sesión liberada'}</Text>
          {nextWorkout ? <Text style={styles.featureMeta}>{nextWorkout.date} · {nextWorkout.time} · {nextWorkout.distance.toLocaleString('es-AR')} m</Text> : null}
          <View style={styles.actionRow}>
            <Button label="Ver entrenamiento" onPress={() => setActive('workouts')} />
          </View>
        </View>
      </Card>
      <View style={styles.metricsGrid}>
        <Card style={styles.metricCard}><Metric value={`${athlete.attendance}%`} label="Asistencia" /></Card>
        <Card style={styles.metricCard}><Metric value={`${(athlete.weekMeters / 1000).toFixed(1)} km`} label="Esta semana" /></Card>
        <Card style={styles.metricCard}><Metric value={athlete.pb50 ? `${athlete.pb50.toFixed(2)} s` : '—'} label="Mejor 50 m" /></Card>
      </View>
      <Card>
        <PageHeader title="Tu grupo" />
        <View style={styles.profileRow}>
          <View>
            <Text style={styles.profileLabel}>Entrenamientos</Text>
            <Text style={styles.profileValue}>{group?.schedule || 'Sin horario'}</Text>
          </View>
          <Button label="Ver progreso" variant="secondary" small onPress={() => setActive('progress')} />
        </View>
      </Card>
    </View>
  );
}

function ProgressScreen({ athlete }) {
  if (!athlete) return <EmptyState title="Perfil no disponible" />;
  const items = [
    { label: 'Asistencia', value: athlete.attendance, display: `${athlete.attendance}%` },
    { label: 'Volumen semanal', value: Math.min(100, Math.round((athlete.weekMeters / 16000) * 100)), display: `${(athlete.weekMeters / 1000).toFixed(1)} km` },
    { label: 'Objetivo mensual', value: 72, display: '72%' },
  ];

  return (
    <View style={styles.pageStack}>
      <PageHeader title="Progreso" subtitle={athlete.name} />
      <Card style={styles.profileHero}>
        <Avatar name={athlete.name} size="large" />
        <View style={styles.flexOne}>
          <Text style={styles.personName}>{athlete.stroke}</Text>
          <Text style={styles.rowMeta}>Carril {athlete.lane}</Text>
        </View>
        <View style={styles.pbBox}>
          <Text style={styles.pbValue}>{athlete.pb50 ? athlete.pb50.toFixed(2) : '—'}</Text>
          <Text style={styles.pbLabel}>50 m</Text>
        </View>
      </Card>
      <Card>
        {items.map((item, index) => (
          <View key={item.label} style={[styles.progressItem, index > 0 && styles.rowDivider]}>
            <View style={styles.progressHeader}>
              <Text style={styles.rowTitle}>{item.label}</Text>
              <Text style={styles.progressDisplay}>{item.display}</Text>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${item.value}%` }]} /></View>
          </View>
        ))}
      </Card>
    </View>
  );
}

function ProfileScreen({ role, athlete, groups, athletes, onExit }) {
  const group = groups.find((item) => item.id === athlete?.groupId);
  return (
    <View style={styles.pageStack}>
      <PageHeader title="Perfil" />
      <Card style={styles.profileHero}>
        <Avatar name={role === 'coach' ? 'Club Demo' : athlete?.name || 'Nadador'} size="large" />
        <View style={styles.flexOne}>
          <Text style={styles.personName}>{role === 'coach' ? 'Club Demo' : athlete?.name}</Text>
          <Text style={styles.rowMeta}>{role === 'coach' ? 'Cuenta de entrenador' : group?.name}</Text>
        </View>
      </Card>
      <Card>
        {role === 'coach' ? (
          <>
            <View style={styles.profileRow}><Text style={styles.profileLabel}>Nadadores</Text><Text style={styles.profileValue}>{athletes.length}</Text></View>
            <View style={[styles.profileRow, styles.rowDivider]}><Text style={styles.profileLabel}>Grupos</Text><Text style={styles.profileValue}>{groups.length}</Text></View>
            <View style={[styles.profileRow, styles.rowDivider]}><Text style={styles.profileLabel}>Plan</Text><Text style={styles.profileValue}>Demo</Text></View>
          </>
        ) : (
          <>
            <View style={styles.profileRow}><Text style={styles.profileLabel}>Grupo</Text><Text style={styles.profileValue}>{group?.name}</Text></View>
            <View style={[styles.profileRow, styles.rowDivider]}><Text style={styles.profileLabel}>Carril</Text><Text style={styles.profileValue}>{athlete?.lane}</Text></View>
            <View style={[styles.profileRow, styles.rowDivider]}><Text style={styles.profileLabel}>Estilo</Text><Text style={styles.profileValue}>{athlete?.stroke}</Text></View>
          </>
        )}
      </Card>
      <Button label="Cambiar perfil" variant="secondary" onPress={onExit} />
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const wide = width >= 940;
  const [role, setRole] = useState(null);
  const [active, setActive] = useState('home');
  const [selectedAthleteId, setSelectedAthleteId] = useState('a1');
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [athletes, setAthletes] = useState(INITIAL_ATHLETES);
  const [workouts, setWorkouts] = useState(INITIAL_WORKOUTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && globalThis.localStorage) {
      try {
        const saved = JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY));
        if (saved?.groups) setGroups(saved.groups);
        if (saved?.athletes) setAthletes(saved.athletes);
        if (saved?.workouts) setWorkouts(saved.workouts);
      } catch (error) {
        console.warn('No se pudieron cargar los datos locales.', error);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || Platform.OS !== 'web' || !globalThis.localStorage) return;
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify({ groups, athletes, workouts }));
  }, [groups, athletes, workouts, hydrated]);

  const selectedAthlete = useMemo(() => athletes.find((athlete) => athlete.id === selectedAthleteId) || athletes[0], [athletes, selectedAthleteId]);
  const selectedGroup = groups.find((group) => group.id === selectedAthlete?.groupId);

  const enter = (nextRole, athleteId) => {
    setRole(nextRole);
    setSelectedAthleteId(athleteId || athletes[0]?.id);
    setActive('home');
  };

  const exit = () => {
    setRole(null);
    setActive('home');
  };

  if (!role) return <RoleEntry athletes={athletes} onEnter={enter} />;

  let content;
  if (role === 'coach') {
    if (active === 'team') content = <TeamScreen athletes={athletes} setAthletes={setAthletes} groups={groups} setGroups={setGroups} />;
    else if (active === 'workouts') content = <WorkoutsScreen role={role} workouts={workouts} setWorkouts={setWorkouts} groups={groups} />;
    else if (active === 'attendance') content = <AttendanceScreen athletes={athletes} setAthletes={setAthletes} workouts={workouts} groups={groups} />;
    else if (active === 'profile') content = <ProfileScreen role={role} groups={groups} athletes={athletes} onExit={exit} />;
    else content = <CoachHome athletes={athletes} groups={groups} workouts={workouts} setActive={setActive} />;
  } else {
    if (active === 'workouts') content = <WorkoutsScreen role={role} workouts={workouts} setWorkouts={setWorkouts} groups={groups} selectedAthlete={selectedAthlete} />;
    else if (active === 'progress') content = <ProgressScreen athlete={selectedAthlete} />;
    else if (active === 'profile') content = <ProfileScreen role={role} athlete={selectedAthlete} groups={groups} athletes={athletes} onExit={exit} />;
    else content = <SwimmerHome athlete={selectedAthlete} group={selectedGroup} workouts={workouts} setActive={setActive} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.appFrame}>
        <AppHeader role={role} onExit={exit} />
        <View style={styles.appBody}>
          {wide ? <Navigation role={role} active={active} onChange={setActive} wide /> : null}
          <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        </View>
        {!wide ? <Navigation role={role} active={active} onChange={setActive} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  entrySafeArea: { flex: 1, backgroundColor: COLORS.background },
  entryContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  brandMark: { width: 64, height: 64, borderRadius: 21, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  brandWave: { width: 34, height: 16, borderRadius: 999, borderWidth: 4, borderColor: '#FFFFFF', borderTopColor: 'transparent', transform: [{ rotate: '-8deg' }] },
  brandName: { color: COLORS.text, fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  entryTitle: { color: COLORS.text, fontSize: 38, lineHeight: 43, fontWeight: '800', letterSpacing: -1.5, textAlign: 'center', marginTop: 12, marginBottom: 28 },
  entryCard: { width: '100%', maxWidth: 480, gap: 22 },
  entryPreview: { padding: 18, borderRadius: 18, backgroundColor: COLORS.surfaceMuted },
  entryPreviewTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  entryPreviewMeta: { color: COLORS.secondary, fontSize: 13, marginTop: 5 },
  appFrame: { flex: 1, width: '100%', maxWidth: 1280, alignSelf: 'center' },
  appHeader: { height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, borderBottomWidth: 1, borderBottomColor: COLORS.line, backgroundColor: 'rgba(245,245,247,0.96)' },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerMark: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
  headerWave: { width: 18, height: 9, borderRadius: 999, borderWidth: 2.5, borderColor: '#FFFFFF', borderTopColor: 'transparent', transform: [{ rotate: '-8deg' }] },
  headerTitle: { color: COLORS.text, fontSize: 17, fontWeight: '750', letterSpacing: -0.4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  appBody: { flex: 1, flexDirection: 'row' },
  contentScroll: { flex: 1 },
  contentContainer: { width: '100%', maxWidth: 1040, alignSelf: 'center', padding: 24, paddingBottom: 120 },
  sideNavigation: { width: 190, padding: 16, gap: 6, borderRightWidth: 1, borderRightColor: COLORS.line },
  sideNavItem: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 14, borderRadius: 14 },
  sideNavItemActive: { backgroundColor: COLORS.surface },
  bottomNavigation: { minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8, paddingBottom: Platform.OS === 'ios' ? 12 : 6, borderTopWidth: 1, borderTopColor: COLORS.line, backgroundColor: COLORS.surface },
  bottomNavItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8 },
  bottomNavItemActive: {},
  navDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'transparent' },
  navDotActive: { backgroundColor: COLORS.blue },
  navLabel: { color: COLORS.secondary, fontSize: 11, fontWeight: '600' },
  navLabelActive: { color: COLORS.blue },
  pageStack: { gap: 18 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  pageTitle: { color: COLORS.text, fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.8 },
  pageSubtitle: { color: COLORS.secondary, fontSize: 14, lineHeight: 20, marginTop: 3 },
  overline: { color: COLORS.blue, fontSize: 11, fontWeight: '800', letterSpacing: 0.9 },
  card: { padding: 20, borderRadius: 24, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)', shadowColor: '#000000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.045, shadowRadius: 18, elevation: 2 },
  featureCard: { minHeight: 230, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: 28 },
  featureContent: { flex: 1, maxWidth: 620 },
  featureTitle: { color: COLORS.text, fontSize: 34, lineHeight: 39, fontWeight: '800', letterSpacing: -1.2, marginTop: 10 },
  featureMeta: { color: COLORS.secondary, fontSize: 15, marginTop: 8 },
  featureBadge: { width: 118, height: 118, borderRadius: 59, backgroundColor: COLORS.blueSoft, alignItems: 'center', justifyContent: 'center' },
  featureBadgeValue: { color: COLORS.blue, fontSize: 34, fontWeight: '800', letterSpacing: -1 },
  featureBadgeLabel: { color: COLORS.blue, fontSize: 11, fontWeight: '700', marginTop: 1 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 22 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { flexGrow: 1, flexBasis: 190, minWidth: 160 },
  metric: { gap: 5 },
  metricValue: { color: COLORS.text, fontSize: 27, fontWeight: '800', letterSpacing: -0.8 },
  metricLabel: { color: COLORS.secondary, fontSize: 13 },
  homeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  homePanel: { flexGrow: 1, flexBasis: 380, minWidth: 290 },
  listCard: { paddingVertical: 4 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11 },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  attendanceRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14 },
  rowDivider: { borderTopWidth: 1, borderTopColor: COLORS.line },
  avatar: { width: 38, height: 38, borderRadius: 14, backgroundColor: COLORS.blueSoft, alignItems: 'center', justifyContent: 'center' },
  avatarLarge: { width: 52, height: 52, borderRadius: 18 },
  avatarText: { color: COLORS.blue, fontSize: 12, fontWeight: '800' },
  avatarTextLarge: { fontSize: 16 },
  rowTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  rowMeta: { color: COLORS.secondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
  personName: { color: COLORS.text, fontSize: 16, fontWeight: '750', letterSpacing: -0.2 },
  statusDot: { width: 9, height: 9, borderRadius: 5 },
  workoutRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  dateTile: { width: 50, height: 50, borderRadius: 15, backgroundColor: COLORS.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  dateTileDay: { color: COLORS.text, fontSize: 12, fontWeight: '800' },
  dateTileTime: { color: COLORS.secondary, fontSize: 9, marginTop: 2 },
  button: { minHeight: 44, paddingHorizontal: 17, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  buttonSmall: { minHeight: 34, paddingHorizontal: 12, borderRadius: 11 },
  buttonPrimary: { backgroundColor: COLORS.blue, borderColor: COLORS.blue },
  buttonSecondary: { backgroundColor: COLORS.surface, borderColor: COLORS.line },
  buttonSubtle: { backgroundColor: 'transparent', borderColor: 'transparent' },
  buttonDanger: { backgroundColor: COLORS.redSoft, borderColor: COLORS.redSoft },
  buttonLabel: { fontSize: 13, fontWeight: '700' },
  buttonTextPrimary: { color: '#FFFFFF' },
  buttonText: { color: COLORS.text },
  buttonTextDanger: { color: COLORS.red },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.38 },
  chip: { minHeight: 30, paddingHorizontal: 11, borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  chipNeutral: { backgroundColor: COLORS.surfaceMuted, borderColor: COLORS.surfaceMuted },
  chipBlue: { backgroundColor: COLORS.blueSoft, borderColor: COLORS.blueSoft },
  chipGreen: { backgroundColor: COLORS.greenSoft, borderColor: COLORS.greenSoft },
  chipOrange: { backgroundColor: COLORS.orangeSoft, borderColor: COLORS.orangeSoft },
  chipText: { color: COLORS.secondary, fontSize: 11, fontWeight: '700' },
  chipTextActive: { color: COLORS.text },
  segmentedControl: { flexDirection: 'row', padding: 4, borderRadius: 15, backgroundColor: COLORS.surfaceMuted },
  segment: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  segmentActive: { backgroundColor: COLORS.surface, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 5, elevation: 1 },
  segmentText: { color: COLORS.secondary, fontSize: 13, fontWeight: '650' },
  segmentTextActive: { color: COLORS.text },
  fieldGroup: { gap: 9 },
  fieldLabel: { color: COLORS.secondary, fontSize: 12, fontWeight: '700' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  horizontalChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  formStack: { gap: 13 },
  formTitle: { color: COLORS.text, fontSize: 19, fontWeight: '800', letterSpacing: -0.4 },
  formRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  flexInput: { flexGrow: 1, flexBasis: 150 },
  input: { minHeight: 48, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, color: COLORS.text, backgroundColor: COLORS.surfaceMuted, borderWidth: 1, borderColor: COLORS.surfaceMuted, fontSize: 14 },
  miniStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 7 },
  miniStat: { color: COLORS.secondary, fontSize: 11, fontWeight: '600' },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  groupCard: { flexGrow: 1, flexBasis: 280, minWidth: 260 },
  groupName: { color: COLORS.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  groupSchedule: { color: COLORS.secondary, fontSize: 13, marginTop: 6 },
  groupFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 22 },
  groupMembers: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  workoutCard: { gap: 18 },
  workoutHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 14 },
  workoutTitle: { color: COLORS.text, fontSize: 24, lineHeight: 30, fontWeight: '800', letterSpacing: -0.7, marginTop: 7 },
  workoutMeta: { color: COLORS.secondary, fontSize: 13, marginTop: 6 },
  blocks: { borderTopWidth: 1, borderTopColor: COLORS.line },
  blockRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14 },
  blockNumber: { width: 30, height: 30, borderRadius: 10, backgroundColor: COLORS.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  blockNumberText: { color: COLORS.secondary, fontSize: 11, fontWeight: '800' },
  blockName: { color: COLORS.text, fontSize: 13, fontWeight: '750' },
  blockDetail: { color: COLORS.secondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
  attendanceSummary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  attendanceValue: { color: COLORS.text, fontSize: 34, fontWeight: '800', letterSpacing: -1.2, marginTop: 8 },
  checkCircle: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  checkCircleActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  checkMark: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  profileHero: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  profileRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingVertical: 10 },
  profileLabel: { color: COLORS.secondary, fontSize: 13 },
  profileValue: { color: COLORS.text, fontSize: 13, fontWeight: '700', textAlign: 'right' },
  pbBox: { minWidth: 76, alignItems: 'flex-end' },
  pbValue: { color: COLORS.text, fontSize: 22, fontWeight: '800' },
  pbLabel: { color: COLORS.secondary, fontSize: 10, marginTop: 2 },
  progressItem: { paddingVertical: 17 },
  progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 10 },
  progressDisplay: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: COLORS.surfaceMuted, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: COLORS.blue },
  emptyState: { minHeight: 170, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  emptyTitle: { color: COLORS.secondary, fontSize: 15, fontWeight: '650', textAlign: 'center' },
  flexOne: { flex: 1 },
});
