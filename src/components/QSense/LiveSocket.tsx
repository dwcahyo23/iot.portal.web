import { Badge, Card, Container, Grid, Group, Text } from "@mantine/core";
import { LiveCardProps } from "@renderer/pages/qsense/mqtt.types";
import useMqtt from "@renderer/utils/hooks/useMqtt";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { GaugeComponent } from "react-gauge-component";
import "./LiveSocket.css";

interface SenseLogData {
  mcCd: string;
  comId: string;
  akumulasi_counter: number;
  rpm: number;
  load_sensor1: number;
  load_sensor2: number;
  load_sensor3: number;
  load_sensor4: number;
  ts: string; // Timestamp
  status: boolean | number;
}

const MAX_DATA_POINTS = 20;

const LiveSocket = ({ comId, mcCd }: LiveCardProps) => {
  const topicKey = `qSense/Pub/${comId}/${mcCd}`;
  const { messages } = useMqtt([topicKey]);
  const topicData = messages[topicKey];
  const parsedMessage: SenseLogData = topicData
    ? safeParseJSON(topicData.payload)
    : null;

  const [sensorData, setSensorData] = useState<
    Record<string, { ts: string; value: number }[]>
  >({
    load_sensor1: [],
    load_sensor2: [],
    load_sensor3: [],
    load_sensor4: [],
  });

  const [previousSensorData, setPreviousSensorData] = useState<
    Record<string, { ts: string; value: number }[]>
  >({
    load_sensor1: [],
    load_sensor2: [],
    load_sensor3: [],
    load_sensor4: [],
  });

  const [counter, setCounter] = useState<number | null>(
    parsedMessage?.akumulasi_counter ?? 0
  );
  const [counterChange, setCounterChange] = useState<number>(0);
  const [isChangeVisible, setIsChangeVisible] = useState<boolean>(false);

  useEffect(() => {
    if (parsedMessage) {
      setSensorData((prev) => {
        const updated = { ...prev };
        setPreviousSensorData({ ...prev }); // Simpan data sebelumnya sebelum update

        Object.entries(prev).forEach(([sensor, values]) => {
          const newValue = parsedMessage[sensor as keyof SenseLogData];
          if (newValue !== undefined) {
            const waveData = generateSinusoidalWave(
              newValue as number,
              100,
              2000,
              parsedMessage.ts
            );
            updated[sensor] = waveData;
          }
        });
        return updated;
      });

      // Track counter changes
      if (parsedMessage.akumulasi_counter !== counter) {
        const change = parsedMessage.akumulasi_counter - (counter || 0);
        setCounterChange(change);
        setCounter(parsedMessage.akumulasi_counter);
      }
    }
  }, [parsedMessage ? JSON.stringify(parsedMessage) : null]);

  const renderSensorChart = (sensor: string, label: string) => {
    const data = sensorData[sensor] || [];
    const previousData = previousSensorData[sensor] || [];

    // Menyusun data dengan menggunakan indeks array sebagai x-axis untuk overlap
    const combinedData = [
      ...data.map((point, index) => ({
        x: index, // Menggunakan indeks array sebagai x-axis
        y: point.value,
        isCurrent: true,
      })),
      ...previousData.map((point, index) => ({
        x: index, // Menggunakan indeks array sebagai x-axis
        y: point.value,
        isCurrent: false,
      })),
    ];

    // Urutkan data berdasarkan indeks x (array index)
    combinedData.sort((a, b) => a.x - b.x);

    const chartOptions: ApexOptions = {
      chart: {
        type: "line",
        animations: {
          enabled: true,
          dynamicAnimation: { speed: 1000 },
        },
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      xaxis: {
        type: "numeric", // Gunakan tipe numerik untuk sumbu x
        labels: {
          formatter: (value) => `${value}`, // Menampilkan indeks sebagai label
          style: {
            colors: "#ffffff",
          },
        },
      },
      yaxis: {
        max:
          Math.max(
            ...data.map((d) => d.value),
            ...previousData.map((d) => d.value)
          ) + 10,
        min:
          Math.min(
            ...data.map((d) => d.value),
            ...previousData.map((d) => d.value)
          ) - 10,
        tickAmount: 5,
        labels: {
          style: { colors: ["#ffffff"] },
          formatter: (value) => value.toFixed(2),
        },
      },
      stroke: {
        curve: "smooth",
        width: [3, 1],
        dashArray: [0, 5],
      },
      colors: ["#00E396", "#FF4560"],
      grid: { show: true },
      tooltip: {
        enabled: true,
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: "'Arial', sans-serif",
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x: {
          show: true,
          formatter: (value: number) => `Index: ${value}`,
        },
        y: {
          formatter: (value: number) => `${value.toFixed(2)}`,
        },
      },
      legend: {
        position: "top", // Tempatkan legend di atas
        labels: {
          colors: "#ffffff", // Warna legend menjadi putih
        },
      },
    };

    const chartSeries = [
      {
        name: `${label} - Current Wave`,
        data: combinedData
          .filter((d) => d.isCurrent)
          .map(({ x, y }) => ({ x, y })),
      },
      {
        name: `${label} - Previous Wave`,
        data: combinedData
          .filter((d) => !d.isCurrent)
          .map(({ x, y }) => ({ x, y })),
        stroke: {
          dashArray: 4, // Garis bergaris
        },
      },
    ];

    return (
      <ApexCharts
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={200}
      />
    );
  };

  const renderCounter = () => (
    <div className="counter-panel">
      {counterChange !== 0 && (
        <Text m="md" className="counter-change" size="xl" fw={700}>
          +{counterChange}
        </Text>
      )}
      <Text m="md" className="counter-value" size="xl" fw={700}>
        {counter?.toLocaleString() ?? 0}
      </Text>
    </div>
  );

  const renderPanelHeader = () => (
    <Card className="header-panel">
      <div className="panel-header-content">
        <div>
          <Text size="lg" fw={700}>
            Machine Code: {parsedMessage?.mcCd || "-"}
          </Text>
          <Text size="lg" fw={700}>
            Company ID: {parsedMessage?.comId || "-"}
          </Text>
        </div>
        <Badge
          color={parsedMessage?.status ? "green" : "red"}
          size="lg"
          variant="filled"
          leftSection={
            parsedMessage?.status ? <IconPlayerPlay /> : <IconPlayerStop />
          }
        >
          {parsedMessage?.status ? "RUNNING" : "STOPPED"}
        </Badge>
      </div>
    </Card>
  );

  return (
    <Container>
      <Grid gutter="lg">
        <Grid.Col span={12}>{renderPanelHeader()}</Grid.Col>

        {/* Counter with CountUp */}
        <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Card className="panel-card akumulasi_counter-panel">
            <Text size="xl" fw={700}>
              Counter
            </Text>
            {renderCounter()}
          </Card>
        </Grid.Col>

        {/* RPM Gauge */}
        <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Card className="panel-card rpm-panel">
            <Text size="xl" fw={700}>
              RPM
            </Text>
            <GaugeComponent
              value={parsedMessage?.rpm || 0}
              minValue={0}
              maxValue={150}
              type="radial"
              arc={{
                gradient: true,
                width: 0.2,
                padding: 0,
                subArcs: [
                  {
                    limit: 30,
                    color: "#EA4228",
                    showTick: true,
                  },
                  {
                    limit: 70,
                    color: "#F5CD19",
                    showTick: true,
                  },
                  {
                    limit: 100,
                    color: "#5BE12C",
                    showTick: true,
                  },
                  {
                    limit: 130,
                    color: "#5BE12C",
                    showTick: true,
                  },
                  { color: "#5BE12C" },
                ],
              }}
              pointer={{
                type: "needle",
                elastic: true,
                color: "#3f51b5",
              }}
              labels={{
                valueLabel: {
                  matchColorWithArc: true,
                  formatTextValue: (value: number) => `${value} RPM`,
                  style: {
                    fontSize: 18,
                  },
                },
              }}
            />
          </Card>
        </Grid.Col>

        {/* Load Sensor Panels */}
        {Object.entries(sensorData).map(([sensor, values], index) => (
          <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6 }} key={sensor}>
            <Card className="panel-card sensor-panel">
              <Group justify="flex-start">
                <Text size="lg" fw={700}>
                  Sensor {index + 1}
                </Text>
              </Group>

              <Group justify="flex-end">
                <Text size="md" fw={400}>
                  Current Peak:{" "}
                  {values.length
                    ? Math.max(...values.map((d) => d.value)).toFixed(2) // Ambil nilai maksimum (peak)
                    : "-"}
                </Text>
                <Text size="md" fw={400}>
                  Previous Peak:{" "}
                  {previousSensorData?.[sensor]?.length
                    ? Math.max(
                        ...previousSensorData[sensor].map((d) => d.value)
                      ).toFixed(2)
                    : "-"}
                </Text>
              </Group>

              {renderSensorChart(sensor, `Sensor ${index + 1}`)}

              <Group justify="flex-end">
                <Text size="md" fw={200}>
                  Timestamp:{" "}
                  {dayjs(parsedMessage?.ts)
                    .add(7, "hour")
                    .format("DD MMM YYYY, HH:mm:ss")}
                </Text>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

function safeParseJSON(payload: string) {
  try {
    return JSON.parse(payload);
  } catch {
    console.warn("Failed to parse JSON payload:", payload);
    return null;
  }
}

function generateSinusoidalWave(
  peak: number,
  totalPoints: number,
  durationMs: number,
  startTs: string
): { ts: string; value: number }[] {
  const data: { ts: string; value: number }[] = [];
  const frequency = Math.PI; // Setengah gelombang sinus (dari 0 ke π)

  for (let i = 0; i < totalPoints; i++) {
    const progress = i / (totalPoints - 1); // Progress dari 0 ke 1
    const value = peak * Math.sin(progress * frequency); // Gelombang sinus naik-turun

    // Hitung timestamp untuk setiap titik
    const ts = dayjs(startTs)
      .add((i * durationMs) / totalPoints, "millisecond")
      .toISOString();

    data.push({ ts, value });
  }

  return data;
}

export default LiveSocket;
