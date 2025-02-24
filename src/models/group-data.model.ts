export interface IGroupData {
  id: string;
  name: string;
  description: string;
  expanded: boolean;
  parentId?: string;
  subGroups?: IGroupData[];
  onRenameGroup(newName: string): void;
}
