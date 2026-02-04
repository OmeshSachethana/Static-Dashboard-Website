// Client-side theme store with persistence
export const themeStore = {
  isDark: false,
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  sidebarCollapsed: false,
  notifications: [],
  
  init() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-theme');
      if (saved) {
        const data = JSON.parse(saved);
        this.isDark = data.isDark || false;
        this.primaryColor = data.primaryColor || '#3b82f6';
        this.sidebarCollapsed = data.sidebarCollapsed || false;
      }
      this.applyTheme();
    }
  },
  
  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
    this.save();
  },
  
  setPrimaryColor(color) {
    this.primaryColor = color;
    this.applyTheme();
    this.save();
  },
  
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.save();
  },
  
  addNotification(message, type = 'info') {
    this.notifications.push({
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    });
    this.save();
  },
  
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  },
  
  applyTheme() {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.toggle('dark', this.isDark);
      root.style.setProperty('--primary', this.primaryColor);
      
      // Generate color shades
      const rgb = this.hexToRgb(this.primaryColor);
      for (let i = 50; i <= 900; i += 100) {
        const shade = this.generateShade(rgb, i);
        root.style.setProperty(`--primary-${i}`, shade);
      }
    }
  },
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  generateShade(rgb, shade) {
    const factor = shade === 500 ? 1 : 
                   shade < 500 ? (500 - shade) / 500 * 0.8 : 
                   (shade - 500) / 400 * 0.6;
    
    const r = Math.round(rgb.r * (shade === 500 ? 1 : 
                   shade < 500 ? 1 - factor : 1 + factor));
    const g = Math.round(rgb.g * (shade === 500 ? 1 : 
                   shade < 500 ? 1 - factor : 1 + factor));
    const b = Math.round(rgb.b * (shade === 500 ? 1 : 
                   shade < 500 ? 1 - factor : 1 + factor));
    
    return `rgb(${r}, ${g}, ${b})`;
  },
  
  save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-theme', JSON.stringify({
        isDark: this.isDark,
        primaryColor: this.primaryColor,
        sidebarCollapsed: this.sidebarCollapsed
      }));
    }
  }
};