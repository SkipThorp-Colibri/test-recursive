export interface IGroupData {
  id: string;
  name: string;
  description: string;
  expanded: boolean;
  subGroups?: IGroupData[];
}
