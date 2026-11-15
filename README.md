# React Admin Panel

A modern, responsive, high-performance Admin Panel built with the latest stable version of **React.js (v18.3)**, **Vite**, **TypeScript**, and **Material UI (MUI v5)**, integrated with a modular Laravel REST API backend.

---

## Table of Contents

- [1. Technology Stack](#1-technology-stack)
- [2. Project Modules & Features](#2-project-modules--features)
- [3. Architecture & Design Patterns](#3-architecture--design-patterns)
- [4. Project Structure](#4-project-structure)
- [5. API Integration & Specifications](#5-api-integration--specifications)
- [6. Environment Configuration](#6-environment-configuration)
- [7. Installation & Quick Start](#7-installation--quick-start)
- [8. Production Build & Optimization](#8-production-build--optimization)
- [9. Default Demo Credentials](#9-default-demo-credentials)
- [10. Component Coding Standards](#10-component-coding-standards)
- [11. Troubleshooting & FAQs](#11-troubleshooting--faqs)

---

## 1. Technology Stack

| Category | Technology | Version | Description |
|---|---|---|---|
| **Core Framework** | React.js | `^18.3.1` | Modern functional components with React Hooks |
| **Language** | TypeScript | `^5.6.3` | Strict type checking without `any` |
| **Build Tool** | Vite | `^5.4.11` | Blazing fast HMR and Rollup-based production bundler |
| **UI Components** | Material UI (MUI) | `^5.16.7` | Accessible, responsive component library |
| **Icons** | Material Icons | `^5.16.7` | Standard MUI iconography |
| **Routing** | React Router DOM | `^6.28.0` | Declarative routing with `React.lazy` code splitting |
| **API Client** | Axios | `^1.7.7` | Centralized instance with interceptors and multipart support |
| **Server State** | TanStack Query | `^5.60.5` | Asynchronous data fetching, caching, and cache invalidation |
| **Form Management** | React Hook Form | `^7.53.2` | High-performance form state without unnecessary re-renders |
| **Form Validation** | Zod | `^3.23.8` | Schema declaration and validation |
| **Global State** | Redux Toolkit | `^2.3.0` | Predictable global state management (`@reduxjs/toolkit`, `react-redux`) |
| **Notifications** | React Toastify | `^10.0.6` | Toast feedback for API success/error states |
| **Date Handling** | Day.js | `^1.11.13` | Lightweight date formatting and relative timestamps |

---

## 2. Project Modules & Features

The panel strictly implements only the requested modules with complete CRUD capabilities:

### 1. Authentication & Profile Security
- **Admin Login**: Authenticate against `POST /api/auth/login` using email and password.
- **Session Persistence**: JWT access token stored in `localStorage` and synchronized with Redux Toolkit store.
- **Profile Fetching**: Automatic profile retrieval via `GET /api/auth/me`.
- **Edit Profile**: Update admin display name, contact email, phone number, and avatar image (`PUT /api/auth/profile`).
- **Change Password**: Dedicated security form with current password verification and new password confirmation (`POST /api/auth/change-password`).
- **Request Interceptor**: Centralized Axios interceptor automatically attaches `Authorization: Bearer {token}` to outgoing API calls.
- **Unauthorized Interceptor**: Intercepts `401 Unauthorized` responses, dispatches `logout()` in Redux, and safely redirects to `/login`.
- **Route Guards**:
  - `ProtectedRoute`: Prevents unauthenticated users from accessing protected admin pages.
  - `GuestRoute`: Redirects logged-in users away from the login screen to the dashboard.
- **Logout**: Seamless token invalidation via `POST /api/auth/logout` and cache reset.

### 2. Dashboard
- **Live Statistics**:
  - Total Users & Active Users count
  - Total Categories count
  - Total Blogs & Published Articles count
  - Backend System Health indicator
- **Data Integrity**: Uses actual Laravel backend listing endpoints (`/api/users/list`, `/api/categories/list`, `/api/blogs/list`) to aggregate statistics without mock numbers.
- **Recent Content**:
  - Recent Blog Posts table with category tags, publication status, and creation timestamps.
  - Recent Users table with user avatars, assigned roles, status chips, and join dates.

### 3. User Management
- **Listing & Pagination**: Server-side paginated data table (`POST /api/users/list`).
- **Debounced Search**: Search across user names, email addresses, and phone numbers.
- **Status Filter**: Filter users by `active`, `inactive`, or `pending`.
- **Add User**: Modal form with name, email, password, phone, status, and role assignment (`POST /api/users`).
- **Edit User**: Edit user profile and change assigned roles (`PUT /api/users/{uuid}`).
- **Status Toggle**: One-click activate/deactivate toggle (`PUT /api/users/{uuid}/toggle-status`).
- **Soft Deletion**: Confirmation dialog before soft-deleting (`DELETE /api/users/{uuid}`).
- **View Details**: Full user drawer displaying UUID, login timestamps, last login IP, and role badges.

### 4. Category Management
- **Hierarchical Listing**: Paginated category table (`POST /api/categories/list`) with visual depth indicators (`— Subcategory`).
- **Parent Category Selection**: Dynamic parent category dropdown avoiding self-nesting.
- **Add Category**: Supports category name, optional custom slug, parent category, display ordering, description, and image upload (`POST /api/categories`).
- **Edit Category**: Update metadata, hierarchy parent, and ordering (`PUT /api/categories/{uuid}`).
- **Image Support**: File upload support with live image preview.
- **View Details**: Modal inspecting tree path (e.g. `/1/5/`), hierarchy depth, ordering, and full-resolution image.
- **Delete Category**: Confirmation dialog before category removal (`DELETE /api/categories/{uuid}`).

### 5. Blog Management
- **Listing & Filtering**:
  - Filter by category via dropdown.
  - Filter by publication status (`published`, `draft`, `archived`).
  - Debounced search across article titles and excerpts.
- **Add Post**: Title, slug, category selection, rich HTML content textarea, excerpt, featured image upload, publish status, featured article toggle, and SEO metadata (`POST /api/blogs`).
- **Edit Post**: Edit all article fields; handles file uploads via Laravel method spoofing (`_method: 'PUT'`) (`PUT /api/blogs/{uuid}`).
- **Publish / Unpublish**: Instant toggle between published and draft states (`POST /api/blogs/{uuid}/publish` and `POST /api/blogs/{uuid}/unpublish`).
- **Featured Toggle**: One-click star toggle to highlight articles on the front page (`PUT /api/blogs/{uuid}/toggle-featured`).
- **Article Preview**: Modal previewing article hero image, formatted content, views counter, author, category, and SEO metadata.
- **Delete Post**: Safe deletion confirmation dialog (`DELETE /api/blogs/{uuid}`).

---

## 3. Architecture & Design Patterns

- **Feature-Based Modular Structure**: Code is grouped by domain feature (`auth`, `dashboard`, `users`, `categories`, `blogs`). Each feature owns its API services, hooks, types, schemas, components, and pages.
- **Separation of Concerns**:
  - UI presentation components are decoupled from API services.
  - Form validation rules are isolated in Zod schemas.
  - Server state is isolated in TanStack Query custom hooks.
- **Centralized API Client**: Axios is wrapped in `apiClient.ts` to manage base URL, authentication headers, and standard error handling in a single place.
- **Responsive Layout**: Material UI `AdminLayout` provides a responsive permanent drawer for desktop and a temporary collapsible drawer for mobile/tablet.
- **Strict Sidebar**: The sidebar menu displays **ONLY**:
  1. Dashboard
  2. Users
  3. Categories
  4. Blogs

---

## 4. Project Structure

```
c:\Users\Arghya\React\react-admin\
├── .env                    # Environment configuration
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── index.html              # HTML template with Google Fonts (Inter, Roboto)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build & chunking configuration
│
└── src/
    ├── main.tsx            # Application entry point
    │
    ├── app/
    │   ├── App.tsx         # Root component
    │   ├── router.tsx      # Lazy routes with ProtectedRoute & GuestRoute
    │   ├── providers.tsx   # MUI ThemeProvider, QueryClientProvider, ToastContainer
    │   └── queryClient.ts  # TanStack Query client configuration
    │
    ├── components/
    │   ├── common/
    │   │   ├── ConfirmDialog.tsx   # Reusable confirmation modal
    │   │   ├── DataTable.tsx       # Reusable MUI data table with pagination
    │   │   ├── EmptyState.tsx      # Empty records placeholder
    │   │   ├── LoadingSpinner.tsx  # Circular loader
    │   │   ├── PageHeader.tsx      # Header bar with title, breadcrumbs, action button
    │   │   ├── SearchInput.tsx     # Debounced search bar with clear button
    │   │   └── StatusChip.tsx      # Color-coded status badge
    │   │
    │   ├── forms/
    │   │   ├── FormImageUpload.tsx # Image file picker with drag-and-drop preview
    │   │   ├── FormSelect.tsx      # Typed MUI select wrapper
    │   │   └── FormTextField.tsx   # MUI TextField wrapper with error helper text
    │   │
    │   └── layout/
    │       ├── AdminLayout.tsx     # Shell layout with responsive navigation drawer
    │       ├── Breadcrumbs.tsx     # Dynamic breadcrumb generator
    │       ├── Header.tsx          # Top app bar with user profile & logout
    │       └── Sidebar.tsx         # Sidebar menu (Dashboard, Users, Categories, Blogs)
    │
    ├── features/
    │   ├── auth/
    │   │   ├── api/authApi.ts
    │   │   ├── hooks/useAuth.ts
    │   │   ├── pages/LoginPage.tsx
    │   │   ├── schemas/loginSchema.ts
    │   │   └── types/auth.types.ts
    │   │
    │   ├── dashboard/
    │   │   ├── api/dashboardApi.ts
    │   │   ├── components/
    │   │   │   ├── RecentBlogsTable.tsx
    │   │   │   ├── RecentUsersTable.tsx
    │   │   │   └── StatCard.tsx
    │   │   ├── pages/DashboardPage.tsx
    │   │   └── types/dashboard.types.ts
    │   │
    │   ├── users/
    │   │   ├── api/userApi.ts
    │   │   ├── components/
    │   │   │   ├── UserDetailDialog.tsx
    │   │   │   └── UserFormDialog.tsx
    │   │   ├── hooks/useUsers.ts
    │   │   ├── pages/UsersListPage.tsx
    │   │   ├── schemas/userSchema.ts
    │   │   └── types/user.types.ts
    │   │
    │   ├── categories/
    │   │   ├── api/categoryApi.ts
    │   │   ├── components/
    │   │   │   ├── CategoryDetailDialog.tsx
    │   │   │   └── CategoryFormDialog.tsx
    │   │   ├── hooks/useCategories.ts
    │   │   ├── pages/CategoriesListPage.tsx
    │   │   ├── schemas/categorySchema.ts
    │   │   └── types/category.types.ts
    │   │
    │   └── blogs/
    │       ├── api/blogApi.ts
    │       ├── components/
    │       │   ├── BlogDetailDialog.tsx
    │       │   └── BlogFormDialog.tsx
    │       ├── hooks/useBlogs.ts
    │       ├── pages/BlogsListPage.tsx
    │       ├── schemas/blogSchema.ts
    │       └── types/blog.types.ts
    │
    ├── services/
    │   ├── apiClient.ts    # Central Axios instance with interceptors
    │   └── apiEndpoints.ts # API endpoint registry
    │
    ├── store/
    │   └── authStore.ts    # Zustand authentication state store
    │
    ├── theme/
    │   ├── index.ts        # Typography & component shape overrides
    │   └── palette.ts      # Custom modern light palette
    │
    ├── types/
    │   └── common.types.ts # Shared TypeScript interfaces (ApiResponse, PaginatedResponse)
    │
    └── utils/
        ├── constants.ts    # Base URLs, pagination defaults, and status enums
        ├── formatters.ts   # Day.js date and image storage URL formatters
        └── helpers.ts      # Error message extractors & debounce utility
```

---

## 5. API Integration & Specifications

### Base URL
`http://localhost/laravel-api`

### Authorization
All protected routes require a Bearer token in the request header:
```
Authorization: Bearer <jwt_access_token>
```

### Standard Response Format
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "errors": [],
  "meta": []
}
```

### Paginated Response Format
Listing endpoints return items in `data` and pagination metadata in `meta`:
```json
{
  "success": true,
  "message": "List retrieved successfully",
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 45,
    "from": 1,
    "to": 10
  }
}
```

### Multipart Form Data & Method Spoofing
When updating records with image files (e.g., Blog or Category images), the Axios client sends a `POST` request with `_method: 'PUT'` via FormData so that PHP/Laravel natively parses both the uploaded file and the text fields.

---

## 6. Environment Configuration

Create or verify the `.env` file in the root directory:

```env
# Backend API Base URL (without trailing slash)
VITE_API_BASE_URL=http://localhost/laravel-api

# Backend Storage URL for uploaded assets
VITE_STORAGE_BASE_URL=http://localhost/laravel-api/storage
```

---

## 7. Installation & Quick Start

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Running Laravel Backend API at `http://localhost/laravel-api`

### Step 1: Clone or Navigate to the Project
```bash
cd c:\Users\Arghya\React\react-admin
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```

The application will launch at:
`http://localhost:3000`

---

## 8. Production Build & Optimization

The project is configured with Rollup manual vendor chunking in `vite.config.ts` to ensure fast initial page loads and optimal cache retention:

- **Vendor Chunk**: `react`, `react-dom`, `react-router-dom`, `zustand`
- **MUI Chunk**: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- **TanStack Chunk**: `@tanstack/react-query`
- **Page Chunks**: Dynamically loaded via `React.lazy` only when the user navigates to each route.

### Build Production Bundle
```bash
npm run build
```

The compiled assets are output to the `/dist` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 9. Default Demo Credentials

The backend seeds several default accounts for testing:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@example.com` | `password` |
| **Editor** | `editor@example.com` | `password` |
| **Author** | `author@example.com` | `password` |

*(Quick-fill demo buttons are provided on the login page for rapid sign-in).*

---

## 10. Component Coding Standards

1. **Strict File Size Limits**: All component files are kept well below 300 lines (maximum component is 287 lines).
2. **TypeScript**: Clean interfaces, zero use of `any`.
3. **No Redundant Global State**: State is localized or managed via TanStack Query; only global authentication is stored in Zustand.
4. **Debounced Search**: Search input triggers with a 350ms debounce to prevent request flooding.
5. **No Unused Imports**: All unused imports, variables, and dead code have been eliminated.

---

## 11. Troubleshooting & FAQs

### 1. API Requests Fail with Network Error
- Verify that your local Apache server (XAMPP) is running.
- Test the health endpoint in your browser or terminal:
  ```bash
  curl http://localhost/laravel-api/api/health
  ```
  Expected output:
  ```json
  {"success":true,"message":"API is running","data":{"status":"healthy",...}}
  ```

### 2. Images Do Not Display
- Ensure the storage symlink has been created in your Laravel backend:
  ```bash
  php artisan storage:link
  ```
- Confirm `VITE_STORAGE_BASE_URL` in `.env` is set to `http://localhost/laravel-api/storage`.

### 3. Session Expired or 401 Unauthorized
- The Axios response interceptor will automatically wipe the expired token from `localStorage` and redirect to `/login`. Simply log in again.
