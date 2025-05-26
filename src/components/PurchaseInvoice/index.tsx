import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import QRCode from "react-qr-code";
import { Button, Flex, Spinner, Text, TextField } from "@radix-ui/themes";
import {
  Cross2Icon,
  DownloadIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  formatBRLCurrencytoNumber,
  formatToBRLCurrency,
} from "../../utils/formatCurrency";
import { Sale, SalesService } from "../../service/SalesService";
import { useReactToPrint } from "react-to-print";

interface PurchaseInvoiceProps {
  open: boolean;
  saleId: string;
  invoiceNumber: string;
  companyName: string;
  companyCNPJ: string;
  companyAddress: string;
  onClickClose: () => void;
}

const PurchaseInvoice: React.FC<PurchaseInvoiceProps> = ({
  open,
  saleId,
  companyName,
  companyCNPJ,
  companyAddress,
  onClickClose,
}) => {
  const componentPrintRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: componentPrintRef });
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [input, setInput] = useState("");
  const [sale, setSale] = useState({
    id: "",
    valorPago: "",
    valorTotal: "",
    troco: "",
    dataVenda: "",
    produtos: [],
  } as Sale);

  const fakePromise = (): Promise<boolean> => {
    return new Promise((res) => {
      setTimeout(() => res(true), 3000);
    });
  };

  const getSale = async (id?: string) => {
    try {
      setSpinnerActive(true);
      const [saleData] = await Promise.all([
        SalesService.getSale(id ?? saleId),
        fakePromise(),
      ]);

      setSale(saleData);
    } catch {
      setInput("");
    } finally {
      setSpinnerActive(false);
    }
  };

  useEffect(() => {
    if (!saleId) {
      return;
    }
    getSale();
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

      {!spinnerActive && !sale.id && (
        <Flex
          direction="column"
          width="100vw"
          height="200px"
          align="center"
          justify="center"
          gap="4"
        >
          <Text as="p" size="3">
            Nota não encontrada, busque novamente!
          </Text>
          <Flex gap="3">
            <TextField.Root
              placeholder="Número da compra…"
              style={{ width: "60vw" }}
              onChange={(event) => {
                setInput(event.target.value);
              }}
            >
              <TextField.Slot style={{ margin: "1rem 0", flex: "1" }}>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
            <Button variant="solid" size="2" onClick={() => getSale(input)}>
              Bucar
            </Button>
          </Flex>
        </Flex>
      )}

      {!spinnerActive && sale.id && (
        <div className="invoice zig-zag">
          <h1>Nota de compra</h1>
          <div className="invoice-header">
            <div>
              <strong>{companyName}</strong>
              <br />
              CNPJ: {companyCNPJ}
              <br />
              {companyAddress}
            </div>
            <div>
              <strong>Data da compra</strong>
              <br />
              {sale.dataVenda}
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th className="right">Qtd</th>
                <th className="right">Unid.</th>
                <th className="right">Valor Unit.</th>
                <th className="right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.produtos.map((item, index) => {
                const itemTotal = formatToBRLCurrency(
                  (
                    formatBRLCurrencytoNumber(item.quantidade) *
                    formatBRLCurrencytoNumber(item.precoUnidade)
                  ).toFixed(2)
                );
                return (
                  <tr key={index}>
                    <td>{item.nome.toUpperCase()}</td>
                    <td width="40" className="right">
                      {item.quantidade}
                    </td>
                    <td width="40" className="right">
                      {item.sigla.toUpperCase()}
                    </td>
                    <td width="80" className="right">
                      {item.precoUnidade}
                    </td>
                    <td width="80" className="right">
                      {itemTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-none">
                <td>
                  <strong>Qtd. total de itens</strong>
                </td>
                <td colSpan={4} className="right">
                  {sale.produtos.length.toString().padStart(3, "000")}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Valor total</strong>
                </td>
                <td colSpan={4} className="right">
                  R$ {formatToBRLCurrency(sale.valorTotal.toString())}
                </td>
              </tr>

              <tr className="border-none">
                <td>
                  <strong>Pagamento total</strong>
                </td>
                <td colSpan={4} className="right">
                  R$ {sale.valorPago}
                </td>
              </tr>

              <tr className="border-none">
                <td>
                  <strong>Troco</strong>
                </td>
                <td colSpan={4} className="right">
                  R$ {sale.troco}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="qr-code-container">
            <QRCode
              size={256}
              level="H"
              style={{ height: "auto", maxWidth: "150px", width: "150px" }}
              value={sale.id}
            />
          </div>

          <div className="invoice-footer">{sale.id}</div>
        </div>
      )}
    </div>
  );
};

export { PurchaseInvoice };
