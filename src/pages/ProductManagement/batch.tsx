import { ValueNoneIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Separator,
  Spinner,
  Table,
  Text,
} from "@radix-ui/themes";
import { ptBR } from "date-fns/locale/pt-BR";
import { Form } from "radix-ui";
import { SyntheticEvent, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Batch, BatchService } from "../../service/BatchService";
import { Product } from "../../service/ProductService";

registerLocale("pt-BR", ptBR);

interface BatchProductProps {
  product?: Product;
}

export const BatchProduct = ({ product }: BatchProductProps) => {
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [productBatches, setProductBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fabDate, setFabDate] = useState<Date | null>(null);
  const [valDate, setValDate] = useState<Date | null>(
    product?.perecivel ? new Date() : null
  );
  const [addError, setAddError] = useState<string | null>(null);

  const formatDate = (dateInput: string | Date | null) => {
    if (!dateInput) return "-";
    try {
      return new Date(dateInput).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      });
    } catch {
      return "Data inválida";
    }
  };

  useEffect(() => {
    const fetchAllBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const all = await BatchService.getAll();
        setAllBatches(all);
      } catch (err) {
        console.error("Falha ao buscar lotes:", err);
        setError("Falha ao buscar os lotes.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllBatches();
  }, []);

  useEffect(() => {
    if (product?.id) {
      const filtered = allBatches.filter((b) => b.idProduto === product.id);
      setProductBatches(filtered);
    } else {
      setProductBatches([]);
    }
  }, [product, allBatches]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!product?.id) {
      setAddError("Nenhum produto selecionado.");
      return;
    }

    if (product.perecivel && !valDate) {
      setAddError("Data de validação é obrigatória para produto perecível.");
      return;
    }

    setAddError(null);
    const formData = new FormData(event.currentTarget);
    const observacoes = (formData.get("observacoes") as string) || "";
    const codigo = (formData.get("codigo") as string) || null;
    const quantidade = Number(formData.get("quantidade")) || 0;

    if (quantidade <= 0) {
      setAddError("Quantidade deve ser maior que zero.");
      return;
    }

    try {
      const newBatchData: Omit<Batch, "id"> = {
        idProduto: product.id,
        codigo: codigo || null,
        dtFabricacao: product.perecivel ? fabDate ?? null : null,
        dtValidade: product.perecivel ? valDate ?? null : null,
        observacoes,
        quantidade,
      };

      setLoadingAdd(true);
      const addedBatch = await BatchService.add(newBatchData);

      setAllBatches((current) => [...current, addedBatch]);
      (event.target as HTMLFormElement).reset();
      setFabDate(new Date());
      setValDate(new Date());
    } catch (err) {
      console.error("Falha ao adicionar lote:", err);
      setAddError("Não foi possível adicionar o lote. Tente novamente.");
    } finally {
      setLoadingAdd(false);
    }
  };

  if (!product) {
    return (
      <Box pt="4">
        <Text as="p" color="gray">
          Selecione um produto na aba "Buscar" para gerenciar seus lotes.
        </Text>
      </Box>
    );
  }

  return (
    <Box pt="4">
      <Flex gap="1">
        <Text as="p">Produto:</Text>
        <Text as="p" weight="medium">
          {product.nome}
        </Text>
        <Text as="p">(Código: {product.codigo || "—"})</Text>
      </Flex>

      <Flex gap="1">
        <Text as="p">Tipo:</Text>
        {product.perecivel ? (
          <Text color="red">Perecível</Text>
        ) : (
          <Text color="green">Não perecível</Text>
        )}
      </Flex>

      <Separator orientation="horizontal" size="4" my="4" />

      {/* --- Formulário de Adição --- */}
      <Heading size="4" mb="3">
        Adicionar Novo Lote
      </Heading>

      <Form.Root onSubmit={handleSubmit}>
        <Grid
          columns={{
            initial: "1",
            sm: loadingAdd ? "1" : "2",
          }}
          gap="4"
        >
          {loadingAdd && (
            <Flex justify="center" p="4">
              <Spinner size="3" />
            </Flex>
          )}

          {!loadingAdd && (
            <>
              <Form.Field name="codigo">
                <Form.Label>Código do Lote</Form.Label>
                <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                  <Form.Control
                    name="codigo"
                    type="text"
                    minLength={1}
                    maxLength={45}
                    required
                    className="rt-reset rt-TextFieldInput"
                  />
                </div>
                <Form.Message className="error-message" match="valueMissing">
                  Código é obrigatório.
                </Form.Message>
              </Form.Field>

              <Form.Field name="quantidade">
                <Form.Label>Quantidade</Form.Label>
                <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                  <Form.Control
                    type="number"
                    min={1}
                    className="rt-reset rt-TextFieldInput"
                    required
                  />
                </div>
                <Form.Message className="error-message" match="valueMissing">
                  Quantidade de itens é obrigatório.
                </Form.Message>
                <Form.Message className="error-message" match="rangeUnderflow">
                  Quantidade mínima de entrada não pode ser menor que 1.
                </Form.Message>
              </Form.Field>

              <Form.Field name="dtFabricacao">
                <Form.Label>Data de Fabricação</Form.Label>
                <DatePicker
                  name="dtFabricacao"
                  popperPlacement="bottom-start"
                  className="datepicker"
                  dateFormat="dd/MM/yyyy"
                  selected={fabDate}
                  onChange={setFabDate}
                  locale="pt-BR"
                />
              </Form.Field>

              {Boolean(product.perecivel) && (
                <Form.Field name="dtValidade">
                  <Form.Label>Data de Validade</Form.Label>
                  <DatePicker
                    name="dtValidade"
                    popperPlacement="bottom-start"
                    className="datepicker"
                    dateFormat="dd/MM/yyyy"
                    selected={valDate}
                    onChange={(val) => setValDate(val!)}
                    locale="pt-BR"
                    required={Boolean(product.perecivel)}
                  />
                  <Form.Message className="error-message" match="valueMissing">
                    Data de validade é obrigatório para produto perecível.
                  </Form.Message>
                </Form.Field>
              )}

              <Form.Field name="observacoes">
                <Form.Label>Observações</Form.Label>
                <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                  <Form.Control
                    name="observacoes"
                    minLength={1}
                    maxLength={45}
                    className="rt-reset rt-TextFieldInput"
                  />
                </div>
              </Form.Field>
            </>
          )}
        </Grid>

        <Flex justify="end" mt="4">
          {!loadingAdd && (
            <>
              {addError && (
                <Text color="red" size="2" mr="4">
                  {addError}
                </Text>
              )}
              <Form.Submit asChild>
                <Button variant="soft">Adicionar Lote</Button>
              </Form.Submit>
            </>
          )}
        </Flex>
      </Form.Root>

      <Separator orientation="horizontal" size="4" my="4" />

      {/* --- Tabela de Lotes --- */}
      <Heading size="4" mb="3">
        Lotes Existentes
      </Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Data Fabricação</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Data Validade</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Observações</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              Quantidade de entrada
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading && (
            <Table.Row>
              <Table.Cell colSpan={5}>
                <Flex justify="center" p="4">
                  <Spinner size="3" />
                </Flex>
              </Table.Cell>
            </Table.Row>
          )}

          {!loading && error && !product?.id && (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Flex justify="center" p="4">
                  <Text color="red">{error}</Text>
                </Flex>
              </Table.Cell>
            </Table.Row>
          )}

          {!loading && productBatches.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5}>
                <Flex
                  gap="2"
                  direction="column"
                  align="center"
                  justify="center"
                  p="4"
                >
                  <ValueNoneIcon width="25" height="25" color="gray" />
                  <Text as="p" size="3" color="gray">
                    Nenhum lote cadastrado para este produto.
                  </Text>
                </Flex>
              </Table.Cell>
            </Table.Row>
          )}

          {!loading &&
            productBatches.map((batch) => (
              <Table.Row key={batch.id}>
                <Table.Cell>{batch.codigo || "—"}</Table.Cell>
                <Table.Cell>{formatDate(batch.dtFabricacao)}</Table.Cell>
                <Table.Cell>{formatDate(batch.dtValidade)}</Table.Cell>
                <Table.Cell>{batch.observacoes || "-"}</Table.Cell>
                <Table.Cell>{batch.quantidade}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
