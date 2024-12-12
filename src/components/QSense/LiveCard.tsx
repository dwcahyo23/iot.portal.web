import { Display } from "@claycot/react-7-segment-display";
import {
  Badge,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { LiveCardProps } from "@renderer/pages/qsense/mqtt.types";
import {
  IconCheck,
  IconDeviceAnalytics,
  IconGauge,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { GaugeComponent } from "react-gauge-component";

const LiveCard = ({ comId, mcCd, parsedMessage }: LiveCardProps) => {
  const isMachineActive =
    parsedMessage?.status === 1 || parsedMessage?.status === true;

  return (
    <Container size="lg" p="md">
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
              Sense Log Information
            </Title>
            <Badge
              size="lg"
              color="cyan"
              variant="gradient"
              gradient={{ from: "teal", to: "blue" }}
            >
              Live Data
            </Badge>
          </Group>

          <Divider />

          <Group justify="center" gap="lg">
            <Badge color="blue" size="lg" variant="light">
              Company ID: {comId}
            </Badge>
            <Badge color="green" size="lg" variant="light">
              Machine Code: {mcCd}
            </Badge>
          </Group>

          <Divider />

          {parsedMessage ? (
            <Stack>
              <Group justify="center" gap="md">
                <ThemeIcon
                  size="xl"
                  radius="xl"
                  color={isMachineActive ? "green" : "red"}
                >
                  {isMachineActive ? (
                    <IconCheck size={24} />
                  ) : (
                    <IconX size={24} />
                  )}
                </ThemeIcon>
                <Text
                  size="lg"
                  fw="bold"
                  style={{ color: isMachineActive ? "#2ecc71" : "#e74c3c" }}
                >
                  {isMachineActive ? "Machine Active" : "Machine Inactive"}
                </Text>
              </Group>

              <Grid grow>
                {/* Column for Akumulasi Counter */}
                <Grid.Col span={6}>
                  <Group>
                    <IconDeviceAnalytics size={18} />
                    <Text>Akumulasi Counter:</Text>
                  </Group>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Display
                      value={parsedMessage.akumulasi_counter}
                      height={40}
                      color="#28a745"
                      count={9}
                      paddingInner="5px"
                      paddingOuter="1px"
                      blankChar="-"
                      leadingZeroes
                      rhsOnlyFirstDigit
                      backgroundColor="#000"
                      skew={false}
                    />
                  </div>
                </Grid.Col>

                {/* Column for RPM */}
                <Grid.Col span={6}>
                  <Group>
                    <IconGauge size={18} />
                    <Text>RPM:</Text>
                  </Group>
                  {parsedMessage.rpm ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 200,
                        width: "100%",
                      }}
                    >
                      <GaugeComponent
                        value={parsedMessage.rpm}
                        minValue={0}
                        maxValue={150}
                        type="radial"
                        arc={{
                          gradient: true,
                          width: 0.2,
                          padding: 0,
                          subArcs: [
                            { limit: 30, color: "#EA4228" },
                            { limit: 70, color: "#F5CD19" },
                            { color: "#5BE12C" },
                          ],
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
                        pointer={{
                          elastic: true,
                          animationDelay: 0,
                          color: "#1a73e8",
                        }}
                      />
                    </div>
                  ) : (
                    <Text color="dimmed">No RPM data</Text>
                  )}
                </Grid.Col>

                {/* Load Sensors */}
                {[
                  "load_sensor1",
                  "load_sensor2",
                  "load_sensor3",
                  "load_sensor4",
                ].map((sensor, index) => (
                  <Grid.Col span={6} key={sensor}>
                    <Group>
                      <IconDeviceAnalytics size={18} />
                      <Text>Load Sensor {index + 1}:</Text>
                    </Group>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Display
                        value={parsedMessage[sensor] || 0}
                        height={40}
                        color="#007bff"
                        count={3}
                        paddingInner="5px"
                        paddingOuter="1px"
                        blankChar="-"
                        leadingZeroes
                        rhsOnlyFirstDigit={false}
                        backgroundColor="#000"
                        skew={false}
                      />
                    </div>
                  </Grid.Col>
                ))}

                {/* Timestamp */}
                <Grid.Col span={12}>
                  <Group>
                    <IconDeviceAnalytics size={18} />
                    <Text>
                      Timestamp:
                      {dayjs(parsedMessage.ts)
                        .add(7, "hour")
                        .format("YYYY-MM-DD HH:mm:ss")}
                    </Text>
                  </Group>
                </Grid.Col>
              </Grid>
            </Stack>
          ) : (
            <Text color="dimmed" size="lg">
              Menunggu data dari MQTT...
            </Text>
          )}
        </Stack>
      </Card>
    </Container>
  );
};

export default LiveCard;
