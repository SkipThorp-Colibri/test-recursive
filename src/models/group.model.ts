import { IGroupData, IGroupMethods } from '.'
export class Group implements IGroupData, IGroupMethods {
  constructor(
    public name: string,
    public expanded: boolean = false,
    public groups: Group[] = []
  ) {}

  toggleGroup(): void {
    this.expanded = !this.expanded;

    // Recursively collapse all child groups if this group is collapsed
    // If collapsing, set all child groups' 'expanded' to false
    if (!this.expanded && this.groups.length > 0) {
      this.setAllChildGroupsCollapsed(this);
    }
  }

  // Helper method to set all child groups to collapsed
  private setAllChildGroupsCollapsed(group: Group): void {
    group.groups.forEach(childGroup => {
      childGroup.expanded = false;

      // If the child group has its own children, collapse them as well
      if (childGroup.groups.length > 0) {
        this.setAllChildGroupsCollapsed(childGroup);
      }
    });
  }

  isGroup(): boolean {
    return this.groups && this.groups.length > 0;
  }

  isExpanded(): boolean {
    return this.expanded;
  }

  selectedGroup(): string {
    console.log(`Group toggled: ${this.name}`);
    return this.name;
  }
}
