import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { Group } from '../../../src/models/group.model';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { GroupDetailsComponent } from '../group-details/group-details.component';

@Component({
  selector: 'clx-recursive-group-list',
  imports: [CommonModule, ContextMenuComponent, GroupDetailsComponent],
  templateUrl: './recursive-group-list.component.html',
})
export class RecursiveGroupListComponent {
  @Input() groups: Group[] = [];
  @Output() selectedGroupChange = new EventEmitter<Group | null>();

  selectedGroup = signal<Group | null>(null);

  onGroupClick(group: Group) {
    this.selectedGroup.set(group);
    this.selectedGroupChange.emit(group);
  }

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedGroupId: string = '';

  onRightClick(event: MouseEvent, group: Group) {
    event.preventDefault();
    this.contextMenuVisible = true;

    if (this.contextMenuVisible) {
      this.selectedGroupId = group.name;
      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    }
  }

  renameGroup(groupId: string) {
    const group = this.groups.find(g => g.name === groupId);
    if (!group) return;

    const newName = prompt('Enter a new name for the group:', group.name);
    if (newName && newName.trim()) {
      group.name = newName.trim();
      console.log(`Group renamed to: ${group.name}`);
    } else {
      console.log('Rename canceled or invalid input');
    }
  }

  deleteGroup(groupId: string) {
    const groupIndex = this.groups.findIndex(g => g.name === groupId);
    if (groupIndex === -1) return;

    this.groups.splice(groupIndex, 1);
    console.log(`Group deleted: ${groupId}`);
  }

  toggleGroup(group: Group) {
    this.selectedGroupId = group.id; // Ensure the selected group is updated
    group.toggleGroup();
  }
}
