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

const BatchService = {
  async getAll(): Promise<Batch[]> {
    const response = await api.get<{ data: Batch[] }>("/batch");
    return response.data.data;
  },

  async add(batch: Omit<Batch, "id">): Promise<Batch> {
    const response = await api.post<{ data: Batch }>("/batch", batch);
    return response.data.data;
  },
};

export { BatchService };
