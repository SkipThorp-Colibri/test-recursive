import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { Group } from '../../../src/models/group.model';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { GroupService } from '../../../src/services/group.service';

@Component({
  selector: 'clx-recursive-group-list',
  imports: [CommonModule, ContextMenuComponent],
  templateUrl: './recursive-group-list.component.html',
})
export class RecursiveGroupListComponent {
  groupService = inject(GroupService);
  @Input() groups: Group[] = [];
  @Output() selectedGroupChange = new EventEmitter<Group | null>();

  selectedGroup = signal<Group | null>(null);

  onGroupClick(group: Group) {
    this.selectedGroupChange.emit(group);
    this.toggleGroup(group);
  }

  // onGroupClick(group: Group) {
  //   this.selectedGroup.set(group);
  //   this.selectedGroupChange.emit(group);
  //   this.toggleGroup(group);
  // }

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedGroupId: string = '';

  onRightClick(event: MouseEvent, group: Group) {
    event.preventDefault();
    this.contextMenuVisible = true;

    if (this.contextMenuVisible) {
      // this.selectedGroupId = group.name;
      this.groupService.selectedGroup.set(group);
      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    }
  }



  deleteGroup(groupId: string) {
    const groupIndex = this.groups.findIndex(g => g.name === groupId);
    if (groupIndex === -1) return;

    this.groups.splice(groupIndex, 1);
    console.log(`Group deleted: ${groupId}`);
  }

  toggleGroup(group: Group) {
    // this.selectedGroupId = group.id; // Ensure the selected group is updated
    this.groupService.selectedGroup.set(group);
    group.toggleGroup();
  }
}
