import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appAutoCollapseSidebar]',
  standalone: true
})
export class AutoCollapseSidebarDirective {
  @Input() sidebarCollapsed: boolean = true;
  @Output() sidebarCollapsedChange = new EventEmitter<boolean>();

  private checkSidebarCollapse() {
    this.sidebarCollapsed = window.innerWidth <= 1200;
    this.sidebarCollapsedChange.emit(this.sidebarCollapsed);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkSidebarCollapse();
  }

  constructor() {
    this.checkSidebarCollapse();
  }
}
