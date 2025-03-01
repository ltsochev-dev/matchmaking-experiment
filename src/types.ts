import { rating } from "openskill";

export interface Player {
  id: number;
  name: string;
  rating: ReturnType<typeof rating>;
  gamesPlayed: number;
  wins: number;
  loses: number;
}

export interface QueuePlayer extends Player {
  skillRating: number;
}

export interface Team {
  players: Player[];
  teamScore: number;
}
