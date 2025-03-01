import { Player, QueuePlayer } from "./types";

const BASE_SR = 2500 as const;
const SR_PER_MU = 100 as const;

export const convertPlayerToSR = (
  player: Player | QueuePlayer,
  min: number = 0,
  max: number = 5000
): number => {
  return convertToSR(player.rating.mu, player.rating.sigma, min, max);
};

export const convertToSR = (
  mu: number,
  sigma: number,
  min: number = 0,
  max: number = 5000
): number => {
  const effectiveSkill = mu - 3 * sigma;
  const sr = BASE_SR + (effectiveSkill - 25) * SR_PER_MU;

  return clamp(sr, min, max);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
