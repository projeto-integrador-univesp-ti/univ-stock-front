import { ValueNoneIcon } from "@radix-ui/react-icons";
import {
    Box,
    Button,
    Card,
    Flex,
    Grid,
    Heading,
    ScrollArea,
    SegmentedControl,
    Text,
} from "@radix-ui/themes";
import { useState } from "react";
import { Clock } from "../../components/Clock";
import { ScrollLine } from "../../components/ScrollLine";

enum DueDate {
  WEEK = "week",
  MONTH = "month",
}

const Dashboard: React.FC = () => {
  const [dueDate, setDueDate] = useState(DueDate.WEEK);
  return (
    <>
      <Card mb="4">
        <Flex justify="between">
          <Text as="p" size="3">
            Maria Silva
          </Text>
          <Text as="p" size="3">
            Último acesso: 20/04/2025 - 10:35
          </Text>
          <Clock />
        </Flex>
      </Card>

      <Grid
        columns="2"
        gap="4"
        mb="4"
        style={{ height: "100%", alignItems: "stretch" }}
      >
        <Grid rows="2" gap="4" style={{ height: "100%" }}>
          {/* PDV */}
          <Card>
            <Flex direction="column" gap="5" height="100%">
              <Box>
                <Heading size="2">PDV</Heading>
                <Text as="div" color="gray" size="2">
                  Registre sua venda de produtos para atualizar automaticamente
                  o estoque
                </Text>
              </Box>
              <Button style={{ width: "max-content" }}>Acessar PDV</Button>
            </Flex>
          </Card>

          {/* Gestão de produtos */}
          <Card>
            <Flex direction="column" gap="5" height="100%">
              <Box>
                <Heading size="2">Gestão de produtos</Heading>
                <Text as="div" color="gray" size="2">
                  Adicione, edite ou exclua produtos para manter seu estoque
                  atualizado
                </Text>
              </Box>
              <Button style={{ width: "max-content" }}>
                Acessar gestão de produtos
              </Button>
            </Flex>
          </Card>
        </Grid>

        {/* Alerta de vencimento */}
        <Card>
          <Flex justify="between" align="center" mb="3">
            <Heading size="2">Produtos próximos a vencer</Heading>
            <SegmentedControl.Root
              defaultValue={DueDate.WEEK}
              onValueChange={(value: DueDate) => setDueDate(value)}
            >
              <SegmentedControl.Item value={DueDate.WEEK}>
                Esta semana
              </SegmentedControl.Item>
              <SegmentedControl.Item value={DueDate.MONTH}>
                Este mês
              </SegmentedControl.Item>
            </SegmentedControl.Root>
          </Flex>
          <ScrollArea type="auto" scrollbars="vertical" style={{ height: 300 }}>
            {dueDate === DueDate.WEEK && (
              <Flex
                gap="2"
                direction="column"
                height="100%"
                align="center"
                justify="center"
              >
                <ValueNoneIcon width="25" height="25" color="gray" />
                <Text as="p" size="3" color="gray">
                  Sem produtos a vencer encontrados!
                </Text>
              </Flex>
            )}

            {dueDate === DueDate.MONTH && (
              <Flex direction="column" py="2" pr="3" gap="2">
                {Array(10)
                  .fill({ name: "Leite Parmalat", dueDate: "30/04/2025" })
                  .map((item, index) => {
                    return (
                      <ScrollLine
                        key={index}
                        index={index}
                        left={item.name}
                        right={item.dueDate}
                      />
                    );
                  })}
              </Flex>
            )}
          </ScrollArea>
        </Card>
      </Grid>

      {/* Alertas gerais */}
      <Card mb="5">
        <Flex justify="between" align="center" mb="3">
          <Heading size="2">Alertas gerais</Heading>
        </Flex>
        <ScrollArea type="auto" scrollbars="vertical" style={{ height: 100 }}>
          <Flex
            gap="2"
            direction="column"
            height="100%"
            align="center"
            justify="center"
          >
            <ValueNoneIcon width="25" height="25" color="gray" />
            <Text as="p" size="3" color="gray">
              Sem novos alertas!
            </Text>
          </Flex>
        </ScrollArea>
      </Card>
    </>
  );
};

export default Dashboard;
