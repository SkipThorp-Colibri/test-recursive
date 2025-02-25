import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { GroupModel } from '../../models/group-models';

@Component({
  selector: 'clx-recursive-group-list',
  imports: [CommonModule, ContextMenuComponent],
  templateUrl: './recursive-group-list.component.html',
})
export class RecursiveGroupListComponent {

  @Input() groups: GroupModel[] = [];
  @Output() selectedGroupChange = new EventEmitter<GroupModel>();

  onGroupClick(group: GroupModel) {
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

  onRightClick(event: MouseEvent, group: GroupModel) {
    console.log(`Selected group: ${group.id} ${group.name}`);
    console.log(`Right clicked on group: ${group.id} ${group.name}`);
    event.preventDefault();
    this.contextMenuVisible = true;

    if (this.contextMenuVisible) {
      console.log(`Selected group: ${group.id} ${group.name}`);
      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    }
  }

  renameGroup(newName: string, group: GroupModel) {
    this.renameGroupById(group.id, newName.trim());
    console.log(`Group renamed to: ${ newName.trim() }`);
  }

  deleteGroup(groupId: string) {
    const groupIndex = this.groups.findIndex(g => g.name === groupId);
    if (groupIndex === -1) return;

    this.groups.splice(groupIndex, 1);
    console.log(`Group deleted: ${groupId}`);
  }

  toggleGroup(group: GroupModel) : void {
    console.log(`Group toggled in model: ${ group.id }`);
    group.expanded = !group.expanded;

    // Recursively collapse all child groups if this group is collapsed
    // If collapsing, set all child groups' 'expanded' to false
    if (!group.expanded && (group.subGroups?.length ?? 0) > 0) {
        this.setAllChildGroupsCollapsed(group);
    }
  }

  renameGroupById = (groupId: string, newName: string): void => {
    console.log(`In groupService, Group with id of ${groupId} renamed to: ${newName}`);
    let updatedGroup: GroupModel | null = null;
    const updatedGroups = this.groups.map(group => {
      if (group.id === groupId) {
        updatedGroup = Object.assign(Object.create(Object.getPrototypeOf(group)), group, { name: newName });
        return updatedGroup;
      }
      return group;
    }).filter((group): group is GroupModel => group !== null);
  };

  isGroup(group: GroupModel): boolean {
    return !!group.subGroups && (group.subGroups?.length ?? 0) > 0;
  }

  isExpanded(group: GroupModel): boolean {
      return group.expanded;
  }

  // Helper method to set all child groups to collapsed
  private setAllChildGroupsCollapsed(group: GroupModel): void {
    if(!!group.subGroups)
      group.subGroups.forEach(subGroup => {
          subGroup.expanded = false;

          // If the child group has its own children, collapse them as well
          if (!!subGroup.subGroups && subGroup.subGroups.length > 0) {
          this.setAllChildGroupsCollapsed(subGroup);
          }
      });
  }
}
