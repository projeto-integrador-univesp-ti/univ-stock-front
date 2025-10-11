import React, { useState } from "react";
import { SalesReceipt } from "../../components/SalesReceipt";
import "./style.css";
import { Button, Flex, Spinner, Text, TextField } from "@radix-ui/themes";
import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Sale, SalesService } from "../../service/SalesService";

const Receipt: React.FC = () => {
  const [input, setInput] = useState("");
  const [sale, setSale] = useState<Sale>();
  const [error, setError] = useState(false);
  const [spinnerActive, setSpinnerActive] = useState(false);

  const getSale = async (id: string) => {
    try {
      setSpinnerActive(true);
      setError(false);

      const [saleData] = await Promise.all([
        SalesService.getSale(id),
        // fakePromise(),
      ]);

      setSale(saleData);
    } catch {
      setError(true);
    } finally {
      setSpinnerActive(false);
    }
  };

  const cleanSale = () => {
    setSale(undefined);
  };

  return (
    <>
      {!sale && (
        <Flex
          direction="column"
          height="200px"
          align="center"
          justify="center"
          gap="4"
        >
          <Flex gap="3">
            <TextField.Root
              value={input}
              placeholder="Número da compra…"
              style={{ width: "60vw" }}
              disabled={spinnerActive}
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

      {spinnerActive && (
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
