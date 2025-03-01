import { predictWin, rate, Rating, rating } from "openskill";
import { Player, QueuePlayer, Team } from "./types";
import { convertToSR } from "./utils";

/**
 * @todo This class can be at least 3 classes
 * @todo Fix the types, QueuePlayer is a silly name
 */
export default class MatchmakingSystem {
  private queue: QueuePlayer[] = [];
  private maxSkillRating = 5000;
  private minSkillRating = 0;
  private minPlayersPerTeam = 5;

  private readonly BASE_SR = 2500;
  private readonly SR_PER_MU = 100;

  addPlayer(player: Player, initialMu = 25, initialSigma = 25 / 3): void {
    const existingPlayer = this.queue.find((p) => p.id === player.id);

    if (!existingPlayer) {
      const newRating = rating({
        mu: player?.rating?.mu ?? initialMu,
        sigma: player?.rating?.sigma ?? initialSigma,
      });

      this.queue.push({
        ...player,
        rating: newRating,
        skillRating: convertToSR(
          newRating.mu,
          newRating.sigma,
          this.minSkillRating,
          this.maxSkillRating
        ),
        gamesPlayed: 0,
      });
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getPlayerStats(playerId: number): Player | null {
    return this.queue.find((p) => p.id === playerId) || null;
  }

  attemptMatchmaking(): {
    team1: Team;
    team2: Team;
    expectedWinProbability: number;
    predirectedOutcomes: number[];
  } | null {
    if (this.queue.length < this.minPlayersPerTeam * 2) {
      return null;
    }

    const sortedPlayers = [...this.queue].sort(
      (a, b) =>
        b.rating.mu - 2 * b.rating.sigma - (a.rating.mu - 2 * a.rating.sigma)
    );
    const matchSize = Math.min(
      this.minPlayersPerTeam * 2,
      sortedPlayers.length
    );
    const matchPlayers = sortedPlayers.slice(0, matchSize);

    this.queue = this.queue.filter(
      (p) => !matchPlayers.some((mp) => mp.id === p.id)
    );

    const { team1, team2 } = this.createBalancedTeams(matchPlayers);
    const winProbability = this.calculateWinProbability(team1, team2);

    return {
      team1,
      team2,
      expectedWinProbability: winProbability,
      predirectedOutcomes: this.predictMatchOutcome(team1, team2),
    };
  }

  private createBalancedTeams(players: Player[]): { team1: Team; team2: Team } {
    const halfSize = Math.floor(players.length / 2);
    let bestTeam1: Player[] = players.slice(0, halfSize);
    let bestTeam2: Player[] = players.slice(halfSize);
    let bestDifference = Infinity;

    let currentTeam1 = [...bestTeam1];
    let currentTeam2 = [...bestTeam2];

    for (let i = 0; i < 10; i++) {
      const team1Score = this.calculateTeamScore(currentTeam1);
      const team2Score = this.calculateTeamScore(currentTeam2);
      const currentDiff = Math.abs(team1Score - team2Score);

      if (currentDiff < bestDifference) {
        bestDifference = currentDiff;
        bestTeam1 = [...currentTeam1];
        bestTeam2 = [...currentTeam2];
      }

      const t1Index = Math.floor(Math.random() * currentTeam1.length);
      const t2Index = Math.floor(Math.random() * currentTeam2.length);
      [currentTeam1[t1Index], currentTeam2[t2Index]] = [
        currentTeam2[t2Index],
        currentTeam1[t1Index],
      ];
    }

    return {
      team1: {
        players: bestTeam1,
        teamScore: this.calculateTeamScore(bestTeam1),
      },
      team2: {
        players: bestTeam2,
        teamScore: this.calculateTeamScore(bestTeam2),
      },
    };
  }

  predictMatchOutcome(team1: Team, team2: Team): number[] {
    return predictWin([
      team1.players.map(({ rating }) => ({ ...rating })),
      team2.players.map(({ rating }) => ({ ...rating })),
    ]);
  }

  updateRatings(team1: Team, team2: Team, team1Won: boolean) {
    const matchTeams = [
      team1.players.map((p) => p.rating),
      team2.players.map((p) => p.rating),
    ];

    const result = team1Won ? [0, 1] : [1, 0];
    const newRatings = rate(matchTeams, { rank: result });

    const team1Players = team1.players.map((player, index) => {
      const newRating = newRatings[0][index];
      return this.updatePlayerRatings(player, newRating, team1Won);
    });

    const team2Players = team2.players.map((player, index) => {
      const newRating = newRatings[1][index];
      return this.updatePlayerRatings(player, newRating, !team1Won);
    });

    return [team1Players, team2Players];
  }

  private updatePlayerRatings(
    player: Player,
    newRating: Rating,
    teamWon: boolean
  ): QueuePlayer {
    const oldRating = structuredClone(player.rating);
    player.rating = newRating;
    player.gamesPlayed += 1;

    const baseChange = (newRating.mu - oldRating.mu) * this.SR_PER_MU;
    const uncertaintyFactor = Math.min(2, player.rating.sigma / 3);
    const srChange = Math.round(baseChange * (1 + uncertaintyFactor));
    const srCurrent = convertToSR(
      oldRating.mu,
      oldRating.sigma,
      this.minSkillRating,
      this.maxSkillRating
    );
    const skillRating = Math.max(
      this.minSkillRating,
      Math.min(
        this.maxSkillRating,
        srCurrent + (teamWon ? srChange : -srChange)
      )
    );

    return {
      ...player,
      wins: teamWon ? player.wins + 1 : player.wins,
      loses: teamWon ? player.loses : player.loses + 1,
      skillRating,
    };
  }

  private calculateWinProbability(team1: Team, team2: Team): number {
    const team1Score = this.calculateTeamScore(team1.players);
    const team2Score = this.calculateTeamScore(team2.players);
    const diff = team1Score - team2Score;
    return 1 / (1 + Math.pow(10, -diff / 400));
  }

  private calculateTeamScore(players: Player[]): number {
    return (
      players.reduce((sum, p) => sum + this.getEffectiveSkill(p), 0) /
      players.length
    );
  }

  private getEffectiveSkill(player: Player): number {
    return player.rating.mu - 3 * player.rating.sigma;
  }
}
