import { EnterIcon } from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Dialog,
  Flex,
  Link,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { Path } from "../../router";
import { BackgroundImage } from "../../utils/BackgroundImage";
import { SyntheticEvent, useState } from "react";
import { Form } from "radix-ui";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);

  const redirect = () => navigate(Path.Dashboard);

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { usuario = "", senha = "" } = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as { usuario: string; senha: string };

    if (
      usuario?.trim?.() === import.meta.env.VITE_USER_LOGIN &&
      senha?.trim?.() === import.meta.env.VITE_PASS_LOGIN
    ) {
      redirect();
    } else {
      setErrorLogin(true);
      setTimeout(() => {
        setErrorLogin(false);
      }, 10000);
    }
  };

  return (
    <Flex
      direction="column"
      minHeight="100vh"
      overflow="hidden"
      position="relative"
    >
      <Form.Root
        name="login"
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "1rem",
          gap: "1rem",
        }}
        onSubmit={submit}
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
            <Text as="p" color="gray" size="4" weight="bold">
              Mini Stock
            </Text>

            <Flex direction="column" gap="1" mt="3">
              <Text as="label" htmlFor="user" color="gray" size="2">
                Usuário
              </Text>
              <TextField.Root
                id="user"
                name="usuario"
                placeholder="Digite seu usuario"
                type="text"
              />
            </Flex>

            <Flex direction="column" gap="1" mt="3" mb="5">
              <Flex justify="between">
                <Text as="label" htmlFor="password" color="gray" size="2">
                  Senha
                </Text>
                <Link
                  href="#"
                  underline="none"
                  size="2"
                  onClick={() => setResetOpen(true)}
                >
                  Esqueci a senha
                </Link>
              </Flex>

              <TextField.Root
                id="password"
                name="senha"
                placeholder="Digite sua senha"
                type="password"
              />
            </Flex>

            <Form.Submit asChild>
              <Button variant="solid" style={{ width: "100%" }}>
                Entrar <EnterIcon />
              </Button>
            </Form.Submit>

            <Text as="p" size="1" mt="2" color="ruby" style={{ height: 20 }}>
              {errorLogin && "Não foi possível entrar, tente novamente!"}
            </Text>
          </Card>
        </Flex>

        <Dialog.Root open={resetOpen}>
          <Dialog.Content maxWidth="350px">
            <Dialog.Title>
              <Flex justify="between">Esqueci a senha</Flex>
            </Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Para redefinição de senha, entre em contato com o administrador do
              sistema.
            </Dialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button
                  variant="soft"
                  style={{ width: "100%" }}
                  onClick={() => setResetOpen(false)}
                >
                  Fechar
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Form.Root>
    </Flex>
  );
};
export default Login;
