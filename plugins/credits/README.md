# AdminDo Credits Plugin

An ES module plugin for [AdminDo](../../README.md) that displays credits and team information.

## Installation

```bash
npm install admindo-plugin-credits
```

## Usage

### With AdminDo

The plugin automatically loads when AdminDo imports it as an ES module:

```javascript
// In AdminDo core
const creditsModule = await import('./plugins/credits/index.js')
this.registerPlugin(creditsModule.default)
```

### Manual Import

```html
<!DOCTYPE html>
<html>
  <head>
    <title>AdminDo with Credits</title>
    <script type="module">
      import AdminDoComponent from './index.js'
      import creditsPlugin from './plugins/credits/index.js'

      // Plugin is auto-registered when imported
    </script>
  </head>
  <body>
    <admin-do></admin-do>
  </body>
</html>
```

### Standalone Usage

You can also use the credits components independently:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Credits Component Demo</title>
    <script type="module" src="./plugins/credits/index.js"></script>
  </head>
  <body>
    <h1>Standalone Credits Demo</h1>

    <!-- Use the credits component -->
    <credits></credits>

    <!-- Use the credits icon -->
    <p>Team info: <credits-icon></credits-icon></p>
  </body>
</html>
```

## Components

### `<credits>`

Main credits component that displays team information, project details, and technology stack.

**Features:**

- Team member list with avatars
- Project description
- Technology stack display
- Responsive design
- Shadow DOM encapsulation
- ES Module compatible

### `<credits-icon>`

Simple icon component that displays the credits emoji.

**Usage:**

```html
<credits-icon></credits-icon>
```

## ES Module Export

The plugin exports a configuration object:

```javascript
export default {
  name: 'credits',
  title: 'Credits',
  description: 'View credits and information about AdminDo',
  version: '1.0.0',
  icon: '👥',
  color: '#34C759',
  components: {
    credits: CreditsComponent,
    'credits-icon': CreditsIconComponent,
  },
}
```

## Dynamic Import

You can dynamically import the plugin:

```javascript
const creditsPlugin = await import('./plugins/credits/index.js')
console.log(creditsPlugin.default.name) // 'credits'
```

## Customization

The plugin uses Shadow DOM for style encapsulation. You can extend the components or create your own variants:

```javascript
import creditsPlugin from './plugins/credits/index.js'

class CustomCreditsComponent extends creditsPlugin.components.credits {
  // Override or extend functionality
}

customElements.define('custom-credits', CustomCreditsComponent)
```

## Browser Support

**ES Module Support Required:**

- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 16+

Also requires support for:

- Custom Elements v1
- Shadow DOM v1
- ES6 Classes

**Important**: ES modules require serving over HTTP(S), not the file:// protocol.

## Development

1. Edit `index.js` to modify the plugin
2. Test with `demo.html` for standalone usage
3. No build process required - direct ES module usage

## License

MIT

## Contributing

This plugin is part of the AdminDo ecosystem. Please refer to the main [AdminDo repository](../../) for contribution guidelines.
