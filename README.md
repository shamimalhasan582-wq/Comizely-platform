# Comizely Platform - Frontend Architecture & API Integration Guide

Welcome to the **Comizely Platform** frontend codebase! This project is crafted using **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.

To make backend integration seamless and straightforward for frontend & full-stack developers, the project features a **centralized Service & API Layer** and a **Global App Context**.

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔌 Connecting to your Backend API

By default, the application runs with mock local persistence so that the UI can be developed and demonstrated independently.

To switch from mock data to your live backend API:

1. Open `.env` (or copy from `.env.example`):
   ```env
   VITE_API_BASE_URL=https://your-api-domain.com/api
   VITE_USE_MOCK_API=false
   ```

2. When `VITE_USE_MOCK_API=false`, all service calls will automatically query your `VITE_API_BASE_URL` using `src/services/apiClient.ts`.

---

## 📂 Project Structure

```text
src/
├── services/           # 🔌 Centralized API service layer (Backend integration here)
│   ├── apiClient.ts    # Reusable HTTP client (Bearer auth, error handling, get/post/put/delete)
│   ├── orderService.ts # Order API calls & mock fallbacks
│   ├── productService.ts # Product API calls
│   ├── customerService.ts# Customer & Tag API calls
│   ├── purchaseService.ts# Purchase & Supplier API calls
│   └── index.ts        # Service barrel export
├── context/
│   └── AppContext.tsx  # React Context & useApp() custom hook
├── components/         # Clean modular UI views & dialogs
│   ├── orders/
│   ├── products/
│   ├── purchases/
│   ├── customers/
│   ├── suppliers/
│   ├── finance/
│   ├── dashboard/
│   └── ...
├── data/               # Mock data references
└── types/              # TypeScript interface definitions
```

---

## 🔑 Authentication & Bearer Tokens

The `apiClient` manages token-based authorization automatically:
```ts
import { setAuthToken, clearAuthToken } from './services/apiClient';

// On successful login:
setAuthToken(response.data.token);

// On logout:
clearAuthToken();
```

---

## 📡 Expected Backend API Endpoints

| Resource | Method | Endpoint | Description |
|---|---|---|---|
| **Orders** | `GET` | `/orders` | Fetch all orders |
| | `POST` | `/orders` | Create new order |
| | `PATCH` | `/orders/:id/status` | Update order status |
| | `DELETE` | `/orders/:id` | Delete an order |
| **Products** | `GET` | `/products` | Fetch all products |
| | `POST` | `/products` | Create a new product |
| | `PATCH` | `/products/:id/stock`| Update inventory stock |
| | `DELETE` | `/products/:id` | Remove a product |
| **Customers** | `GET` | `/customers` | Fetch all customers |
| | `POST` | `/customers` | Create customer |
| | `DELETE` | `/customers/:id` | Remove customer |
| **Purchases** | `GET` | `/purchases` | Fetch purchase records |
| | `POST` | `/purchases` | Create purchase record |
| | `DELETE` | `/purchases/:id` | Remove purchase record |
| **Suppliers** | `GET` | `/suppliers` | Fetch all suppliers |
| | `POST` | `/suppliers` | Add new supplier |

All payload shapes match the TypeScript definitions in `src/types/index.ts`.
