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

  renameGroupById = (groupId: string, newName: string, groups: GroupModel[]): void => {
    console.log(`Renaming group with ID: ${groupId} to '${newName}'`);

    let groupFound = false;

    const updateGroupName = (groups: GroupModel[]) => {
      groups.forEach(group => {
        if (group.id === groupId) {
          group.name = newName;
          groupFound = true;
        } else if (group.subGroups && group.subGroups.length > 0) {
          updateGroupName(group.subGroups);
        }
      });
    };

    updateGroupName(groups);

    if (!groupFound) {
      console.warn(`Group with ID ${groupId} not found.`);
    } else {
      console.log(`Group renamed successfully.`);
    }
  }

  deleteGroup = (groupToDelete: GroupModel, groups: GroupModel[]) => {
    console.log(`Deleting group: ${groupToDelete.id} - ${groupToDelete.name}`);

    const removeGroupById = (groups: GroupModel[]): GroupModel[] => {
      const groupFound = groups.find(group => group.id === groupToDelete.id);
      if (groupFound) {
        groups.splice(groups.indexOf(groupFound), 1);
      }
      return groups;
    };

    groups = [...removeGroupById(groups)];

    console.log(`Group deleted successfully: ${groupToDelete.id}`);
  }
}
