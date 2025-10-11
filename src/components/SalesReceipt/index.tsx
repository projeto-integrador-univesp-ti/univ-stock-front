import React, { useRef } from "react";
import "./styles.css";
import {
  formatBRLCurrencytoNumber,
  formatToBRLCurrency,
} from "../../utils/formatCurrency";
import QRCode from "react-qr-code";
import { Sale } from "../../service/SalesService";
import { useReactToPrint } from "react-to-print";
import { Button } from "@radix-ui/themes";
import { Cross2Icon, DownloadIcon } from "@radix-ui/react-icons";

interface SalesReceiptProps {
  sale: Sale;
  onClose?: () => void;
  fullScreen?: boolean;
}

const SalesReceipt: React.FC<SalesReceiptProps> = (props) => {
  const { sale, fullScreen = false, onClose } = props;
  const companyName = "Mini Mercadinho Thais";
  const companyCNPJ = "43.780.540/0001-48";
  const companyAddress =
    "Rua Dr. Lucas Nogueira Garcez, 1336, Jd. Suarão - Itanhaém - SP";

  const componentPrintRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: componentPrintRef });

  return (
    <div className={`${fullScreen && "receipt-full"}`}>
      <div className="menu-container no-print">
        <Button onClick={reactToPrintFn} variant="solid" size="1">
          Imprimir <DownloadIcon />
        </Button>
        {onClose && (
          <Button onClick={onClose} variant="solid" size="1">
            Fechar <Cross2Icon />
          </Button>
        )}
      </div>
      <div className="receipt zig-zag" ref={componentPrintRef}>
        <h1>Nota de compra</h1>
        <div className="receipt-header">
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

        <table className="receipt-table">
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

        <div className="receipt-footer">{sale.id}</div>
      </div>
    </div>
  );
};

export { SalesReceipt };
