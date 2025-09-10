import type { Particle as IParticle } from '@/types';
import { randomBetween, randomIntBetween } from '@/utils';

class ParticleImpl implements IParticle {
  public x: number;
  public y: number;
  public readonly size: number;
  public readonly speedX: number;
  public readonly speedY: number;
  public readonly color: string;
  public ttl: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = randomBetween(2, 7);
    this.speedX = randomBetween(-6, 6);
    this.speedY = randomBetween(-6, 6);
    this.color = `hsl(${randomIntBetween(0, 60)}, 100%, 50%)`; // Red-orange-yellow palette
    this.ttl = randomIntBetween(50, 150); // Time to live
  }

  public update(): void {
    this.x += this.speedX;
    this.y += this.speedY;
    this.ttl--;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // Fade out effect based on remaining ttl
    const alpha = Math.max(0, this.ttl / 150);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  public reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.ttl = randomIntBetween(50, 150);
  }

  public get isAlive(): boolean {
    return this.ttl > 0;
  }
}

/**
 * Particle pool for better performance
 */
class ParticlePool {
  private readonly pool: ParticleImpl[] = [];
  private readonly activeParticles: ParticleImpl[] = [];
  private readonly maxPoolSize = 200;

  public create(x: number, y: number): void {
    let particle: ParticleImpl;

    // Reuse particle from pool if available
    if (this.pool.length > 0) {
      particle = this.pool.pop()!;
      particle.reset(x, y);
    } else {
      particle = new ParticleImpl(x, y);
    }

    this.activeParticles.push(particle);
  }

  public update(): void {
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const particle = this.activeParticles[i]!;
      particle.update();

      if (!particle.isAlive) {
        // Return particle to pool
        this.activeParticles.splice(i, 1);

        if (this.pool.length < this.maxPoolSize) {
          this.pool.push(particle);
        }
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (const particle of this.activeParticles) {
      particle.draw(ctx);
    }
  }

  public clear(): void {
    // Return all active particles to pool
    for (const particle of this.activeParticles) {
      if (this.pool.length < this.maxPoolSize) {
        this.pool.push(particle);
      }
    }
    this.activeParticles.length = 0;
  }

  public get count(): number {
    return this.activeParticles.length;
  }

  public getStats(): { active: number; pooled: number } {
    return {
      active: this.activeParticles.length,
      pooled: this.pool.length,
    };
  }
}

// Global particle system
const particlePool = new ParticlePool();

/**
 * Creates an explosion effect at the specified location
 */
export function createExplosion(
  x: number,
  y: number,
  particleCount: number = 50,
): void {
  for (let i = 0; i < particleCount; i++) {
    // Add some randomness to the position for better visual effect
    const offsetX = randomBetween(-10, 10);
    const offsetY = randomBetween(-10, 10);
    particlePool.create(x + offsetX, y + offsetY);
  }
}

/**
 * Creates a burst effect (smaller explosion)
 */
export function createBurst(
  x: number,
  y: number,
  particleCount: number = 15,
): void {
  createExplosion(x, y, particleCount);
}

/**
 * Creates a trail effect
 */
export function createTrail(
  x: number,
  y: number,
  particleCount: number = 3,
): void {
  createExplosion(x, y, particleCount);
}

/**
 * Updates all active particles
 */
export function updateParticles(): void {
  particlePool.update();
}

/**
 * Draws all active particles
 */
export function drawParticles(ctx: CanvasRenderingContext2D): void {
  particlePool.draw(ctx);
}

/**
 * Clears all particles
 */
export function clearParticles(): void {
  particlePool.clear();
}

/**
 * Gets particle system statistics
 */
export function getParticleStats(): { active: number; pooled: number } {
  return particlePool.getStats();
}

/**
 * Enhanced particle system class for advanced effects
 */
export class ParticleSystem {
  private readonly pools = new Map<string, ParticlePool>();

  public createPool(name: string): void {
    this.pools.set(name, new ParticlePool());
  }

  public emit(poolName: string, x: number, y: number, count: number = 1): void {
    const pool = this.pools.get(poolName);
    if (!pool) {
      // eslint-disable-next-line no-console
      console.warn(`Particle pool '${poolName}' not found`);
      return;
    }

    for (let i = 0; i < count; i++) {
      pool.create(x, y);
    }
  }

  public update(): void {
    for (const pool of this.pools.values()) {
      pool.update();
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (const pool of this.pools.values()) {
      pool.draw(ctx);
    }
  }

  public clear(poolName?: string): void {
    if (poolName) {
      const pool = this.pools.get(poolName);
      if (pool) {
        pool.clear();
      }
    } else {
      for (const pool of this.pools.values()) {
        pool.clear();
      }
    }
  }

  public getStats(): Record<string, { active: number; pooled: number }> {
    const stats: Record<string, { active: number; pooled: number }> = {};

    for (const [name, pool] of this.pools.entries()) {
      stats[name] = pool.getStats();
    }

    return stats;
  }
}

// Legacy exports for backward compatibility
export const particles: ParticleImpl[] = [];

// Maintain compatibility with old API while using new pool system
const legacyUpdateParticles = (): void => {
  updateParticles();
  // Update legacy array for any code that might still reference it
  particles.length = 0;
};

const legacyDrawParticles = (ctx: CanvasRenderingContext2D): void => {
  drawParticles(ctx);
};

// Export legacy functions
// Export legacy functions with different names to avoid conflicts
export { legacyUpdateParticles, legacyDrawParticles };
