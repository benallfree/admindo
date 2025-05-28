# AdminDo Project Structure

This document provides an overview of the complete AdminDo project structure and how all the pieces fit together with ES modules.

## Project Layout

```
admindo/
├── index.html                 # Main SPA dashboard page
├── index.js                   # Main ES module component
├── package.json               # Main package configuration (type: "module")
├── README.md                  # Main documentation
├── STRUCTURE.md               # This file
├── examples/
│   └── empty/
│       └── index.html         # Minimal demo example
└── plugins/
    └── credits/
        ├── index.js           # Credits plugin ES module
        ├── package.json       # Plugin package config (type: "module")
        ├── demo.html          # Standalone plugin demo
        └── README.md          # Plugin documentation
```

## Key Components

### 1. Main Dashboard (`index.html`)

- **Purpose**: Single Page Application admin dashboard
- **Features**: Zero dependencies, pure HTML with ES module import
- **Architecture**: Imports `index.js` as ES module
- **Minimal Structure**: Just imports the component and declares `<admin-do></admin-do>`

### 2. ES Module Component (`index.js`)

- **Purpose**: Main ES module that defines and exports the AdminDo web component
- **Functionality**:
  - Defines the `<admin-do>` custom element
  - Manages plugin loading via dynamic imports
  - Handles styling injection
  - Provides global utilities
- **Export**: `export default AdminDoComponent`

### 3. Web Components Architecture

#### Core Component: `<admin-do/>`

- Self-contained custom element
- Manages plugin registration and display
- Handles navigation between plugins
- Creates plugin tiles and views automatically
- Injects styles programmatically

#### Plugin Components Example: Credits

- `<credits>`: Full credits page component with Shadow DOM
- `<credits-icon>`: Icon component for the plugin

### 4. ES Module Plugin System

#### How ES Module Plugins Work:

1. **ES Module packages**: Each plugin is an ES module
2. **Dynamic imports**: Plugins loaded via `import()`
3. **Web component based**: Plugins export web components
4. **Auto-registration**: Components register themselves
5. **Pluggable UI**: Each plugin gets a tile and dedicated view

#### Plugin ES Module Structure:

```javascript
// plugins/plugin-name/index.js
class PluginComponent extends HTMLElement {
  // Component implementation
}

customElements.define('plugin-name', PluginComponent)

export default {
  name: 'plugin-name',
  title: 'Display Title',
  description: 'Plugin description',
  icon: '🔌',
  color: '#007AFF',
  components: {
    'plugin-name': PluginComponent,
    'plugin-name-icon': PluginIconComponent,
  },
}
```

### 5. Credits Plugin (`plugins/credits/`)

- **Purpose**: Demonstrates ES module plugin architecture
- **Features**: Team info, tech stack display, responsive design, Shadow DOM
- **Usage**: Can be used standalone or with AdminDo
- **Components**: `<credits>` and `<credits-icon>`
- **ES Module**: `import creditsPlugin from './plugins/credits/index.js'`

## Usage Examples

### Running the Dashboard

```bash
# Navigate to project root
cd admindo

# Start a simple web server (required for ES modules)
npm run dev
# or
python3 -m http.server 8000

# Open http://localhost:8000 in browser
```

### Minimal Integration Example

```html
<!-- examples/empty/index.html -->
<html>
  <head>
    <script type="module" src="../../index.js"></script>
  </head>
  <body>
    <admin-do></admin-do>
  </body>
</html>
```

### Using Plugins Standalone (ES Module)

```html
<!-- Import and use plugin components -->
<script type="module">
  import creditsPlugin from './plugins/credits/index.js'
  // Components are auto-registered
</script>

<credits></credits>
```

### Programmatic Plugin Loading

```javascript
// In index.js
async loadDefaultPlugins() {
  try {
    const creditsModule = await import('./plugins/credits/index.js')
    this.registerPlugin(creditsModule.default)
  } catch (error) {
    console.warn('Credits plugin not found, skipping:', error.message)
  }
}
```

## Key Features Delivered

✅ **SPA Architecture**: Single page application with routing  
✅ **Zero Dependencies**: Pure HTML/CSS/JS, no frameworks  
✅ **ES Modules**: Modern JavaScript module system  
✅ **Web Components**: Native custom elements  
✅ **Pluggable System**: Extensible plugin architecture  
✅ **NPM Packages**: Both main app and plugins are npm packages  
✅ **Dynamic Loading**: Plugins loaded via ES module imports  
✅ **Default Plugin**: Credits plugin included and working  
✅ **Separate Plugin Package**: Credits as independent ES module  
✅ **Icon System**: Plugin tiles with icons  
✅ **Modern UI**: Clean, responsive design  
✅ **Examples**: Minimal integration example provided

## ES Module Benefits

- **Native browser support**: No build tools required
- **Dynamic imports**: Load plugins on demand
- **Better tree shaking**: Only load what you need
- **Standard syntax**: Uses official JavaScript module syntax
- **Better debugging**: Clear import/export chains
- **Future proof**: Built on web standards

## Browser Compatibility

**ES Module Support Required:**

- **Chrome 61+**
- **Firefox 60+**
- **Safari 10.1+**
- **Edge 16+**

Also requires:

- Custom Elements v1
- Shadow DOM v1
- ES6 Classes
- CSS Grid & Flexbox

**Note**: ES modules require serving over HTTP(S), not file:// protocol
