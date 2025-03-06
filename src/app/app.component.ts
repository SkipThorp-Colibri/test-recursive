import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupListComponent } from '../../libs/ui/recursive-group-list/src/components/group-list.component';
import { GroupService } from '../services/group.service';
import { GroupModel } from '../models';

@Component({
  selector: 'clx-recursive-group-root',
  imports: [CommonModule, GroupListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  @Input() selectedGroupChange = signal<GroupModel | null>(null);

  public groups = signal<GroupModel[]>([]);
  public fullGroupsList: GroupModel[] = [];
  public loading = signal<boolean>(false);
  public title = 'test-recursive';

  constructor(private groupService: GroupService) {
    this.getGroups();
  }

  sortGroupsRecursively = (groups: GroupModel[]): GroupModel[] => {
    return groups.sort((a, b) => a.name.localeCompare(b.name)).map(group => ({
      ...group,
      subGroups: group.subGroups ? this.sortGroupsRecursively(group.subGroups) : []
    }));
  };

  getGroups = (): void => {
    this.loading.set(true);
    this.groups.set(this.groupService.groups())

  }
}
