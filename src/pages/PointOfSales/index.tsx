import { CheckIcon, DownloadIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Kbd,
  ScrollArea,
  Separator,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { ScrollLine } from "../../components/ScrollLine";
import { TopBarInformation } from "../../components/TopBarInformation";
import { formatBRLCurrencytoNumber, formatToBRLCurrency, normalizeDecimal } from "../../utils/formatCurrency";

const PointOfSales: React.FC = () => {
  const produto = { name: "Leite Parmalat", qtd: "1,000", preco: "4,99" };
  const produtos: (typeof produto)[] = Array(10).fill(produto);
  
  const [open, setOpen] = useState(false);
  const [subtotal] = useState("10,00");
  const [valorPago, setValorPago] = useState("");

  const trocoMemo = useMemo(() => {
    return (
      Math.round(
        (formatBRLCurrencytoNumber(valorPago) -
          formatBRLCurrencytoNumber(subtotal)) *
          100
      ) / 100
    );
  }, [subtotal, valorPago]);


  const openFinishSale = () => {
    setValorPago('')
    setOpen(true);
  }

  const closeFinishSale = () => { 
    setOpen(false);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        openFinishSale()
      }
      if (e.key.toLowerCase() === "escape") {
        e.preventDefault();
        closeFinishSale()
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Dialog.Root open={open}>
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

          <Grid columns={{ initial: "1", sm: "2" }} height="40%" gap="4">
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
                <Dialog.Trigger>
                  <Button variant="solid" color="red" onClick={openFinishSale}>
                    Finalizar compra <CheckIcon />
                  </Button>
                </Dialog.Trigger>
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
                  <Text size="9">R$ {subtotal}</Text>
                </Flex>
              </Card>
            </Grid>
          </Grid>
        </Flex>

        <Dialog.Content
          size="4"
          align="center"
          maxWidth="500px"
          height="100vh"
          maxHeight="530px"
        >
          <Dialog.Title mb="4">Finalização de compra</Dialog.Title>

          <Flex direction="column" gap="4">
            <Flex direction="column">
              <Text as="div" size="3" weight="bold">
                VALOR PAGO (ENTRADA)
              </Text>
              <TextField.Root
                type="text"
                maxLength={12}
                value={valorPago}
                style={{
                  height: "80px",
                  fontSize: "50px",
                  textAlign: "end",
                }}
                placeholder="0,00"
                onChange={(e) =>
                  setValorPago(formatToBRLCurrency(e.target.value))
                }
              >
                <TextField.Slot style={{ fontSize: "32px" }}>R$</TextField.Slot>
              </TextField.Root>
            </Flex>

            <Flex direction="column">
              <Text as="div" size="2" mb="1" weight="bold">
                VALOR PENDENTE
              </Text>
              <TextField.Root
                type="text"
                color={trocoMemo < 0 ? "red" : 'lime'}
                variant='soft'
                value={normalizeDecimal(
                  trocoMemo > 0 ? "0" : Math.abs(trocoMemo).toString()
                )}
                style={{
                  pointerEvents: "none",
                  height: "80px",
                  fontSize: "50px",
                  textAlign: "end",
                }}
              >
                <TextField.Slot style={{ fontSize: "32px" }}>R$</TextField.Slot>
              </TextField.Root>
            </Flex>

            <Flex direction="column">
              <Text as="div" size="2" mb="1" weight="bold">
                TROCO (SAÍDA)
              </Text>
              <TextField.Root
                color={trocoMemo > 0 ? "red" : 'lime'}
                variant='soft'
                type="text"
                value={normalizeDecimal(
                  trocoMemo < 0 ? "0" : trocoMemo.toString()
                )}
                style={{
                  pointerEvents: "none",
                  height: "80px",
                  fontSize: "50px",
                  textAlign: "end",
                }}
              >
                <TextField.Slot style={{ fontSize: "32px" }}>R$</TextField.Slot>
              </TextField.Root>
            </Flex>
          </Flex>

          <Flex gap="3" mt="8" justify="end">
            <Dialog.Close>
              <Button variant="surface" color="gray" onClick={closeFinishSale}>
                Cancelar
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button variant="solid"  disabled={trocoMemo < 0} onClick={closeFinishSale}>
                Finalizar compra <CheckIcon />
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default PointOfSales;
