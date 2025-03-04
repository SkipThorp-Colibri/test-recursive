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

  public groups: GroupModel[] = [];
  public fullGroupsList: GroupModel[] = [];
  public loading = signal<boolean>(false);
  public title = 'test-recursive';

  constructor(private groupService: GroupService) {
    this.fetchGroups();
  }

  onSelectedGroupChange = (group: GroupModel) => {
    console.log('group change:', group);
  }

  sortGroupsRecursively = (groups: GroupModel[]): GroupModel[] => {
    return groups.sort((a, b) => a.name.localeCompare(b.name)).map(group => ({
      ...group,
      subGroups: group.subGroups ? this.sortGroupsRecursively(group.subGroups) : []
    }));
  };

  // Simulate fetching groups from an API
  private fetchGroups = (): void => {
    this.loading.set(true);
    setTimeout(() => {
      this.groups = [
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
                ),
                this.createGroup(
                  'da016a98-247b-4d8e-bac0-73fbace41662',
                  'Visual Team 3',
                  'Visual development Team 3',
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
                  '081495e4-875e-4a15-ab5a-3c19705efb17',
                ),
                this.createGroup(
                  '496434de-222c-47bf-9f69-191386f3ce79',
                  'Print Team B',
                  'Print media Team B',
                  false,
                  '081495e4-875e-4a15-ab5a-3c19705efb17',
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
      this.sortGroupsRecursively(this.groups);
      console.log('In the Mock Groups:', this.groups);
      this.fullGroupsList = [...this.groups];
      console.log('In the Mock Full Groups:', this.fullGroupsList);
      this.loading.set(false);
    }, 1000);

  }


  private createGroup = (
    id: string = crypto.randomUUID.toString(),
    name: string,
    description: string,
    expanded: boolean,
    parentId: string = '',
    subgroups: GroupModel[] = []): GroupModel => {
    return {
      id: id,
      name: name,
      description: description,
      expanded: expanded,
      parentId: parentId,
      subGroups: subgroups
    };
  }
}
