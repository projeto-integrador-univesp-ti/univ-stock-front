import { api } from "./..";

export interface Product {
  id: string;
  nome: string;
  marca: string;
  codigo: string;
  quantidade: number;
  precoUnidade: number;
  perecivel: boolean;
  idMedida: number;
}

export interface ProductDecrease {
  codigo: string;
  quantidade: number;
}

const ProductService = {
  async getByCode(code: string): Promise<Product> {
    const response = await api.get<{ data: Product }>(`/product/${code}`);
    return response.data.data;
  },

  async getAll(): Promise<Product[]> {
    const response = await api.get<{ data: Product[] }>("/product");
    return response.data.data;
  },

  async add(product: Omit<Product, "id">): Promise<Product> {
    const response = await api.post<{ data: Product }>("/product", product);
    return response.data.data;
  },
 
  async update(product: Product ): Promise<Product> {
    const response = await api.put<{ data: Product }>(`/product/${product.id}`, product);
    return response.data.data;
  },

  async decrease(products: ProductDecrease[]): Promise<{ message: string }> {
    const response = await api.patch<{ data: { message: string } }>("/product/decrease", {
      produtos: products,
    });
    return response.data.data;
  },
};

export { ProductService };
