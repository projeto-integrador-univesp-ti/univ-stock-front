import { Flex, Text } from "@radix-ui/themes";
import React, { ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sizes = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

interface ProductLineExpiringProps {
  index: number;
  children: ReactNode;
  size?: (typeof sizes)[number];
  oddColor?: string;
  evenColor?: string;
}

const ScrollLine: React.FC<ProductLineExpiringProps> = (props) => {
  const { index, children, oddColor, evenColor, size = '3' } = props;

  const background =
    index % 2 === 0
      ? oddColor ?? "var(--accent-5)"
      : evenColor ?? "var(--accent-3)";

  return (
    <Flex
      justify="between"
      align='center'
      py="1"
      px="2"
      flexGrow="1"
      style={{ background, borderRadius: "var(--radius-4)" }}
    >
      {React.Children.map(children, (child, index) => (
        <Text key={index} as="p" size={size}>
          {child}
        </Text>
      ))}
    </Flex>
  );
};

export { ScrollLine };
