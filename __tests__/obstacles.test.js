/**
 * @jest-environment jsdom
 */

import { obstacles, tunnels, checkCollisions, generateWallWithTunnels } from '../src/obstacles.js';
import { character } from '../src/character.js';

describe('Collision Detection', () => {
    // Use a larger canvas height to ensure wall segments have non-zero height
    const mockCanvas = { width: 800, height: 800 };

    beforeEach(() => {
        // Reset state before each test
        obstacles.length = 0;
        tunnels.length = 0;
        character.y = 300;
        character.x = 150; // Character's fixed x position
    });

    test('should return "ceiling" when character hits the top', () => {
        character.y = character.size / 2 - 1; // Just touching the ceiling
        const result = checkCollisions(character, mockCanvas);
        expect(result).toBe('ceiling');
    });

    test('should return "floor" when character hits the bottom', () => {
        character.y = mockCanvas.height - character.size / 2 + 1; // Just touching the floor
        const result = checkCollisions(character, mockCanvas);
        expect(result).toBe('floor');
    });

    test('should return null when no obstacles are present', () => {
        const result = checkCollisions(character, mockCanvas);
        expect(result).toBeNull();
    });

    describe('with wall obstacles', () => {
        beforeEach(() => {
            // Generate a standard wall for these tests
            // Mock question state needed for generation
            const mockQuestionState = { correctAnswer: 1, answers: ['A', 'B', 'C', 'D'] };
            generateWallWithTunnels(mockCanvas, mockQuestionState);
            // Move wall to be in contact with the character for collision checks
            const wallX = character.x + character.size / 2 - 1;
            obstacles.forEach(o => o.x = wallX);
            tunnels.forEach(t => t.x = wallX);
        });

        test('should return "wall" when character hits a solid wall segment', () => {
            // Position character to hit the second wall segment to avoid ceiling collision
            character.y = obstacles[1].y + obstacles[1].height / 2;
            const result = checkCollisions(character, mockCanvas);
            expect(result).toBe('wall');
        });

        test('should return "correct" when character passes through the correct tunnel', () => {
            // The correct tunnel is at index 1 (second tunnel)
            character.y = tunnels[1].y + tunnels[1].height / 2;
            const result = checkCollisions(character, mockCanvas);
            expect(result).toBe('correct');
        });

        test('should return "incorrect" when character passes through an incorrect tunnel', () => {
            // An incorrect tunnel is at index 0 (first tunnel)
            character.y = tunnels[0].y + tunnels[0].height / 2;
            const result = checkCollisions(character, mockCanvas);
            expect(result).toBe('incorrect');
        });

        test('should return null if character is not horizontally aligned with the wall', () => {
            // Move wall far away
            obstacles.forEach(o => o.x = 800);
            tunnels.forEach(t => t.x = 800);
            character.y = tunnels[1].y + tunnels[1].height / 2; // Aim for correct tunnel

            const result = checkCollisions(character, mockCanvas);
            expect(result).toBeNull();
        });
    });
});
