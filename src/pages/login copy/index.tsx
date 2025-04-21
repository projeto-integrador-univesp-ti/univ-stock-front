import { EnterIcon } from "@radix-ui/react-icons";
import { Button, Card, Flex, Link, Text, TextField } from "@radix-ui/themes";
import { BackgroundImage } from "../../utils/BackgroundImage";

const Login = () => (
  <>
    <Flex
      direction="column"
      minHeight="100vh"
      overflow="hidden"
      position="relative"
    >
      <Flex inset="0" align="start" justify="center" position="absolute">
          <BackgroundImage   />
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
          <Text as="p" color="gray" size="4" weight="bold">
            Mini Stock
          </Text>

          <Flex direction="column" gap="1" mt="3">
            <Text as="label" htmlFor="email" color="gray" size="2">
              E-mail
            </Text>
            <TextField.Root
              id="email"
              placeholder="Digite seu e-mail"
              type="email"
            />
          </Flex>

          <Flex direction="column" gap="1" mt="3" mb="5">
            <Flex justify="between">
              <Text as="label" htmlFor="password" color="gray" size="2">
                Senha
              </Text>
              <Link href="#" color="indigo" underline="none" size="2">
                Esqueci a senha
              </Link>
            </Flex>

            <TextField.Root
              id="password"
              placeholder="Digite sua senha"
              type="password"
            />
          </Flex>

          <Button variant="solid" style={{ width: "100%" }}>
            Entrar <EnterIcon />
          </Button>
        </Card>
      </Flex>
    </Flex>
  </>
);

export { Login };
