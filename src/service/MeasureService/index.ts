import { api } from "..";

export interface Measure {
  id: number;
  nome: string;
  sigla: string;
}

const MeasureService = {
  async getAll(): Promise<Measure[]> {
    const response = await api.get<{ data: Measure[] }>("/measure");
    return response.data.data;
  },
};

export { MeasureService };
