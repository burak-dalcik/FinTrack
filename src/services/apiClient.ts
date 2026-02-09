import axios, { AxiosInstance } from "axios";

export type Environment = "preview" | "staging" | "production";

const DEFAULT_ENV: Environment = "production";
const ENV_STORAGE_KEY = "fintrack_env";
const BUSINESS_CODENAME_KEY = "fintrack_business_codename";

const BASES: Record<Environment, string> = {
  preview: "https://fintrack.prw.mindbricks.com",
  staging: "https://fintrack-stage.mindbricks.co",
  production: "https://fintrack.mindbricks.co"
};

type ServiceName =
  | "auth"
  | "customerManagement"
  | "supplierManagement"
  | "invoiceManagement"
  | "paymentManagement"
  | "expenseManagement"
  | "productCatalog"
  | "bff";

export const getEnvironment = (): Environment => {
  const stored = (localStorage.getItem(ENV_STORAGE_KEY) as Environment | null) ?? DEFAULT_ENV;
  return stored && stored in BASES ? stored : DEFAULT_ENV;
};

export const setEnvironment = (env: Environment) => {
  localStorage.setItem(ENV_STORAGE_KEY, env);
};

export const getBusinessCodename = () =>
  localStorage.getItem(BUSINESS_CODENAME_KEY) ?? "babil";

export const setBusinessCodename = (codename: string) => {
  localStorage.setItem(BUSINESS_CODENAME_KEY, codename);
};

const getServiceBaseUrl = (service: ServiceName) => {
  const appBase = BASES[getEnvironment()];
  switch (service) {
    case "auth":
      return `${appBase}/auth-api`;
    case "customerManagement":
      return `${appBase}/customermanagement-api`;
    case "supplierManagement":
      return `${appBase}/suppliermanagement-api`;
    case "invoiceManagement":
      return `${appBase}/invoicemanagement-api`;
    case "paymentManagement":
      return `${appBase}/paymentmanagement-api`;
    case "expenseManagement":
      return `${appBase}/expensemanagement-api`;
    case "productCatalog":
      return `${appBase}/productcatalog-api`;
    case "bff":
      return `${appBase}/bff-service`;
    default:
      return appBase;
  }
};

const createServiceClient = (service: ServiceName): AxiosInstance => {
  const client = axios.create({
    baseURL: getServiceBaseUrl(service),
    timeout: 10000
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("fintrack_auth_token");
    const businessCodename = getBusinessCodename();

    config.headers = {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "mbx-business-codename": businessCodename
    };

    return config;
  });

  return client;
};

export const authClient = createServiceClient("auth");
export const customerClient = createServiceClient("customerManagement");
export const supplierClient = createServiceClient("supplierManagement");
export const invoiceClient = createServiceClient("invoiceManagement");
export const paymentClient = createServiceClient("paymentManagement");
export const expenseClient = createServiceClient("expenseManagement");
export const productClient = createServiceClient("productCatalog");
export const bffClient = createServiceClient("bff");

