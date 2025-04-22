import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";
import { Path } from "../../router";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const redirectLogin = () => navigate(Path.Login);

  return (
    <Flex align="center" justify="between" p="4" mb="5">
      <Text weight="bold" size="5">
        Mini Stock
      </Text>

      <Flex gap="5" align="center">
        <Button variant="ghost" size="3">
          Configurações
          <GearIcon />
        </Button>
        <Button variant="solid" size="2" onClick={redirectLogin}>
          Sair
          <ExitIcon />
        </Button>
      </Flex>
    </Flex>
  );
};

export { TopBar };
