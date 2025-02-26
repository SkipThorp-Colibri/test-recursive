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

  selectedGroup: GroupModel | undefined;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };

  onRightClick(event: MouseEvent, group: GroupModel) {
    event.preventDefault();
    this.selectedGroupChange.emit(group);
    console.log(`Right-clicked on: ${group.id} - ${group.name}`);

    this.selectedGroup = group; // ✅ Assign the exact clicked group (No Deep Copy)
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };

    this.showSelectedGroup();

    console.log(`Updated selectedGroup for menu: ${this.selectedGroup.id} - ${this.selectedGroup.name}`);
  }

  showSelectedGroup() {
    console.log(`Showing Selected group: ${this.selectedGroup?.id} - ${this.selectedGroup?.name}\n\r ${this.selectedGroup?.subGroups}`);
  }

  renameGroup(newName: string, group: GroupModel) {
    console.log(`Renaming group: ${group.id} - ${group.name} to: ${newName.trim()}`);
    this.renameGroupById(group.id, newName.trim());
    console.log(`Group renamed to: ${ newName.trim() }`);
  }

  deleteGroup(groupToDelete: GroupModel) {
    console.log(`Deleting group: ${groupToDelete.id} - ${groupToDelete.name}`);

    const removeGroupById = (groups: GroupModel[]): GroupModel[] => {
      return groups
        .filter(group => group.id !== groupToDelete.id) // ✅ Remove only the exact group
        .map(group => ({
          ...group,
          subGroups: group.subGroups ? removeGroupById(group.subGroups) : []
        }));
    };

    this.groups = removeGroupById(this.groups);

    console.log(`Group deleted successfully: ${groupToDelete.id}`);
  }


  // deleteGroup(group: GroupModel) {
  //   console.log(`Deleting selected group:\n\r ${group.id}`);
  //   const groupIndex = this.groups.findIndex(g => g.id === group.id);
  //   if (groupIndex === -1) return;

  //   this.groups.splice(groupIndex, 1);
  //   console.log(`Group deleted: ${group.id}`);
  // }

  toggleGroup(group: GroupModel) : void {
    console.log(`Group toggled in model: ${ group.id }`);
    group.expanded = !group.expanded;

    // Recursively collapse all child groups if this group is collapsed
    // If collapsing, set all child groups' 'expanded' to false
    if (!group.expanded && (group.subGroups?.length ?? 0) > 0) {
        this.setAllChildGroupsCollapsed(group);
    }
  }

  renameGroupById(groupId: string, newName: string): void {
    console.log(`Renaming group with ID: ${groupId} to '${newName}'`);

    let groupFound = false;

    const updateGroupName = (groups: GroupModel[]) => {
      groups.forEach(group => {
        if (group.id === groupId) {
          group.name = newName;
          groupFound = true;
        } else if (group.subGroups && group.subGroups.length > 0) {
          updateGroupName(group.subGroups);
        }
      });
    };

    updateGroupName(this.groups);

    if (!groupFound) {
      console.warn(`Group with ID ${groupId} not found.`);
    } else {
      console.log(`Group renamed successfully.`);
    }
  }

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
