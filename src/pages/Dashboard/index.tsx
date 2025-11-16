import { ValueNoneIcon } from "@radix-ui/react-icons";
import {
  Card,
  Flex,
  Grid,
  Heading,
  ScrollArea,
  SegmentedControl,
  Spinner,
  Text,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { ScrollLine } from "../../components/ScrollLine";
import { TopBarInformation } from "../../components/TopBarInformation";
import { BatchService, ExpiringBatches } from "../../service/BatchService";

enum DueDate {
  WEEK = "semana",
  MONTH = "mes",
}

const Dashboard: React.FC = () => {
  const [dueDate, setDueDate] = useState(DueDate.WEEK);
  const [loadingDash, setLoadingDash] = useState<boolean>(false);
  const [expiringBatches, setExpiringBatches] = useState<ExpiringBatches>({
    semana: [],
    mes: [],
    estoqueBaixo: [],
  });

  const initDashboard = async () => {
    try {
      setLoadingDash(true);
      const resp = await BatchService.getExpiring();
      console.log(resp);
      setExpiringBatches(resp);
    } finally {
      setLoadingDash(false);
    }
  };

  useEffect(() => {
    initDashboard();
  }, []);

  return (
    <Flex direction="column" gap="4" height="100%">
      <TopBarInformation title="Dashboard" />

      <Grid gap="4" columns={{ initial: "1" }}>
        <Card>
          <Flex justify="between" align="center" mb="3">
            <Heading as="h2" size="2">
              Produtos próximos a vencer
            </Heading>
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
          <ScrollArea type="auto" scrollbars="vertical" style={{ height: 200 }}>
            <Flex direction="column" py="2" pr="3" gap="2">
              {loadingDash && (
                <Flex justify="center" p="4">
                  <Spinner size="3" />
                </Flex>
              )}
              {expiringBatches[dueDate].map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Flex justify="between">
                      <Text as="p" weight="bold" size="1" style={{ flex: 1 }}>
                        Produto
                      </Text>
                      <Text as="p" weight="bold" size="1" style={{ flex: 1 }}>
                        Código do Lote
                      </Text>
                      <Text as="p" weight="bold" size="1" style={{ flex: 1 }}>
                        Quantidade
                      </Text>
                      <Text as="p" weight="bold" size="1" style={{ flex: 1 }}>
                        Data Venc. Lote
                      </Text>
                    </Flex>
                    <ScrollLine key={index} index={index}>
                      <Text as="p" size="2" style={{ flex: 1 }}>
                        {item.nome}
                      </Text>
                      <Text as="p" size="2" style={{ flex: 1 }}>
                        {item.lote}
                      </Text>
                      <Text as="p" size="2" style={{ flex: 1 }}>
                        {item.quantidade}
                      </Text>
                      <Text as="p" size="2" style={{ flex: 1 }}>
                        {item.data}
                      </Text>
                    </ScrollLine>
                  </React.Fragment>
                );
              })}
            </Flex>

            {!loadingDash && expiringBatches[dueDate].length === 0 && (
              <Flex
                gap="2"
                direction="column"
                height="100%"
                align="center"
                justify="center"
              >
                <ValueNoneIcon width="25" height="25" color="gray" />
                <Text as="p" size="3" color="gray">
                  Sem produtos próximos a vencer&nbsp;
                  {dueDate === DueDate.WEEK ? "essa semana" : "esse mês"}!
                </Text>
              </Flex>
            )}
          </ScrollArea>
        </Card>

        <Card>
          <Flex justify="between" align="center" mb="3">
            <Heading as="h2" size="2">
              Produtos com estoque baixo
            </Heading>
          </Flex>
          <ScrollArea type="auto" scrollbars="vertical" style={{ height: 200 }}>
            <Flex direction="column" py="2" pr="3" gap="2">
              {loadingDash && (
                <Flex justify="center" p="4">
                  <Spinner size="3" />
                </Flex>
              )}
              {expiringBatches.estoqueBaixo.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Flex justify="between">
                      <Text as="p" weight="bold" size="1" style={{ flex: 1 }}>
                        Produto
                      </Text>
                      <Text as="p" weight="bold" size="1" style={{ flex: 1 }}>
                        Quantidade mínima
                      </Text>
                      <Text as="p" weight="bold" size="1" style={{ flex: 1 }}>
                        Quantidade em estoque
                      </Text> 
                    </Flex>
                    <ScrollLine key={index} index={index}>
                      <Text as="p" size="2" style={{ flex: 1 }}>
                        {item.nome}
                      </Text>
                      <Text as="p" size="2" style={{ flex: 1 }}>
                        {item.minimo}
                      </Text>
                      <Text as="p" size="2" style={{ flex: 1 }}>
                        {item.quantidade}
                      </Text>
                    </ScrollLine>
                  </React.Fragment>
                );
              })}
            </Flex>

            {!loadingDash && expiringBatches.estoqueBaixo.length === 0 && (
              <Flex
                gap="2"
                direction="column"
                height="100%"
                align="center"
                justify="center"
              >
                <ValueNoneIcon width="25" height="25" color="gray" />
                <Text as="p" size="3" color="gray">
                  Sem produtos com estoque mínimo!
                </Text>
              </Flex>
            )}
          </ScrollArea>
        </Card>
      </Grid>
    </Flex>
  );
};

export default Dashboard;
