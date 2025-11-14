import {
  CardStackPlusIcon,
  MagnifyingGlassIcon,
  Pencil2Icon,
  UpdateIcon,
  ValueNoneIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  Spinner,
  Table,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { useState } from "react";
import { Measure } from "../../service/MeasureService";
import { Product } from "../../service/ProductService";

interface SearchProductProps {
  products: Product[];
  measures: Measure[];
  loading: boolean;
  blockUpdate: boolean;
  onUpdateProducts: () => void;
  onEdit: (product: Product) => void;
  onGoToBatch: (product: Product) => void;
}

const SearchProduct: React.FC<SearchProductProps> = (props) => {
  const {
    products,
    measures,
    loading,
    blockUpdate,
    onUpdateProducts,
    onEdit,
    onGoToBatch,
  } = props;

  const [productsFiltered, setProductsFiltered] = useState<Product[] | null>(
    null
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value) {
      setProductsFiltered(null);
      return;
    }

    const filteredProducts = products.filter(
      (product) =>
        product.nome.toLowerCase().includes(value.toLowerCase()) ||
        product.codigo.toLowerCase().includes(value.toLowerCase())
    );
    setProductsFiltered(filteredProducts);
  };

  const listToRender = productsFiltered ?? products;

  return (
    <>
      <Flex align="center" gap="4">
        <TextField.Root
          style={{ margin: "1rem 0", flex: "1" }}
          placeholder="Buscar produto por código ou nome..."
          onChange={handleSearchChange}
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
            onClick={onUpdateProducts}
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
              <Table.ColumnHeaderCell>Nome do produto</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Marca</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantidade</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="0" />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!loading &&
              listToRender.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>{product.codigo}</Table.Cell>
                  <Table.Cell>{product.nome}</Table.Cell>
                  <Table.Cell>{product.marca || "-"}</Table.Cell>
                  <Table.Cell>
                    {product.quantidade}&nbsp;
                    {measures.find((i) => i.id === product.idMedida)?.sigla}
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="3">
                      <Button
                        variant="surface"
                        size="1"
                        color="amber"
                        onClick={() => onGoToBatch(product)}
                      >
                        Lotes <CardStackPlusIcon />
                      </Button>
                      <Button
                        variant="surface"
                        size="1"
                        color="blue"
                        onClick={() => onEdit(product)}
                      >
                        Editar <Pencil2Icon />
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}

            {loading && (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Flex justify="center" p="4">
                    <Spinner size="3" />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            )}

            {!loading && listToRender.length === 0 && (
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
                      {productsFiltered
                        ? "Produto filtrado não encontrado!"
                        : "Estoque sem produtos cadastrado!"}
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Flex>
    </>
  );
};

export { SearchProduct };
