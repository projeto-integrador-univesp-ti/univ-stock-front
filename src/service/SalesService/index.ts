import { api } from "..";

export type Sale = {
  id: string;
  valorTotal: string;
  valorPago: string;
  troco: string;
  dataVenda: string;
};

type Product = {
  nome: string;
  sigla: string;
  quantidade: string;
  precoUnidade: string;
};

export interface SaleWithProducts extends Sale {
  produtos: Product[];
}

export type SaleSave = {
  valorTotal: number;
  valorPago: number;
  troco: number;
  produtos: ProductSaleSave[];
};

export type ProductSaleSave = {
  idProduto: string;
  idMedida: number;
  quantidade: number;
  precoUnidade: number;
};

const SalesService = {
  async saveSale(sale: SaleSave): Promise<{ idVenda: string }> {
    const response = await api.post<{
      data: { idVenda: string };
    }>(`/sales`, sale);
    return response.data.data;
  },

  async getSale(id: string): Promise<SaleWithProducts | undefined> {
    const response = await api.get<{ data: SaleWithProducts[] }>(
      `/sales?id=${id}`
    );
    return response.data.data[0];
  },

  async getSaleByDate(
    dataInicio: string,
    dataFim: string
  ): Promise<SaleWithProducts[]> {
    const response = await api.get<{ data: SaleWithProducts[] }>(
      `/sales?dataInicio=${dataInicio}&dataFim=${dataFim}`
    );
    return response.data.data;
  },
};

export { SalesService };
