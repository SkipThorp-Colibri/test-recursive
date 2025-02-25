import { Injectable, signal } from '@angular/core';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groups = signal<Group[]>([]);
  private loading = signal<boolean>(false);
  private selectedGroup = signal<Group | null>(null);

  // Expose groups as a signal for components to use
  getGroups = this.groups;
  selectedGroup$ = this.selectedGroup;

  constructor() {
    this.fetchGroups();
  }

  // Simulate fetching groups from an API
  private fetchGroups(): void {
    this.loading.set(true);
    setTimeout(() => {
      const mockGroups: Group[] = [
        this.createGroup(
          'c9151c1c-868d-4781-84c3-e8a2df07d2e0',
          'Engineering',
          'Engineering department',
          false,
          '',
          [
            this.createGroup(
              '187fd7be-e511-4532-87e5-457ed4ec7932',
              'Software',
              'Software development team',
              false,
              'c9151c1c-868d-4781-84c3-e8a2df07d2e0'
            ),
            this.createGroup(
              'bb408b26-6dd9-4fb6-b0f2-e2b78e8cbc3e',
              'Hardware Team',
              'Hardware development team',
              false,
              'c9151c1c-868d-4781-84c3-e8a2df07d2e0',
              [
                this.createGroup(
                  '6eba9c9e-f06f-40f1-b92c-4e82b1d7294a',
                  'Visual Team 1',
                  'Visual development Team 1',
                  false,
                  'bb408b26-6dd9-4fb6-b0f2-e2b78e8cbc3e',
                ),
                this.createGroup(
                  'c91c4e0a-a416-4ca8-985b-c3850da7c421',
                  'Visual Team 2',
                  'Visual development Team 2',
                  false,
                  'bb408b26-6dd9-4fb6-b0f2-e2b78e8cbc3e',
                )
              ]
            )
          ]
        ),
        this.createGroup(
          '8b726bef-4f2b-418c-a498-2a3f7efe2372',
          'Marketing',
          'Marketing department',
          false,
          '',
          [
            this.createGroup(
              '081495e4-875e-4a15-ab5a-3c19705efb17',
              'Digital',
              'Digital marketing team',
              false,
              '8b726bef-4f2b-418c-a498-2a3f7efe2372',
              [
                this.createGroup(
                  '996a577f-5477-46eb-9d1b-5f6a27780967',
                  'Print Team A',
                  'Print media Team A',
                  false,
                  '996a577f-5477-46eb-9d1b-5f6a27780967',
                ),
                this.createGroup(
                  '496434de-222c-47bf-9f69-191386f3ce79',
                  'Print Team B',
                  'Print media Team B',
                  false,
                  '996a577f-5477-46eb-9d1b-5f6a27780967',
                  [
                    this.createGroup(
                      'fe89d7f2-5767-4991-abd2-197be8f1c143',
                      'Print Team B - Print Sub-Team Alpha',
                      'Print media Team B - Team Alpha',
                      false,
                      '496434de-222c-47bf-9f69-191386f3ce79',
                    ),
                    this.createGroup(
                      '2583a87a-16e5-4155-b6a1-16f41d82a04a',
                      'Print Team B - Print Sub-Team Beta',
                      'Print media Team B - Team Beta',
                      false,
                      '496434de-222c-47bf-9f69-191386f3ce79',
                    )
                  ]
                )
              ]
            )
          ]
        )
      ];

      this.groups.set(mockGroups);
      this.loading.set(false);
    }, 1000);
  }

  // Helper function to create a group with nested groups
  private createGroup(
      id: string = crypto.randomUUID.toString(),
      name: string,
      description: string,
      expanded: boolean,
      parentId: string = '',
      subgroups: Group[] = []): Group {
    return new Group(id, name, description, expanded, parentId, subgroups);
  }

  // setSelectedGroup(group: Group): void {
  //   console.log(`Group toggled in service: ${group.id}`);
  //   this.selectedGroup.set(group);
  // }

  renameGroupById = (groupId: string, newName: string): Group | null => {
    let updatedGroup: Group | null = null;
    const updatedGroups = this.groups().map(group => {
      if (group.id === groupId) {
        updatedGroup = Object.assign(Object.create(Object.getPrototypeOf(group)), group, { name: newName });
        return updatedGroup;
      }
      return group;
    }).filter((group): group is Group => group !== null);

    if (updatedGroup) {
      this.groups.set(updatedGroups);
      this.selectedGroup.set(updatedGroup);
    }
    return updatedGroup;
  };

  // onRenameGroup(newName: string): void {

  //   const group = this.selectedGroup();
  //   console.log(`Group with id of ${group?.id} renamed to: ${newName}`);
  //   if (group) {
  //     if (newName && newName.trim()) {
  //       group.name = newName.trim();
  //       const groupName = this.renameGroup(group, newName);
  //       console.log(`Group renamed to: ${groupName}`);

  //     } else {
  //       console.log('Rename canceled or invalid input');
  //     }

  //   }

  // }

  // Rename a group by updating its name within the groups signal
  renameGroup = (group: Group, newName: string): Group | null => {
    console.log(`Group renamed: ${group.id} to ${newName}`);

    const updateGroup = (groups: Group[]): Group[] =>
      groups.map(g =>
        g.id === group.id
          ? new Group(g.id, newName, g.description, g.expanded, g.parentId, g.subGroups)
          : new Group(g.id, g.name, g.description, g.expanded, g.parentId, updateGroup(g.subGroups || []))
      );

    this.groups.set(updateGroup(this.groups()));
    return this.groups().find(g => g.id === group.id) || null;
  };

  // Rename a group and return the updated group
  onRenameGroup = (newName: string): Group | null => {
    const group = this.selectedGroup();
    console.log(`Group with id of ${group?.id} renamed to: ${newName}`);

    if (group && newName && newName.trim()) {
      return this.renameGroup(group, newName.trim());
    }

    console.log('Rename canceled or invalid input');
    return null;
  };

  onMove(groupId: string, newParentId: string, groups: Group[]) {
    const groupToMove = this.findGroupById(groupId, groups);
    if (groupToMove) {
        this.removeGroupById(groupId, groups);
        const newParent = this.findGroupById(newParentId, groups);
        if (newParent) {
            newParent.subGroups = newParent.subGroups || [];
            newParent.subGroups.push(groupToMove);
        }
    }
}

  private findGroupById(id: string, groups: Group[]): Group | null {
    for (let group of groups) {
      if (group.id === id) return group;
      if (group.subGroups) {
        const found = this.findGroupById(id, group.subGroups);
        if (found) return found;
      }
    }
    return null;
  }

  private removeGroupById(id: string, groups: Group[]): boolean {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].id === id) {
        groups.splice(i, 1);
        return true;
      }
      if (groups[i].subGroups) {
        if (this.removeGroupById(id, groups[i].subGroups)) {
          return true;
        }
      }
    }
    return false;
  }


}
