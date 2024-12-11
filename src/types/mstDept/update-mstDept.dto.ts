import { ConnectUserDeptInterface } from "../userDept/connect-userDept.dto";
import { ConnectKpiInterface } from "../kpi/connect-kpi.dto";
import { ConnectPdScwInterface } from "../pdScw/connect-pdScw.dto";

interface UpdateMstDeptUserDeptRelationInputInterface {
  connect: ConnectUserDeptInterface[];
}
interface UpdateMstDeptKpiRelationInputInterface {
  connect: ConnectKpiInterface[];
}
interface UpdateMstDeptPdScwRelationInputInterface {
  connect: ConnectPdScwInterface[];
}

export interface UpdateMstDeptInterface {
  deptNm?: string;
  createdBy?: string;
  updatedBy?: string;
  userDept?: UpdateMstDeptUserDeptRelationInputInterface;
  kpi?: UpdateMstDeptKpiRelationInputInterface;
  pdScw?: UpdateMstDeptPdScwRelationInputInterface;
}
