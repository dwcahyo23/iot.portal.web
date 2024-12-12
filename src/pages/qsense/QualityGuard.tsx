import { Grid } from "@mantine/core";
import OkNgCard from "@renderer/components/QSense/OkNgCard";
import { mqttGet, mqttPost } from "@renderer/services/MqttService";
import { addNotification } from "@renderer/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MqttGetSubscriptionsResponse, MqttSubscription } from "./mqtt.types";

const QualityGuard = () => {
  const [subscriptions, setSubscriptions] = useState<MqttSubscription[]>([]); // Ensure initial state is an array
  const dispatch = useDispatch();

  const fetchSubscriptions = async () => {
    const params = {
      qos: 2,
      match_topic: "qSense/Sub/+",
      page: 1,
      limit: 10,
      node: "emqx@172.17.0.3",
    };

    try {
      const response = await mqttGet<MqttGetSubscriptionsResponse>(
        "mqtt/api/v5/subscriptions",
        { params }
      );
      setSubscriptions(response.data || []); // Ensure response data is valid
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]); // Reset to empty array on error
    }
  };

  useEffect(() => {
    fetchSubscriptions();

    const intervalId = setInterval(() => {
      fetchSubscriptions();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOkClick = async (topic: string, message: string) => {
    const payload = {
      payload_encoding: "plain",
      topic,
      qos: 2,
      payload: JSON.stringify({
        judge: 1,
        msg: message,
      }),
      retain: false,
    };

    try {
      await mqttPost("/mqtt/api/v5/publish", payload);
      dispatch(
        addNotification({
          id: Math.random().toString(),
          message: `Pesan ${topic} OK terkirim`,
          title: "Success",
          color: "green",
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          id: Math.random().toString(),
          message: `Pesan ${topic} OK error, ${error}`,
          title: "Error",
          color: "red",
        })
      );
    }
  };

  const handleNgClick = async (topic: string, message: string) => {
    const confirmation = window.confirm(
      "Pastikan input sudah benar, karena akan mengirim sinyal untuk mematikan mesin?"
    );

    if (!confirmation) {
      return; // Cancel execution if user declines
    }

    const payload = {
      payload_encoding: "plain",
      topic,
      qos: 2,
      payload: JSON.stringify({
        judge: 0,
        msg: message,
      }),
      retain: false,
    };

    try {
      await mqttPost("/mqtt/api/v5/publish", payload);
      dispatch(
        addNotification({
          id: Math.random().toString(),
          message: `Pesan ${topic} NG terkirim`,
          title: "Success",
          color: "green",
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          id: Math.random().toString(),
          message: `Pesan ${topic} NG error, ${error}`,
          title: "Error",
          color: "red",
        })
      );
    }
  };

  const isOnline = (topic: string) => {
    const topicCount = subscriptions?.filter(
      (subscription) => subscription.topic === topic
    ).length;
    return topicCount >= 2;
  };

  // Get unique machine codes from subscriptions
  const uniqueTopics = Array.from(
    new Set(subscriptions?.map((subscription) => subscription.topic) || [])
  );

  return (
    <Grid
      type="container"
      breakpoints={{
        xs: "100px",
        sm: "200px",
        md: "300px",
        lg: "400px",
        xl: "500px",
      }}
    >
      {uniqueTopics.map((topic) => {
        const machineCode = topic.split("/")[2]; // Get machine code from topic
        return (
          <Grid.Col key={machineCode} span={{ base: 12, md: 6, lg: 3 }}>
            <OkNgCard
              key={machineCode}
              machineCode={machineCode}
              machineName="Forming" // Assuming machine name is static for now, adjust if dynamic
              online={isOnline(topic)}
              topic={topic}
              onNgClick={handleNgClick}
              onOkClick={handleOkClick}
            />
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default QualityGuard;
