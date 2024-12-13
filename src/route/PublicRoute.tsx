import appConfig from "@renderer/configs/app.config";
import useAuth from "@renderer/utils/hooks/useAuth";
import { Outlet } from "react-router-dom";

const { authenticatedEntryPath } = appConfig;

const PublicRoute = () => {
  const { authenticated } = useAuth();

  // return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
  return authenticated ? <Outlet /> : <Outlet />;
};

export default PublicRoute;
