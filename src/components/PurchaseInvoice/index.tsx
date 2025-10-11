import {
  ChevronRightIcon,
  Cross2Icon,
  DownloadIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, Spinner, Text } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Sale, SalesService } from "../../service/SalesService";
import { SalesReceipt } from "../SalesReceipt";
import "./styles.css";

interface PurchaseInvoiceProps {
  open: boolean;
  saleId: string;
  onClickClose: () => void;
}

const PurchaseInvoice: React.FC<PurchaseInvoiceProps> = (props) => {
  const { open, saleId, onClickClose } = props;
  const componentPrintRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: componentPrintRef });
  const [spinnerActive, setSpinnerActive] = useState(true);
  const [error, setError] = useState(false);
  const [sale, setSale] = useState({} as Sale);

  const fakePromise = (): Promise<boolean> => {
    return new Promise((res) => {
      setTimeout(() => res(true), 2000);
    });
  };

  const getSale = async (id: string) => {
    try {
      setSpinnerActive(true);
      const [saleData] = await Promise.all([
        SalesService.getSale(id),
        fakePromise(),
      ]);

      setSale(saleData);
    } catch {
      setError(true);
    } finally {
      setSpinnerActive(false);
    }
  };

  useEffect(() => {
    if (!saleId) {
      return;
    }
    getSale(saleId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={componentPrintRef}
      className="purchase-invoice"
      style={{ display: open ? "block" : "none" }}
    >
      <div className="menu-container no-print">
        <Button onClick={reactToPrintFn} variant="solid" size="1">
          Imprimir <DownloadIcon />
        </Button>
        <Button onClick={onClickClose} variant="solid" size="1">
          Fechar <Cross2Icon />
        </Button>
      </div>

      {spinnerActive && (
        <Flex
          width="100vw"
          height="200px"
          align="center"
          justify="center"
          gap="4"
        >
          <Spinner
            size="3"
            style={{ height: 28, color: "var(--accent-indicator)" }}
          />
        </Flex>
      )}

      {error && (
        <Flex
          direction="column"
          width="100vw"
          height="200px"
          align="center"
          justify="center"
          gap="4"
        >
          <Text as="p" size="4">
            Ocorreu um erro ao recuperar a nota de venda, vá através do menu
          </Text>
          <Flex align="center" justify="center" gap="3">
            <Text as="p" size="4">
              Vendas
            </Text>

            <ChevronRightIcon />

            <Text as="p" size="4">
              Notas de vendas
            </Text>
          </Flex>
        </Flex>
      )}

      {!spinnerActive && sale.id && (
        <SalesReceipt sale={sale} fullScreen onClose={onClickClose} />
      )}
    </div>
  );
};

export { PurchaseInvoice };
