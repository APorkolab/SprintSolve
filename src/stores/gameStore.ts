/* eslint-disable no-console */
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, GameStateStore } from '@/types';

interface GameStoreState extends GameStateStore {
  // Additional state not in the interface
  lives: number;
  level: number;
  experience: number;
  achievements: string[];
  settings: {
    volume: number;
    sfxVolume: number;
    musicVolume: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'dynamic';
    theme: 'light' | 'dark' | 'auto';
    highContrast: boolean;
    reducedMotion: boolean;
    autoSave: boolean;
  };
  statistics: {
    totalGamesPlayed: number;
    totalScore: number;
    bestScore: number;
    totalQuestionsAnswered: number;
    correctAnswers: number;
    averageScore: number;
    playTime: number; // in seconds
    categoriesPlayed: number[];
    lastPlayed: number;
  };

  // Extended actions
  setLives: (_lives: number) => void;
  decrementLives: () => void;
  setLevel: (_level: number) => void;
  incrementLevel: () => void;
  addExperience: (_xp: number) => void;
  unlockAchievement: (_achievement: string) => void;
  updateSettings: (_settings: Partial<GameStoreState['settings']>) => void;
  updateStatistics: (_stats: Partial<GameStoreState['statistics']>) => void;
  resetStatistics: () => void;
}

const defaultSettings: GameStoreState['settings'] = {
  volume: 0.7,
  sfxVolume: 0.8,
  musicVolume: 0.6,
  difficulty: 'medium',
  theme: 'auto',
  highContrast: false,
  reducedMotion: false,
  autoSave: true,
};

const defaultStatistics: GameStoreState['statistics'] = {
  totalGamesPlayed: 0,
  totalScore: 0,
  bestScore: 0,
  totalQuestionsAnswered: 0,
  correctAnswers: 0,
  averageScore: 0,
  playTime: 0,
  categoriesPlayed: [],
  lastPlayed: 0,
};

export const useGameStore = create<GameStoreState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Core game state
        gameState: 'menu',
        score: { value: 0 },
        hasShield: false,
        gameSpeed: 4,
        selectedCategoryId: null,
        lives: 3,
        level: 1,
        experience: 0,
        achievements: [],
        settings: defaultSettings,
        statistics: defaultStatistics,

        // Core actions
        setGameState: (state: GameState) => {
          set({ gameState: state });

          // Track game state changes
          if (state === 'playing') {
            const stats = get().statistics;
            set({
              statistics: {
                ...stats,
                totalGamesPlayed: stats.totalGamesPlayed + 1,
                lastPlayed: Date.now(),
              },
            });
          }
        },

        incrementScore: () => {
          const currentScore = get().score.value;
          const newScore = currentScore + 1;

          set({
            score: { value: newScore },
            experience: get().experience + 10,
          });

          // Update statistics
          const stats = get().statistics;
          set({
            statistics: {
              ...stats,
              totalScore: stats.totalScore + 1,
              bestScore: Math.max(stats.bestScore, newScore),
              correctAnswers: stats.correctAnswers + 1,
              averageScore:
                (stats.totalScore + 1) /
                Math.max(stats.totalQuestionsAnswered, 1),
            },
          });

          // Check for level up (every 100 XP)
          const newXP = get().experience;
          const newLevel = Math.floor(newXP / 100) + 1;
          if (newLevel > get().level) {
            set({ level: newLevel });
            get().unlockAchievement(`level_${newLevel}`);
          }
        },

        resetScore: () => {
          set({ score: { value: 0 } });
        },

        setShield: (hasShield: boolean) => {
          set({ hasShield });
        },

        setGameSpeed: (speed: number) => {
          set({ gameSpeed: speed });
        },

        setSelectedCategory: (categoryId: number) => {
          set({ selectedCategoryId: categoryId });

          // Track category usage
          const stats = get().statistics;
          const categoriesPlayed = stats.categoriesPlayed.includes(categoryId)
            ? stats.categoriesPlayed
            : [...stats.categoriesPlayed, categoryId];

          set({
            statistics: {
              ...stats,
              categoriesPlayed,
            },
          });
        },

        resetGame: () => {
          set({
            gameState: 'menu',
            score: { value: 0 },
            hasShield: false,
            gameSpeed: 4,
            lives: 3,
          });
        },

        // Extended actions
        setLives: (lives: number) => {
          set({ lives: Math.max(0, lives) });
        },

        decrementLives: () => {
          const newLives = Math.max(0, get().lives - 1);
          set({ lives: newLives });

          if (newLives === 0) {
            get().setGameState('gameOver');
          }
        },

        setLevel: (level: number) => {
          set({ level: Math.max(1, level) });
        },

        incrementLevel: () => {
          const newLevel = get().level + 1;
          set({ level: newLevel });
          get().unlockAchievement(`level_${newLevel}`);
        },

        addExperience: (xp: number) => {
          const newXP = get().experience + xp;
          set({ experience: newXP });

          // Check for level up
          const newLevel = Math.floor(newXP / 100) + 1;
          if (newLevel > get().level) {
            get().setLevel(newLevel);
          }
        },

        unlockAchievement: (achievement: string) => {
          const achievements = get().achievements;
          if (!achievements.includes(achievement)) {
            set({ achievements: [...achievements, achievement] });
          }
        },

        updateSettings: (settings: Partial<GameStoreState['settings']>) => {
          set({
            settings: {
              ...get().settings,
              ...settings,
            },
          });
        },

        updateStatistics: (stats: Partial<GameStoreState['statistics']>) => {
          set({
            statistics: {
              ...get().statistics,
              ...stats,
            },
          });
        },

        resetStatistics: () => {
          set({ statistics: defaultStatistics });
        },
      }),
      {
        name: 'sprintsolve-game-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({
          // Only persist these properties
          settings: state.settings,
          statistics: state.statistics,
          achievements: state.achievements,
          level: state.level,
          experience: state.experience,
        }),
      },
    ),
  ),
);

// Selectors for better performance
export const useGameState = () => useGameStore(state => state.gameState);
export const useScore = () => useGameStore(state => state.score);
export const useShield = () => useGameStore(state => state.hasShield);
export const useGameSpeed = () => useGameStore(state => state.gameSpeed);
export const useSelectedCategory = () =>
  useGameStore(state => state.selectedCategoryId);
export const useLives = () => useGameStore(state => state.lives);
export const useLevel = () => useGameStore(state => state.level);
export const useExperience = () => useGameStore(state => state.experience);
export const useAchievements = () => useGameStore(state => state.achievements);
export const useSettings = () => useGameStore(state => state.settings);
export const useStatistics = () => useGameStore(state => state.statistics);

// Action selectors
export const useGameActions = () =>
  useGameStore(state => ({
    setGameState: state.setGameState,
    incrementScore: state.incrementScore,
    resetScore: state.resetScore,
    setShield: state.setShield,
    setGameSpeed: state.setGameSpeed,
    setSelectedCategory: state.setSelectedCategory,
    resetGame: state.resetGame,
    setLives: state.setLives,
    decrementLives: state.decrementLives,
    addExperience: state.addExperience,
    unlockAchievement: state.unlockAchievement,
    updateSettings: state.updateSettings,
    updateStatistics: state.updateStatistics,
  }));

// Subscribe to store changes for analytics
useGameStore.subscribe(
  state => state.statistics,
  (statistics, previousStatistics) => {
    // Analytics tracking
    if (statistics.totalGamesPlayed > previousStatistics.totalGamesPlayed) {
      // Track game started
      console.debug('Game started:', statistics.totalGamesPlayed);
    }

    if (statistics.bestScore > previousStatistics.bestScore) {
      // Track new high score
      console.debug('New high score:', statistics.bestScore);
    }
  },
);

// Subscribe to achievements for notifications
useGameStore.subscribe(
  state => state.achievements,
  (achievements, previousAchievements) => {
    const newAchievements = achievements.filter(
      achievement => !previousAchievements.includes(achievement),
    );

    for (const achievement of newAchievements) {
      // Show achievement notification
      console.debug('Achievement unlocked:', achievement);
    }
  },
);
