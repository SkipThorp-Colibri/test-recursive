import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() selectedGroupChange = new EventEmitter<GroupModel>();

  selectedGroup: GroupModel | undefined;

  onSelectedGroupChange = (group: GroupModel) => {
    this.selectedGroup = group;
    this.selectedGroupChange.emit(group);
  }

  onGroupAdded(newGroup: GroupModel) {
    console.log(`onGroupAdded \n\r ID: ${newGroup.id}\n\rNAME: ${newGroup.name}\n\rPARENT ID: ${newGroup.parentId}\n\rDESCRIPTION: ${newGroup.description}`);
    this.handleGroupAdded(newGroup);
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
