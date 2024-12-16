import { Container, Paper, Stack } from "@mantine/core";
import LiveSocket from "@renderer/components/QSense/LiveSocket";
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
          <Stack gap="lg">
            <LiveSocket comId={comId} mcCd={mcCd?.toUpperCase()} />
            {/* <HeatmapChart mcCd={mcCd?.toUpperCase()} comId={comId} /> */}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SenseLogId;
