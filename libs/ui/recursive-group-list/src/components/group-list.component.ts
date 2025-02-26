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

  onGroupAdded = (newGroup: GroupModel) => {
    console.log(`Adding a new group:\n\r ID: ${newGroup.id}\n\rNAME: ${newGroup.name}\n\rDESCRIPTION: ${newGroup.description}\n\rPARENT ID: ${newGroup.parentId}`);
    this.groups.find(g => g.id === newGroup.parentId)?.subGroups?.push(newGroup);
  }
}
