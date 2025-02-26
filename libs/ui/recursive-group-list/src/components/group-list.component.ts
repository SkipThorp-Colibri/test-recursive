import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupModel } from '../models/group-model';
import { RecursiveGroupListComponent } from './recursive-group-list/recursive-group-list.component';
import { GroupDetailsComponent } from './group-details/group-details.component';

@Component({
    selector: 'clx-group-list',
    templateUrl: './group-list.component.html',
    imports: [
        CommonModule,
        RecursiveGroupListComponent,
        GroupDetailsComponent
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
}
