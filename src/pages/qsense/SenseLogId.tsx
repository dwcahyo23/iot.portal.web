import { Container, Paper, Stack } from "@mantine/core";
import HeatmapChart from "@renderer/components/QSense/HeatmapChart";
import LiveCard from "@renderer/components/QSense/LiveCard";
import { useParams } from "react-router-dom";

const SenseLogId = () => {
  const { comId, mcCd } = useParams<{ comId: string; mcCd: string }>();

  // Validasi parameter awal
  if (!comId || !mcCd) {
    return <div>Error: Parameter `comId` atau `mcCd` tidak ditemukan.</div>;
  }

  return (
    <Container size="lg" py="lg">
      <Paper
        shadow="xs"
        p="md"
        radius="md"
        style={{ backgroundColor: "#f4f4f9" }}
      >
        <Stack gap="xl">
          {" "}
          {/* Display LiveCard and HeatmapChart */}
          <Stack gap="lg">
            <LiveCard comId={comId} mcCd={mcCd?.toUpperCase()} />
            <HeatmapChart mcCd={mcCd?.toUpperCase()} comId={comId} />
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SenseLogId;
