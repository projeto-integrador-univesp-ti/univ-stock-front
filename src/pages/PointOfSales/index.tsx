import { CheckIcon, MinusCircledIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Kbd,
  ScrollArea,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { PurchaseInvoice } from "../../components/PurchaseInvoice";
import { ScrollLine } from "../../components/ScrollLine";
import { TopBarInformation } from "../../components/TopBarInformation";
import { Measure, MeasureService } from "../../service/MeasureService";
import { ProductService } from "../../service/ProductService";
import { SalesService } from "../../service/SalesService";
import {
  formatBRLCurrencytoNumber,
  formatToBRLCurrency,
  normalizeDecimal,
} from "../../utils/formatCurrency";
import { exitFullScreen, fullScreen } from "../../utils/fullScreen";

const PointOfSales: React.FC = () => {
  const [produtos, setProdutos] = useState(
    [] as {
      id: string;
      idMedida: string;
      code: string;
      name: string;
      sigla: string;
      qtd: string;
      preco: string;
    }[]
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [removeActive, setRemoveActive] = useState(false);
  const [openFinish, setOpenFinish] = useState(false);
  const [sucessSale, setSucessSale] = useState(false);
  const [saleId, setSaleId] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [measures, setMeasures] = useState([] as Measure[]);

  const subtotalMemo = useMemo(() => {
    return produtos.reduce((acc, item) => {
      const preco = formatBRLCurrencytoNumber(item?.preco);
      const qtd = formatBRLCurrencytoNumber(item?.qtd);
      return formatToBRLCurrency(
        (formatBRLCurrencytoNumber(acc) + preco * qtd).toFixed(2)
      );
    }, "0,00");
  }, [produtos]);

  const trocoMemo = useMemo(() => {
    return (
      Math.round(
        (formatBRLCurrencytoNumber(valorPago) -
          formatBRLCurrencytoNumber(subtotalMemo)) *
          100
      ) / 100
    );
  }, [subtotalMemo, valorPago]);

  const openFinishSale = () => {
    setValorPago("");
    setOpenFinish(true);
  };

  const cancelFinishSale = () => {
    setSaleId('');
    setSucessSale(false);
    setOpenFinish(false);
  }

  const closeFinishSale = async () => {
    const productsToDecrease = produtos.map((item) => ({
      codigo: item.code,
      quantidade: formatBRLCurrencytoNumber(item.qtd),
    }));
    ProductService.decrease(productsToDecrease);

    const productsToSaveSale = produtos.map((item) => ({
      idProduto: item.id,
      idMedida: Number(item.idMedida),
      quantidade: formatBRLCurrencytoNumber(item.qtd),
      precoUnidade: formatBRLCurrencytoNumber(item.preco),
    }));
    const { idVenda } = await SalesService.saveSale({
      troco: trocoMemo,
      valorPago: formatBRLCurrencytoNumber(valorPago.toString()),
      valorTotal: formatBRLCurrencytoNumber(subtotalMemo.toString()),
      produtos: productsToSaveSale,
    });
    setSaleId(idVenda);
    setSucessSale(true);
    setOpenFinish(false);
  };

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      inputRef.current?.focus();
    }, 3000);
  };

  const addProduct = async (code: string) => {
    const product = await ProductService.getByCode(code);
    setProdutos((prev) => [
      ...prev,
      {
        id: product.id,
        idMedida: product.idMedida.toString(),
        code: product.codigo,
        sigla: measures.find((item) => item.id === product.idMedida)!.sigla,
        name: product.nome,
        qtd: "1,000",
        preco: formatToBRLCurrency(product.precoUnidade.toString()),
      },
    ]);
  };

  const removeProduct = (index: number) => {
    setProdutos((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const newProducts = [...prev.slice(0, index), ...prev.slice(index + 1)];
      if (newProducts.length === 0) {
        setRemoveActive(false);
      }
      return newProducts;
    });
  };

  const updateQuantity = (quantity: number) => {
    setProdutos((prev) => {
      const updatedProdutos = [...prev];
      const lastItem = updatedProdutos[updatedProdutos.length - 1];
      lastItem.qtd = quantity.toFixed(3).replace(".", ",");
      return updatedProdutos;
    });
  };

  const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const value = e.currentTarget.value.trim();

    if (value.startsWith("x")) {
      const quantity = Number(value.slice(1).replace(",", "."));
      if (quantity > 0) {
        updateQuantity(quantity);
      }
    } else if (value) {
      addProduct(value);
    }

    e.currentTarget.value = "";
  };

  const newSale = () => {
    setProdutos([]);
  };

  const onClosePurchaseVoice = () => {
    setSucessSale(false);
    newSale();
  };

  const initiMeasures = async () => {
    const measures = await MeasureService.getAll();
    setMeasures(measures);
  };

  useEffect(() => {
    initiMeasures();
    inputRef.current?.focus();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fullScreen();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        openFinishSale();
      }
      if (e.key.toLowerCase() === "escape") {
        e.preventDefault();
        closeFinishSale();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      exitFullScreen();
    };
  }, []);

  return (
    <>
      <Flex direction="column" gap="4">
        <Dialog.Root open={openFinish}>
          <Grid
            rows="48px 1fr 260px"
            gap="4"
            style={{ height: "calc(100vh - 100px)", background: " " }}
          >
            <TopBarInformation title="Ponto de Venda" />

            <Card>
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
                          {removeActive && (
                            <Button
                              variant="surface"
                              size="1"
                              color="red"
                              onClick={() => removeProduct(index)}
                            >
                              <MinusCircledIcon />
                            </Button>
                          )}
                          {!removeActive && (
                            <Text as="p" size="3">
                              {(index + 1).toString().padStart(3, "000")}
                            </Text>
                          )}
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

            <Grid
              columns={{ initial: "1", sm: "2fr 1fr" }}
              gap="4"
              justify="between"
            >
              <Card>
                <Flex direction="column" mb="4">
                  <Text as="div" size="3" weight="bold">
                    Item
                  </Text>
                  <TextField.Root
                    autoFocus
                    ref={inputRef}
                    type="text"
                    style={{
                      height: "80px",
                      fontSize: "36px",
                      textAlign: "end",
                    }}
                    onBlur={handleBlur}
                    onKeyUp={enter}
                    disabled={removeActive}
                  ></TextField.Root>
                </Flex>
                <Flex direction="row" gap="4">
                  <Card style={{ flex: 1 }}>
                    <Flex direction="column" gap="4">
                      <Flex justify="between" align="center" flexGrow="1">
                        <Text size="3">Remover item</Text>
                      </Flex>
                      <Button
                        variant="surface"
                        disabled={produtos.length === 0 && !removeActive}
                        onClick={() => setRemoveActive((prev) => !prev)}
                      >
                        {removeActive ? (
                          <>Salvar</>
                        ) : (
                          <>
                            Remover item <MinusCircledIcon />
                          </>
                        )}
                      </Button>
                    </Flex>
                  </Card>

                  <Card style={{ flex: 1 }}>
                    <Flex direction="column" gap="4">
                      <Flex justify="between" align="center" flexGrow="1">
                        <Text size="3">Finalização de compra</Text>
                        <Tooltip content='Aperte a tecla "F" para finalizar a compra'>
                          <Kbd>F</Kbd>
                        </Tooltip>
                      </Flex>
                      <Dialog.Trigger>
                        <Button
                          disabled={produtos.length === 0 || removeActive}
                          variant="solid"
                          style={{ background: "var(--accent-a9)" }}
                          onClick={openFinishSale}
                        >
                          Finalizar compra <CheckIcon />
                        </Button>
                      </Dialog.Trigger>
                    </Flex>
                  </Card>
                </Flex>
              </Card>

              <Grid columns="1" rows="2" gap="4">
                <Card>
                  <Flex direction="column" align="center" gap="4">
                    <Flex justify="between" align="center">
                      <Text as="div" size="3" weight="bold">
                        QTD. ITENS
                      </Text>
                    </Flex>
                    <Text size="8">{produtos.length}</Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" align="center">
                    <Text as="div" size="3" weight="bold">
                      SUBTOTAL
                    </Text>
                    <Text
                      style={{ color: "var(--accent-a10)", fontSize: "3rem" }}
                    >
                      R$ {subtotalMemo}
                    </Text>
                  </Flex>
                </Card>
              </Grid>
            </Grid>
          </Grid>

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
                  <TextField.Slot style={{ fontSize: "32px" }}>
                    R$
                  </TextField.Slot>
                </TextField.Root>
              </Flex>

              <Flex direction="column">
                <Text as="div" size="2" mb="1" weight="bold">
                  VALOR PENDENTE
                </Text>
                <TextField.Root
                  type="text"
                  color={trocoMemo < 0 ? "red" : "lime"}
                  variant="soft"
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
                  <TextField.Slot style={{ fontSize: "32px" }}>
                    R$
                  </TextField.Slot>
                </TextField.Root>
              </Flex>

              <Flex direction="column">
                <Text as="div" size="2" mb="1" weight="bold">
                  TROCO (SAÍDA)
                </Text>
                <TextField.Root
                  color={trocoMemo > 0 ? "red" : "lime"}
                  variant="soft"
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
                  <TextField.Slot style={{ fontSize: "32px" }}>
                    R$
                  </TextField.Slot>
                </TextField.Root>
              </Flex>
            </Flex>

            <Flex gap="3" mt="8" justify="end">
              <Dialog.Close>
                <Button
                  variant="surface"
                  color="gray"
                  onClick={cancelFinishSale}
                >
                  Cancelar
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button
                  variant="solid"
                  disabled={trocoMemo < 0}
                  onClick={closeFinishSale}
                >
                  Finalizar compra <CheckIcon />
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      {saleId && (
        <PurchaseInvoice
          open={sucessSale}
          saleId={saleId}
          // saleId={"174821670568436794118599426290229793803817701" }
          onClickClose={onClosePurchaseVoice}
          invoiceNumber="123456789"
          companyName="Mini Mercadinho Thais"
          companyCNPJ="43.780.540/0001-48"
          companyAddress="Rua Dr. Lucas Nogueira Garcez, 1336, Jd. Suarão - Itanhaém - SP"
        />
      )}
    </>
  );
};

export default PointOfSales;
