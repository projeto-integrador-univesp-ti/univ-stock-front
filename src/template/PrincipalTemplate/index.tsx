import { Container, Flex, Text } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import { TopBarSite } from "../../components/TopBarSite";

const PrincipalTemplate: React.FC = () => {
  return (
    <Flex direction="column" minHeight="100vh">
      <TopBarSite />
      <Container
        p="4"
        size="4"
        height={{ initial: "calc(100vh - 136px)" }}
        style={{ background: "var(--sand-2)" }}
      >
        <Outlet />
      </Container>
      <Flex style={{ height: "40px" }}>
        <Text
          as="p"
          size="1"
          color="gray"
          style={{ padding: "var(--space-3)" }}
        >
          Sistema gestor de estoque @ 2025
        </Text>
      </Flex>
    </Flex>
  );
};

export default PrincipalTemplate;
