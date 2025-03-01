import { rating } from "openskill";
import MatchmakingSystem from "./matchmaker";
import { Player } from "./types";
import { convertPlayerToSR } from "./utils";

const players: Player[] = [
  {
    id: 1,
    name: "player1",
    rating: { mu: 30, sigma: 2 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
  {
    id: 2,
    name: "player2",
    rating: { mu: 25, sigma: 8 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
  {
    id: 3,
    name: "player3",
    rating: { mu: 20, sigma: 3 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
  {
    id: 4,
    name: "player4",
    rating: { mu: 28, sigma: 6 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
  {
    id: 5,
    name: "player5",
    rating: { mu: 35, sigma: 5 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
  {
    id: 6,
    name: "player6",
    rating: { mu: 41, sigma: 1 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
  {
    id: 7,
    name: "player7",
    rating: { mu: 21, sigma: 3 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
  {
    id: 8,
    name: "player8",
    rating: { mu: 29, sigma: 5 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
  {
    id: 9,
    name: "player9",
    rating: { mu: 33, sigma: 6 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
  {
    id: 10,
    name: "player10",
    rating: { mu: 32, sigma: 4 },
    gamesPlayed: 0,
    wins: 0,
    loses: 0,
  },
];

const matchmaking = new MatchmakingSystem();

players.forEach((player) => matchmaking.addPlayer(player));

const matchResult = matchmaking.attemptMatchmaking();

if (matchResult) {
  console.log("Team 1:");
  matchResult.team1.players.forEach((p) =>
    console.log(
      `${p.id}: SR=${convertPlayerToSR(p)}, mu=${p.rating.mu.toFixed(
        2
      )}, sigma=${p.rating.sigma.toFixed(2)}`
    )
  );
  console.log("Team 2:");
  matchResult.team2.players.forEach((p) =>
    console.log(
      `${p.id}: SR=${convertPlayerToSR(p)}, mu=${p.rating.mu.toFixed(
        2
      )}, sigma=${p.rating.sigma.toFixed(2)}`
    )
  );
  console.log(
    `Expected Team 1 Win Probability: ${(
      matchResult.expectedWinProbability * 100
    ).toFixed(2)}%`
  );

  const team1sr = matchResult.team1.players.reduce(
    (sum, p) => sum + convertPlayerToSR(p),
    0
  );
  const team2sr = matchResult.team2.players.reduce(
    (sum, p) => sum + convertPlayerToSR(p),
    0
  );

  console.log(`Team 1 SR: ${team1sr}`);
  console.log(`Team 1 Avg SR: ${team1sr / matchResult.team1.players.length}`);
  console.log(`Team 2 SR: ${team2sr}`);
  console.log(`Team 2 Avg SR: ${team2sr / matchResult.team2.players.length}`);

  console.log(`Predictions: ${matchResult.predirectedOutcomes}`);

  console.log("If team 1 won here's the updated ratings:");

  const newRatings = matchmaking.updateRatings(
    matchResult.team1,
    matchResult.team2,
    true
  );

  console.dir(newRatings, { depth: null, colors: true });
  console.log("Matchmaking successful!");
}
