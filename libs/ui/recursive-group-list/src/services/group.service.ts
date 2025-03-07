import { Injectable } from '@angular/core';
import { GroupModel } from '../models/group-model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor() { }

  sortGroupsListRecursively = (groups: GroupModel[]): GroupModel[] => {
    return groups.sort((a, b) => a.name.localeCompare(b.name)).map(group => ({
      ...group,
      subGroups: group.subGroups ? this.sortGroupsListRecursively(group.subGroups) : []
    }));
  }
}
