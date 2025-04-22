import { Container, Flex, Text } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import { TopBar } from "../../components/TopBar";

const PrincipalTemplate: React.FC = () => {
  return (
    <Flex direction="column" minHeight="100vh">
      <TopBar />
      <Container size="4">
        <Outlet />
      </Container>
      <Text as="p" size="1" color="gray" style={{ padding: "var(--space-3)" }}>
        Sistema gestor de estoque @ 2025
      </Text>
    </Flex>
  );
};

export { PrincipalTemplate };
