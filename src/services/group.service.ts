import { Injectable, signal } from '@angular/core';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groups = signal<Group[]>([]);
  private loading = signal<boolean>(false);
  public selectedGroup = signal<Group | null>(null);

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
        this.createGroup(
          'c9151c1c-868d-4781-84c3-e8a2df07d2e0',
          'Engineering',
          'Engineering department',
          false,
          [
            this.createGroup(
              '187fd7be-e511-4532-87e5-457ed4ec7932',
              'Software',
              'Software development team',
              false
            ),
            this.createGroup(
              'bb408b26-6dd9-4fb6-b0f2-e2b78e8cbc3e',
              'Hardware Team',
              'Hardware development team',
              false,
              [
                this.createGroup(
                  '6eba9c9e-f06f-40f1-b92c-4e82b1d7294a',
                  'Visual Team 1',
                  'Visual development Team 1',
                  false
                ),
                this.createGroup(
                  'c91c4e0a-a416-4ca8-985b-c3850da7c421',
                  'Visual Team 2',
                  'Visual development Team 2',
                  false
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
          [
            this.createGroup(
              '081495e4-875e-4a15-ab5a-3c19705efb17',
              'Digital',
              'Digital marketing team',
              false,
              [
                this.createGroup(
                  '996a577f-5477-46eb-9d1b-5f6a27780967',
                  'Print Team A',
                  'Print media Team A',
                  false
                ),
                this.createGroup(
                  '496434de-222c-47bf-9f69-191386f3ce79',
                  'Print Team B',
                  'Print media Team B',
                  false,
                  [
                    this.createGroup(
                      'fe89d7f2-5767-4991-abd2-197be8f1c143',
                      'Print Team B - Print Sub-Team A',
                      'Print media Team B - Team A',
                      false
                    ),
                    this.createGroup(
                      '2583a87a-16e5-4155-b6a1-16f41d82a04a',
                      'Print Team B - Sub-Team B',
                      'Print media Team B - Team A',
                      false
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
    }, 1234);
  }

  // Helper function to create a group with nested groups
  private createGroup(id: string = crypto.randomUUID.toString(), name: string, description: string, expanded: boolean, subgroups: Group[] = []): Group {
    return new Group(id, name, description, expanded, subgroups);
  }

  setSelectedGroup(group: Group): void {
    console.log(`Group toggled in service: ${group.name}`);
    this.selectedGroup.set(group);
  }

}
