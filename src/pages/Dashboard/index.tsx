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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollLine } from "../../components/ScrollLine";
import { TopBarInformation } from "../../components/TopBarInformation";
import { Path } from "../../router";

enum DueDate {
  WEEK = "week",
  MONTH = "month",
}

const Dashboard2: React.FC = () => {
  const navigate = useNavigate();
  const redirectProduct = () => navigate(Path.ProductManagement);
  const redirectPDV = () => navigate(Path.PointOfSale);

  const [dueDate, setDueDate] = useState(DueDate.WEEK);
  return (
    <Flex direction="column" gap="4" height="100%">
      <TopBarInformation title="Dashboard" />

      <Grid gap="4" columns={{ initial: "1", md: "2" }}>
        <Grid
          gap="4"
          height="100%"
          columns={{ initial: "1", sm: "2", md: "1" }}
          rows={{ initial: "1", sm: "1", md: "2" }}
        >
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
              <Button style={{ width: "max-content" }} onClick={redirectPDV}>
                Acessar PDV
              </Button>
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
              <Button
                style={{ width: "max-content" }}
                onClick={redirectProduct}
              >
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
                      <React.Fragment key={index}>
                        <ScrollLine key={index} index={index}>
                          <Box>{item.name}</Box>
                          <Box>{item.dueDate}</Box>
                        </ScrollLine>
                      </React.Fragment>
                    );
                  })}
              </Flex>
            )}
          </ScrollArea>
        </Card>
      </Grid>

      {/* Alertas gerais */}
      <Card>
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
    </Flex>
  );
};

export default Dashboard2;
