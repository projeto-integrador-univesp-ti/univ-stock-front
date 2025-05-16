import {
  Flex,
  Grid,
  Select,
  Separator,
  Switch,
  TabNav,
} from "@radix-ui/themes";
import { Form } from "radix-ui";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "./styles.css";

enum Action {
  SEARCH = "#search",
  ADD_EDIT = "#add-edit",
}

registerLocale("pt-BR", ptBR);

const ProductManagement = () => {
  const [hash, setHash] = useState(Action.SEARCH as string);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [medida, setMedida] = useState("unidade");

  useEffect(() => {
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

      {hash === Action.ADD_EDIT && (
        <Form.Root
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1rem",
            gap: "1rem",
          }}
          onSubmit={(event) => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(event.currentTarget));
            console.log("Form data:", data);
          }}
          onClearServerErrors={
            () => {}
            // setServerErrors({ email: false, password: false })
          }
        >
          {/* <TextField.Root placeholder="Search the docs…">
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root> */}

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
                  type="number"
                  pattern="[0-9]*"
                  className="rt-reset rt-TextFieldInput"
                  required
                />
              </div>
              <Form.Message className="error-message" match="valueMissing">
                Quantidade do produto é obrigatório.
              </Form.Message>
              <Form.Message className="error-message" match="tooLong">
                Quantidade não pode ultrapassar 45 caracteres.
              </Form.Message>
            </Form.Field>

            <Form.Field name="unidade_medida">
              <Form.Label>Unidade de medida</Form.Label>
              <Select.Root
                name="unidade_medida"
                defaultValue="unidade"
                onValueChange={setMedida}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Unidade de medida</Select.Label>
                    <Select.Item value="unidade">Unidade</Select.Item>
                    <Select.Item value="kilo">Kilo</Select.Item>
                    <Select.Item value="litro">Litro</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Form.Field>

            <Form.Field name="preco_unidade">
              <Form.Label>Preço por {medida}</Form.Label>
              <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                <Form.Control
                  minLength={1}
                  maxLength={10}
                  max={9999999999}
                  min={0}
                  type="number"
                  pattern="[0-9]*"
                  className="rt-reset rt-TextFieldInput"
                  required
                />
              </div>
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
                <Switch name="perecivel" size="2" id="aa" defaultChecked />
                <Form.Label htmlFor="aa">Produto perecível</Form.Label>
              </Flex>
            </Form.Field>

            <div />

            <Form.Field name="lote">
              <Form.Label>Número do lote</Form.Label>
              <div className="rt-TextFieldRoot rt-r-size-2 rt-variant-surface rt-reset rt-TextFieldInput">
                <Form.Control
                  minLength={10}
                  maxLength={45}
                  className="rt-reset rt-TextFieldInput"
                  required
                />
              </div>
              <Form.Message className="error-message" match="valueMissing">
                Número do lote é obrigatório.
              </Form.Message>
              <Form.Message className="error-message" match="tooLong">
                Número do lote não pode ultrapassar 45 caracteres.
              </Form.Message>
            </Form.Field>

            <Form.Field name="data_validade">
              <Form.Label>Data de validade</Form.Label>
              <DatePicker
                name="data_validade"
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

          <Form.Submit>Adicionar</Form.Submit>
        </Form.Root>
      )}
    </>
  );
};

export default ProductManagement;
