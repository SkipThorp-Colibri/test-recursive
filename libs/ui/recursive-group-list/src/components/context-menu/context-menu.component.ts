import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { GroupModel } from '../../models/group-model';

@Component({
  selector: 'clx-context-menu',
  standalone: true,
  templateUrl: './context-menu.component.html',
})
export class ContextMenuComponent {

  @Input() group!: GroupModel;
  @Input() visible = false;
  @Input() position = { x: 0, y: 0 };

  @Output() rename = new EventEmitter<{ newName: string; group: GroupModel }>();
  @Output() delete = new EventEmitter<{ group: GroupModel }>();
  @Output() close = new EventEmitter<void>();

  onRenameGroup = (): void => {
    if (!this.group) {
      console.error("No group is selected. Cannot rename.");
      return;
    }

    console.log(`onRename group with ID: ${this.group.id}`);

    const newName = prompt(`Rename group '${this.group.name}':`, this.group.name);
    if (newName && newName.trim() !== this.group.name) {
      this.rename.emit({ newName: newName.trim(), group: this.group });
    }
  };

  onDelete = (): void => {
    if (!this.group) {
      console.error("Error: No group is selected. Cannot delete.");
      return;
    }

    console.log(`Attempting to delete group: ${this.group.id} - ${this.group.name}`);

    const confirmDelete = confirm(`Are you sure you want to delete '${this.group.name}'?`);
    if (confirmDelete) {
      this.delete.emit({ group: this.group });
      this.close.emit();
    }
  }


  @HostListener('document:click', ['$event'])
  onClickOutside = (event: Event) => {
    this.close.emit();
  }
}
