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
    // console.log(`Right-clicked on: ${group.id} - ${group.name}`);

    this.selectedGroup = group;
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };

    // console.log(`Updated selectedGroup for menu: ${this.selectedGroup.id} - ${this.selectedGroup.name}`);
  }

  renameGroupById = (groupId: string, newName: string, groups: GroupModel[]): GroupModel[] => {
    // console.log(`Renaming group with ID: ${groupId} to '${newName}'`);

    const updatedGroups = this.updateGroupNameRecursively(groups, groupId, newName);

    const updatedFullGroupsList = this.updateGroupRecursively(this.fullGroupsList, groupId, updatedGroups);
    this.groups = [...updatedFullGroupsList];
    const sortedGroups = this.groupService.sortGroupsListRecursively(this.groups);
    // console.log('Sorted groups: ', sortedGroups);
    this.updateGroupsList.emit({ updatedGroupList: sortedGroups });
    // console.log(`Group renamed successfully.`);
    // console.log('Updated groups:', updatedGroups);
    // console.log('Updated fullGroupsList:', updatedFullGroupsList);

    return updatedFullGroupsList;
  };

  deleteGroup = (groupToDelete: GroupModel): void => {
    // console.log('Full groups list:', this.fullGroupsList);
    // console.log(`Deleting group: ${groupToDelete.id} - ${groupToDelete.name}`);

    const removeGroupById = (groups: GroupModel[]): GroupModel[] => {
      return groups
        .filter(group => group.id !== groupToDelete.id)
        .map(group => ({
          ...group,
          subGroups: group.subGroups ? removeGroupById(group.subGroups) : []
        }));
    };

    const newFullGroupsList: GroupModel[] = [...removeGroupById(this.fullGroupsList)];

    // console.log(`Group deleted successfully: ${groupToDelete.id}`);

    // console.log('Full groups list before delete:', this.fullGroupsList);

    // console.log('New full groups list:', newFullGroupsList);

    this.updateGroupsList.emit({ updatedGroupList: newFullGroupsList });
  };

  toggleGroup = (group: GroupModel): void => {
    // console.log(`Group toggled in model: ${group.id}`);
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

  private updateGroupNameRecursively(groups: GroupModel[], groupId: string, newName: string): GroupModel[] {
    return groups.map(group => ({
      ...group,
      name: group.id === groupId ? newName : group.name,
      subGroups: group.subGroups ? this.updateGroupNameRecursively(group.subGroups, groupId, newName) : []
    }));
  }

  private updateGroupRecursively(groups: GroupModel[], groupId: string, updatedGroups: GroupModel[]): GroupModel[] {
    return groups.map(group => {
      if (group.subGroups?.some(sub => sub.id === groupId)) {
        // If this group is the parent of the renamed group, update its subGroups
        return {
          ...group,
          subGroups: updatedGroups
        };
      }
      return {
        ...group,
        subGroups: group.subGroups ? this.updateGroupRecursively(group.subGroups, groupId, updatedGroups) : []
      };
    });
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
