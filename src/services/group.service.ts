import { Injectable, signal } from '@angular/core';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groups = signal<Group[]>([]);
  private loading = signal<boolean>(false);

  // Expose groups as a signal for components to use
  getGroups = this.groups;

  constructor() {
    this.fetchGroups();
  }

  // Simulate fetching groups from an API
  private fetchGroups(): void {
    this.loading.set(true);
    setTimeout(() => {
      const mockGroups: Group[] = [
        this.createGroup('Group A', [
          this.createGroup('Group A.1', [
            this.createGroup('Group A.1.1', [
              new Group('Group A.1.1.1', false),
              new Group('Group A.1.1.2', false)
            ])
          ])
        ]),
        this.createGroup('Group B', [
          this.createGroup('Group B.1', [
            new Group('Group B.1.1', false),
            new Group('Group B.1.2', false)
          ])
        ])
      ];
      this.groups.set(mockGroups);
      this.loading.set(false);
    }, 3000);
  }

  // Helper function to create a group with nested groups
  private createGroup(name: string, subgroups: Group[] = []): Group {
    return new Group(name, false, subgroups);
  }
}
