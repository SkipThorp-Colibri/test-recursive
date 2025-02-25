export interface GroupModel {
  id: string;
  name: string;
  description: string;
  expanded: boolean;
  parentId?: string;
  subGroups?: GroupModel[];
}
