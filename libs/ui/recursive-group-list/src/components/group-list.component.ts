import { GroupModel } from './../models/group-model';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecursiveGroupListComponent } from './recursive-group-list/recursive-group-list.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'clx-group-list',
  templateUrl: './group-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RecursiveGroupListComponent,
    GroupDetailsComponent,
    AddGroupComponent
  ],
})
export class GroupListComponent {
  groupsService = inject(GroupsService);
  @Input() groups = signal<GroupModel[]>([]);
  @Output() selectedGroupChange = new EventEmitter<GroupModel>();

  selectedGroup: GroupModel | undefined;

  onSelectedGroupChange = (group: GroupModel) => {
    this.selectedGroup = group;
    this.selectedGroupChange.emit(group);
  };

  onGroupAdded(newGroup: GroupModel) {
    console.log(
      `onGroupAdded \n\r ID: ${newGroup.id}\n\rNAME: ${newGroup.name}\n\rPARENT ID: ${newGroup.parentId}\n\rDESCRIPTION: ${newGroup.description}`
    );
    this.handleGroupAdded(newGroup);
  }

  private handleGroupAdded(newGroup: GroupModel) {
    const updatedGroups = [...this.groups()]; // Clone to maintain reactivity

    if (newGroup.parentId) {
      const parentGroup = this.findGroupById(updatedGroups, newGroup.parentId);
      if (parentGroup) {
        parentGroup.subGroups = parentGroup.subGroups || [];
        parentGroup.subGroups.push(newGroup);
      } else {
        updatedGroups.push(newGroup);
      }
    } else {
      updatedGroups.push(newGroup);
    }

    this.groups.set(updatedGroups);
  }

  private findGroupById(groups: GroupModel[], id: string): GroupModel | undefined {
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
    return undefined;
  }
}
