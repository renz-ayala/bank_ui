export interface ClientDashboardDto {
  client: Client;
  products: Product[];
}

interface Product {
  productType: string;
  productName: string;
  balance: string;
}

interface Client {
  names: string;
  surnames: string;
  documentType: string;
  documentNum: string;
}
