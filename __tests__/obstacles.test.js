/**
 * @jest-environment jsdom
 */

import { obstacles, checkCollisions } from '../src/obstacles.js';

describe('checkCollisions', () => {
  // Clear obstacles array before each test
  beforeEach(() => {
    obstacles.length = 0;
  });

  test('should return null when there is no collision', () => {
    const character = { x: 50, y: 100, size: 20 };
    obstacles.push({ x: 200, y: 100, width: 50, height: 100, isCorrectAnswer: true });

    const result = checkCollisions(character);
    expect(result).toBeNull();
  });

  test('should return "correct" when colliding with a correct obstacle', () => {
    const character = { x: 210, y: 150, size: 20 };
    obstacles.push({ x: 200, y: 100, width: 50, height: 100, isCorrectAnswer: true });

    const result = checkCollisions(character);
    expect(result).toBe('correct');
  });

  test('should return "incorrect" when colliding with an incorrect obstacle', () => {
    const character = { x: 210, y: 150, size: 20 };
    obstacles.push({ x: 200, y: 100, width: 50, height: 100, isCorrectAnswer: false });

    const result = checkCollisions(character);
    expect(result).toBe('incorrect');
  });

  test('should return null if character is above the obstacle', () => {
    const character = { x: 210, y: 50, size: 20 };
    obstacles.push({ x: 200, y: 100, width: 50, height: 100, isCorrectAnswer: true });

    const result = checkCollisions(character);
    expect(result).toBeNull();
  });

  test('should return "correct" on edge collision', () => {
    // Character's right edge is just touching the obstacle's left edge
    const character = { x: 190, y: 150, size: 20 }; // character right edge at 200
    obstacles.push({ x: 200, y: 100, width: 50, height: 100, isCorrectAnswer: true });

    const result = checkCollisions(character);
    expect(result).toBe('correct');
  });
});
