import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { BackgroundImage } from "../../utils/BackgroundImage";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const redirect = () => navigate("/");

  return (
    <Flex
      direction="column"
      minHeight="100vh"
      overflow="hidden"
      position="relative"
    >
      <Flex inset="0" align="start" justify="center" position="absolute">
        <BackgroundImage />
      </Flex>
      <Flex
        position="relative"
        justify="center"
        align="center"
        height="100vh"
        width="100vw"
      >
        <Card
          variant="surface"
          size="3"
          style={{ width: "100%", maxWidth: "320px" }}
        >
          <Flex direction="column" align="center" gap="3">
            <Text as="p" color="gray" size="4" weight="bold">
              404 - Página não encontrada
            </Text>
            <Button
              variant="ghost"
              style={{ width: "100%" }}
              onClick={redirect}
            >
              Ir para o início
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};

export default NotFound;
