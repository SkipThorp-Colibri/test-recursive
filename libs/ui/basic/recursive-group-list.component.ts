import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGroup } from '../../../src/app/group.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'clx-recursive-group-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './recursive-group-list.component.html',
  styleUrls: ['./recursive-group-list.component.css']
})
export class RecursiveGroupListComponent {
  @Input()
  groups: IGroup[] = [];
  @Input()
  group: IGroup | null = null;


  ngOnInit() {
    if (!this.groups) {
      // Initialize groups if they are not defined
      this.groups = []; // You should initialize groups here if necessary
    }

    // Iterate over groups to set methods correctly
    this.groups.forEach((group: IGroup) => {
      // Attach methods to the group
      group.toggleGroup = () => {
        group.expanded = !group.expanded;
      };

      group.isGroup = () => {
        return !!group.groups && group.groups.length > 0;
      };

      group.isExpanded = () => {
        return group.expanded;
      };
    });

    // If no group is selected, choose the first one
    if (!this.group) {
      this.group = this.groups[0];
    }
  }


  }
