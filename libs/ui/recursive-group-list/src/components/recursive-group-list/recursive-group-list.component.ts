import { DndDropEvent, DndModule } from 'ngx-drag-drop';
import { Component, Input, Output, EventEmitter, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { GroupModel } from '../../models/group-model';


@Component({
  selector: 'clx-recursive-group-list',
  imports: [CommonModule, ContextMenuComponent, DndModule],
  templateUrl: './recursive-group-list.component.html',
})
export class RecursiveGroupListComponent {
  public groups = model<GroupModel[]>([])
  public fullGroupsList = input<GroupModel[]>([])
  @Output() selectedGroupChange = new EventEmitter<GroupModel>();
  @Output() moveGroup = new EventEmitter<{ movingGroup: GroupModel, targetGroup: GroupModel }>();

  onDrop(event: any, targetGroup: GroupModel) {
    const draggedGroup = event.data.movingGroup;
    console.log('In RGL - Moving group: ', draggedGroup);
    console.log('In RGL - Target group: ', targetGroup);


    // Prevent dropping a group into itself
    if (draggedGroup === targetGroup) {
      return;
    }

    this.moveGroup.emit({ movingGroup: draggedGroup, targetGroup: targetGroup });

    // // Find the parent list of the dragged group and remove it
    // this.removeGroup(draggedGroup);


  }

  sortGroupsRecursively = (groups: GroupModel[]): GroupModel[] => {
    return groups.sort((a, b) => a.name.localeCompare(b.name)).map(group => ({
      ...group,
      subGroups: group.subGroups ? this.sortGroupsRecursively(group.subGroups) : []
    }));
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
    this.sortGroupsRecursively(this.groups());
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

    this.groups.set(removeGroupById(this.groups()));

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

    updateGroupName(this.groups());

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
