import { http, HttpResponse, delay } from "msw";
import { Customers } from "../../../entities/customer/types/type";
import { Product } from "../../../entities/product/types/type";
import { Order } from "../../../entities/order/types/type";

const baseUrl = "http://localhost:4000";

let users: User[] = [
  { id: 1, email: "admin@test.com", role: "admin", name: "Admin User" },
  { id: 2, email: "staff@test.com", role: "staff", name: "Staff User" },
];

let customers: Customers[] = [
  {
    id: 1,
    name: "Acme Corp",
    email: "contact@acme.com",
    status: "active",
    createdAt: new Date("2024-01-15T10:00:00Z") as unknown as Date,
  },
];

let products: Product[] = [
  { id: 1, name: "CRM Suite", price: 1200, stock: 25, status: "active" },
];

let orders: Order[] = [
  {
    id: 1,
    customerId: 1,
    status: "pending",
    total: 2000,
    createdAt: new Date("2024-04-01T11:15:00Z") as unknown as Date,
  },
];

const paginate = <T,>(items: T[], page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};

export const resetMockData = () => {
  customers = [
    {
      id: 1,
      name: "Acme Corp",
      email: "contact@acme.com",
      status: "active",
      createdAt: new Date("2024-01-15T10:00:00Z") as unknown as Date,
    },
  ];
  products = [
    { id: 1, name: "CRM Suite", price: 1200, stock: 25, status: "active" },
  ];
  orders = [
    {
      id: 1,
      customerId: 1,
      status: "pending",
      total: 2000,
      createdAt: new Date("2024-04-01T11:15:00Z") as unknown as Date,
    },
  ];
};

export const setCustomers = (data: Customers[]) => {
  customers = data;
};

export const setProducts = (data: Product[]) => {
  products = data;
};

export const setOrders = (data: Order[]) => {
  orders = data;
};

export const handlers = [
  http.get(`${baseUrl}/users`, async ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const filtered = email
      ? users.filter((u) => u.email.toLowerCase() === email.toLowerCase())
      : users;
    return HttpResponse.json(filtered);
  }),

  http.get(`${baseUrl}/customers`, async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase();
    const status = url.searchParams.get("status");
    const page = Number(url.searchParams.get("_page")) || 1;
    const limit = Number(url.searchParams.get("_limit")) || 10;
    const sort = (url.searchParams.get("_sort") as keyof Customers | null) || "name";
    const order = (url.searchParams.get("_order") as "asc" | "desc" | null) || "asc";

    let result = [...customers];
    if (q) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    if (status) {
      result = result.filter((c) => c.status === status);
    }
    result.sort((a, b) => {
      const av = (a as any)[sort];
      const bv = (b as any)[sort];
      if (av < bv) return order === "asc" ? -1 : 1;
      if (av > bv) return order === "asc" ? 1 : -1;
      return 0;
    });

    const paged = paginate(result, page, limit);
    await delay(50);
    return HttpResponse.json(paged);
  }),

  http.post(`${baseUrl}/customers`, async ({ request }) => {
    const body = (await request.json()) as Omit<Customers, "id">;
    const id = customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1;
    const created: Customers = { ...body, id };
    customers.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${baseUrl}/customers/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Customers>;
    customers = customers.map((c) => (c.id === id ? { ...c, ...body } : c));
    const updated = customers.find((c) => c.id === id);
    return HttpResponse.json(updated);
  }),

  http.delete(`${baseUrl}/customers/:id`, async ({ params }) => {
    const id = Number(params.id);
    customers = customers.filter((c) => c.id !== id);
    return new HttpResponse(null, { status: 200 });
  }),

  http.get(`${baseUrl}/products`, async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase();
    const status = url.searchParams.get("status");
    const page = Number(url.searchParams.get("_page")) || 1;
    const limit = Number(url.searchParams.get("_limit")) || 10;

    let result = [...products];
    if (q) {
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (status) {
      result = result.filter((p) => p.status === status);
    }
    const paged = paginate(result, page, limit);
    return HttpResponse.json(paged);
  }),

  http.post(`${baseUrl}/products`, async ({ request }) => {
    const body = (await request.json()) as Omit<Product, "id">;
    const id = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const created: Product = { ...body, id };
    products.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${baseUrl}/products/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Product>;
    products = products.map((p) => (p.id === id ? { ...p, ...body } : p));
    const updated = products.find((p) => p.id === id);
    return HttpResponse.json(updated);
  }),

  http.delete(`${baseUrl}/products/:id`, async ({ params }) => {
    const id = Number(params.id);
    products = products.filter((p) => p.id !== id);
    return new HttpResponse(null, { status: 200 });
  }),

  http.get(`${baseUrl}/orders`, async () => {
    return HttpResponse.json(orders);
  }),

  http.post(`${baseUrl}/orders`, async ({ request }) => {
    const body = (await request.json()) as Omit<Order, "id">;
    const id = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
    const created: Order = { ...body, id };
    orders.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${baseUrl}/orders/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as Partial<Order>;
    orders = orders.map((o) => (o.id === id ? { ...o, ...body } : o));
    const updated = orders.find((o) => o.id === id);
    return HttpResponse.json(updated);
  }),
];
