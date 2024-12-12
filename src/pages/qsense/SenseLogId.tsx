import LiveCard from "@renderer/components/QSense/LiveCard";
import useMqtt from "@renderer/utils/hooks/useMqtt";
import { useParams } from "react-router-dom";

const SenseLogId = () => {
  const { comId, mcCd } = useParams<{ comId: string; mcCd: string }>();

  if (!comId || !mcCd) {
    return <div>Error: Parameter `comId` atau `mcCd` tidak ditemukan.</div>;
  }

  const topicKey = `qSense/Pub/${comId}/${mcCd}`;
  const topics = [topicKey];
  const { messages } = useMqtt(topics);

  // Extract and parse the payload
  const topicData = messages[topicKey];
  const parsedMessage = topicData ? JSON.parse(topicData.payload) : null;

  return (
    <div>
      <LiveCard comId={comId} mcCd={mcCd} parsedMessage={parsedMessage} />
      {/* <DowntimesChartId comId={comId} mcCd={mcCd} /> */}
    </div>
  );
};

export default SenseLogId;
