/**
 * AdminDo About Plugin
 * A web component plugin that displays about information
 */

// About main component
class AboutComponent extends HTMLElement {
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
        
        .about-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e5e7;
          margin-top: 1rem;
        }
        
        .about-header {
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
      
      <div class="about-container">
        <h2 class="about-header">About</h2>
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
       
          
        
       
      </div>
    `
  }
}

// About icon component
class AboutIconComponent extends HTMLElement {
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
if (!customElements.get('admindo-plugin-about')) {
  customElements.define('admindo-plugin-about', AboutComponent)
}

if (!customElements.get('admindo-plugin-about-icon')) {
  customElements.define('admindo-plugin-about-icon', AboutIconComponent)
}

// Plugin configuration
const aboutPlugin = {
  name: 'about',
  slug: 'about',
  title: 'About',
  description: 'About AdminDo',
  version: '0.0.1',
  icon: '👥',
  color: '#34C759',
  components: {
    panel: AboutComponent,
    icon: AboutIconComponent,
  },
}

// Export as ES module
export default aboutPlugin

// Auto-register plugin if AdminDo is available
window.AdminDo?.registerPlugin?.(aboutPlugin)
