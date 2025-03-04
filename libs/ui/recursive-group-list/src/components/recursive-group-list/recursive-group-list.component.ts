import { DndDropEvent, DndModule } from 'ngx-drag-drop';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { GroupModel } from '../../models/group-model';


@Component({
  selector: 'clx-recursive-group-list',
  imports: [CommonModule, ContextMenuComponent, DndModule],
  templateUrl: './recursive-group-list.component.html',
})
export class RecursiveGroupListComponent {

  @Input() groups: GroupModel[] = [];
  @Input() fullGroupsList: GroupModel[] = [];
  @Output() selectedGroupChange = new EventEmitter<GroupModel>();
  @Output() moveGroup = new EventEmitter<{ movingGroup: GroupModel, fullList: GroupModel[] }>();
  @Output() groupsForMove = new EventEmitter<{ groups: GroupModel[] }>();

  movingGroup!: GroupModel;
  showMoveModal: boolean = false;
  groupsList!: GroupModel[];
  targetGroup!: GroupModel;

  removeGroup = (groupToRemove: GroupModel) => {
    console.log(`groupToRemove: ${groupToRemove.id} - ${groupToRemove.name}`);

    // Find the topmost parent of the group
    const findTopMostParent = (groupList: GroupModel[], removeGroupId: string, parentId?: string): GroupModel | null => {
      for (const group of groupList) {
        if (group.id === removeGroupId) {
          return parentId ? this.findGroupById(this.groups, parentId) : null;
        }
        if (group.subGroups) {
          const parent = findTopMostParent(group.subGroups, removeGroupId, group.id);
          if (parent) return parent;
        }
      }
      return null;
    };

    // Locate the top-most level to start the removal process
    const topMostParent = findTopMostParent(this.groups, groupToRemove.id, groupToRemove.parentId);
    const targetGroupList = topMostParent ? topMostParent.subGroups : this.groups;

    // Remove the group from the identified level
    const removeRecursive = (groupList: GroupModel[]): boolean => {
      const index = groupList.findIndex(g => g.id === groupToRemove.id);
      if (index !== -1) {
        groupList.splice(index, 1);
        console.log(`Group ${groupToRemove.id} removed successfully`);
        return true;
      }
      return groupList.some(group => group.subGroups && removeRecursive(group.subGroups));
    };

    if (!removeRecursive(targetGroupList!)) {
      console.warn(`Group ${groupToRemove.id} not found in groups list.`);
    }

    this.sortGroupsRecursively(this.groups);
    console.log('Updated groups list:', this.groups);
  };


  onDrop(event: any, targetGroup: GroupModel) {
    const draggedGroup = event.data.movingGroup;
    console.log('In RGL - Moving group: ', draggedGroup);
    console.log('In RGL - Target group: ', targetGroup);

    // Prevent dropping a group into itself
    if (draggedGroup === targetGroup) {
      return;
    }

    // Find the parent list of the dragged group and remove it
    this.removeGroup(draggedGroup);

    // Ensure the targetGroup has a subGroups array
    if (!targetGroup.subGroups) {
      targetGroup.subGroups = [];
    }

    // Move the dragged group into the dropped-on group
    targetGroup.subGroups.push(draggedGroup);
  }

  sortGroupsRecursively = (groups: GroupModel[]): GroupModel[] => {
    return groups.sort((a, b) => a.name.localeCompare(b.name)).map(group => ({
      ...group,
      subGroups: group.subGroups ? this.sortGroupsRecursively(group.subGroups) : []
    }));
  };

  private findGroupById(groups: GroupModel[], id: string): GroupModel | null {
    for (const group of groups) {
      if (group.id === id) {
        return group;
      }
      if (group.subGroups) {
        const found = this.findGroupById(group.subGroups, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  onUpdateGroups = (updatedGroups: GroupModel[]) => {
    console.log('Updating groups after move operation', updatedGroups);
    this.groups = updatedGroups;
    this.showMoveModal = false;
  };

  onGroupClick(group: GroupModel) {
    this.selectedGroupChange.emit(group);
    if (this.isGroup(group) && group.subGroups) {
      this.toggleGroup(group);
    }
  }

  selectedGroup: GroupModel | undefined = undefined;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };

  onRightClick(event: MouseEvent, group: GroupModel) {
    event.preventDefault();
    this.selectedGroupChange.emit(group);
    console.log(`Right-clicked on: ${group.id} - ${group.name}`);

    this.selectedGroup = group;
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };

    console.log(`Updated selectedGroup for menu: ${this.selectedGroup.id} - ${this.selectedGroup.name}`);
  }

  renameGroup = (newName: string, group: GroupModel) => {
    console.log(`Renaming group: ${group.id} - ${group.name} to: ${newName.trim()}`);
    this.renameGroupById(group.id, newName.trim());
    console.log(`Group renamed to: ${newName.trim()}`);
  }

  deleteGroup = (groupToDelete: GroupModel) => {
    console.log(`Deleting group: ${groupToDelete.id} - ${groupToDelete.name}`);

    const removeGroupById = (groups: GroupModel[]): GroupModel[] => {
      const groupFound = groups.find(group => group.id === groupToDelete.id);
      if (groupFound) {
        groups.splice(groups.indexOf(groupFound), 1);
      }
      return groups;
    };

    this.groups = removeGroupById(this.groups);

    console.log(`Group deleted successfully: ${groupToDelete.id}`);
  }

  toggleGroup = (group: GroupModel): void => {
    console.log(`Group toggled in model: ${group.id}`);
    group.expanded = !group.expanded;

    // Recursively collapse all child groups if this group is collapsed
    // If collapsing, set all child groups' 'expanded' to false
    if (!group.expanded && (group.subGroups?.length ?? 0) > 0) {
      this.setAllChildGroupsCollapsed(group);
    }
  }

  renameGroupById = (groupId: string, newName: string): void => {
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

  isGroup = (group: GroupModel): boolean => {
    return !!group.subGroups && (group.subGroups?.length ?? 0) > 0;
  }

  isExpanded = (group: GroupModel): boolean => {
    return group.expanded;
  }

  // Helper method to set all child groups to collapsed
  private setAllChildGroupsCollapsed = (group: GroupModel): void => {
    if (!!group.subGroups)
      group.subGroups.forEach(subGroup => {
        subGroup.expanded = false;

        // If the child group has its own children, collapse them as well
        if (!!subGroup.subGroups && subGroup.subGroups.length > 0) {
          this.setAllChildGroupsCollapsed(subGroup);
        }
      });
  }
}
