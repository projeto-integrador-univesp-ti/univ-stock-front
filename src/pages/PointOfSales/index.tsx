import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Kbd,
  ScrollArea,
  Separator,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { TopBarInformation } from "../../components/TopBarInformation";
import { ScrollLine } from "../../components/ScrollLine";
import { CheckIcon, DownloadIcon } from "@radix-ui/react-icons";

const PointOfSales: React.FC = () => {
  const produto = { name: "Leite Parmalat", qtd: "1,000", preco: "4,99" };
  const produtos: (typeof produto)[] = Array(10).fill(produto);
  return (
    <Flex direction="column" gap="4" height="100%">
      <TopBarInformation title="Ponto de Venda" />

      <Card style={{ height: "60%" }}>
        <Flex direction="row" ml="36px" align="center">
          <ScrollLine
            oddColor=""
            evenColor=""
            style={{ background: "var(--slate-5)" }}
          >
            <Text weight="medium">PRODUTO</Text>
            <Flex gap="8">
              <Text
                weight="medium"
                style={{ textAlign: "right", width: "150px" }}
              >
                QUANTIDADE
              </Text>
              <Text
                weight="medium"
                style={{ textAlign: "right", width: "120px" }}
              >
                PREÇO UNID.
              </Text>
            </Flex>
          </ScrollLine>
        </Flex>

        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "calc(100% - 36px)" }}
        >
          <Flex direction="column" py="2" pr="3" gap="2">
            {produtos.map((item, index) => {
              return (
                <Flex direction="row" align="center" gap="2" key={index}>
                  <Box width="30px">
                    <Text as="p" size="3">
                      {(index + 1).toString().padStart(3, "000")}
                    </Text>
                  </Box>
                  <ScrollLine oddColor="" evenColor="" index={index}>
                    <Text weight="regular">{item.name}</Text>
                    <Flex gap="8">
                      <Text
                        weight="regular"
                        style={{ textAlign: "right", width: "150px" }}
                      >
                        {item.qtd}
                      </Text>
                      <Text
                        weight="regular"
                        style={{ textAlign: "right", width: "120px" }}
                      >
                        {item.preco}
                      </Text>
                    </Flex>
                  </ScrollLine>
                </Flex>
              );
            })}
          </Flex>
        </ScrollArea>
      </Card>

      <Grid columns={{ initial: "1", sm: "2" }}  height="40%" gap="4">
        <Card>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Text size="3">Impressão da nota resumo</Text>
              <Tooltip content='Aperte a tecla "P" para imprimir resumo de compra'>
                <Kbd>P</Kbd>
              </Tooltip>
            </Flex>
            <Button variant="solid">
              Imprimir <DownloadIcon />
            </Button>
          </Flex>
          <Separator size="4" my="9" />
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Text size="3">Finalização da compra</Text>
              <Tooltip content='Aperte a tecla "F" para finalizar a compra'>
                <Kbd>F</Kbd>
              </Tooltip>
            </Flex>
            <Button variant="solid" color="red">
              Finalizar compra <CheckIcon />
            </Button>
          </Flex>
        </Card>

        <Grid columns="1" rows="2" gap="4">
          <Card>
            <Flex direction="column" gap="4">
              <Flex justify="between" align="center">
                <Text size="5">DESCONTO</Text>
                <Tooltip content='Aperte a tecla "D" para aplicar um desconto'>
                  <Kbd>D</Kbd>
                </Tooltip>
              </Flex>
              <Text size="9">R$ 0,00</Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="4">
              <Text size="5">SUBTOTAL</Text>
              <Text size="9">R$ 0,00</Text>
            </Flex>
          </Card>
        </Grid>
      </Grid>
    </Flex>
  );
};

export default PointOfSales;
