import { Flex, Text } from "@radix-ui/themes";
import { ReactNode } from "react";

interface ProductLineExpiringProps {
  index: number;
  left: ReactNode;
  right: ReactNode;
}

const ScrollLine: React.FC<ProductLineExpiringProps> = (props) => {
  const { index, left, right } = props;
  return (
    <Flex
      justify="between"
      py="1"
      px="2"
      style={{
        borderRadius: "var(--radius-4)",
        background: `var(--accent-${index % 2 === 0 ? 5 : 3})`,
      }}
    >
      <Text as="p" size="3">
        {left}
      </Text>

      <Text as="p" size="3">
        {right}
      </Text>
    </Flex>
  );
};

export { ScrollLine };
