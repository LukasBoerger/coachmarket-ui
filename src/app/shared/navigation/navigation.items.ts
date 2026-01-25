import { NavItem } from './navigation.model';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    route: '/',
    icon: 'home',
  },

  // Core: Direkt zur Suche
  {
    label: 'Coaches finden',
    route: '/coaches',
    icon: 'search',
  },

  // Sportarten (SEO + Struktur)
  {
    label: 'Sportarten',
    icon: 'sports',
    children: [
      { label: 'Fitness (Allgemein)', route: '/sports/fitness', icon: 'fitness_center' },
      { label: 'Bodybuilding', route: '/sports/bodybuilding', icon: 'fitness_center' },
      { label: 'Laufen', route: '/sports/running', icon: 'directions_run' },
      { label: 'Hyrox / Functional', route: '/sports/hyrox', icon: 'bolt' },
      { label: 'Yoga', route: '/sports/yoga', icon: 'self_improvement' },
      { label: 'Mobility', route: '/sports/mobility', icon: 'accessibility_new' },
      { label: 'Radsport', route: '/sports/cycling', icon: 'directions_bike' },
      { label: 'Schwimmen', route: '/sports/swimming', icon: 'pool' },
      { label: 'Teamsport', route: '/sports/team-sports', icon: 'sports_soccer' },
      { label: 'Kampfsport', route: '/sports/martial-arts', icon: 'sports_mma' },
    ],
  },

  // Ziele (das ist bei dir aktuell "Specializations")
  // Label user-friendly, Route kannst du erstmal so lassen.
  {
    label: 'Ziele',
    icon: 'tune',
    children: [
      { label: 'Abnehmen', route: '/specializations/abnehmen', icon: 'monitor_weight' },
      { label: 'Muskelaufbau', route: '/specializations/muskelaufbau', icon: 'fitness_center' },
      { label: 'Ausdauer verbessern', route: '/specializations/ausdauer', icon: 'speed' },
      { label: 'Hyrox Performance', route: '/specializations/hyrox-performance', icon: 'bolt' },
      { label: 'Mobility / Beweglichkeit', route: '/specializations/mobility', icon: 'accessibility_new' },
      { label: 'Reha / Schmerzen', route: '/specializations/rehab', icon: 'healing' },
      { label: 'Stress / Mental', route: '/specializations/mental', icon: 'psychology' },
    ],
  },

  // Für Coaches (Growth + Monetarisierung)
  {
    label: 'Für Coaches',
    icon: 'school',
    children: [
      { label: 'Coach werden', route: '/for-coaches/apply', icon: 'person_add' },
      { label: 'So funktioniert’s', route: '/for-coaches/how-it-works', icon: 'info' },
      { label: 'Preise', route: '/for-coaches/pricing', icon: 'payments' },
    ],
  },

  // Vertrauen + SEO (später ausbauen)
  {
    label: 'Wissen',
    route: '/wissen',
    icon: 'menu_book',
  },

  {
    label: 'Über uns',
    route: '/about',
    icon: 'info',
  },
];
