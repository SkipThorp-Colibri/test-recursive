import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupModel } from '../../models/group-model';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'clx-add-group',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-group.component.html',
})
export class AddGroupComponent {
  @Input() groups: GroupModel[] = [];
  @Output() groupAdded = new EventEmitter<{ group: GroupModel }>();
  @Output() updateGroupsList = new EventEmitter<{ updatedGroupList: GroupModel[] }>();

  groupService = inject(GroupService);

  isModalOpen = false;
  newGroup: GroupModel = {
    id: '',
    name: '',
    description: '',
    expanded: false,
    parentId: undefined,
    subGroups: []
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  isGroup = (group: GroupModel): boolean => {
    return !!group.subGroups && (group.subGroups?.length ?? 0) > 0;
  }

  addGroup() {
    if (!this.newGroup.name.trim()) return;

    this.newGroup.id = crypto.randomUUID();
    this.groupAdded.emit({ group: this.newGroup });

    const sortedGroups = this.groupService.sortGroupsListRecursively(this.groups);
    // console.log('Sorted groups: ', sortedGroups);
    this.updateGroupsList.emit({ updatedGroupList: sortedGroups });


    // Reset form and close modal
    this.newGroup = { id: '', name: '', description: '', expanded: false, parentId: undefined, subGroups: [] };
    this.isModalOpen = false;
  }
}
