# Matchmaking Experiment

Testing openskill library by creating a matchmaker system that dynamically assigns teams and calculates rating

Here's the output of index.js once the project is being built

```
Team 1:
1: SR=2400, mu=30.00, sigma=2.00
8: SR=1400, mu=29.00, sigma=5.00
5: SR=2000, mu=35.00, sigma=5.00
10: SR=2000, mu=32.00, sigma=4.00
7: SR=1200, mu=21.00, sigma=3.00
Team 2:
9: SR=1500, mu=33.00, sigma=6.00
6: SR=3800, mu=41.00, sigma=1.00
4: SR=1000, mu=28.00, sigma=6.00
3: SR=1100, mu=20.00, sigma=3.00
2: SR=100, mu=25.00, sigma=8.00
Expected Team 1 Win Probability: 50.43%
Team 1 SR: 9000
Team 1 Avg SR: 1800
Team 2 SR: 7500
Team 2 Avg SR: 1500
Predictions: 0.5000000150000002,0.5000000150000002
If team 1 won here's the updated ratings:
[
  [
    {
      id: 1,
      name: 'player1',
      rating: { mu: 30.124101045598806, sigma: 1.9978753831615563 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 2421
    },
    {
      id: 8,
      name: 'player8',
      rating: { mu: 29.775631534992527, sigma: 4.966709670092432 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 1606
    },
    {
      id: 5,
      name: 'player5',
      rating: { mu: 35.77563153499253, sigma: 4.966709670092432 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 2206
    },
    {
      id: 10,
      name: 'player10',
      rating: { mu: 32.49640418239522, sigma: 3.9829758656420418 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 2116
    },
    {
      id: 7,
      name: 'player7',
      rating: { mu: 21.27922735259731, sigma: 2.9928246459039096 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 1256
    }
  ],
  [
    {
      id: 9,
      name: 'player9',
      rating: { mu: 31.88309058961076, sigma: 5.92154416282029 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 1832
    },
    {
      id: 6,
      name: 'player6',
      rating: { mu: 40.9689747386003, sigma: 0.9996390881399223 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 3804
    },
    {
      id: 4,
      name: 'player4',
      rating: { mu: 26.88309058961076, sigma: 5.92154416282029 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 1332
    },
    {
      id: 3,
      name: 'player3',
      rating: { mu: 19.72077264740269, sigma: 2.990241266104533 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 1156
    },
    {
      id: 2,
      name: 'player2',
      rating: { mu: 23.014383270419128, sigma: 7.813062368651227 },
      gamesPlayed: 1,
      wins: 0,
      loses: 0,
      skillRating: 696
    }
  ]
]
```
