export class ViewManager {
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  switchView(route: string): void {
    const viewName = this.normalizeRoute(route)
    this.updateActiveNavigation(viewName)
    this.updateActiveContent(viewName)
  }

  private normalizeRoute(route: string): string {
    if (route === '/' || route === '') {
      return 'dashboard'
    }
    return route.startsWith('/') ? route.substring(1) : route
  }

  private updateActiveNavigation(viewName: string): void {
    this.container.querySelectorAll('.nav-link').forEach((link: Element) => {
      link.classList.remove('active')
    })

    const targetNav = this.container.querySelector(`[data-view="${viewName}"]`)
    if (targetNav) {
      targetNav.classList.add('active')
    }
  }

  private updateActiveContent(viewName: string): void {
    this.container.querySelectorAll('.plugin-content').forEach((content: Element) => {
      content.classList.remove('active')
    })

    const targetView = this.container.querySelector(`#${viewName}-view`)
    if (targetView) {
      targetView.classList.add('active')
    }
  }
}
