import { analyticsService } from '../services/analyticsService';
import { t } from '../services/i18nService';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export class ConsentManager {
  private consentBanner: HTMLElement | null = null;
  private preferencesModal: HTMLElement | null = null;
  private currentPreferences: ConsentPreferences;

  constructor() {
    this.currentPreferences = this.loadConsentPreferences();
    this.init();
  }

  /**
   * Initialize the consent manager
   */
  public init(): void {
    if (this.shouldShowConsent()) {
      this.createConsentBanner();
    } else {
      this.applyConsent();
    }

    // Add event listener for consent preference changes
    document.addEventListener('show-consent-preferences', () => {
      this.showPreferencesModal();
    });
  }

  /**
   * Check if we need to show consent banner
   */
  private shouldShowConsent(): boolean {
    const hasConsent = localStorage.getItem('consent_preferences');
    const consentVersion = localStorage.getItem('consent_version');
    const currentVersion = '1.0'; // Update this when privacy policy changes

    return !hasConsent || consentVersion !== currentVersion;
  }

  /**
   * Load saved consent preferences
   */
  private loadConsentPreferences(): ConsentPreferences {
    const saved = localStorage.getItem('consent_preferences');
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      necessary: true, // Always required
      analytics: false,
      marketing: false,
      preferences: false,
    };
  }

  /**
   * Save consent preferences
   */
  private saveConsentPreferences(preferences: ConsentPreferences): void {
    localStorage.setItem('consent_preferences', JSON.stringify(preferences));
    localStorage.setItem('consent_version', '1.0');
    localStorage.setItem('consent_timestamp', Date.now().toString());

    this.currentPreferences = preferences;
    this.applyConsent();
  }

  /**
   * Apply consent preferences to services
   */
  private applyConsent(): void {
    // Apply analytics consent
    analyticsService.updateConsent(this.currentPreferences.analytics);

    // Initialize analytics if consent given
    if (this.currentPreferences.analytics) {
      analyticsService.initialize({
        userConsent: true,
      });
    }

    // Apply other consents (marketing, preferences, etc.)
    this.applyMarketingConsent(this.currentPreferences.marketing);
    this.applyPreferencesConsent(this.currentPreferences.preferences);

    // Dispatch event for other parts of the app
    document.dispatchEvent(
      new CustomEvent('consent-updated', {
        detail: this.currentPreferences,
      }),
    );
  }

  /**
   * Apply marketing consent
   */
  private applyMarketingConsent(enabled: boolean): void {
    // Placeholder for marketing tools (social media pixels, etc.)
    if (enabled) {
      // eslint-disable-next-line no-console
      console.log('Marketing consent granted');
    } else {
      // eslint-disable-next-line no-console
      console.log('Marketing consent denied');
    }
  }

  /**
   * Apply preferences consent
   */
  private applyPreferencesConsent(enabled: boolean): void {
    // Placeholder for preference-based features
    if (enabled) {
      // eslint-disable-next-line no-console
      console.log('Preferences consent granted');
    } else {
      // eslint-disable-next-line no-console
      console.log('Preferences consent denied');
    }
  }

  /**
   * Create and show consent banner
   */
  private createConsentBanner(): void {
    this.consentBanner = document.createElement('div');
    this.consentBanner.className = 'consent-banner';
    this.consentBanner.innerHTML = `
      <div class="consent-content">
        <div class="consent-text">
          <h3>🍪 ${t('privacy.cookieConsent')}</h3>
          <p>${t('privacy.cookieDescription')}</p>
        </div>
        <div class="consent-actions">
          <button class="btn-accept-all" type="button">${t('privacy.acceptAll')}</button>
          <button class="btn-accept-necessary" type="button">${t('privacy.acceptNecessary')}</button>
          <button class="btn-preferences" type="button">${t('privacy.customize')}</button>
          <a href="#privacy-policy" class="privacy-link">${t('privacy.privacyPolicy')}</a>
        </div>
      </div>
    `;

    this.addConsentStyles();
    this.attachConsentEvents();

    document.body.appendChild(this.consentBanner);

    // Show with animation
    setTimeout(() => {
      this.consentBanner?.classList.add('show');
    }, 100);
  }

  /**
   * Attach event listeners to consent banner
   */
  private attachConsentEvents(): void {
    if (!this.consentBanner) return;

    const acceptAllBtn = this.consentBanner.querySelector('.btn-accept-all');
    const acceptNecessaryBtn = this.consentBanner.querySelector(
      '.btn-accept-necessary',
    );
    const preferencesBtn = this.consentBanner.querySelector('.btn-preferences');

    acceptAllBtn?.addEventListener('click', () => {
      this.saveConsentPreferences({
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true,
      });
      this.hideConsentBanner();
    });

    acceptNecessaryBtn?.addEventListener('click', () => {
      this.saveConsentPreferences({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
      });
      this.hideConsentBanner();
    });

    preferencesBtn?.addEventListener('click', () => {
      this.showPreferencesModal();
    });
  }

  /**
   * Hide consent banner
   */
  private hideConsentBanner(): void {
    if (this.consentBanner) {
      this.consentBanner.classList.remove('show');
      setTimeout(() => {
        this.consentBanner?.remove();
        this.consentBanner = null;
      }, 300);
    }
  }

  /**
   * Show preferences modal
   */
  private showPreferencesModal(): void {
    this.createPreferencesModal();
  }

  /**
   * Create preferences modal
   */
  private createPreferencesModal(): void {
    this.preferencesModal = document.createElement('div');
    this.preferencesModal.className = 'consent-modal-overlay';
    this.preferencesModal.innerHTML = `
      <div class="consent-modal">
        <div class="modal-header">
          <h2>Privacy Preferences</h2>
          <button class="close-btn" type="button">×</button>
        </div>
        <div class="modal-content">
          <p>Choose which cookies and data processing you're comfortable with. You can change these settings at any time.</p>
          
          <div class="preference-group">
            <div class="preference-header">
              <label class="preference-label">
                <input type="checkbox" checked disabled>
                <span class="checkmark"></span>
                <strong>Necessary</strong>
              </label>
            </div>
            <p class="preference-description">Required for basic site functionality, game saves, and security.</p>
          </div>
          
          <div class="preference-group">
            <div class="preference-header">
              <label class="preference-label">
                <input type="checkbox" id="analytics-consent" ${this.currentPreferences.analytics ? 'checked' : ''}>
                <span class="checkmark"></span>
                <strong>Analytics</strong>
              </label>
            </div>
            <p class="preference-description">Help us understand how you play and improve the game experience.</p>
          </div>
          
          <div class="preference-group">
            <div class="preference-header">
              <label class="preference-label">
                <input type="checkbox" id="marketing-consent" ${this.currentPreferences.marketing ? 'checked' : ''}>
                <span class="checkmark"></span>
                <strong>Marketing</strong>
              </label>
            </div>
            <p class="preference-description">Personalized content and recommendations based on your interests.</p>
          </div>
          
          <div class="preference-group">
            <div class="preference-header">
              <label class="preference-label">
                <input type="checkbox" id="preferences-consent" ${this.currentPreferences.preferences ? 'checked' : ''}>
                <span class="checkmark"></span>
                <strong>Preferences</strong>
              </label>
            </div>
            <p class="preference-description">Remember your settings and provide a personalized experience.</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-save" type="button">Save Preferences</button>
          <button class="btn-cancel" type="button">Cancel</button>
        </div>
      </div>
    `;

    this.attachPreferencesEvents();
    document.body.appendChild(this.preferencesModal);

    // Show with animation
    setTimeout(() => {
      this.preferencesModal?.classList.add('show');
    }, 50);
  }

  /**
   * Attach event listeners to preferences modal
   */
  private attachPreferencesEvents(): void {
    if (!this.preferencesModal) return;

    const closeBtn = this.preferencesModal.querySelector('.close-btn');
    const saveBtn = this.preferencesModal.querySelector('.btn-save');
    const cancelBtn = this.preferencesModal.querySelector('.btn-cancel');
    const overlay = this.preferencesModal;

    const closeModal = () => this.hidePreferencesModal();

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    overlay?.addEventListener('click', e => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    saveBtn?.addEventListener('click', () => {
      const analyticsCheckbox = this.preferencesModal?.querySelector(
        '#analytics-consent',
      ) as HTMLInputElement;
      const marketingCheckbox = this.preferencesModal?.querySelector(
        '#marketing-consent',
      ) as HTMLInputElement;
      const preferencesCheckbox = this.preferencesModal?.querySelector(
        '#preferences-consent',
      ) as HTMLInputElement;

      const preferences: ConsentPreferences = {
        necessary: true,
        analytics: analyticsCheckbox?.checked || false,
        marketing: marketingCheckbox?.checked || false,
        preferences: preferencesCheckbox?.checked || false,
      };

      this.saveConsentPreferences(preferences);
      this.hidePreferencesModal();
      this.hideConsentBanner();
    });
  }

  /**
   * Hide preferences modal
   */
  private hidePreferencesModal(): void {
    if (this.preferencesModal) {
      this.preferencesModal.classList.remove('show');
      setTimeout(() => {
        this.preferencesModal?.remove();
        this.preferencesModal = null;
      }, 300);
    }
  }

  /**
   * Add consent banner and modal styles
   */
  private addConsentStyles(): void {
    const styleId = 'consent-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        border-top: 2px solid #FF6A00;
        padding: 1.5rem;
        z-index: 10000;
        transform: translateY(100%);
        transition: transform 0.3s ease-out;
        font-family: 'Press Start 2P', monospace;
      }

      .consent-banner.show {
        transform: translateY(0);
      }

      .consent-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 2rem;
        flex-wrap: wrap;
      }

      .consent-text {
        flex: 1;
        min-width: 300px;
      }

      .consent-text h3 {
        color: #FF6A00;
        font-size: 0.8rem;
        margin: 0 0 0.5rem 0;
      }

      .consent-text p {
        color: white;
        font-size: 0.5rem;
        line-height: 1.4;
        margin: 0;
      }

      .consent-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .consent-actions button {
        background: #FF6A00;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.4rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid transparent;
      }

      .consent-actions button:hover {
        background: white;
        color: #FF6A00;
        border-color: #FF6A00;
      }

      .btn-accept-necessary {
        background: #666 !important;
      }

      .btn-accept-necessary:hover {
        background: white !important;
        color: #666 !important;
        border-color: #666 !important;
      }

      .privacy-link {
        color: #FF6A00;
        text-decoration: none;
        font-size: 0.4rem;
        border-bottom: 1px solid transparent;
        transition: border-color 0.2s;
      }

      .privacy-link:hover {
        border-bottom-color: #FF6A00;
      }

      .consent-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 1rem;
      }

      .consent-modal-overlay.show {
        opacity: 1;
      }

      .consent-modal {
        background: #1a1a1a;
        border: 2px solid #FF6A00;
        border-radius: 10px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        font-family: 'Press Start 2P', monospace;
        transform: scale(0.9);
        transition: transform 0.3s ease;
      }

      .consent-modal-overlay.show .consent-modal {
        transform: scale(1);
      }

      .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-header h2 {
        color: #FF6A00;
        font-size: 0.7rem;
        margin: 0;
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-btn:hover {
        color: #FF6A00;
      }

      .modal-content {
        padding: 1.5rem;
        color: white;
      }

      .modal-content > p {
        font-size: 0.5rem;
        line-height: 1.4;
        margin-bottom: 1.5rem;
      }

      .preference-group {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: rgba(255, 106, 0, 0.1);
        border-radius: 5px;
      }

      .preference-header {
        margin-bottom: 0.5rem;
      }

      .preference-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 0.5rem;
      }

      .preference-label input[type="checkbox"] {
        margin-right: 0.5rem;
        transform: scale(1.2);
      }

      .preference-description {
        font-size: 0.4rem;
        line-height: 1.3;
        color: #ccc;
        margin: 0;
        margin-left: 1.5rem;
      }

      .modal-actions {
        padding: 1.5rem;
        border-top: 1px solid #333;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }

      .modal-actions button {
        background: #FF6A00;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.4rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid transparent;
      }

      .modal-actions button:hover {
        background: white;
        color: #FF6A00;
        border-color: #FF6A00;
      }

      .btn-cancel {
        background: #666 !important;
      }

      .btn-cancel:hover {
        background: white !important;
        color: #666 !important;
        border-color: #666 !important;
      }

      @media (max-width: 768px) {
        .consent-content {
          flex-direction: column;
          text-align: center;
        }

        .consent-actions {
          justify-content: center;
          width: 100%;
        }

        .consent-modal {
          margin: 1rem;
          max-height: calc(100vh - 2rem);
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Get current consent preferences
   */
  public getConsentPreferences(): ConsentPreferences {
    return { ...this.currentPreferences };
  }

  /**
   * Check if specific consent is granted
   */
  public hasConsent(type: keyof ConsentPreferences): boolean {
    return this.currentPreferences[type];
  }

  /**
   * Programmatically show consent preferences
   */
  public showConsentPreferences(): void {
    this.showPreferencesModal();
  }

  /**
   * Reset all consent preferences
   */
  public resetConsent(): void {
    localStorage.removeItem('consent_preferences');
    localStorage.removeItem('consent_version');
    localStorage.removeItem('consent_timestamp');

    this.currentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    this.createConsentBanner();
  }
}

// Export singleton instance
export const consentManager = new ConsentManager();
