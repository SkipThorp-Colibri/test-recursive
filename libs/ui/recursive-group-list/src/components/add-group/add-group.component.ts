import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupModel } from '../../models/group-model';

@Component({
  selector: 'clx-add-group',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-group.component.html',
})
export class AddGroupComponent {
  @Input() groups: GroupModel[] = [];
  @Output() groupAdded = new EventEmitter<{ group: GroupModel }>();

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

    // Reset form and close modal
    this.newGroup = { id: '', name: '', description: '', expanded: false, parentId: undefined, subGroups: [] };
    this.isModalOpen = false;
  }
}
