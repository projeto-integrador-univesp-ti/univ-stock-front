import {
  ArchiveIcon,
  ArrowLeftIcon,
  ExitIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { Path } from "../../router";
import { useGlobalContext } from "../../contexts/GlobalContext";

const TopBarSite: React.FC = () => {
  const navigate = useNavigate();
  const redirectLogin = () => navigate(Path.Login);
  const redirectSettings = () => navigate(Path.Settings);

  const { appearance } = useGlobalContext();

  return (
    <Flex
      p="4"
      height="64px"
      align="center"
      justify="between"
      style={{ boxSizing: "border-box", boxShadow: `var(--shadow-${appearance === 'dark' ? 2 : 1})` }}
    >
      <Flex gap="3" align="center">
        {location.pathname !== Path.Dashboard && (
          <Button
            mr="2"
            size="3"
            variant="ghost"
            style={{ padding: 6 }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon width="15" height="15" />
          </Button>
        )}
        <ArchiveIcon
          width="20"
          height="20"
          color={appearance === "dark" ? "white" : "black"}
        />
        <Text weight="bold" size="4">
          Mini Stock
        </Text>
      </Flex>

      <Flex gap="4" align="center">
        <Button
          variant="ghost"
          size="2"
          style={{ padding: 6 }}
          onClick={redirectSettings}
        >
          Configurações
          <GearIcon width="15" height="15" />
        </Button>
        <Button
          variant="solid"
          style={{ fontSize: 14 }}
          onClick={redirectLogin}
        >
          Sair
          <ExitIcon width="15" height="15" />
        </Button>
      </Flex>
    </Flex>
  );
};

export { TopBarSite };
