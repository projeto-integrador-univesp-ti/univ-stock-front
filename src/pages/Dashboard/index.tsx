import { ValueNoneIcon } from "@radix-ui/react-icons";
import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  ScrollArea,
  SegmentedControl,
  Text,
} from "@radix-ui/themes";
import React, { useState } from "react";
import { ScrollLine } from "../../components/ScrollLine";
import { TopBarInformation } from "../../components/TopBarInformation";

enum DueDate {
  WEEK = "week",
  MONTH = "month",
}

const Dashboard2: React.FC = () => {
  const [dueDate, setDueDate] = useState(DueDate.WEEK);
  return (
    <Flex direction="column" gap="4" height="100%">
      <TopBarInformation title="Dashboard" />

      <Grid gap="4" columns={{ initial: "1" }}>
        <Card>
          <Flex justify="between" align="center" mb="3">
            <Heading as="h2" size="2">Produtos próximos a vencer</Heading>
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
                {Array(1)
                  .fill({ name: "Leite Parmalat 1L", dueDate: "30/05/2025" })
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

        <Card>
          <Flex justify="between" align="center" mb="3">
            <Heading as="h2" size="2">Produtos com estoque baixo</Heading>
          </Flex>
          <ScrollArea type="auto" scrollbars="vertical" style={{ height: 200 }}>
            <Flex
              gap="2"
              direction="column"
              height="100%"
              align="center"
              justify="center"
            >
              <ValueNoneIcon width="25" height="25" color="gray" />
              <Text as="p" size="3" color="gray">
                Sem produtos com estoque baixo!
              </Text>
            </Flex>
          </ScrollArea>
        </Card>
      </Grid>
    </Flex>
  );
};

export default Dashboard2;
