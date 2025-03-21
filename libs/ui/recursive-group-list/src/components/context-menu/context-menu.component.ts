import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { GroupModel } from '../../models/group-model';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'clx-context-menu',
  standalone: true,
  templateUrl: './context-menu.component.html',
})
export class ContextMenuComponent {

  @Input() group!: GroupModel;
  @Input() visible = false;
  @Input() position = { x: 0, y: 0 };

  @Output() rename = new EventEmitter<{ groupId: string, newName: string; group: GroupModel }>();
  @Output() addGroup = new EventEmitter<{ group: GroupModel }>();
  @Output() moveGroupEvent = new EventEmitter<{ movingGroup: GroupModel }>();
  @Output() delete = new EventEmitter<{ group: GroupModel }>();
  @Output() close = new EventEmitter<void>();

  groupService = inject(GroupService);

  onAddGroup = () => {
    // console.log(`onAddGroup \n\r ID: ${this.group.id}\n\rNAME: ${this.group.name}`);
    this.addGroup.emit({ group: this.group });
  }

  moveGroup = (group: GroupModel) => {
    // console.log(`Context menu: Move group selected for ${group.id} - ${group.name}`);
    this.moveGroupEvent.emit({ movingGroup: group });
  };

  onRenameGroup = (): void => {
    if (!this.group) {
      console.error("No group is selected. Cannot rename.");
      return;
    }

    // console.log(`onRename group with ID: ${this.group.id}`);

    const groupId = this.group.id;
    const newName = prompt(`Rename group '${this.group.name}':`, this.group.name);
    if (newName && newName.trim() !== this.group.name) {
      this.rename.emit({ groupId: groupId, newName: newName.trim(), group: this.group });
    }
  };

  onDelete = (): void => {
    if (!this.group) {
      console.error("Error: No group is selected. Cannot delete.");
      return;
    }

    // console.log(`Attempting to delete group: ${this.group.id} - ${this.group.name}`);

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
