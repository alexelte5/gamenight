export interface Player {
  id: string;
  token: string;
  name: string;
  health: number;
  points: number;
  isHost: boolean;
  connected: boolean;
}

export interface Room {
  code: string;
  gameType: 'lms' | 'wwm' | 'imposter';
  gameState: LmsGameState | null;
  state: 'lobby' | 'playing' | 'results';
  round: number;
  players: Player[];
  hostId: string;
  settings: Settings;
}

export interface LmsGameState {
  categories: LmsData[];
  currentCategory: number;
  revealedAnswers: boolean[];
  justRevealed: number | null;
  wrongAnswers: boolean[];
}

export interface LmsData {
  filename: string;
  category: string;
  answers: string[];
}

export interface Settings {
  maxHealth: number;
  timer: number | null;
}

// Events Client → Server
export interface ClientEvents {
  'room:create': (gameType: Room['gameType']) => void;
  'room:join': (payload: { code: string; name: string }) => void;
  'room:updateSettings': (payload: { maxHealth: number; timer: number | null }) => void;
  'room:addPlayer': (name: string) => void;
  'room:leave': () => void;
  'room:removePlayer': (playerId: string) => void;
  'room:reconnect': (token: string) => void;
  'game:start': (payload: { categories: LmsData[] }) => void;
  'game:nextRound': () => void;
  'game:revealAnswer': (index: number) => void;
  'game:revealAll': (wrongs: boolean[]) => void;
  'game:reduceHealth': (playerId: string) => void;
  'game:select': (gameType: Room['gameType']) => void;
  'game:results': () => void;
  'game:end': () => void;
}

// Events Server → Client
export interface ServerEvents {
  'room:created': (room: Room) => void;
  'room:joined': (payload: { room: Room; token: string }) => void;
  'room:updated': (room: Room) => void;
  'game:stateChanged': (room: Room) => void;
  error: (message: string) => void;
}
