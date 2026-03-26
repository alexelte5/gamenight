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
}

export interface LmsGameState {
  categories: LmsData[];
  currentCategory: number;
  revealedAnswers: boolean[];
}

export interface LmsData {
  filename: string;
  category: string;
  answers: string[];
}

// Events Client → Server
export interface ClientEvents {
  'room:create': (gameType: Room['gameType']) => void;
  'room:join': (payload: { code: string; name: string }) => void;
  'room:reconnect': (token: string) => void;
  'game:start': (payload: { categories: LmsData[] }) => void;
  'game:nextRound': () => void;
  'game:revealAnswer': (index: number) => void;
  'game:reduceHealth': (playerId: string) => void;
  'game:select': (gameType: Room['gameType']) => void;
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
