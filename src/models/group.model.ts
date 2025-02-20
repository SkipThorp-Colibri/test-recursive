import { IGroupData, IGroupMethods } from '.';

export class Group implements IGroupData, IGroupMethods {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public expanded: boolean = false,
    public subGroups: Group[] = []
  ) {}

  toggleGroup(): void {
    console.log(`Group toggled in model: ${this.name}`);
    this.selectedGroup(this);
    this.expanded = !this.expanded;

    // Recursively collapse all child groups if this group is collapsed
    // If collapsing, set all child groups' 'expanded' to false
    if (!this.expanded && this.subGroups.length > 0) {
      this.setAllChildGroupsCollapsed(this);
    }

  }

  // Helper method to set all child groups to collapsed
  private setAllChildGroupsCollapsed(group: Group): void {
    group.subGroups.forEach(subGroup => {
      subGroup.expanded = false;

      // If the child group has its own children, collapse them as well
      if (subGroup.subGroups.length > 0) {
        this.setAllChildGroupsCollapsed(subGroup);
      }
    });
  }

  isGroup(): boolean {
    return this.subGroups && this.subGroups.length > 0;
  }

  isExpanded(): boolean {
    return this.expanded;
  }

  selectedGroup(group: Group): Group {
    return group;
  }
}
