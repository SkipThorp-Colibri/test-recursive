import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupModel } from '../models/group-model';
import { RecursiveGroupListComponent } from './recursive-group-list/recursive-group-list.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { AddGroupComponent } from './add-group/add-group.component';

@Component({
  selector: 'clx-group-list',
  templateUrl: './group-list.component.html',
  imports: [
    CommonModule,
    RecursiveGroupListComponent,
    GroupDetailsComponent,
    AddGroupComponent
  ],
})
export class GroupListComponent {

  @Input() groups: GroupModel[] = [];
  @Input() fullGroupsList: GroupModel[] = [];
  @Output() selectedGroupChange = new EventEmitter<GroupModel>();
  @Output() fullGroupsListChange = new EventEmitter<GroupModel[]>();

  selectedGroup: GroupModel | undefined;

  onSelectedGroupChange = (group: GroupModel) => {
    this.selectedGroup = group;
    this.selectedGroupChange.emit(group);
  }

  onGroupAdded(newGroup: GroupModel) {
    console.log(`onGroupAdded \n\r ID: ${newGroup.id}\n\rNAME: ${newGroup.name}\n\rPARENT ID: ${newGroup.parentId}\n\rDESCRIPTION: ${newGroup.description}`);
    this.handleGroupAdded(newGroup);
  }

  onMoveGroup(movingGroup: GroupModel, targetGroup: GroupModel) {
    console.log('In groupList component', movingGroup, targetGroup);

    if (!targetGroup.subGroups) {
      targetGroup.subGroups = [];
    }

    let foundMovingGroup = this.findAndRemoveGroup(this.groups, movingGroup.id);

    if (!foundMovingGroup) {
      console.warn("Group to move not found in tree!");
      return;
    }

    targetGroup.subGroups.push(foundMovingGroup);
    console.log('After move into targetGroup', targetGroup);

    console.log('Updated groups list:', this.groups);
  }

  private findAndRemoveGroup(groups: GroupModel[], groupIdToRemove: string): GroupModel | null {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].id === groupIdToRemove) {
        return groups.splice(i, 1)[0];
      }

      if (groups[i].subGroups) {
        let foundGroup = this.findAndRemoveGroup(groups[i].subGroups ?? [], groupIdToRemove);
        if (foundGroup) return foundGroup;
      }
    }
    return null;
  }



  private handleGroupAdded(newGroup: GroupModel) {
    if (newGroup.parentId) {
      const parentGroup = this.findGroupById(this.groups, newGroup.parentId);
      if (parentGroup) {
        parentGroup.subGroups = parentGroup.subGroups || [];
        parentGroup.subGroups.push(newGroup);
        return;
      }
    }
    this.groups.push(newGroup);
    this.fullGroupsList = [...this.groups];
    console.log('Adding group to root level', this.fullGroupsList);
  }

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
}
