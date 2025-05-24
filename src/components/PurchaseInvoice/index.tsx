import React, { useEffect, useState } from "react";
import "./styles.css";
import QRCode from "react-qr-code";
import { Button, Flex, Spinner } from "@radix-ui/themes";
import { Cross2Icon, DownloadIcon } from "@radix-ui/react-icons";
import {
  formatBRLCurrencytoNumber,
  formatToBRLCurrency,
} from "../../utils/formatCurrency";

interface PurchaseItem {
  description: string;
  quantity: number;
  acronym: string;
  unitPrice: number;
}

interface PurchaseInvoiceProps {
  open: boolean;
  invoiceNumber: string;
  companyName: string;
  companyCNPJ: string;
  companyAddress: string;
  date: Date;
  items: PurchaseItem[];
  onClickPrint: () => void;
  onClickClose: () => void;
}

const formatDateTime = (date: Date): string => {
  const d = date.toLocaleDateString("pt-BR");
  const t = date.toLocaleTimeString("pt-BR");
  return `${d} ${t}`;
};

const PurchaseInvoice: React.FC<PurchaseInvoiceProps> = ({
  open,
  invoiceNumber,
  companyName,
  companyCNPJ,
  companyAddress,
  date,
  items,
  onClickPrint,
  onClickClose,
}) => {
  const [spinnerActive, setSpinnerActive] = useState(true);

  const total = items.reduce((acc, item) => {
    return formatToBRLCurrency(
      (
        formatBRLCurrencytoNumber(acc) +
        item?.unitPrice * item?.quantity
      ).toFixed(2)
    );
  }, "0,00");

  useEffect(() => {
    setSpinnerActive(open)
    setTimeout(() => {
      setSpinnerActive(false);
    }, 1500);
  }, [open]);

  return (
    <div
      className="purchase-invoice"
      style={{ display: open ? "block" : "none" }}
    >
      <div className="menu-container no-print">
        <Button onClick={onClickPrint} variant="solid" size="1">
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
      {!spinnerActive && (
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
              {formatDateTime(date)}
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th className="right">Qtd</th>
                <th>Unid.</th>
                <th>Valor Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const itemTotal = item.quantity * item.unitPrice;
                return (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td width="40" className="right">
                      {item.quantity.toFixed(3).replace(".", ",")}
                    </td>
                    <td width="40">{item.acronym}</td>
                    <td width="80">
                      {formatToBRLCurrency(item.unitPrice.toFixed(2))}
                    </td>
                    <td width="80">
                      {formatToBRLCurrency(itemTotal.toFixed(2))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-none">
                <td colSpan={4} className="right">
                  <strong>Qtd. total de itens</strong>
                </td>
                <td>{items.length.toString().padStart(3, "000")}</td>
              </tr>
              <tr>
                <td colSpan={4} className="right">
                  <strong>Total Geral</strong>
                </td>
                <td>R$ {formatToBRLCurrency(total.toString())}</td>
              </tr>
            </tfoot>
          </table>

          <div className="qr-code-container">
            <QRCode
              size={256}
              level="H"
              style={{ height: "auto", maxWidth: "150px", width: "150px" }}
              value={invoiceNumber}
            />
          </div>

          <div className="invoice-footer">Nota nº {invoiceNumber}</div>
        </div>
      )}
    </div>
  );
};

export { PurchaseInvoice };
