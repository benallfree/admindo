import pkg from '../package.json' with { type: 'json' }
/**
 * AdminDO DTerm Plugin
 * A web component plugin that provides a Durable Objects File System terminal
 */

// DTerm main component
class DtermComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.commandHistory = []
    this.historyIndex = -1
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector('.terminal-input')
    if (input) {
      input.addEventListener('keydown', (e) => this.handleKeyDown(e))
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.executeCommand(e.target.value)
      e.target.value = ''
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (this.historyIndex > 0) {
        this.historyIndex--
        e.target.value = this.commandHistory[this.historyIndex]
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++
        e.target.value = this.commandHistory[this.historyIndex]
      } else {
        this.historyIndex = this.commandHistory.length
        e.target.value = ''
      }
    }
  }

  executeCommand(command) {
    if (command.trim()) {
      this.commandHistory.push(command)
      this.historyIndex = this.commandHistory.length
      this.addOutput(`$ ${command}`)

      // Simulate command execution
      setTimeout(() => {
        this.processCommand(command)
      }, 100)
    }
  }

  processCommand(command) {
    const cmd = command.trim().toLowerCase()

    if (cmd === 'ls' || cmd === 'dir') {
      this.addOutput('data/\nlogs/\nconfig.json\nREADME.md')
    } else if (cmd.startsWith('cat ')) {
      const file = cmd.substring(4)
      this.addOutput(`Contents of ${file}:\n[File content would be displayed here]`)
    } else if (cmd === 'pwd') {
      this.addOutput('/durable-objects')
    } else if (cmd === 'help') {
      this.addOutput(
        'Available commands:\nls, dir - List files\ncat <file> - Display file contents\npwd - Show current directory\nclear - Clear terminal\nhelp - Show this help'
      )
    } else if (cmd === 'clear') {
      this.clearOutput()
    } else {
      this.addOutput(`Command not found: ${command}`)
    }
  }

  addOutput(text) {
    const output = this.shadowRoot.querySelector('.terminal-output')
    if (output) {
      const line = document.createElement('div')
      line.textContent = text
      line.style.whiteSpace = 'pre-wrap'
      output.appendChild(line)
      output.scrollTop = output.scrollHeight
    }
  }

  clearOutput() {
    const output = this.shadowRoot.querySelector('.terminal-output')
    if (output) {
      output.innerHTML = ''
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 1200px;
        }
        
        .terminal-container {
          background: #1a1a1a;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #333;
          margin-top: 1rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          color: #00ff00;
        }
        
        .terminal-header {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #333;
        }
        
        .terminal-output {
          height: 400px;
          overflow-y: auto;
          background: #000;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .terminal-input-container {
          display: flex;
          align-items: center;
          background: #000;
          padding: 0.5rem 1rem;
          border-radius: 6px;
        }
        
        .terminal-prompt {
          color: #00ff00;
          margin-right: 0.5rem;
        }
        
        .terminal-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #00ff00;
          font-family: inherit;
          font-size: 14px;
          outline: none;
        }
        
        .terminal-input::placeholder {
          color: #666;
        }
        
        .help-text {
          color: #666;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          text-align: center;
        }
      </style>
      
      <div class="terminal-container">
        <h2 class="terminal-header">
          💻 DOFS Terminal
        </h2>
        
        <div class="terminal-output">
          <div>Welcome to DOFS Terminal v1.0</div>
          <div>Type 'help' for available commands</div>
          <div>$ pwd</div>
          <div>/durable-objects</div>
          <div>$ </div>
        </div>
        
        <div class="terminal-input-container">
          <span class="terminal-prompt">$</span>
          <input type="text" class="terminal-input" placeholder="Enter command..." autofocus>
        </div>
        
        <div class="help-text">
          Use ↑/↓ arrows for command history • Press Enter to execute
        </div>
      </div>
    `
  }
}

// Register the custom element
customElements.define('admindo-dterm', DtermComponent)

// Plugin configuration
/**
 * @type {import('admindo').Plugin}
 */
const dtermPlugin = {
  slug: pkg.name,
  title: 'Terminal',
  description: pkg.description,
  version: pkg.version,
  icon: '💻',
  color: '#00FF00',
  render: () => document.createElement('admindo-dterm'),
}

// Auto-register plugin if AdminDO is available
window.AdminDO?.registerPlugin?.(dtermPlugin)
