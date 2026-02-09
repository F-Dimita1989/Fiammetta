export interface HistoryEntry {
  time: string;
  temp: number;
  target: number;
  pressure: number;
}

export interface BoilerState {
  room_temp: number;
  target_temp: number;
  heating_active: boolean;
  boiler_pressure: number;
  mode: string;
  history: HistoryEntry[];
}
