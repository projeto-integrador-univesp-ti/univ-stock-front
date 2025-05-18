import {
  Button,
  Dialog,
  Flex,
  Grid,
  Select,
  Separator,
  Switch,
  Table,
  TabNav,
  Text,
  TextField,
} from "@radix-ui/themes";
import { ptBR } from "date-fns/locale/pt-BR";
import { Form } from "radix-ui";
import { SyntheticEvent, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "./styles.css";

import { MagnifyingGlassIcon, ValueNoneIcon } from "@radix-ui/react-icons";
import { Measure, MeasureService } from "../../service/MeasureService";
import { Product, ProductService } from "../../service/ProductService";

enum Action {
  SEARCH = "#search",
  ADD_EDIT = "#add-edit",
}

registerLocale("pt-BR", ptBR);

const ProductManagement = () => {
  const [hash, setHash] = useState(window.location.hash);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [measures, setMeasures] = useState([] as Measure[]);
  const [measure, setMeasure] = useState("5");
  const [sucessAdded, setSucessAdded] = useState(false);
  const [errorAdded, setErrorAdded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsFiltered, setProductsFiltered] = useState<Product[] | null>(
    null
  );
  const [productAdded, setProductAdded] = useState({} as Product);

  const getProducts = async () => {
    const allProducts = await ProductService.getAll();
    setProducts(allProducts);
  };

  const initHash = () => {
    const has = ([Action.SEARCH, Action.ADD_EDIT] as string[]).includes(
      window.location.hash
    );
    if (!has) {
      setHash(Action.SEARCH);
      window.location.hash = Action.SEARCH;
    }
  };

  const initMeasures = async () => {
    const measures = await MeasureService.getAll();
    setMeasures(measures);
  };

  const resetForm = () => {
    if (!errorAdded) {
      document.forms?.namedItem("add-product")?.reset();
    }
    setSucessAdded(false);
    setErrorAdded(false);
    setProductAdded({} as Product);
  };

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const product = await ProductService.add({
        ...data,
        idMedida: Number(data.idMedida as string),
        quantidade: Number((data.quantidade as string).replace(",", ".")),
        precoUnidade: Number((data.precoUnidade as string).replace(",", ".")),
        perecivel: !!data.perecivel,
      } as unknown as Product);

      setSucessAdded(true);
      setProductAdded(product);
    } catch {
      setErrorAdded(true);
    }
  };

  useEffect(() => {
    initMeasures();
    getProducts();
  }, []);

  useEffect(() => {
    initHash();
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <>
      <TabNav.Root>
        <TabNav.Link href={Action.SEARCH} active={hash === Action.SEARCH}>
          Buscar
        </TabNav.Link>
        <TabNav.Link href={Action.ADD_EDIT} active={hash === Action.ADD_EDIT}>
          Adicionar/Editar
        </TabNav.Link>
      </TabNav.Root>

      {hash === Action.SEARCH && (
        <>
          <TextField.Root
            style={{ margin: "1rem 0" }}
            placeholder="Buscar produto por nome..."
            onChange={(event) => {
              const value = event.target.value;
              const filteredProducts = products.filter((product) =>
                product.nome.toLowerCase().includes(value.toLowerCase())
              );
              if (value) {
                setProductsFiltered(filteredProducts);
              } else {
                setProductsFiltered(null);
              }
            }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>

          <Flex direction="column" gap="4">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>
                    Nome do produto
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Marca</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantidade</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {(productsFiltered || products).map((product, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>{product.nome}</Table.RowHeaderCell>
                    <Table.Cell>{product.marca}</Table.Cell>
                    <Table.Cell>{product.quantidade}</Table.Cell>
                  </Table.Row>
                ))}

                {productsFiltered?.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={3}>
                      <Flex
                        gap="2"
                        direction="column"
                        height="100%"
                        align="center"
                        justify="center"
                      >
                        <ValueNoneIcon width="25" height="25" color="gray" />
                        <Text as="p" size="3" color="gray">
                          Produto filtrado não encontrado!
                        </Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Flex>
        </>
      )}

      {hash === Action.ADD_EDIT && (
        <Form.Root
          name="add-product"
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1rem",
            gap: "1rem",
          }}
          onSubmit={submit}
        >
          <Grid columns={{ initial: "1", sm: "2" }} gap="4">
            <Form.Field name="nome">
              <Form.Label>Nome do produto</Form.Label>
              <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                <Form.Control
                  minLength={1}
                  maxLength={45}
                  className="rt-reset rt-TextFieldInput"
                  required
                />
              </div>
              <Form.Message className="error-message" match="valueMissing">
                Nome do produto é obrigatório.
              </Form.Message>
              <Form.Message className="error-message" match="tooLong">
                Nome não pode ultrapassar 45 caracteres.
              </Form.Message>
            </Form.Field>

            <Form.Field name="marca">
              <Form.Label>Marca</Form.Label>
              <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                <Form.Control
                  minLength={1}
                  maxLength={45}
                  className="rt-reset rt-TextFieldInput"
                  required
                />
              </div>
              <Form.Message className="error-message" match="valueMissing">
                Marca do produto é obrigatório.
              </Form.Message>
              <Form.Message className="error-message" match="tooLong">
                Marca não pode ultrapassar 45 caracteres.
              </Form.Message>
            </Form.Field>

            <Form.Field name="quantidade">
              <Form.Label>Quantidade total</Form.Label>
              <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                <Form.Control
                  minLength={1}
                  maxLength={10}
                  max={9999999999}
                  min={0}
                  pattern="^\d+(,\d{1,2})?$"
                  className="rt-reset rt-TextFieldInput"
                  required
                />
              </div>
              <Form.Message className="error-message" match="patternMismatch">
                Valor incorreto, apenas números e 1 vírgula.
              </Form.Message>
              <Form.Message className="error-message" match="valueMissing">
                Quantidade do produto é obrigatório.
              </Form.Message>
              <Form.Message className="error-message" match="tooLong">
                Quantidade não pode ultrapassar 45 caracteres.
              </Form.Message>
            </Form.Field>

            <Form.Field name="idMedida">
              <Form.Label>Unidade de medida</Form.Label>
              <Select.Root
                name="idMedida"
                defaultValue={measure}
                onValueChange={setMeasure}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Unidade de medida</Select.Label>
                    {measures.map((item) => (
                      <Select.Item key={item.id} value={item.id.toString()}>
                        {item?.nome} ({item?.sigla})
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Form.Field>

            <Form.Field name="precoUnidade">
              <Form.Label>
                Preço por{" "}
                {measures
                  .find((item) => item.id.toString() === measure)
                  ?.nome?.toLowerCase()}
              </Form.Label>
              <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                <Form.Control
                  minLength={1}
                  maxLength={10}
                  max={9999999999}
                  min={0}
                  pattern="^\d+(,\d{1,2})?$"
                  className="rt-reset rt-TextFieldInput"
                  required
                />
              </div>
              <Form.Message className="error-message" match="patternMismatch">
                Valor incorreto, apenas números e 1 vírgula.
              </Form.Message>
              <Form.Message className="error-message" match="valueMissing">
                Quantidade do produto é obrigatório.
              </Form.Message>
              <Form.Message className="error-message" match="tooLong">
                Quantidade não pode ultrapassar 45 caracteres.
              </Form.Message>
            </Form.Field>
          </Grid>

          <Separator orientation="horizontal" size="4" my="4" />

          <Grid columns={{ initial: "1", sm: "2" }} gap="4" mb="8">
            <Form.Field
              name="perecivel"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Flex gap="3">
                <Switch
                  name="perecivel"
                  size="2"
                  value={"true"}
                  defaultChecked
                />
                <Form.Label htmlFor="aa">Produto perecível</Form.Label>
              </Flex>
            </Form.Field>

            <div />

            <Form.Field name="lote">
              <Form.Label>Número do lote</Form.Label>
              <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                <Form.Control
                  minLength={5}
                  maxLength={45}
                  className="rt-reset rt-TextFieldInput"
                  required
                />
              </div>
              <Form.Message className="error-message" match="valueMissing">
                Número do lote é obrigatório.
              </Form.Message>
              <Form.Message className="error-message" match="tooShort">
                Número do lote deve ter no mínimo 5 caracteres.
              </Form.Message>
              <Form.Message className="error-message" match="tooLong">
                Número do lote não pode ultrapassar 45 caracteres.
              </Form.Message>
            </Form.Field>

            <Form.Field name="dataValidade">
              <Form.Label>Data de validade</Form.Label>
              <DatePicker
                name="dataValidade"
                popperPlacement="bottom-start"
                className="datepicker"
                dateFormat="dd/MM/yyyy"
                selected={startDate}
                onChange={(date) => {
                  console.log(date);
                  setStartDate(date);
                }}
                locale="pt-BR"
              />
            </Form.Field>
          </Grid>

          <Form.Submit>
            <Text size='3'>Adicionar</Text>
          </Form.Submit>
        </Form.Root>
      )}

      <Dialog.Root open={sucessAdded || errorAdded}>
        <Dialog.Content size="1" maxWidth="500px">
          <Flex gap="4" direction="column" align="center">
            {sucessAdded && (
              <Text as="p" trim="both" size="3" align="center">
                O produto
                <Text as="span" size="3" weight="bold" color="green">
                  &nbsp;({productAdded.nome})&nbsp;
                </Text>
                foi adicionado com sucesso!
              </Text>
            )}
            {errorAdded && (
              <Text as="p" trim="both" size="3" align="center">
                O produto não pode ser adicionado, tente novamente!
              </Text>
            )}
            <Flex gap="3" justify="end">
              <Dialog.Close>
                <Button
                  variant="soft"
                  onClick={resetForm}
                  style={{ width: "150px" }}
                >
                  Fechar
                </Button>
              </Dialog.Close>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default ProductManagement;
