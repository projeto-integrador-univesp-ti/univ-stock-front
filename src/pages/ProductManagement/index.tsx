import { TabNav } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Measure, MeasureService } from "../../service/MeasureService";
import { Product, ProductService } from "../../service/ProductService";
import { BatchProduct } from "./batch";
import { EditProduct } from "./edit";
import { SearchProduct } from "./search";

enum Action {
  SEARCH = "#search",
  ADD_EDIT = "#add-edit",
  BATCH = "#batch",
}

const ProductManagement = () => {
  const [hash, setHash] = useState(window.location.hash);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [blockUpdate, setBlockUpdate] = useState(false);

  const [productToEdit, setProductToEdit] = useState<Product>();
  const [productForBatch, setProductForBatch] = useState<Product>();

  const getProducts = async () => {
    setLoading(true);
    const allProducts = await ProductService.getAll();
    setProducts(allProducts);
    setLoading(false);
  };

  const fakePromise = () => {
    return new Promise((res) => {
      setTimeout(() => res(true), 1000);
    });
  };

  const updateProducts = async () => {
    setLoading(true);
    setBlockUpdate(true);
    const [allProducts] = await Promise.all([
      ProductService.getAll(),
      fakePromise(),
    ]);
    setProducts(allProducts);
    setLoading(false);
    setTimeout(() => setBlockUpdate(false), 10000);
  };

  const initMeasures = async () => {
    const measures = await MeasureService.getAll();
    setMeasures(measures);
  };

  const handleEditClick = (product: Product) => {
    setProductToEdit(product);
    window.location.hash = Action.ADD_EDIT;
  };

  const handleBatchClick = (product: Product) => {
    setProductForBatch(product);
    window.location.hash = Action.BATCH;
  };

  const handleFormDone = () => {
    window.location.hash = Action.SEARCH;
  };

  useEffect(() => {
    initMeasures();
    getProducts();
  }, []);

  useEffect(() => {
    const initHash = () => {
      const validHashes = [Action.SEARCH, Action.ADD_EDIT, Action.BATCH];
      if (!validHashes.includes(window.location.hash as Action)) {
        window.location.hash = Action.SEARCH;
      }
      setHash(window.location.hash);
    };

    const handleHashChange = () => {
      setHash(window.location.hash);
      if (window.location.hash !== Action.ADD_EDIT) {
        setProductToEdit(undefined);
      }
      if (window.location.hash !== Action.BATCH) {
        setProductForBatch(undefined);
      }
    };

    initHash();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <>
      <TabNav.Root>
        <TabNav.Link href={Action.SEARCH} active={hash === Action.SEARCH}>
          Buscar
        </TabNav.Link>
        <TabNav.Link href={Action.ADD_EDIT} active={hash === Action.ADD_EDIT}>
          {productToEdit ? "Editando Produto" : "Adicionar Produto"}
        </TabNav.Link>
        <TabNav.Link href={Action.BATCH} active={hash === Action.BATCH}>
          Lotes do Produto
        </TabNav.Link>
      </TabNav.Root>

      {hash === Action.SEARCH && (
        <SearchProduct
          products={products}
          measures={measures}
          loading={loading}
          blockUpdate={blockUpdate}
          onUpdateProducts={updateProducts}
          onEdit={handleEditClick}
          onGoToBatch={handleBatchClick}
        />
      )}

      {hash === Action.ADD_EDIT && (
        <EditProduct
          productToEdit={productToEdit}
          measures={measures}
          products={products}
          setProducts={setProducts}
          onDone={handleFormDone}
        />
      )}

      {hash === Action.BATCH && <BatchProduct product={productForBatch} />}
    </>
  );
};

export default ProductManagement;
