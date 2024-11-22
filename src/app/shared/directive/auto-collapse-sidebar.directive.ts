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
      this.sidebarHidden = true;
      this.sidebarCollapsed = false;
    } else if (width <= 1200) {
      this.sidebarHidden = false;
      this.sidebarCollapsed = true;
    } else {
      this.sidebarHidden = false;
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
