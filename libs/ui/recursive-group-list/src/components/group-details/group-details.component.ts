import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupModel } from '../../models/group-model';

@Component({
  selector: 'clx-group-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-details.component.html',
})
export class GroupDetailsComponent {
  @Input() selectedGroup: GroupModel | undefined;
}
