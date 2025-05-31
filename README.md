# admindo

![AdminDO Logo](https://raw.githubusercontent.com/benallfree/admindo/refs/heads/main/site/admindo.svg)

Admin dashboard for Cloudflare Durable Objects.

## Quickstart

admindo separates frontend and backend. Frontend compoents are pure HTML components and can be easily integrated.

```html
<html>
  <head>
    <script type="module" src="https://unpkg.com/admindo"></script>
    <script type="module" src="https://unpkg.com/admindo-plugin-about"></script>
  </head>
  <body>
    <admin-do />
  </body>
</html>
```

## Configuration

### Root Prefix

You can configure AdminDO to work under a specific path prefix using the `root` attribute:

```html
<!-- AdminDO will handle routes under /admin path -->
<admin-do root="/admin" />

<!-- All plugin routes will be relative to /admin -->
<!-- Example: dashboard at /admin/, plugins at /admin/plugin-name -->
```

This is useful when:

- Mounting AdminDO under a subdirectory
- Integrating with existing routing systems
- Deploying multiple AdminDO instances with different paths

## Available Plugins

- [about](./plugins/about) - Author credits
- [better-auth](./plugins/better-auth) - Enhanced authentication functionality
- [dofs-browser](./plugins/dofs-browser) - Durable Objects File System GUI
- [dterm](./plugins/dterm) - Durable Objects File System terminal
- [dorm](./plugins/dorm) - Durable Objects ORM
