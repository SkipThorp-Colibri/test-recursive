import { DndDropEvent, DndModule } from 'ngx-drag-drop';
import { Component, Input, Output, EventEmitter, input, model, inject, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { GroupModel } from '../../models/group-model';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'clx-recursive-group-list',
  standalone: true,
  imports: [CommonModule, ContextMenuComponent, DndModule],
  templateUrl: './recursive-group-list.component.html',
})
export class RecursiveGroupListComponent {
  @Input() fullGroupsList: GroupModel[] = [];
  @Output() selectedGroupChange = new EventEmitter<GroupModel>();
  @Output() updateGroupsList = new EventEmitter<{ updatedGroupList: GroupModel[] }>();

  public moveGroup = output<{ movingGroup: GroupModel; targetGroup: GroupModel }>();
  public groups = input<GroupModel[]>([]);

  // Mutable state to handle modifications
  public mutableGroups = signal<GroupModel[]>([]);

  groupService = inject(GroupService);

  onDrop(event: any, targetGroup: GroupModel) {
    const draggedGroup = event.data.movingGroup;
    if (draggedGroup === targetGroup) {
      return;
    }
    this.moveGroup.emit({ movingGroup: draggedGroup, targetGroup });
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

    this.selectedGroup = group;
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
  }

  renameGroupById = (groupId: string, newName: string, groups: GroupModel[]): GroupModel[] => {
    const updatedGroups = this.groupService.updateGroupNameRecursively(groups, groupId, newName);
    const updatedFullGroupsList = this.groupService.updateGroupRecursively(this.fullGroupsList, groupId, updatedGroups);

    // Update mutableGroups instead of trying to modify input()
    this.mutableGroups.set([...updatedFullGroupsList]);

    const sortedGroups = this.groupService.sortGroupsListRecursively(this.mutableGroups());
    this.updateGroupsList.emit({ updatedGroupList: sortedGroups });

    return updatedFullGroupsList;
  };

  deleteGroup = (groupToDelete: GroupModel): void => {
    const removeGroupById = (groups: GroupModel[]): GroupModel[] => {
      return groups
        .filter(group => group.id !== groupToDelete.id)
        .map(group => ({
          ...group,
          subGroups: group.subGroups ? removeGroupById(group.subGroups) : []
        }));
    };

    const newFullGroupsList: GroupModel[] = [...removeGroupById(this.fullGroupsList)];
    this.mutableGroups.set([...newFullGroupsList]);

    this.updateGroupsList.emit({ updatedGroupList: newFullGroupsList });
  };

  toggleGroup = (group: GroupModel): void => {
    group.expanded = !group.expanded;

    if (!group.expanded && (group.subGroups?.length ?? 0) > 0) {
      this.setAllChildGroupsCollapsed(group);
    }
  };

  isGroup = (group: GroupModel): boolean => {
    return !!group.subGroups && (group.subGroups?.length ?? 0) > 0;
  };

  isExpanded = (group: GroupModel): boolean => {
    return group.expanded;
  };

  private setAllChildGroupsCollapsed = (group: GroupModel): void => {
    if (!!group.subGroups)
      group.subGroups.forEach(subGroup => {
        subGroup.expanded = false;
        if (!!subGroup.subGroups && subGroup.subGroups.length > 0) {
          this.setAllChildGroupsCollapsed(subGroup);
        }
      });
  };
}
