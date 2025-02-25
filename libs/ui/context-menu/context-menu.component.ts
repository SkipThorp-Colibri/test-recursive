import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { GroupService } from '../../../src/services/group.service';
import { Group } from '../../../src/models';

@Component({
  selector: 'clx-context-menu',
  standalone: true,
  templateUrl: './context-menu.component.html',
})
export class ContextMenuComponent {
  private groupService = inject(GroupService);
  @Input() group!: Group;
  @Input() visible = false;
  @Input() position = { x: 0, y: 0 };

  @Output() rename = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  renameGroup = (): void => {
    console.log(`Rename group with id of ${this.group.id}`);
    if (!this.group) return;
    const newName = prompt(`Rename group '${this.group.name}':`, this.group.name);
    if (newName && newName.trim() !== this.group.name) {
      this.rename.emit(newName.trim());
    }
  };

  onDelete() {
    this.delete.emit(this.groupService.selectedGroup$()!.id);
    this.close.emit();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.close.emit();
  }
}
