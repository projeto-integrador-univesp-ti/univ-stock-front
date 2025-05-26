import { api } from "..";

export type Sale = {
  id: string,
  valorTotal: string;
  valorPago: string;
  troco: string;
  dataVenda: string;
  produtos: ProductSale[];
};

export type ProductSale = {
  nome: string;
  sigla: string;
  quantidade: string;
  precoUnidade: string;
};

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

  async getSale(id: string): Promise<Sale> {
    const response = await api.get<{ data: Sale }>(`/sales/${id}`);
    return response.data.data;
  },
};

export { SalesService };
