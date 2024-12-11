import { EntityMstDeptInterface } from "../mstDept/mstDept.entity";

export interface EntityKpiInterface {
  id: number;
  dept: string;
  mstDept?: EntityMstDeptInterface;
}
