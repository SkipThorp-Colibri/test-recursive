import { DndDropEvent, DndModule } from 'ngx-drag-drop';
import { Component, Input, Output, EventEmitter, input, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { GroupModel } from '../../models/group-model';
import { GroupService } from '../../services/group.service';


@Component({
  selector: 'clx-recursive-group-list',
  imports: [CommonModule, ContextMenuComponent, DndModule],
  templateUrl: './recursive-group-list.component.html',
})
export class RecursiveGroupListComponent {
  @Input() groups: GroupModel[] = [];
  @Input() fullGroupsList: GroupModel[] = [];
  @Output() selectedGroupChange = new EventEmitter<GroupModel>();
  @Output() moveGroup = new EventEmitter<{ movingGroup: GroupModel, targetGroup: GroupModel }>();
  @Output() updateGroupsList = new EventEmitter<{ updatedGroupList: GroupModel[] }>();


  groupService = inject(GroupService);

  onDrop(event: any, targetGroup: GroupModel) {
    const draggedGroup = event.data.movingGroup;
    // console.log('In RGL - Moving group: ', draggedGroup);
    // console.log('In RGL - Target group: ', targetGroup);


    // Prevent dropping a group into itself
    if (draggedGroup === targetGroup) {
      return;
    }

    this.moveGroup.emit({ movingGroup: draggedGroup, targetGroup: targetGroup });

  }

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

    const newGroupsList = this.groupService.renameGroupById(group.id, newName.trim(), this.groups); // ✅ Call updated function

    console.log('After rename:', this.groups);
    this.updateGroupsList.emit({ updatedGroupList: newGroupsList });
  };

  // renameGroup = (newName: string, group: GroupModel) => {
  //   console.log(`Renaming group: ${group.id} - ${group.name} to: ${newName.trim()}`);
  //   this.groupService.renameGroupById(group.id, newName.trim(), this.groups);
  //   console.log(`Group renamed to: ${newName.trim()}`);
  //   const newFullGroupsList = this.groupService.sortGroupsListRecursively(this.fullGroupsList);

  //   this.updateGroupsList.emit({ updatedGroupList: newFullGroupsList });
  // }

  deleteGroup = (groupToDelete: GroupModel): void => {
    console.log('Full groups list:', this.fullGroupsList);
    console.log(`Deleting group: ${groupToDelete.id} - ${groupToDelete.name}`);

    const removeGroupById = (groups: GroupModel[]): GroupModel[] => {
      return groups
        .filter(group => group.id !== groupToDelete.id) // ✅ Removes the group if found at this level
        .map(group => ({
          ...group,
          subGroups: group.subGroups ? removeGroupById(group.subGroups) : [] // ✅ Recursively check subGroups
        }));
    };

    const newFullGroupsList: GroupModel[] = [...removeGroupById(this.fullGroupsList)];

    console.log(`Group deleted successfully: ${groupToDelete.id}`);

    console.log('Full groups list before delete:', this.fullGroupsList);

    console.log('New full groups list:', newFullGroupsList);

    this.updateGroupsList.emit({ updatedGroupList: newFullGroupsList });
  };

  // deleteGroup = (groupToDelete: GroupModel) => {
  //   console.log(`Deleting group: ${groupToDelete.id} - ${groupToDelete.name}`);

  //   const removeGroupById = (groups: GroupModel[]): GroupModel[] => {
  //     const groupFound = groups.find(group => group.id === groupToDelete.id);
  //     if (groupFound) {
  //       groups.splice(groups.indexOf(groupFound), 1);
  //     }
  //     return groups;
  //   };

  //   this.groups.set(removeGroupById(this.groups()));

  //   console.log(`Group deleted successfully: ${groupToDelete.id}`);
  // }

  toggleGroup = (group: GroupModel): void => {
    console.log(`Group toggled in model: ${group.id}`);
    group.expanded = !group.expanded;

    // Recursively collapse all child groups if this group is collapsed
    // If collapsing, set all child groups' 'expanded' to false
    if (!group.expanded && (group.subGroups?.length ?? 0) > 0) {
      this.setAllChildGroupsCollapsed(group);
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
