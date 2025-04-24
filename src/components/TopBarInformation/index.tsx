import { Card, Flex, Text } from "@radix-ui/themes";
import { Clock } from "../Clock";

interface TopBarInformationProps {
  title: string;
}

const TopBarInformation: React.FC<TopBarInformationProps> = (props) => {
  const { title } = props;
  return (
    <Flex direction="column" gap="3" justify="start">
      <Card mb="4">
        <Flex justify="between">
          <Text as="p" size="3" style={{ width: "10%" }}>
            Maria Silva
          </Text>
          <Text
            as="p"
            size="3"
            weight="medium"
            style={{ color: "var(--accent-indicator)" }}
          >
            {title.toUpperCase()}
          </Text>
          <Clock style={{ width: "10%", textAlign: "right" }} />
        </Flex>
      </Card>
    </Flex>
  );
};

export { TopBarInformation };
