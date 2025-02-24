import { Group } from '.';

export interface IGroupMethods {
  toggleGroup(): void;
  isGroup(): boolean;
  isExpanded(): boolean;
  selectedGroup(group: Group): Group | null;
  rename(newName: string): void;
}
