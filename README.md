# AdminDo

A zero-dependency admin dashboard with pluggable architecture built using pure HTML, CSS, JavaScript, and ES modules.

## Features

- 🚀 **Zero Dependencies**: Pure vanilla JavaScript, no frameworks required
- 🧩 **Pluggable Architecture**: Easily extend with custom plugins
- 🔧 **Web Components**: Built using native web components technology
- 📱 **Responsive Design**: Modern, clean UI that works on all devices
- ⚡ **Lightweight**: Minimal footprint, fast loading
- 🎯 **SPA Ready**: Single Page Application architecture
- 📦 **ES Modules**: Modern JavaScript module system

## Quick Start

1. Clone or download this repository
2. Open `index.html` in your browser or serve it with a simple HTTP server:

```bash
npm run dev
# or
python3 -m http.server 8000
```

3. Navigate to `http://localhost:8000` in your browser

## Architecture

### Core Components

- **`<admin-do/>`**: Main dashboard web component that renders the admin skeleton
- **ES Module System**: Modern JavaScript imports for components and plugins
- **Plugin System**: Extensible architecture for adding new functionality

### Web Components

AdminDo uses native web components for maximum compatibility and performance:

```html
<!-- Main dashboard component -->
<admin-do></admin-do>

<!-- Plugin components (example with credits) -->
<credits></credits>
<credits-icon></credits-icon>
```

### Using ES Modules

```html
<script type="module" src="./index.js"></script>
```

```javascript
// Import the main component
import AdminDoComponent from './index.js'

// Import a plugin
import creditsPlugin from './plugins/credits/index.js'
```

## Plugin Development

### Creating a Plugin

Plugins are ES modules that export web components. Here's the basic structure:

```javascript
// my-plugin/index.js
class MyPluginComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h2>My Plugin Content</h2>'
  }
}

customElements.define('my-plugin', MyPluginComponent)

// Export plugin configuration
export default {
  name: 'my-plugin',
  title: 'My Plugin',
  description: 'Description of my plugin',
  icon: '🔌',
  color: '#007AFF',
}
```

### Plugin Registration

Plugins are automatically loaded via ES module imports in the main component:

```javascript
async loadDefaultPlugins() {
  try {
    const creditsModule = await import('./plugins/credits/index.js')
    this.registerPlugin(creditsModule.default)
  } catch (error) {
    console.warn('Plugin not found:', error.message)
  }
}
```

## Project Structure

```
admindo/
├── index.html              # Main dashboard page
├── index.js                # Main ES module component
├── package.json            # Package configuration
├── examples/
│   └── empty/
│       └── index.html      # Minimal demo
└── plugins/
    └── credits/
        ├── index.js        # Credits plugin ES module
        ├── package.json    # Plugin package config
        ├── demo.html       # Standalone plugin demo
        └── README.md       # Plugin documentation
```

## Default Plugins

### Credits Plugin

The credits plugin (`plugins/credits`) is included by default and demonstrates the plugin architecture.

- **Package**: `plugins/credits`
- **Components**: `<credits>`, `<credits-icon>`
- **Functionality**: Displays team and project information
- **ES Module**: `import creditsPlugin from './plugins/credits/index.js'`

## Examples

### Minimal Integration

See `examples/empty/index.html` for the simplest possible integration:

```html
<html>
  <head>
    <script type="module" src="../../index.js"></script>
  </head>
  <body>
    <admin-do></admin-do>
  </body>
</html>
```

### Programmatic Usage

```javascript
import AdminDoComponent from './index.js'

// Create an instance
const adminDo = AdminDo.create('#my-container')

// Register a plugin
AdminDo.registerPlugin(myPlugin)
```

## Browser Support

AdminDo works in all modern browsers that support:

- Custom Elements v1
- ES6 Classes
- ES Modules (import/export)
- CSS Grid
- Flexbox

**Minimum Versions:**

- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 16+

## Development

No build process required! Simply edit the HTML, CSS, and JavaScript files directly. The ES module system handles dependency loading automatically.

## License

MIT
