/* eslint-disable no-console */
import type { Obstacle, Tunnel, Character, CollisionResult, Question } from '@/types';
import { wrapText } from '@/utils';

/**
 * Wall obstacle implementation
 */
class ObstacleImpl implements Obstacle {
  public x: number;
  public y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly isWall = true as const;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(ctx: CanvasRenderingContext2D, image?: HTMLImageElement): void {
    const wallColor = '#FF4500';
    
    ctx.fillStyle = wallColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Add texture/border effect
    ctx.strokeStyle = '#CC3300';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Optional: use image if provided
    if (image) {
      ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
  }

  public update(gameSpeed: number): void {
    this.x -= gameSpeed;
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  public reset(x: number, y: number, width: number, height: number): void {
    this.x = x;
    this.y = y;
    Object.assign(this, { width, height }); // Readonly workaround for reset
  }
}

/**
 * Tunnel implementation (passage between walls)
 */
class TunnelImpl implements Tunnel {
  public x: number;
  public y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly isCorrect: boolean;
  public readonly answerText: string;
  public readonly type = 'tunnel';

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    isCorrect: boolean,
    answerText: string
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isCorrect = isCorrect;
    this.answerText = answerText;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // Tunnels are empty space, but we draw the answer text in them
    const textColor = this.isCorrect ? '#00FF00' : '#FFFFFF';
    
    ctx.fillStyle = textColor;
    ctx.font = '14px "Press Start 2P"';
    ctx.textAlign = 'center';

    const maxWidth = this.width - 10; // Padding
    const lineHeight = 18;
    const x = this.x + this.width / 2;
    const y = this.y + this.height / 2;

    wrapText(ctx, this.answerText, x, y, maxWidth, lineHeight);
    ctx.textAlign = 'left'; // Reset alignment
  }

  public update(gameSpeed: number): void {
    this.x -= gameSpeed;
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  public reset(
    x: number,
    y: number,
    width: number,
    height: number,
    isCorrect: boolean,
    answerText: string
  ): void {
    this.x = x;
    this.y = y;
    Object.assign(this, { width, height, isCorrect, answerText }); // Readonly workaround
  }
}

/**
 * Object pool for obstacles and tunnels
 */
class ObstaclePool {
  private readonly obstaclePool: ObstacleImpl[] = [];
  private readonly tunnelPool: TunnelImpl[] = [];
  private readonly activeObstacles: ObstacleImpl[] = [];
  private readonly activeTunnels: TunnelImpl[] = [];
  private readonly maxPoolSize = 50;

  public createObstacle(
    x: number,
    y: number,
    width: number,
    height: number
  ): ObstacleImpl {
    let obstacle: ObstacleImpl;

    if (this.obstaclePool.length > 0) {
      obstacle = this.obstaclePool.pop()!;
      obstacle.reset(x, y, width, height);
    } else {
      obstacle = new ObstacleImpl(x, y, width, height);
    }

    this.activeObstacles.push(obstacle);
    return obstacle;
  }

  public createTunnel(
    x: number,
    y: number,
    width: number,
    height: number,
    isCorrect: boolean,
    answerText: string
  ): TunnelImpl {
    let tunnel: TunnelImpl;

    if (this.tunnelPool.length > 0) {
      tunnel = this.tunnelPool.pop()!;
      tunnel.reset(x, y, width, height, isCorrect, answerText);
    } else {
      tunnel = new TunnelImpl(x, y, width, height, isCorrect, answerText);
    }

    this.activeTunnels.push(tunnel);
    return tunnel;
  }

  public update(gameSpeed: number): void {
    // Update obstacles
    for (let i = this.activeObstacles.length - 1; i >= 0; i--) {
      const obstacle = this.activeObstacles[i]!;
      obstacle.update(gameSpeed);

      // Remove off-screen obstacles and return to pool
      if (obstacle.x + obstacle.width < 0) {
        this.activeObstacles.splice(i, 1);
        if (this.obstaclePool.length < this.maxPoolSize) {
          this.obstaclePool.push(obstacle);
        }
      }
    }

    // Update tunnels
    for (let i = this.activeTunnels.length - 1; i >= 0; i--) {
      const tunnel = this.activeTunnels[i]!;
      tunnel.update(gameSpeed);

      // Remove off-screen tunnels and return to pool
      if (tunnel.x + tunnel.width < 0) {
        this.activeTunnels.splice(i, 1);
        if (this.tunnelPool.length < this.maxPoolSize) {
          this.tunnelPool.push(tunnel);
        }
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D, wallImage?: HTMLImageElement): void {
    // Draw obstacles
    for (const obstacle of this.activeObstacles) {
      obstacle.draw(ctx, wallImage);
    }

    // Draw tunnels
    for (const tunnel of this.activeTunnels) {
      tunnel.draw(ctx);
    }
  }

  public clear(): void {
    // Return all active objects to pools
    for (const obstacle of this.activeObstacles) {
      if (this.obstaclePool.length < this.maxPoolSize) {
        this.obstaclePool.push(obstacle);
      }
    }
    
    for (const tunnel of this.activeTunnels) {
      if (this.tunnelPool.length < this.maxPoolSize) {
        this.tunnelPool.push(tunnel);
      }
    }

    this.activeObstacles.length = 0;
    this.activeTunnels.length = 0;
  }

  public getActiveObstacles(): readonly ObstacleImpl[] {
    return this.activeObstacles;
  }

  public getActiveTunnels(): readonly TunnelImpl[] {
    return this.activeTunnels;
  }

  public getStats(): {
    activeObstacles: number;
    activeTunnels: number;
    pooledObstacles: number;
    pooledTunnels: number;
  } {
    return {
      activeObstacles: this.activeObstacles.length,
      activeTunnels: this.activeTunnels.length,
      pooledObstacles: this.obstaclePool.length,
      pooledTunnels: this.tunnelPool.length,
    };
  }
}

// Global obstacle pool
const obstaclePool = new ObstaclePool();

/**
 * Wall generation system
 */
export class WallGenerator {
  private readonly defaultWallWidth = 100;
  private readonly defaultTunnelCount = 4;
  private readonly minTunnelHeight = 120;

  public generateWallWithTunnels(
    canvas: HTMLCanvasElement,
    question: Question,
    characterSize: number = 60
  ): void {
    const wallWidth = this.defaultWallWidth;
    const numberOfTunnels = Math.min(this.defaultTunnelCount, question.answers.length);
    const tunnelHeight = Math.max(this.minTunnelHeight, characterSize * 2);
    
    // Calculate layout
    const totalTunnelHeight = numberOfTunnels * tunnelHeight;
    const totalWallHeight = canvas.height - totalTunnelHeight;

    if (totalWallHeight < 0) {
      console.error('Not enough space for tunnels. Reduce tunnel height or number of tunnels.');
      return;
    }

    // The height of each wall segment
    const wallSegmentHeight = totalWallHeight / (numberOfTunnels + 1);
    let currentY = 0;

    // Generate walls and tunnels
    for (let i = 0; i < numberOfTunnels + 1; i++) {
      // Add wall segment
      obstaclePool.createObstacle(
        canvas.width,
        currentY,
        wallWidth,
        wallSegmentHeight
      );

      // Add tunnel after the segment (except for the last one)
      if (i < numberOfTunnels && i < question.answers.length) {
        const tunnelY = currentY + wallSegmentHeight;
        const isCorrect = i === question.correctAnswer;
        const answerText = question.answers[i] || '';

        obstaclePool.createTunnel(
          canvas.width,
          tunnelY,
          wallWidth,
          tunnelHeight,
          isCorrect,
          answerText
        );

        currentY += wallSegmentHeight + tunnelHeight;
      }
    }
  }

  public generateMovingWall(
    canvas: HTMLCanvasElement,
    question: Question,
    characterSize: number = 60
  ): void {
    // Implementation for moving/animated walls
    this.generateWallWithTunnels(canvas, question, characterSize);
    
    // Add vertical movement to tunnels
    const tunnels = obstaclePool.getActiveTunnels();
    const amplitude = 30;
    const frequency = 0.02;
    
    tunnels.forEach((tunnel, index) => {
      const offset = Math.sin(Date.now() * frequency + index) * amplitude;
      tunnel.y += offset;
    });
  }
}

/**
 * Collision detection system
 */
export class CollisionDetector {
  public checkCollisions(character: Character, canvas: HTMLCanvasElement): CollisionResult {
    // Check floor and ceiling collisions
    const characterHalfSize = character.size / 2;
    
    if (character.y - characterHalfSize <= 0) {
      return 'ceiling';
    }
    if (character.y + characterHalfSize >= canvas.height) {
      return 'floor';
    }

    // Get active obstacles and tunnels
    const obstacles = obstaclePool.getActiveObstacles();
    const tunnels = obstaclePool.getActiveTunnels();

    if (obstacles.length === 0) {
      return null;
    }

    // Check horizontal overlap with wall structure
    const wallX = obstacles[0]!.x;
    const wallWidth = obstacles[0]!.width;
    const charRight = character.x + characterHalfSize;
    const charLeft = character.x - characterHalfSize;

    // Only check collision when character is horizontally aligned with wall
    if (charRight < wallX || charLeft > wallX + wallWidth) {
      return null;
    }

    // Check wall collisions (solid parts)
    for (const obstacle of obstacles) {
      if (this.isRectColliding(character, obstacle)) {
        return 'wall';
      }
    }

    // Check tunnel collisions (answer selection)
    for (const tunnel of tunnels) {
      if (this.isCharacterInTunnel(character, tunnel)) {
        return tunnel.isCorrect ? 'correct' : 'incorrect';
      }
    }

    // Fallback for edge cases
    return 'wall';
  }

  private isRectColliding(character: Character, obstacle: Obstacle): boolean {
    const charHalfSize = character.size / 2;
    
    return (
      character.x + charHalfSize > obstacle.x &&
      character.x - charHalfSize < obstacle.x + obstacle.width &&
      character.y + charHalfSize > obstacle.y &&
      character.y - charHalfSize < obstacle.y + obstacle.height
    );
  }

  private isCharacterInTunnel(character: Character, tunnel: Tunnel): boolean {
    return (
      character.y >= tunnel.y &&
      character.y <= tunnel.y + tunnel.height
    );
  }
}

// Global instances
export const wallGenerator = new WallGenerator();
export const collisionDetector = new CollisionDetector();

// Legacy API compatibility
export const obstacles: ObstacleImpl[] = [];
export const tunnels: TunnelImpl[] = [];

export function generateWallWithTunnels(
  canvas: HTMLCanvasElement,
  questionState: Question
): void {
  obstaclePool.clear();
  wallGenerator.generateWallWithTunnels(canvas, questionState);
}

export function checkCollisions(
  character: Character,
  canvas: HTMLCanvasElement
): CollisionResult {
  return collisionDetector.checkCollisions(character, canvas);
}

/**
 * Update all obstacles and tunnels
 */
export function updateObstacles(gameSpeed: number): void {
  obstaclePool.update(gameSpeed);
  
  // Update legacy arrays for backward compatibility
  obstacles.length = 0;
  tunnels.length = 0;
  
  obstacles.push(...obstaclePool.getActiveObstacles());
  tunnels.push(...obstaclePool.getActiveTunnels());
}

/**
 * Draw all obstacles and tunnels
 */
export function drawObstacles(
  ctx: CanvasRenderingContext2D,
  wallImage?: HTMLImageElement
): void {
  obstaclePool.draw(ctx, wallImage);
}

/**
 * Clear all obstacles and tunnels
 */
export function clearObstacles(): void {
  obstaclePool.clear();
}

/**
 * Get obstacle system statistics
 */
export function getObstacleStats(): {
  activeObstacles: number;
  activeTunnels: number;
  pooledObstacles: number;
  pooledTunnels: number;
} {
  return obstaclePool.getStats();
}
