/**
 * AdminDo Credits Plugin
 * A web component plugin that displays credits information
 */

// Credits main component
class CreditsComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 800px;
        }
        
        .credits-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e5e7;
          margin-top: 1rem;
        }
        
        .credits-header {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1d1d1f;
        }
        
        .team-section {
          margin-bottom: 2rem;
        }
        
        .team-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1d1d1f;
        }
        
        .team-member {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .member-avatar {
          width: 48px;
          height: 48px;
          background: #007AFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-right: 1rem;
          font-size: 1.2rem;
        }
        
        .member-info {
          flex: 1;
        }
        
        .member-name {
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 0.25rem;
        }
        
        .member-role {
          color: #6e6e73;
          font-size: 0.9rem;
        }
        
        .description {
          color: #6e6e73;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        
        .tech-stack {
          background: #f5f5f7;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }
        
        .tech-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1d1d1f;
        }
        
        .tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .tech-tag {
          background: white;
          padding: 0.25rem 0.75rem;
          border-radius: 16px;
          font-size: 0.8rem;
          border: 1px solid #e5e5e7;
          color: #6e6e73;
        }
      </style>
      
      <div class="credits-container">
        <h2 class="credits-header">Credits</h2>
        
        <div class="team-section">
          <h3 class="team-title">AdminDo Contributors</h3>
          
          <div class="team-member">
            <div class="member-avatar">👤</div>
            <div class="member-info">
              <div class="member-name">@janwilmake</div>
              <div class="member-role">Contributor • <a href="https://x.com/janwilmake" target="_blank" style="color: #007AFF; text-decoration: none;">x.com/janwilmake</a></div>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">⚡</div>
            <div class="member-info">
              <div class="member-name">@flowisgreat</div>
              <div class="member-role">Contributor • <a href="https://x.com/flowisgreat" target="_blank" style="color: #007AFF; text-decoration: none;">x.com/flowisgreat</a></div>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">🚀</div>
            <div class="member-info">
              <div class="member-name">@benallfree</div>
              <div class="member-role">Contributor • <a href="https://x.com/benallfree" target="_blank" style="color: #007AFF; text-decoration: none;">x.com/benallfree</a></div>
            </div>
          </div>
        </div>
        
        <div class="description">
          <p>AdminDo is a zero-dependency admin dashboard built with pure HTML, CSS, and JavaScript.</p>
          <p>Features web components and a pluggable architecture for maximum flexibility and extensibility.</p>
        </div>
        
        <div class="tech-stack">
          <div class="tech-title">Built with:</div>
          <div class="tech-list">
            <span class="tech-tag">HTML5</span>
            <span class="tech-tag">CSS3</span>
            <span class="tech-tag">Vanilla JavaScript</span>
            <span class="tech-tag">Web Components</span>
            <span class="tech-tag">Custom Elements</span>
            <span class="tech-tag">Shadow DOM</span>
            <span class="tech-tag">ES Modules</span>
          </div>
        </div>
      </div>
    `
  }
}

// Credits icon component
class CreditsIconComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-size: inherit;
        }
      </style>
      👥
    `
  }
}

// Register web components
if (!customElements.get('admindo-plugin-credits')) {
  customElements.define('admindo-plugin-credits', CreditsComponent)
}

if (!customElements.get('admindo-plugin-credits-icon')) {
  customElements.define('admindo-plugin-credits-icon', CreditsIconComponent)
}

// Plugin configuration
const creditsPlugin = {
  name: 'credits',
  slug: 'credits',
  title: 'Credits',
  description: 'View credits and information about AdminDo',
  version: '1.0.0',
  icon: '👥',
  color: '#34C759',
  components: {
    panel: CreditsComponent,
    icon: CreditsIconComponent,
  },
}

// Export as ES module
export default creditsPlugin
