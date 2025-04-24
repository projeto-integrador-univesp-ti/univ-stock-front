import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  ScrollArea,
  Text,
} from "@radix-ui/themes";
import { ScrollLine } from "../../components/ScrollLine";
import { TopBarInformation } from "../../components/TopBarInformation";

const PointOfSales: React.FC = () => {
  const produto = { name: "Leite Parmalat", qtd: "1,000", preco: "4,99" };
  const produtos: (typeof produto)[] = [
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
    produto,
  ];

  const cardValue = (title: string, value: string) => {
    return (
      <Card>
        <Flex direction="column" gap="3">
          <Text
            as="p"
            size="4"
            weight="medium"
            style={{
              background: "var(--accent-7)",
              borderRadius: "var(--radius-4)",
              padding: "var(--space-1) var(--space-2)",
            }}
          >
            {title.toUpperCase()}
          </Text>
          <Text
            as="p"
            size="9"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>R$</span> <span>{value}</span>
          </Text>
        </Flex>
      </Card>
    );
  };

  return (
    <Flex direction="column">
      <TopBarInformation title="Ponto de Venda" />
      <Grid
        gap="4"
        columns={{ initial: "1fr", sm: "320px 1fr" }}
        style={{ height: "100%" }}
      >
        <Grid
          columns={{ initial: "repeat(2, 1fr)", sm: "1fr" }}
          gap={{ initial: "4", sm: "9" }}
        >
          {cardValue("Subtotal", "0,00")}
          {cardValue("Desconto", "0,00")}
          {cardValue("Total recebido", "0,00")}
          {cardValue("Troco", "0,00")}
        </Grid>

        <Card>
          <Flex direction="row" align="center" gap="2">
            <Box width="30px" />
            <ScrollLine oddColor="" evenColor="" index={0}>
              <Box maxWidth="100%">
                <Text as="p" weight="bold" size="6">
                  Produto
                </Text>
              </Box>
              <Flex gap="8">
                <Box width="150px" style={{ textAlign: "right" }}>
                  <Text as="p" weight="bold" size="6">
                    Quantidade
                  </Text>
                </Box>
                <Box width="130px" style={{ textAlign: "right" }}>
                  <Text as="p" weight="bold" size="6">
                    Preço Un.
                  </Text>
                </Box>
              </Flex>
            </ScrollLine>
          </Flex>
          <ScrollArea
            type="always"
            scrollbars="vertical"
            style={{ height: "calc(100vh - 33 0px)", background: "" }}
          >
            <Box px="2">
              <Flex direction="column" py="2" pr="3" gap="2">
                {produtos.map((item, index) => {
                  return (
                    <Flex direction="row" align="center" gap="2">
                      <Box width="30px">
                        <Text as="p" size="3">
                          {(index + 1).toString().padStart(3, "000")}
                        </Text>
                      </Box>
                      <ScrollLine
                        size="6"
                        oddColor=""
                        evenColor=""
                        key={index}
                        index={index}
                      >
                        <Box maxWidth="100%">{item.name}</Box>
                        <Flex gap="8">
                          <Box width="150px" style={{ textAlign: "right" }}>
                            {item.qtd}
                          </Box>
                          <Box width="130px" style={{ textAlign: "right" }}>
                            {item.preco}
                          </Box>
                        </Flex>
                      </ScrollLine>
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          </ScrollArea>
          <Card>
            <Flex justify="between">
              <Text>
                Itens totais: 27
              </Text>
              <Button>Finalizar venda</Button>
            </Flex>
          </Card>
        </Card>
      </Grid>
    </Flex>
  );
};

export default PointOfSales;
