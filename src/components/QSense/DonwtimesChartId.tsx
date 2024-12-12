import { useFindDowntimesQuery } from "@renderer/pages/qsense/@qsense.api";
import { DowntimeCardProps } from "@renderer/pages/qsense/mqtt.types";
const DowntimesChartId = ({ comId, mcCd }: DowntimeCardProps) => {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );

  const {
    data: queryData = [],
    error,
    isLoading,
  } = useFindDowntimesQuery(
    {
      mcCd,
      comId,
      startOfDay: startOfDay.toISOString(),
      endOfDay: now.toISOString(),
    },
    { refetchOnMountOrArgChange: 5, skipPollingIfUnfocused: true }
  );

  // if (isLoading) {
  //   console.log("Data sedang dimuat...");
  // } else if (error) {
  //   console.error("Terjadi kesalahan:", error);
  // } else {
  //   console.log("Query Data:", queryData);
  // }

  console.log(queryData);

  return <div>Dowtimes</div>;
};

export default DowntimesChartId;
