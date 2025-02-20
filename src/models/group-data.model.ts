export interface IGroupData {
  name: string;
  expanded: boolean;
  groups?: IGroupData[];
}
