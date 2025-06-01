export function getAdminDOTemplate(): string {
  return `
    <div class="admin-header">
        <div class="admin-header-content">
            <div class="admin-logo">
                <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160">
                    <defs>
                        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#ea6b17;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#d06f23;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <g transform="translate(30, 30) scale(4.8)">
                        <path d="M60,30 A20,20 0 0,0 40,10 A15,15 0 0,0 25,15 A10,10 0 0,0 15,10 A10,10 0 0,0 5,20 A15,15 0 0,0 0,30 H60 Z" fill="url(#cloudGradient)" />
                    </g>
                    <g transform="translate(120, 10) scale(1.78)">
                        <g transform="translate(-40, 20) scale(2)">
                            <circle cx="40" cy="25" r="8" fill="#d8e4e4" opacity="0.8" />
                            <path d="M40,21 V29 M36,25 H44 M37.2,21.8 L42.8,28.2 M37.2,28.2 L42.8,21.8" stroke="#2F80ED" stroke-width="1.5" />
                        </g>
                        <g transform="translate(0, 0) scale(1)">
                            <text x="0" y="85" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#d8e4e4">D</text>
                        </g>
                    </g>
                </svg>
            </div>
            <h1 class="admin-title">AdminDO Dashboard</h1>
        </div>
    </div>
    <div class="admin-container">
        <aside class="admin-sidebar">
            <nav>
                <ul class="sidebar-nav" id="sidebar-nav">
                    <li><a href="#" class="nav-link active" data-view="dashboard">Dashboard</a></li>
                </ul>
            </nav>
        </aside>
        <main class="admin-content">
            <div id="dashboard-view" class="plugin-content active">
                <h2>Welcome to AdminDO</h2>
                <p>A zero-dependency admin dashboard with pluggable architecture.</p>
                <div class="plugin-grid" id="plugin-grid">
                </div>
            </div>
            <div id="plugin-views"></div>
        </main>
    </div>
  `
}
