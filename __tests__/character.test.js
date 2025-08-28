/**
 * @jest-environment jsdom
 */

import { character } from '../src/character.js';

describe('character', () => {
  beforeEach(() => {
    // Reset character state before each test
    character.y = 100;
    character.gravity = 0;
    character.speed = 5; // Use a fixed speed for predictable tests
  });

  test('should have a defined initial state', () => {
    expect(character.x).toBe(50);
    expect(character.y).toBe(100);
    expect(character.size).toBe(60);
  });

  test('jump() should decrease the y position by the character speed', () => {
    const initialY = character.y;
    character.jump();
    expect(character.y).toBe(initialY - character.speed);
  });

  test('fall() should increase the y position by the character gravity', () => {
    const initialY = character.y;
    character.gravity = 2;
    character.fall();
    expect(character.y).toBe(initialY + 2);
  });

  test('fall() should not change y position when gravity is 0', () => {
    const initialY = character.y;
    character.gravity = 0;
    character.fall();
    expect(character.y).toBe(initialY);
  });

  describe('update()', () => {
    test('should set gravity to 0.5 when a question is displayed', () => {
      const mockQuestionState = { display: true };
      character.update(mockQuestionState);
      expect(character.gravity).toBe(0.5);
    });

    test('should set gravity to 0 when no question is displayed', () => {
      const mockQuestionState = { display: false };
      // First set it to a non-zero value to ensure it changes
      character.gravity = 0.5;
      character.update(mockQuestionState);
      expect(character.gravity).toBe(0);
    });

    test('should increment the currentFrame', () => {
      const initialFrame = character.currentFrame;
      character.update({ display: false });
      expect(character.currentFrame).toBe(initialFrame + 1);
    });

    test('should reset currentFrame to 0 after reaching totalFrames', () => {
      character.currentFrame = character.totalFrames - 1;
      character.update({ display: false });
      expect(character.currentFrame).toBe(0);
    });
  });
});
