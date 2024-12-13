import { Card, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { useFindDowntimesQuery } from "@renderer/pages/qsense/@qsense.api";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import Chart from "react-apexcharts";

interface HeatmapChartProps {
  mcCd: string;
  comId: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ mcCd, comId }) => {
  const startOfDayStr = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
  const endOfDayStr = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const { data, error, isLoading, refetch } = useFindDowntimesQuery({
    mcCd,
    comId,
    // startOfDay: startOfDayStr,
    // endOfDay: endOfDayStr,
  });

  const downtimes = data?.data ?? [];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = dayjs().startOf("day");

  const downtimeMap = hours.map((hour) => {
    const start = today.add(hour, "hour");
    const stop = today.add(hour + 1, "hour");

    const isDowntime =
      Array.isArray(downtimes) &&
      downtimes.some(
        ({ downtimeStart, downtimeFinish }) =>
          dayjs(downtimeStart).isBefore(stop) &&
          dayjs(downtimeFinish).isAfter(start)
      );
    return isDowntime ? 2 : 1;
  });

  const heatmapSeries = [
    {
      name: "Machine Status",
      data: downtimeMap,
    },
  ];

  const heatmapOptions = {
    chart: {
      type: "heatmap" as const,
      height: "100%",
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            { from: 1, to: 1, color: "#00E396", name: "RUN" },
            { from: 2, to: 2, color: "#FF4560", name: "STOP" },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: hours.map((hour) => `${hour}:00 - ${hour + 1}:00`),
    },
  };

  // Re-fetch data when mcCd or comId changes
  useEffect(() => {
    refetch();
  }, [mcCd, comId, refetch]);

  // Optional: Trigger refetch if downtimes is empty and not loading
  useEffect(() => {
    if (downtimes.length === 0 && !isLoading) {
      refetch();
    }
  }, [downtimes, isLoading, refetch]);

  if (isLoading) {
    return <Text>Loading heatmap...</Text>;
  }

  if (error) {
    return <Text>Error fetching downtime data. Please try again later.</Text>;
  }

  return (
    <Card
      shadow="xl"
      padding="xl"
      radius="md"
      withBorder
      style={{ backgroundColor: "#f9fafb" }}
    >
      <Stack gap="lg">
        <Group justify="apart">
          <Title order={3} style={{ color: "#1a73e8" }}>
            Stop Time
          </Title>
        </Group>

        <Divider />
        {downtimes.length === 0 ? (
          <div>
            No downtime data available.{" "}
            <button onClick={() => refetch()}>Refresh Data</button>
          </div>
        ) : (
          <Chart
            options={heatmapOptions}
            series={heatmapSeries}
            type="heatmap"
            height="250"
          />
        )}
      </Stack>
    </Card>
  );
};

export default HeatmapChart;
