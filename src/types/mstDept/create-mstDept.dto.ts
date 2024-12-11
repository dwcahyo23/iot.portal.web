import { ConnectUserDeptInterface } from "../userDept/connect-userDept.dto";
import { ConnectKpiInterface } from "../kpi/connect-kpi.dto";
import { ConnectPdScwInterface } from "../pdScw/connect-pdScw.dto";

interface CreateMstDeptUserDeptRelationInputInterface {
  connect: ConnectUserDeptInterface[];
}
interface CreateMstDeptKpiRelationInputInterface {
  connect: ConnectKpiInterface[];
}
interface CreateMstDeptPdScwRelationInputInterface {
  connect: ConnectPdScwInterface[];
}

export interface CreateMstDeptInterface {
  deptNm: string;
  createdBy?: string;
  updatedBy?: string;
  userDept?: CreateMstDeptUserDeptRelationInputInterface;
  kpi?: CreateMstDeptKpiRelationInputInterface;
  pdScw?: CreateMstDeptPdScwRelationInputInterface;
}
