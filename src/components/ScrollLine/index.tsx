import { Flex } from "@radix-ui/themes";
import React, { CSSProperties, ReactNode } from "react";

interface ProductLineExpiringProps {
  children: ReactNode;
  index?: number;
  oddColor?: string;
  evenColor?: string;
  style?: CSSProperties;
}

const ScrollLine: React.FC<ProductLineExpiringProps> = (props) => {
  const {
    index = 0,
    children,
    oddColor,
    evenColor,
    style = {}
  } = props;

  const background =
    index % 2 === 0
      ? oddColor ?? "var(--gray-5)"
      : evenColor ?? "var(--accent-indicator)";

  return (
    <Flex
      justify="between"
      align="center"
      py="1"
      px="2"
      flexGrow="1"
      style={{ background, borderRadius: "var(--radius-4)", ...style }}
    >
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>{child}</React.Fragment>
      ))}
    </Flex>
  );
};

export { ScrollLine };

