import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecursiveGroupListComponent } from '../../libs/ui/recursive-group-list/recursive-group-list.component';
import { GroupService } from '../services/group.service';
import { GroupDetailsComponent } from "../../libs/ui/group-details/group-details.component";
import { Group } from '../models/group.model';

@Component({
  selector: 'clx-recursive-group-root',
  standalone: true,
  imports: [CommonModule, RecursiveGroupListComponent, GroupDetailsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'test-recursive';
  private groupService = inject(GroupService);
  groups = this.groupService.getGroups;

  selectedGroup = signal<Group | null>(null);

  onSelectedGroupChange(group: Group | null) {
    this.selectedGroup.set(group);
  }
}
