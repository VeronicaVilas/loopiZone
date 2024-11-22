import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appAutoCollapseSidebar]',
  standalone: true
})
export class AutoCollapseSidebarDirective {
  @Input() sidebarCollapsed: boolean = true;
  @Input() sidebarHidden: boolean = false;
  @Output() sidebarCollapsedChange = new EventEmitter<boolean>();
  @Output() sidebarHiddenChange = new EventEmitter<boolean>();

  private checkSidebarCollapse() {
    const width = window.innerWidth;
    if (width <= 800) {
      this.sidebarHidden = true; // Esconde completamente
      this.sidebarCollapsed = true;
    } else if (width <= 1200) {
      this.sidebarHidden = false; // Apenas colapsa, mas não esconde
      this.sidebarCollapsed = true;
    } else {
      this.sidebarHidden = false; // Mostra completamente
      this.sidebarCollapsed = false;
    }
    this.sidebarCollapsedChange.emit(this.sidebarCollapsed);
    this.sidebarHiddenChange.emit(this.sidebarHidden);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkSidebarCollapse();
  }

  constructor() {
    this.checkSidebarCollapse();
  }
}
