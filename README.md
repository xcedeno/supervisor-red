# 🛡️ Supervisor Red

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)

> **A scalable, high-performance dashboard for real-time network node monitoring and personnel supervision.**

---

## 📖 Project Overview

**Supervisor Red** is a modern administrative interface designed to simplify the complexity of monitoring distributed systems. Built with performance and scalability in mind, it provides a centralized hub for tracking metrics, managing user roles, and visualizing data in real-time.

This project serves as a comprehensive example of a **production-ready frontend architecture**, utilizing modern React patterns, strict typing, and optimized build tools.

### ✨ Key Features (Planned)

* **📊 Interactive Dashboard:** Real-time data visualization using dynamic charts (Recharts/Chart.js).
* **🔐 Authentication & Security:** Secure login flow with Role-Based Access Control (RBAC).
* **⚡ State Management:** Optimized global state handling using **Zustand**.
* **📡 Efficient Data Fetching:** Server-state management with **TanStack Query** (caching, retries).
* **📝 Form Handling:** Robust validation schemas with **Zod** and **React Hook Form**.
* **🎨 UI/UX:** Fully responsive design with **Tailwind CSS** and Dark Mode support.

---

## 🛠️ Tech Stack

This project uses a carefully selected stack to ensure type safety, speed, and maintainability.

| Category | Technology | Reason |
| :--- | :--- | :--- |
| **Core** | React 18 + TypeScript | Component-based UI with static type checking. |
| **Build Tool** | Vite | Lightning-fast HMR and optimized bundling. |
| **Styling** | Tailwind CSS | Utility-first CSS for rapid UI development. |
| **State** | Zustand | Lightweight and scalable global state management. |
| **Async Data** | TanStack Query | Powerful asynchronous state management. |
| **Routing** | React Router DOM | Standard routing library for SPA. |
| **Quality** | ESLint + Prettier | Code consistency and best practices. |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/xcedeno/supervisor-red.git](https://github.com/xcedeno/supervisor-red.git)
    cd supervisor-red
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser at `http://localhost:5173`.

---

## 🗺️ Development Roadmap

We are following an Agile development process structured in 5 key phases.

### 🟢 Phase 1: Foundation (Current Status)
- [x] Initialize Project with Vite + TypeScript.
- [x] Configure Tailwind CSS.
- [x] Set up ESLint and Prettier for code quality.
- [x] Define folder structure (Feature-based architecture).

### 🟡 Phase 2: Core UI & Layouts
- [ ] Create Layouts (Sidebar, Header, Main Content).
- [ ] Build atomic UI components (Buttons, Inputs, Cards).
- [ ] Implement Routing (React Router).
- [ ] Set up Dark/Light theme toggler.

### 🔴 Phase 3: Logic & Integration
- [ ] Implement Mock Authentication (Login/Logout).
- [ ] Configure Zustand for global UI state (sidebar toggle, theme).
- [ ] Set up TanStack Query for data fetching.
- [ ] Create "Mock API" services to simulate backend responses.

### 🔴 Phase 4: Dashboard Features
- [ ] **Module A:** Network Status Overview (Charts).
- [ ] **Module B:** Personnel Table (Search, Filter, Pagination).
- [ ] **Module C:** Incident Reporting Forms (Zod Validation).

### 🔴 Phase 5: Optimization & Deployment
- [ ] Unit Testing with Vitest.
- [ ] Performance Audit (Lighthouse).
- [ ] CI/CD Pipeline setup (GitHub Actions).
- [ ] Final Deployment (Vercel/Netlify).

---

## 📂 Project Structure

We follow a **Feature-First** architecture to ensure maintainability as the project grows.

```text
src/
├── assets/         # Static assets
├── components/     # Shared/Generic UI components (Buttons, Inputs)
├── features/       # Business logic modules (Auth, Dashboard, Users)
├── hooks/          # Shared custom hooks
├── layouts/        # Page layouts (DashboardLayout, AuthLayout)
├── lib/            # Third-party library configurations (Axios, QueryClient)
├── pages/          # Page entry points
├── routes/         # Route definitions
├── stores/         # Global state stores (Zustand)
├── types/          # Shared TypeScript interfaces
└── utils/          # Helper functions

-----

### 👨‍💼 Comentarios del Project Manager

He diseñado este README con una estrategia específica para tu portafolio:

1.  **Badges Visuales:** Captan la atención inmediata y muestran que estás actualizado con el stack moderno.
2.  **Tabla de Tech Stack:** Justifica *por qué* elegiste cada tecnología. Esto demuestra criterio técnico, algo que buscan los líderes de equipo.
3.  **Roadmap Interactivo:** La sección "Development Roadmap" con los checkboxes (`[x]` y `[ ]`) es vital. Muestra que:
      * Sabes planificar.
      * Trabajas de manera ordenada.
      * El proyecto está "vivo".
4.  **Arquitectura Explícita:** Mostrar el árbol de carpetas (`Project Structure`) valida que no eres un principiante que pone todo en un solo archivo.

**Siguiente paso sugerido:**
Copia este código en tu archivo `README.md`, haz un commit y súbelo. Luego, dime si quieres que **comencemos con la Fase 1.4 (Definir estructura de carpetas)** para que coincida con lo que acabamos de prometer en el documento.