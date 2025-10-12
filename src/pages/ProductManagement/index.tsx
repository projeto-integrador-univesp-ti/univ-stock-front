import {
  Button,
  Dialog,
  Flex,
  Grid,
  Select,
  Separator,
  Spinner,
  Switch,
  Table,
  TabNav,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { ptBR } from "date-fns/locale/pt-BR";
import { Form } from "radix-ui";
import { SyntheticEvent, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "./styles.css";

import {
  MagnifyingGlassIcon,
  Pencil2Icon,
  UpdateIcon,
  ValueNoneIcon,
} from "@radix-ui/react-icons";
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
  const [loading, setLoading] = useState(false);
  const [blockUpdate, setBlockUpdate] = useState(false);
  const [sucessAdded, setSucessAdded] = useState(false);
  const [sucessEdited, setSucessEdited] = useState(false);
  const [errorAdded, setErrorAdded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productToEdit, setProductToEdit] = useState<Product>();
  const [productsFiltered, setProductsFiltered] = useState<Product[] | null>(
    null
  );
  const [productAddedEdited, setProductAddedEdited] = useState({} as Product);
  const [perishable, setPerishable] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    const allProducts = await ProductService.getAll();
    setProducts(allProducts);
    setLoading(false);
  };

  const fakePromise = () => {
    return new Promise((res) => {
      setTimeout(() => res(true), 1000);
    });
  };

  const updateProducts = async () => {
    setLoading(true);
    setBlockUpdate(true);
    const [allProducts] = await Promise.all([
      ProductService.getAll(),
      fakePromise(),
    ]);
    setProducts(allProducts);
    setLoading(false);
    setTimeout(() => setBlockUpdate(false), 10000);
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
    setSucessEdited(false);
    setErrorAdded(false);
    setProductAddedEdited({} as Product);
    setProductToEdit({} as Product);
    window.location.hash = Action.SEARCH;
  };

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const newProduct = {
        ...data,
        idMedida: Number(data.idMedida as string),
        quantidade: Number((data.quantidade as string).replace(",", ".")),
        precoUnidade: Number((data.precoUnidade as string).replace(",", ".")),
        perecivel: !!data.perecivel,
      } as unknown as Product;

      if (productToEdit) {
        const productEdited = await ProductService.update({
          ...productToEdit,
          ...newProduct,
        });
        setSucessEdited(true);
        setProducts((state) =>
          state.map((product) => {
            return product.id === productEdited.id ? productEdited : product;
          })
        );
        setProductAddedEdited(productEdited);
      } else {
        const productAdded = await ProductService.add(newProduct);
        setSucessAdded(true);
        setProducts((state) => [...state, productAdded]);
        setProductAddedEdited(productAdded);
      }
    } catch {
      setErrorAdded(true);
    } finally {
      setBlockUpdate(false);
    }
  };

  const toEdit = (product: Product) => {
    setProductToEdit(product);
    window.location.hash = Action.ADD_EDIT;
  };

  useEffect(() => {
    initMeasures();
    getProducts();
  }, []);

  useEffect(() => {
    initHash();
    const handleHashChange = () => {
      setHash(window.location.hash);
      if (window.location.hash === Action.SEARCH) {
        setProductToEdit(undefined);
      }
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
          {productToEdit ? 'Editando' : 'Adicionar'}
        </TabNav.Link>
      </TabNav.Root>

      {hash === Action.SEARCH && (
        <>
          <Flex align="center" gap="4">
            <TextField.Root
              style={{ margin: "1rem 0", flex: "1" }}
              placeholder="Buscar produto por código ou nome..."
              onChange={(event) => {
                const value = event.target.value;
                const filteredProducts = products.filter(
                  (product) =>
                    product.nome.toLowerCase().includes(value.toLowerCase()) ||
                    product.codigo.toLowerCase().includes(value.toLowerCase())
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

            <Tooltip content="Atualizar lista de produtos">
              <Button
                variant="ghost"
                style={{ padding: "8px" }}
                disabled={blockUpdate}
                onClick={updateProducts}
              >
                <UpdateIcon />
              </Button>
            </Tooltip>
          </Flex>

          <Flex direction="column" gap="4">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Código</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    Nome do produto
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Marca</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantidade</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell width="0" />
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {!loading &&
                  (productsFiltered || products).map((product, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{product.codigo}</Table.Cell>
                      <Table.Cell>{product.nome}</Table.Cell>
                      <Table.Cell>{product.marca || "-"}</Table.Cell>
                      <Table.Cell>
                        {product.quantidade}&nbsp;
                        {measures.find((i) => i.id === product.idMedida)?.sigla}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          variant="surface"
                          size="1"
                          color="blue"
                          onClick={() => toEdit(product)}
                        >
                          Editar <Pencil2Icon />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}

                {!loading && products?.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={4}>
                      <Flex
                        gap="2"
                        direction="column"
                        height="100%"
                        align="center"
                        justify="center"
                      >
                        <ValueNoneIcon width="25" height="25" color="gray" />
                        <Text as="p" size="3" color="gray">
                          Estoque sem produtos cadastrado!
                        </Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                )}

                {!loading && productsFiltered?.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={4}>
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

                {loading && (
                  <Table.Row>
                    <Table.Cell colSpan={4}>
                      <Flex
                        gap="2"
                        direction="column"
                        height="100%"
                        align="center"
                        justify="center"
                      >
                        <Spinner
                          size="3"
                          style={{
                            height: 28,
                            color: "var(--accent-indicator)",
                          }}
                        />
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
                  defaultValue={productToEdit?.nome}
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
                  maxLength={45}
                  className="rt-reset rt-TextFieldInput"
                  defaultValue={productToEdit?.marca}
                />
              </div>
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
                  defaultValue={productToEdit?.quantidade
                    ?.toString()
                    ?.replace?.(".", ",")}
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
                defaultValue={productToEdit?.idMedida?.toString?.() ?? measure}
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
                Preço por&nbsp;
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
                  defaultValue={productToEdit?.precoUnidade
                    ?.toString()
                    ?.replace?.(".", ",")}
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

            <Form.Field name="codigo">
              <Form.Label>Código do produto/ Código de barras</Form.Label>
              <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                <Form.Control
                  minLength={1}
                  maxLength={45}
                  className="rt-reset rt-TextFieldInput"
                  required
                  defaultValue={productToEdit?.codigo}
                />
              </div>
              <Form.Message className="error-message" match="valueMissing">
                Código é obrigatório.
              </Form.Message>
              <Form.Message className="error-message" match="tooLong">
                Código não pode ultrapassar 45 caracteres.
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
                  value="true"
                  checked={perishable}
                  onCheckedChange={(checked) => {
                    setPerishable(checked);
                  }}
                />
                <Form.Label htmlFor="aa">Produto perecível</Form.Label>
              </Flex>
            </Form.Field>

            <div />

            {perishable && (
              <>
                <Form.Field name="lote">
                  <Form.Label>Número do lote</Form.Label>
                  <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                    <Form.Control
                      maxLength={45}
                      className="rt-reset rt-TextFieldInput"
                      required
                    />
                  </div>
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
              </>
            )}
          </Grid>

          <Form.Submit asChild >
            <Button>

            <Text size="3">{productToEdit ? "Editar" : "Adicionar"}</Text>
            </Button>
          </Form.Submit>
        </Form.Root>
      )}

      <Dialog.Root open={sucessAdded || sucessEdited || errorAdded}>
        <Dialog.Content size="1" maxWidth="500px">
          <Flex gap="4" direction="column" align="center">
            {sucessAdded && (
              <Text as="p" trim="both" size="3" align="center">
                O produto
                <Text as="span" size="3" weight="bold" color="green">
                  &nbsp;({productAddedEdited.nome})&nbsp;
                </Text>
                foi adicionado com sucesso!
              </Text>
            )}
            {sucessEdited && (
              <Text as="p" trim="both" size="3" align="center">
                O produto
                <Text as="span" size="3" weight="bold" color="blue">
                  &nbsp;({productAddedEdited.nome})&nbsp;
                </Text>
                foi editado com sucesso!
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
