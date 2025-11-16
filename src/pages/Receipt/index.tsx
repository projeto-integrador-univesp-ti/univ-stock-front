import {
  CrossCircledIcon,
  MagnifyingGlassIcon,
  ReaderIcon,
  ValueNoneIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  Grid,
  Separator,
  Spinner,
  Table,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Form } from "radix-ui";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { SalesReceipt } from "../../components/SalesReceipt";
import { SalesService, SaleWithProducts } from "../../service/SalesService";
import "./style.css";

const Receipt: React.FC = () => {
  const [input, setInput] = useState("");
  const [sale, setSale] = useState<SaleWithProducts>();
  const [sales, setSales] = useState<SaleWithProducts[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dtInicio, setDtInicio] = useState<Date | null>(new Date());
  const [dtFim, setDtFim] = useState<Date | null>(new Date());
  const form = useRef<HTMLFormElement>(null);

  const getSale = async (id: string) => {
    try {
      setLoading(true);
      setError(false);

      const [saleData] = await Promise.all([SalesService.getSale(id)]);

      setSale(saleData);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getSaleByDate = async (dtInicio: string, dtFim: string) => {
    try {
      setLoading(true);
      setError(false);
      const salesData = await SalesService.getSaleByDate(dtInicio, dtFim);
      setSales(salesData);
    } finally {
      setLoading(false);
    }
  };

  const cleanSale = () => {
    setSale(undefined);
  };

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.dataInicio && data.dataFim) {
      getSaleByDate(data.dataInicio as string, data.dataFim as string);
    }
    console.log(data);
  };

  useEffect(() => {
    form.current?.requestSubmit();
  }, []);

  return (
    <>
      {!sale && (
        <Flex direction="column" height="200px" gap="4">
          <Flex gap="3" direction="column">
            <Flex gap="3">
              <TextField.Root
                value={input}
                placeholder="Número da compra…"
                style={{ width: "60vw" }}
                disabled={loading}
                maxLength={45}
                onChange={(event) => {
                  setError(false);
                  setInput(event.target.value);
                }}
              >
                <TextField.Slot style={{ margin: "1rem 0", flex: "1" }}>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
              <Button
                variant="solid"
                size="2"
                onClick={() => getSale(input)}
                disabled={input.length < 45}
              >
                Bucar
              </Button>
            </Flex>
            <Separator orientation="horizontal" size="4" my="3" />
          </Flex>

          <Form.Root ref={form} onSubmit={submit}>
            <Grid
              columns={{
                initial: "1",
                sm: "2",
              }}
              gap="4"
            >
              <Form.Field name="dataInicio">
                <Form.Label>Data inicial</Form.Label>
                <DatePicker
                  name="dataInicio"
                  popperPlacement="bottom-start"
                  className="datepicker"
                  dateFormat="dd/MM/yyyy"
                  selected={dtInicio}
                  onChange={(date) => {
                    setDtInicio(date);
                    setTimeout(() => {
                      form.current?.requestSubmit();
                    }, 300);
                  }}
                  locale="pt-BR"
                />
              </Form.Field>

              <Form.Field name="dataFim">
                <Form.Label>Data final</Form.Label>
                <DatePicker
                  name="dataFim"
                  popperPlacement="bottom-start"
                  className="datepicker"
                  dateFormat="dd/MM/yyyy"
                  selected={dtFim}
                  onChange={(date) => {
                    setDtFim(date);
                    setTimeout(() => {
                      form.current?.requestSubmit();
                    }, 300);
                  }}
                  locale="pt-BR"
                />
              </Form.Field>
            </Grid>
          </Form.Root>
        </Flex>
      )}

      {!sale && (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Código da venda</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Data</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantidade de itens</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Valor pago</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Valor total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {sales.map((sale) => {
              return (
                <Table.Row>
                  <Table.RowHeaderCell>{sale.id}</Table.RowHeaderCell>
                  <Table.Cell>{sale.dataVenda}</Table.Cell>
                  <Table.Cell>{sale.produtos.length}</Table.Cell>
                  <Table.Cell>R$ {sale.valorPago}</Table.Cell>
                  <Table.Cell>R$ {sale.valorTotal}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="surface"
                      size="1"
                      color="blue"
                      onClick={() => getSale(sale.id)}
                    >
                      Nota <ReaderIcon />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      )}

      {!sale && !loading && sales.length === 0 && (
        <Flex
          gap="2"
          direction="column"
          height="100%"
          align="center"
          justify="center"
        >
          <ValueNoneIcon width="25" height="25" color="gray" />
          <Text as="p" size="3" color="gray">
            Sem vendas para o período selecionado!
          </Text>
        </Flex>
      )}

      {error && (
        <Flex direction="column" gap="3" align="center" justify="center">
          <CrossCircledIcon color="red" height={40} width={40} />
          <Text as="p" size="4" align="center">
            Nota de compra não encontrada, verifique o código e tente novamente.
          </Text>
        </Flex>
      )}

      {loading && (
        <Flex height="200px" align="center" justify="center" gap="4">
          <Spinner
            size="3"
            style={{ height: 28, color: "var(--accent-indicator)" }}
          />
        </Flex>
      )}

      {sale && <SalesReceipt sale={sale} onClose={cleanSale} />}
    </>
  );
};

export default Receipt;
