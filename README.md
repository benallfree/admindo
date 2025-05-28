# admindo

![AdminDo Logo](./admindo/admindo.svg)

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

## Available Plugins

- [about](./plugins/about) - Author credits
- [dofs](./plugins/dofs) - Durable Objects File System GUI
- [dterm](./plugins/dterm) - Durable Objects File System terminal
- [dorm](./plugins/dorm) - Durable Objects ORM
