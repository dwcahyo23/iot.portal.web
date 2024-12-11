import { EntityUserDeptInterface } from "../userDept/userDept.entity";
import { EntityKpiInterface } from "../kpi/kpi.entity";
import { EntityPdScwInterface } from "../pdScw/pdScw.entity";

export interface EntityMstDeptInterface {
  deptId: number;
  deptNm: string;
  userDept?: EntityUserDeptInterface[];
  kpi?: EntityKpiInterface[];
  pdScw?: EntityPdScwInterface[];
}
