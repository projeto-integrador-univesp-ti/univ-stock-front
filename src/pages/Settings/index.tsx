import {
  Button,
  Card,
  Flex,
  Heading,
  RadioCards
} from "@radix-ui/themes";
import {
  AccentColors,
  Appearances,
  Scalings,
  useGlobalContext,
} from "../../contexts/GlobalContext";

const Settings = () => {
  const {
    appearance,
    setAppearance,
    scaling,
    setScalign,
    accentColors,
    setAccentColors,
  } = useGlobalContext();

  const appearanceName = {
    [Appearances[0]]: "Claro",
    [Appearances[1]]: "Escuro",
  };

  const reset = () => {
    setAppearance("dark");
    setAccentColors("iris");
    setScalign("100%");
  };

  return (
    <Flex direction="column" gap="4">
      <Card>
        <Flex direction="column" gap="4">
          <Heading as="h2" size="4">
            Aparência
          </Heading>
          <RadioCards.Root
            columns={{ initial: "2", sm: "4", md: "6" }}
            value={appearance}
            defaultValue={appearance}
            onValueChange={setAppearance}
          >
            {Appearances.map((item) => (
              <RadioCards.Item value={item}>
                {appearanceName[item]}
              </RadioCards.Item>
            ))}
          </RadioCards.Root>
        </Flex>
      </Card>

      <Card>
        <Flex direction="column" gap="4">
          <Heading as="h2" size="4">
            Escala (Zoom)
          </Heading>
          <RadioCards.Root
            columns={{ initial: "2", sm: "4", md: "6" }}
            value={scaling}
            defaultValue={scaling}
            onValueChange={setScalign}
          >
            {Scalings.map((item) => (
              <RadioCards.Item value={item}>{item}</RadioCards.Item>
            ))}
          </RadioCards.Root>
        </Flex>
      </Card>

      <Card>
        <Flex direction="column" gap="4">
          <Heading as="h2" size="4">
            Transparência (Zoom)
          </Heading>
          <RadioCards.Root
            columns={{ initial: "2", sm: "4", md: "6" }}
            value={accentColors}
            defaultValue={accentColors}
            onValueChange={setAccentColors}
          >
            {AccentColors.map((item) => (
              <RadioCards.Item value={item}>
                <div
                  style={{
                    background: `var(--${item}-indicator)`,
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                  }}
                ></div>
                {`${item.charAt(0).toUpperCase()}${item.slice(1)}`}
              </RadioCards.Item>
            ))}
          </RadioCards.Root>
        </Flex>
      </Card>

      <Flex justify="center" mt="9">
        <Button variant="ghost" onClick={reset}>
          Resetar para padrão
        </Button>
      </Flex>
    </Flex>
  );
};

export { Settings };

