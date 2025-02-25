import { Injectable, signal } from '@angular/core';
import { GroupModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  // Expose groups as a signal for components to use
  public groups = signal<GroupModel[]>([]);
  public loading = signal<boolean>(false);
  public selectedGroup = signal<GroupModel>(this.getGroup());

  constructor() {
  }

  

  // Helper function to create a group with nested groups
  

  // setSelectedGroup(group: Group): void {
  //   console.log(`Group toggled in service: ${group.id}`);
  //   this.selectedGroup.set(group);
  // }

  

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
  renameGroup = (group: GroupModel, newName: string): GroupModel | null => {
    console.log(`Group renamed: ${group.id} to ${newName}`);

    const updateGroup = (groups: GroupModel[]): GroupModel[] =>
      groups.map(g =>
        g.id === group.id
          ? this.getGroup(g.id, newName, g.description, g.expanded, g.parentId, g.subGroups)
          : this.getGroup(g.id, g.name, g.description, g.expanded, g.parentId, updateGroup(g.subGroups || []))
      );

    this.groups.set(updateGroup(this.groups()));
    return this.groups().find(g => g.id === group.id) || null;
  };

  // Rename a group and return the updated group
  onRenameGroup = (newName: string): GroupModel | null => {
    const group = this.selectedGroup();
    console.log(`Group with id of ${group?.id} renamed to: ${newName}`);

    if (group && newName && newName.trim()) {
      return this.renameGroup(group, newName.trim());
    }

    console.log('Rename canceled or invalid input');
    return null;
  };

  onMove(groupId: string, newParentId: string, groups: GroupModel[]) {
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

  private findGroupById(id: string, groups: GroupModel[]): GroupModel | null {
    for (let group of groups) {
      if (group.id === id) return group;
      if (group.subGroups) {
        const found = this.findGroupById(id, group.subGroups);
        if (found) return found;
      }
    }
    return null;
  }

  private removeGroupById(id: string, groups: GroupModel[]): boolean {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].id === id) {
        groups.splice(i, 1);
        return true;
      }
      if (!!groups[i].subGroups) {
        if (this.removeGroupById(id, groups[i].subGroups ?? [])) {
          return true;
        }
      }
    }
    return false;
  }

  getGroup(id: string = '', newName: string = '', description: string = '', expanded: boolean = false, parentId: string = '', subGroups: GroupModel[] = []) : GroupModel {
    return {
      id: id,
      name: newName,
      description: description,
      expanded: expanded,
      parentId: parentId,
      subGroups: []
    };
  }
}
