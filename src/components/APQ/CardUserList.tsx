import {
  Badge,
  Card,
  Center,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { EntityPdApqUserDailyProgresInterface } from "@renderer/types";
import { IconArrowDown, IconArrowUp, IconMinus } from "@tabler/icons-react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface CardUserListProps {
  users: EntityPdApqUserDailyProgresInterface[];
}

interface UserCardProps extends EntityPdApqUserDailyProgresInterface {
  rank: number;
}

const trendStyles = {
  up: { color: "green", icon: <IconArrowUp size={16} /> },
  down: { color: "red", icon: <IconArrowDown size={16} /> },
  no_change: { color: "gray", icon: <IconMinus size={16} /> },
};

function UserCard({
  firstname,
  lastname,
  nik,
  avaibility,
  performance,
  quality,
  oee,
  trend,
  change_percent,
  rank,
}: UserCardProps) {
  const { color, icon } = trendStyles[trend] || trendStyles.no_change;

  const abbreviateLastname = (lastname?: string) => {
    if (!lastname) return "";
    const maxLength = 12;
    return lastname.length > maxLength
      ? `${lastname.substring(0, maxLength)}...`
      : lastname;
  };

  return (
    <Card
      padding="sm"
      withBorder
      aria-label={`${firstname} ${lastname} Overview`}
    >
      <Card.Section
        style={{
          backgroundColor: "#f0f8ff",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <Flex justify="flex-start" align="center">
          <Text fw={700} size="lg" color="blue">
            {`${firstname} ${abbreviateLastname(lastname)}`}
          </Text>
        </Flex>

        <Group justify="space-between">
          <Text size="sm" color="dimmed">
            NIK: {nik}
          </Text>
          <Badge
            color="violet"
            style={{ marginTop: 5 }}
            size="sm"
            variant="outline"
          >
            Rank: {rank}
          </Badge>
        </Group>
      </Card.Section>

      <Stack mt="md">
        <Group gap="xs" justify="space-between">
          <Badge color="blue" variant="light">
            A: {avaibility}%
          </Badge>
          <Badge color="green" variant="light">
            P: {performance}%
          </Badge>
          <Badge color="orange" variant="light">
            Q: {quality}%
          </Badge>
        </Group>
        <Center>
          <Text fw={700} size="lg">
            OEE: {Math.round(oee)} %
          </Text>
          <Text fw={600} size="sm" color={color}>
            {icon} {change_percent?.toFixed(2)}%
          </Text>
        </Center>
      </Stack>
    </Card>
  );
}

const CardUserList = ({ users }: CardUserListProps) => {
  const { colorScheme } = useMantineColorScheme();

  if (!users || users.length === 0)
    return <Text size="md">No users to display!</Text>;

  // Sort users by OEE and assign ranks
  const rankedUsers = [...users]
    .sort((a, b) => b.oee - a.oee)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  return (
    <Paper
      shadow="lg"
      radius="lg"
      p="md"
      style={{
        width: "100%",
        border: "1px solid #e0e0e0",
        backgroundColor: colorScheme === "dark" ? "#1A1B1E" : "#f9f9f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Flex justify="center" mb="md" align="center" direction="row">
        <Text
          c="dark"
          size="sm"
          style={{
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "1.2rem",
          }}
        >
          Overview Operator
        </Text>
      </Flex>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={6} // Adjust based on screen size
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        style={{ width: "100%" }}
      >
        {rankedUsers.map((user, index) => (
          <SwiperSlide key={index}>
            <UserCard {...user} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Paper>
  );
};

export default CardUserList;
