import { api } from "./..";

export interface Product {
  id: string;
  nome: string;
  marca: string;
  quantidade: number;
  precoUnidade: number;
  perecivel: boolean;
  idMedida: number;
}

const ProductService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>("/product");
    return response.data;
  },

  async add(product: Omit<Product, "id">): Promise<Product> {
    const response = await api.post<{ data: Product }>("/product", product);
    return response.data.data;
  },
};

export { ProductService };
