import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupModel } from '../../models/group-model';

@Component({
  selector: 'clx-move-group',
  templateUrl: './move-group.component.html',
  imports: [CommonModule],
})
export class MoveGroupComponent implements OnChanges {
  @Input() groups: GroupModel[] = [];
  @Input() movingGroup!: GroupModel;
  @Output() updateGroups = new EventEmitter<{ updatedGroups: GroupModel[] }>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['groups']) {
      console.log('Current Groups:', this.groups);
    }
    if (changes['movingGroup']) {
      console.log(`Received moving group: ${this.movingGroup.id} - ${this.movingGroup.name}`);
    }
  }

  isModalOpen = true;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onMoveGroup = (group: GroupModel) => {
    console.log(`Received moving group: ${group.id} - ${group.name}`);
    console.log('Current Groups:', this.groups);
    this.movingGroup = group;
    this.openModal();
  };

  setTargetGroup = (targetGroup: GroupModel): GroupModel | undefined => {
    this.openModal();
    console.log(`In MoveGroup - OpenModal: ${this.isModalOpen}`);
    console.log(`Selected target group: ${targetGroup.id} - ${targetGroup.name}`);
    // this.setMoveGroups(this.movingGroup, targetGroup.id);
    return targetGroup;
  }

  setMoveGroups = (movingGroup: GroupModel, targetGroupId: string) => {
    console.log(`In MoveGroup - Moving group: ${movingGroup.id} - ${movingGroup.name} to: ${targetGroupId}`);

    // Find the index of the group to remove
    const parentGroup = this.groups.find(g => g.id === movingGroup.parentId);
    if (parentGroup) {
      parentGroup.subGroups = parentGroup.subGroups?.filter(g => g.id !== movingGroup.id);
    } else {
      // If it is at root level, remove from groups array
      this.groups = this.groups.filter(g => g.id !== movingGroup.id);
    }

    // Find targetGroup and add movingGroup as a subGroup
    const target = this.groups.find(g => g.id === targetGroupId);
    if (target) {
      console.log(`Target group found: ${target.id} - ${target.name}`);
      target.subGroups = [...(target.subGroups || []), movingGroup];
      movingGroup.parentId = targetGroupId;
      this.moveGroups(movingGroup, target);
    }

    this.closeModal();
  }

  moveGroups = (movingGroup: GroupModel, targetGroup: GroupModel) => {


    // Confirm the move action before proceeding
    if (!confirm(`Are you sure you want to move "${movingGroup.name}" under "${targetGroup.name}"?`)) {
      return;
    }





    // Emit the updated groups array
    this.updateGroups.emit({ updatedGroups: [...this.groups] });
  };
}
