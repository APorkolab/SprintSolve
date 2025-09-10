import type { Character as ICharacter } from '@/types';

class CharacterImpl implements ICharacter {
  public readonly size = 60;
  public readonly gravity = 0.5;
  public readonly jump_strength = -10;

  public x = 150; // Fixed horizontal position
  public y = 0; // Will be initialized later
  public velocity_y = 0;

  public jump(): void {
    this.velocity_y = this.jump_strength;
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    characterImage: HTMLImageElement,
  ): void {
    if (!characterImage) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Rotate based on vertical velocity for a more dynamic feel
    const angle = Math.atan2(this.velocity_y, 20) * 0.3;
    ctx.rotate(angle);

    // Draw the entire GIF. The browser handles the animation.
    ctx.drawImage(
      characterImage,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size,
    );

    ctx.restore();
  }

  public update(): void {
    this.velocity_y += this.gravity;
    this.y += this.velocity_y;
  }

  public reset(canvasHeight: number): void {
    this.y = canvasHeight / 2;
    this.velocity_y = 0;
  }

  public getBounds(): {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } {
    const halfSize = this.size / 2;
    return {
      top: this.y - halfSize,
      bottom: this.y + halfSize,
      left: this.x - halfSize,
      right: this.x + halfSize,
    };
  }
}

export const character = new CharacterImpl();
