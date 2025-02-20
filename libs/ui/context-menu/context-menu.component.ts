import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'clx-context-menu',
  standalone: true,
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent {
  @Input() groupId!: string;
  @Input() visible = false;
  @Input() position = { x: 0, y: 0 };

  @Output() rename = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  onRename() {
    this.rename.emit(this.groupId);
    this.close.emit();
  }

  onDelete() {
    this.delete.emit(this.groupId);
    this.close.emit();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.close.emit();
  }
}
