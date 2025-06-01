export function attachAdminDOStyles(): void {
  if (!document.getElementById('admindo-styles')) {
    const style = document.createElement('style')
    style.id = 'admindo-styles'
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #f5f5f7;
        color: #1d1d1f;
      }
      
      .admin-header {
        background: #ffffff;
        border-bottom: 1px solid #e5e5e7;
        padding: 1.5rem 2rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .admin-header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .admin-logo {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      
      .admin-logo svg {
        width: 128px;
        height: 128px;
      }
      
      .admin-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 0;
      }
      
      .admin-container {
        display: grid;
        grid-template-columns: 280px 1fr;
        min-height: calc(100vh - 80px);
      }
      
      .admin-sidebar {
        background: #ffffff;
        border-right: 1px solid #e5e5e7;
        padding: 2rem 1rem;
      }
      
      .admin-content {
        padding: 2rem;
      }
      
      .plugin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      
      .plugin-tile {
        background: #ffffff;
        border: 1px solid #e5e5e7;
        border-radius: 12px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      
      .plugin-tile:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }
      
      .plugin-icon {
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }
      
      .plugin-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      
      .plugin-description {
        color: #6e6e73;
        font-size: 0.9rem;
        line-height: 1.4;
      }
      
      .sidebar-nav {
        list-style: none;
      }
      
      .sidebar-nav li {
        margin-bottom: 0.5rem;
      }
      
      .sidebar-nav a {
        display: block;
        padding: 0.75rem 1rem;
        color: #6e6e73;
        text-decoration: none;
        border-radius: 8px;
        transition: background-color 0.2s ease;
      }
      
      .sidebar-nav a:hover,
      .sidebar-nav a.active {
        background: #f5f5f7;
        color: #1d1d1f;
      }
      
      .plugin-content {
        display: none;
      }
      
      .plugin-content.active {
        display: block;
      }
    `
    document.head.appendChild(style)
  }
}
