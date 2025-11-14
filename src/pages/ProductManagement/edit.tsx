import {
  Button,
  Dialog,
  Flex,
  Grid,
  Select,
  Separator,
  Switch,
  Text,
} from "@radix-ui/themes";
import { Form } from "radix-ui";
import { SyntheticEvent, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Measure } from "../../service/MeasureService";
import { Product, ProductService } from "../../service/ProductService";
import "./styles.css";

interface EditProductProps {
  productToEdit?: Product;
  measures: Measure[];
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onDone: () => void;
}

const EditProduct: React.FC<EditProductProps> = (props) => {
  const { productToEdit, measures, products, setProducts, onDone } = props;

  const [measure, setMeasure] = useState(
    productToEdit?.idMedida?.toString() ?? "5"
  );
  const [perishable, setPerishable] = useState(
    productToEdit?.perecivel ?? false
  );

  const [sucessAdded, setSucessAdded] = useState(false);
  const [sucessEdited, setSucessEdited] = useState(false);
  const [errorAdded, setErrorAdded] = useState<string | false>("");
  const [productAddedEdited, setProductAddedEdited] = useState({} as Product);

  useEffect(() => {
    setMeasure(productToEdit?.idMedida?.toString() ?? "5");
    setPerishable(productToEdit?.perecivel ?? false);
  }, [productToEdit]);

  const resetForm = () => {
    const hasError = !!errorAdded;
    setSucessAdded(false);
    setSucessEdited(false);
    setErrorAdded(false);

    if (!hasError) {
      setProductAddedEdited({} as Product);
      onDone();
    }
  };

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const newProduct = {
        ...data,
        idMedida: Number(data.idMedida as string),
        quantidadeMinimaEstoque: Number(
          (data.quantidadeMinimaEstoque as string)?.replace?.(",", ".")
        ),
        precoUnidade: Number(
          (data.precoUnidade as string)?.replace?.(",", ".")
        ),
        perecivel: !!data.perecivel,
      } as unknown as Product;

      if (productToEdit) {
        const productEdited = await ProductService.update({
          ...productToEdit,
          ...newProduct,
        });
        setSucessEdited(true);
        setProducts(
          products.map((p) => (p.id === productEdited.id ? productEdited : p))
        );
        setProductAddedEdited(productEdited);
      } else {
        const productAdded = await ProductService.add(newProduct);
        setSucessAdded(true);
        setProducts([...products, productAdded]);
        setProductAddedEdited(productAdded);
      }
      setErrorAdded(false);
    } catch (error) {
      if (((error as { status?: number })?.status ?? 0) === 409) {
        setErrorAdded("Código do produto (Código de barras) já existente!");
      } else {
        setErrorAdded("O produto não pode ser adicionado, tente novamente!");
      }
    }
  };

  return (
    <>
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
          </Form.Field>

          <Form.Field name="idMedida">
            <Form.Label>Unidade de medida</Form.Label>
            <Select.Root
              name="idMedida"
              value={measure}
              onValueChange={setMeasure}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Unidade de medida</Select.Label>
                  {measures.map((item) => (
                    <Select.Item key={item.id} value={item.id.toString()}>
                      {item.nome} ({item.sigla})
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
                pattern="^\d+(,\d{1,2})?$"
                className="rt-reset rt-TextFieldInput"
                required
                defaultValue={productToEdit?.precoUnidade
                  ?.toString()
                  .replace(".", ",")}
              />
            </div>
            <Form.Message className="error-message" match="patternMismatch">
              Valor incorreto, apenas números e 1 vírgula.
            </Form.Message>
            <Form.Message className="error-message" match="valueMissing">
              Preço do produto é obrigatório.
            </Form.Message>
          </Form.Field>

          <Form.Field name="codigo">
            <Form.Label>Código do produto / Código de barras</Form.Label>
            <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
              <Form.Control
                minLength={1}
                maxLength={45}
                className="rt-reset rt-TextFieldInput"
                required
                defaultValue={productToEdit?.codigo ?? ""}
              />
            </div>
            <Form.Message className="error-message" match="valueMissing">
              Código é obrigatório.
            </Form.Message>
          </Form.Field>

          <Form.Field name="quantidadeMinimaEstoque">
            <Form.Label>Quantidade mínima em estoque</Form.Label>
            <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
              <Form.Control
                type="number"
                min={0}
                className="rt-reset rt-TextFieldInput"
                required
                defaultValue={productToEdit?.quantidadeMinimaEstoque}
              />
            </div>
            <Form.Message className="error-message" match="valueMissing">
              Quantidade mínima em estoque é obrigatório.
            </Form.Message>
            <Form.Message className="error-message" match="rangeUnderflow">
              Quantidade mínima em estoque não pode ser negativa
            </Form.Message>
          </Form.Field>
        </Grid>

        {!productToEdit && (
          <>
            <Separator orientation="horizontal" size="4" my="4" />

            <Grid columns={{ initial: "1", sm: "2" }} gap="4">
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
                    onCheckedChange={setPerishable}
                  />
                  <Form.Label>Produto perecível</Form.Label>
                </Flex>
              </Form.Field>

              <div />
            </Grid>
          </>
        )}

        <Form.Submit asChild>
          <Button mt="8">
            <Text size="3">{productToEdit ? "Editar" : "Adicionar"}</Text>
          </Button>
        </Form.Submit>
      </Form.Root>

      {/* Diálogo de feedback */}
      <Dialog.Root open={sucessAdded || sucessEdited || Boolean(errorAdded)}>
        <Dialog.Title></Dialog.Title>
        <Dialog.Content size="1" maxWidth="500px">
          <Flex gap="4" direction="column" align="center">
            {sucessAdded && (
              <Text align="center">
                Produto
                <Text weight="bold" color="green">
                  &nbsp;({productAddedEdited.nome})&nbsp;
                </Text>
                adicionado com sucesso!
              </Text>
            )}
            {sucessEdited && (
              <Text align="center">
                Produto
                <Text weight="bold" color="blue">
                  &nbsp;({productAddedEdited.nome})&nbsp;
                </Text>
                editado com sucesso!
              </Text>
            )}
            {errorAdded && <Text align="center">{errorAdded}</Text>}
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

export { EditProduct };
