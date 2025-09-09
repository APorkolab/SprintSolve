import type { TriviaCategory, GameScore, DisplayMessage } from '@/types';
import { wrapText } from '@/utils';

/**
 * Modern UI component system for the game
 */
export class UIComponentSystem {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private notifications: DisplayMessage[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Render responsive canvas size adjustment
   */
  public setCanvasSize(): void {
    const pixelRatio = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    this.canvas.width = displayWidth * pixelRatio;
    this.canvas.height = displayHeight * pixelRatio;
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    this.ctx.scale(pixelRatio, pixelRatio);
  }

  /**
   * Create gradient background
   */
  public drawGradientBackground(color1: string = '#FFE600', color2: string = '#FF6A00'): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw modern game panel with glass morphism effect
   */
  public drawGamePanel(
    score: GameScore,
    lives: number,
    level: number,
    hasShield: boolean,
    experience: number = 0
  ): void {
    const panelWidth = 280;
    const panelHeight = 120;
    const padding = 20;
    const x = padding;
    const y = padding;

    // Glass morphism background
    this.drawGlassPanel(x, y, panelWidth, panelHeight);

    // Content
    this.ctx.font = 'bold 16px Inter, system-ui';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'left';

    let contentY = y + 25;
    const lineHeight = 20;

    // Score with icon
    this.ctx.fillText(`🎯 Score: ${score.value}`, x + 15, contentY);
    contentY += lineHeight;

    // Lives with hearts
    const heartsText = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives));
    this.ctx.fillText(`${heartsText} Lives: ${lives}`, x + 15, contentY);
    contentY += lineHeight;

    // Level and experience
    this.ctx.fillText(`⭐ Level: ${level}`, x + 15, contentY);
    
    // Experience bar
    if (experience > 0) {
      const expBarWidth = 100;
      const expBarHeight = 6;
      const expBarX = x + 140;
      const expBarY = contentY - 8;
      
      const currentLevelExp = experience % 100;
      const expProgress = currentLevelExp / 100;

      // Background
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.fillRect(expBarX, expBarY, expBarWidth, expBarHeight);
      
      // Progress
      this.ctx.fillStyle = '#10B981';
      this.ctx.fillRect(expBarX, expBarY, expBarWidth * expProgress, expBarHeight);
    }

    contentY += lineHeight;

    // Shield indicator
    if (hasShield) {
      this.ctx.fillText('🛡️ Shield Active', x + 15, contentY);
    }
  }

  /**
   * Draw glass morphism panel
   */
  private drawGlassPanel(x: number, y: number, width: number, height: number): void {
    // Background blur effect (simulated)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    this.ctx.fillRect(x, y, width, height);

    // Border
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);

    // Inner glow
    const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x + 1, y + 1, width - 2, height - 2);
  }

  /**
   * Modern menu screen with animations
   */
  public drawMenuScreen(
    bestScore: number,
    totalGamesPlayed: number,
    achievements: string[] = []
  ): void {
    // Gradient background
    this.drawGradientBackground();

    // Main title with glow effect
    this.ctx.save();
    this.ctx.shadowColor = '#FF6A00';
    this.ctx.shadowBlur = 20;
    this.ctx.font = 'bold 48px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SprintSolve', this.canvas.width / 2, this.canvas.height / 2 - 120);
    this.ctx.restore();

    // Subtitle
    this.ctx.font = '16px Inter, system-ui';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillText('Educational Trivia Game', this.canvas.width / 2, this.canvas.height / 2 - 80);

    // Start button
    this.drawModernButton(
      'Start Game',
      this.canvas.width / 2 - 100,
      this.canvas.height / 2 - 20,
      200,
      50,
      '#FF6A00',
      '#FFFFFF'
    );

    // Statistics panel
    this.drawStatsPanel(bestScore, totalGamesPlayed, achievements);

    // Version info
    this.ctx.font = '12px Inter, system-ui';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('v1.0.0 • Built with ❤️', this.canvas.width / 2, this.canvas.height - 20);
  }

  /**
   * Modern button with hover effects
   */
  public drawModernButton(
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    bgColor: string = '#FF6A00',
    textColor: string = '#FFFFFF',
    isHovered: boolean = false
  ): void {
    this.ctx.save();

    // Shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = isHovered ? 15 : 10;
    this.ctx.shadowOffsetY = isHovered ? 6 : 4;

    // Button background
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(x, y, width, height);

    // Border
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);

    // Text
    this.ctx.shadowColor = 'transparent';
    this.ctx.font = 'bold 16px "Press Start 2P", monospace';
    this.ctx.fillStyle = textColor;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x + width / 2, y + height / 2);

    this.ctx.restore();
  }

  /**
   * Statistics panel
   */
  private drawStatsPanel(bestScore: number, totalGamesPlayed: number, achievements: string[]): void {
    const panelWidth = 300;
    const panelHeight = 150;
    const x = this.canvas.width / 2 - panelWidth / 2;
    const y = this.canvas.height - panelHeight - 80;

    this.drawGlassPanel(x, y, panelWidth, panelHeight);

    this.ctx.font = 'bold 18px Inter, system-ui';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Statistics', x + panelWidth / 2, y + 25);

    this.ctx.font = '14px Inter, system-ui';
    let contentY = y + 50;
    const lineHeight = 20;

    this.ctx.textAlign = 'left';
    this.ctx.fillText(`🏆 Best Score: ${bestScore}`, x + 20, contentY);
    contentY += lineHeight;
    
    this.ctx.fillText(`🎮 Games Played: ${totalGamesPlayed}`, x + 20, contentY);
    contentY += lineHeight;
    
    this.ctx.fillText(`🏅 Achievements: ${achievements.length}`, x + 20, contentY);

    // Achievement badges
    if (achievements.length > 0) {
      contentY += lineHeight;
      const badgeSize = 20;
      const badgeSpacing = 25;
      let badgeX = x + 20;

      for (let i = 0; i < Math.min(achievements.length, 8); i++) {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(badgeX, contentY, badgeSize, badgeSize);
        badgeX += badgeSpacing;
      }
    }
  }

  /**
   * Category selection screen
   */
  public drawCategorySelect(categories: TriviaCategory[], selectedIndex: number = -1): void {
    this.drawGradientBackground();

    // Title
    this.ctx.font = 'bold 32px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Select Category', this.canvas.width / 2, 80);

    if (categories.length === 0) {
      this.drawLoadingState('Loading categories...');
      return;
    }

    // Categories grid
    const itemWidth = 280;
    const itemHeight = 60;
    const itemsPerRow = Math.floor((this.canvas.width - 40) / (itemWidth + 20));
    const totalWidth = itemsPerRow * itemWidth + (itemsPerRow - 1) * 20;
    const startX = (this.canvas.width - totalWidth) / 2;
    let currentY = 140;

    categories.forEach((category, index) => {
      const col = index % itemsPerRow;
      const row = Math.floor(index / itemsPerRow);
      const x = startX + col * (itemWidth + 20);
      const y = currentY + row * (itemHeight + 20);

      const isSelected = index === selectedIndex;
      const bgColor = isSelected ? '#FF6A00' : 'rgba(255, 255, 255, 0.1)';
      const textColor = isSelected ? '#FFFFFF' : '#FFFFFF';

      // Category button
      this.drawGlassPanel(x, y, itemWidth, itemHeight);
      
      if (isSelected) {
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(x + 2, y + 2, itemWidth - 4, itemHeight - 4);
      }

      this.ctx.font = '14px Inter, system-ui';
      this.ctx.fillStyle = textColor;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      // Wrap long category names
      wrapText(this.ctx, category.name, x + itemWidth / 2, y + itemHeight / 2, itemWidth - 20, 16);
    });

    // Instructions
    this.ctx.font = '12px Inter, system-ui';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Click on a category to select it', this.canvas.width / 2, this.canvas.height - 40);
  }

  /**
   * Game over screen with enhanced statistics
   */
  public drawGameOverScreen(
    finalScore: number,
    bestScore: number,
    isNewRecord: boolean = false,
    gameStats: {
      correctAnswers: number;
      totalQuestions: number;
      accuracy: number;
      playTime: number;
    }
  ): void {
    // Dark overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const panelWidth = 400;
    const panelHeight = 350;
    const x = this.canvas.width / 2 - panelWidth / 2;
    const y = this.canvas.height / 2 - panelHeight / 2;

    // Main panel
    this.drawGlassPanel(x, y, panelWidth, panelHeight);

    // Title
    this.ctx.font = 'bold 32px "Press Start 2P", monospace';
    this.ctx.fillStyle = isNewRecord ? '#FFD700' : '#FF6A00';
    this.ctx.textAlign = 'center';
    
    if (isNewRecord) {
      this.ctx.save();
      this.ctx.shadowColor = '#FFD700';
      this.ctx.shadowBlur = 20;
      this.ctx.fillText('New Record!', x + panelWidth / 2, y + 50);
      this.ctx.restore();
    } else {
      this.ctx.fillText('Game Over', x + panelWidth / 2, y + 50);
    }

    // Score
    this.ctx.font = 'bold 24px Inter, system-ui';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText(`Score: ${finalScore}`, x + panelWidth / 2, y + 90);

    // Statistics
    let statsY = y + 130;
    const statsLineHeight = 25;
    
    this.ctx.font = '16px Inter, system-ui';
    this.ctx.textAlign = 'left';
    
    const stats = [
      `Accuracy: ${gameStats.accuracy.toFixed(1)}%`,
      `Correct: ${gameStats.correctAnswers}/${gameStats.totalQuestions}`,
      `Play Time: ${Math.floor(gameStats.playTime / 60)}:${(gameStats.playTime % 60).toString().padStart(2, '0')}`,
      `Best Score: ${bestScore}`,
    ];

    stats.forEach((stat, index) => {
      this.ctx.fillText(stat, x + 30, statsY + index * statsLineHeight);
    });

    // Play again button
    this.drawModernButton(
      'Play Again',
      x + 50,
      y + panelHeight - 70,
      150,
      45,
      '#FF6A00',
      '#FFFFFF'
    );

    // Menu button
    this.drawModernButton(
      'Main Menu',
      x + 220,
      y + panelHeight - 70,
      130,
      45,
      'rgba(255, 255, 255, 0.2)',
      '#FFFFFF'
    );
  }

  /**
   * Loading state with animated spinner
   */
  public drawLoadingState(message: string): void {
    this.ctx.font = '20px Inter, system-ui';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);

    // Animated dots
    const time = Date.now();
    const dotCount = Math.floor((time / 500) % 4);
    const dots = '.'.repeat(dotCount);
    this.ctx.fillText(dots, this.canvas.width / 2 + 100, this.canvas.height / 2);
  }

  /**
   * Settings screen
   */
  public drawSettingsScreen(settings: {
    volume: number;
    sfxVolume: number;
    musicVolume: number;
    theme: string;
    difficulty: string;
  }): void {
    this.drawGradientBackground();

    const panelWidth = 400;
    const panelHeight = 450;
    const x = this.canvas.width / 2 - panelWidth / 2;
    const y = this.canvas.height / 2 - panelHeight / 2;

    this.drawGlassPanel(x, y, panelWidth, panelHeight);

    // Title
    this.ctx.font = 'bold 28px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Settings', x + panelWidth / 2, y + 40);

    // Settings items
    let itemY = y + 80;
    const itemHeight = 50;
    const itemPadding = 20;

    // Volume sliders
    this.drawSlider('Master Volume', settings.volume, x + itemPadding, itemY, panelWidth - 2 * itemPadding);
    itemY += itemHeight;

    this.drawSlider('SFX Volume', settings.sfxVolume, x + itemPadding, itemY, panelWidth - 2 * itemPadding);
    itemY += itemHeight;

    this.drawSlider('Music Volume', settings.musicVolume, x + itemPadding, itemY, panelWidth - 2 * itemPadding);
    itemY += itemHeight + 20;

    // Theme selector
    this.drawSelector('Theme', settings.theme, ['Auto', 'Light', 'Dark'], x + itemPadding, itemY, panelWidth - 2 * itemPadding);
    itemY += itemHeight;

    // Difficulty selector
    this.drawSelector('Difficulty', settings.difficulty, ['Easy', 'Medium', 'Hard', 'Dynamic'], x + itemPadding, itemY, panelWidth - 2 * itemPadding);

    // Back button
    this.drawModernButton(
      'Back',
      x + panelWidth / 2 - 75,
      y + panelHeight - 60,
      150,
      40,
      '#FF6A00',
      '#FFFFFF'
    );
  }

  /**
   * Draw slider control
   */
  private drawSlider(label: string, value: number, x: number, y: number, width: number): void {
    this.ctx.font = '14px Inter, system-ui';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(label, x, y);

    // Slider track
    const sliderY = y + 15;
    const sliderWidth = width - 60;
    const sliderHeight = 4;
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(x, sliderY, sliderWidth, sliderHeight);

    // Slider fill
    this.ctx.fillStyle = '#FF6A00';
    this.ctx.fillRect(x, sliderY, sliderWidth * value, sliderHeight);

    // Slider handle
    const handleX = x + sliderWidth * value - 6;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(handleX, sliderY - 4, 12, 12);

    // Value text
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`${Math.round(value * 100)}%`, x + width, y);
  }

  /**
   * Draw selector control
   */
  private drawSelector(label: string, selectedValue: string, options: string[], x: number, y: number, width: number): void {
    this.ctx.font = '14px Inter, system-ui';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(label, x, y);

    // Selector background
    const selectorY = y + 5;
    const selectorHeight = 25;
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(x, selectorY, width, selectorHeight);

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, selectorY, width, selectorHeight);

    // Selected value
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(selectedValue, x + width / 2, selectorY + 17);
  }

  /**
   * Add notification
   */
  public addNotification(text: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000): void {
    const notification: DisplayMessage = {
      text,
      ttl: Math.ceil(duration / 16.67), // Convert ms to frames (60fps)
      color: this.getNotificationColor(type),
    };

    this.notifications.push(notification);

    // Limit notifications
    if (this.notifications.length > 3) {
      this.notifications.shift();
    }
  }

  /**
   * Update and draw notifications
   */
  public updateNotifications(): void {
    for (let i = this.notifications.length - 1; i >= 0; i--) {
      const notification = this.notifications[i]!;
      notification.ttl--;

      if (notification.ttl <= 0) {
        this.notifications.splice(i, 1);
      }
    }

    // Draw notifications
    this.notifications.forEach((notification, index) => {
      const y = 80 + index * 60;
      this.drawNotification(notification, this.canvas.width - 320, y);
    });
  }

  /**
   * Draw individual notification
   */
  private drawNotification(notification: DisplayMessage, x: number, y: number): void {
    const width = 300;
    const height = 50;
    
    // Background with fade effect
    const alpha = Math.min(notification.ttl / 30, 0.9);
    this.ctx.save();
    this.ctx.globalAlpha = alpha;

    this.drawGlassPanel(x, y, width, height);

    // Text
    this.ctx.font = '14px Inter, system-ui';
    this.ctx.fillStyle = notification.color;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    
    wrapText(this.ctx, notification.text, x + 15, y + height / 2, width - 30, 16);

    this.ctx.restore();
  }

  /**
   * Get notification color by type
   */
  private getNotificationColor(type: string): string {
    switch (type) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'info': return '#3B82F6';
      default: return '#FFFFFF';
    }
  }

  /**
   * Draw pause overlay
   */
  public drawPauseOverlay(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = 'bold 48px "Press Start 2P", monospace';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Paused', this.canvas.width / 2, this.canvas.height / 2 - 20);

    this.ctx.font = '16px Inter, system-ui';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillText('Press P or ESC to continue', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }
}
