/**
 * @jest-environment jsdom
 */

import { character } from '../src/character.js';

describe('character', () => {
  beforeEach(() => {
    // Reset character state before each test
    character.y = 200;
    character.velocity_y = 0;
    character.gravity = 0.5; // Use a consistent gravity for tests
  });

  test('should have a defined initial state', () => {
    expect(character.x).toBe(150);
    expect(character.size).toBe(60);
    expect(character.jump_strength).toBe(-10);
  });

  test('jump() should set a negative vertical velocity', () => {
    character.jump();
    expect(character.velocity_y).toBe(character.jump_strength);
  });

  describe('update()', () => {
    test('should apply gravity to velocity_y', () => {
      const initialVelocity = character.velocity_y;
      character.update();
      expect(character.velocity_y).toBe(initialVelocity + character.gravity);
    });

    test('should apply velocity to y position', () => {
      const initialY = character.y;
      character.velocity_y = -10; // Set a known velocity
      character.update();
      // New y should be initialY + velocity_y + gravity
      // y = 200 + (-10) + 0.5 = 190.5
      expect(character.y).toBe(initialY + (-10) + character.gravity);
    });

    test('should simulate a fall over multiple frames', () => {
      character.y = 200;
      character.velocity_y = 0;

      // Frame 1
      character.update();
      expect(character.velocity_y).toBe(0.5);
      expect(character.y).toBe(200.5);

      // Frame 2
      character.update();
      expect(character.velocity_y).toBe(1.0);
      expect(character.y).toBe(201.5);

      // Frame 3
      character.update();
      expect(character.velocity_y).toBe(1.5);
      expect(character.y).toBe(203.0);
    });
  });
});
