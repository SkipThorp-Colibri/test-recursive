import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { GroupModel } from '../../models/group-models';

@Component({
  selector: 'clx-context-menu',
  standalone: true,
  templateUrl: './context-menu.component.html',
})
export class ContextMenuComponent {

  @Input() group!: GroupModel;
  @Input() visible = false;
  @Input() position = { x: 0, y: 0 };

  @Output() rename = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  renameGroup = (): void => {
    console.log(`Rename group with id of\n\r ${this.group.id}`);
    if (!this.group) return;
    const newName = prompt(`Rename group '${this.group.name}':`, this.group.name);
    if (newName && newName.trim() !== this.group.name) {
      this.rename.emit(newName.trim());
    }
  };

  onDelete() {
    this.delete.emit(this.group.id);
    this.close.emit();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.close.emit();
  }
}
