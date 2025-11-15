import { api } from "..";

export interface Batch {
  id: string;
  codigo: string | null;
  dtFabricacao: Date | null;
  dtValidade: Date | null;
  observacoes: string;
  idProduto: string;
  quantidade: number;
}

export interface ExpiringBatchItem {
  nome: string;
  lote: string;
  data: string;
  quantidade: string;
}

export interface ExpiringBatches {
  semana: ExpiringBatchItem[];
  mes: ExpiringBatchItem[];
}

const BatchService = {
  async getAll(): Promise<Batch[]> {
    const response = await api.get<{ data: Batch[] }>("/batch");
    return response.data.data;
  },

  async getExpiring(): Promise<ExpiringBatches> {
    const response = await api.get<ExpiringBatches>(
      "/batch/expiring"
    );
    return response.data;
  },

  async add(batch: Omit<Batch, "id">): Promise<Batch> {
    const response = await api.post<{ data: Batch }>("/batch", batch);
    return response.data.data;
  },
};

export { BatchService };
