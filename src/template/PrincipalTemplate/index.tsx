import { Container, Flex } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import { TopBarSite } from "../../components/TopBarSite";

const PrincipalTemplate: React.FC = () => {
  return (
    <Flex direction="column" style={{minHeight: '100vh', height: 'calc(100vh - 60px)'}}>
      <TopBarSite />
      <Container
        p="4"
        mb='2'
        size="4"
        style={{ background: "var(--sand-2)", minHeight:'calc(100vh - 60px)' }}
      >
        <Outlet />
      </Container>
      {/* <Box style={{ height: "20px", width: '100vw', position: 'absolute', bottom: 0 }}>
        <Text
          as="p"
          size='1'
          color="gray"
          style={{ height:'20px', padding: "0 var(--space-3)" }}
        >
          Sistema gestor de estoque @ 2025
        </Text>
      </Box> */}
    </Flex>
  );
};

export default PrincipalTemplate;
