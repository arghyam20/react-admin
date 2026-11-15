# React Admin Panel

A modern, responsive, fast-loading Admin Panel built with the latest stable version of **React.js (v18.3)**, **Vite**, **TypeScript**, and **Material UI (MUI v5)**, integrated with the Laravel REST API backend.

---

## 1. Technology Stack

- **Framework**: React 18.3 (TypeScript)
- **Build Tool**: Vite 5
- **UI Component Library**: Material UI (MUI v5)
- **Icons**: MUI Material Icons
- **Routing**: React Router DOM v6 (Code-split with React.lazy & Suspense)
- **API Client**: Axios (with centralized interceptors & multipart support)
- **Data Fetching & Caching**: TanStack Query (React Query v5)
- **Form Handling**: React Hook Form
- **Schema Validation**: Zod
- **Global State**: Zustand
- **Notifications**: React Toastify
- **Date Handling**: Day.js

---

## 2. Modules Implemented

The application strictly implements only the requested modules with complete CRUD capabilities:

1. **Authentication**
   - Secure Admin login with JWT tokens (`POST /api/auth/login`)
   - Profile retrieval (`GET /api/auth/me`)
   - Logout (`POST /api/auth/logout`)
   - Global session state managed via Zustand + localStorage persistence
   - Axios request interceptor attaches Bearer token automatically
   - Axios response interceptor handles `401 Unauthorized` and session expiration
   - `ProtectedRoute` and `GuestRoute` navigation guards

2. **Dashboard**
   - System overview stat cards: Total Users, Total Categories, Total Blogs, System Health
   - Calculated from live Laravel backend listing endpoints (`/api/users/list`, `/api/categories/list`, `/api/blogs/list`)
   - Recent Blog Posts table with publication status and categories
   - Recent Users table with roles and joined dates

3. **User Management**
   - User listing with server-side pagination, search, and status filtering (`POST /api/users/list`)
   - View complete user details (UUID, email, phone, roles, last login IP, timestamps)
   - Add new user with role assignment (`POST /api/users`)
   - Edit user profile and role assignment (`PUT /api/users/{uuid}`)
   - Toggle user status (Active / Inactive) (`PUT /api/users/{uuid}/toggle-status`)
   - Soft-delete user with confirmation dialog (`DELETE /api/users/{uuid}`)
   - Form validation with Zod and React Hook Form

4. **Category Management**
   - Hierarchical category listing with server-side pagination, search, and status filter (`POST /api/categories/list`)
   - Indented tree depth display in data table
   - Add category with name, slug, parent category selector, ordering, description, and optional image upload (`POST /api/categories`)
   - Edit category details (`PUT /api/categories/{uuid}`)
   - View category details modal with path, depth, and image preview
   - Delete category with confirmation dialog (`DELETE /api/categories/{uuid}`)

5. **Blog Management**
   - Blog article listing with server-side pagination, title search, category filter, and status filter (`POST /api/blogs/list`)
   - Add new blog with post title, category dropdown, content, excerpt, featured image upload, status (draft/published), featured toggle, and SEO metadata (`POST /api/blogs`)
   - Edit blog with method spoofing for multipart FormData updates (`PUT /api/blogs/{uuid}`)
   - Publish / Unpublish actions (`POST /api/blogs/{uuid}/publish`, `POST /api/blogs/{uuid}/unpublish`)
   - Toggle Featured article status (`PUT /api/blogs/{uuid}/toggle-featured`)
   - Full article preview dialog with formatted HTML content, view count, and SEO metadata
   - Delete blog with confirmation dialog (`DELETE /api/blogs/{uuid}`)

---

## 3. Project Structure

```
src/
├── app/
│   ├── App.tsx             # Root application component
│   ├── router.tsx          # React Router DOM configuration with route guards
│   ├── providers.tsx       # Theme, QueryClient, Toast notifications provider
│   └── queryClient.ts      # TanStack QueryClient configuration
│
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.tsx   # Reusable confirmation dialog
│   │   ├── DataTable.tsx       # Reusable MUI data table with pagination
│   │   ├── EmptyState.tsx      # Reusable empty records state
│   │   ├── LoadingSpinner.tsx  # Circular progress spinner
│   │   ├── PageHeader.tsx      # Page title and action button bar
│   │   ├── SearchInput.tsx     # Debounced search input
│   │   └── StatusChip.tsx      # Colored status badges
│   ├── forms/
│   │   ├── FormImageUpload.tsx # Image file upload with preview & validation
│   │   ├── FormSelect.tsx      # Typed MUI select wrapper
│   │   └── FormTextField.tsx   # MUI TextField wrapper with error handling
│   └── layout/
│       ├── AdminLayout.tsx     # Shell layout with responsive drawer
│       ├── Breadcrumbs.tsx     # Dynamic breadcrumb navigation
│       ├── Header.tsx          # Top app bar with user profile & logout
│       └── Sidebar.tsx         # Sidebar menu with Dashboard, Users, Categories, Blogs
│
├── features/
│   ├── auth/
│   │   ├── api/authApi.ts
│   │   ├── hooks/useAuth.ts
│   │   ├── pages/LoginPage.tsx
│   │   ├── schemas/loginSchema.ts
│   │   └── types/auth.types.ts
│   ├── dashboard/
│   │   ├── api/dashboardApi.ts
│   │   ├── components/
│   │   ├── pages/DashboardPage.tsx
│   │   └── types/dashboard.types.ts
│   ├── users/
│   │   ├── api/userApi.ts
│   │   ├── components/
│   │   ├── hooks/useUsers.ts
│   │   ├── pages/UsersListPage.tsx
│   │   ├── schemas/userSchema.ts
│   │   └── types/user.types.ts
│   ├── categories/
│   │   ├── api/categoryApi.ts
│   │   ├── components/
│   │   ├── hooks/useCategories.ts
│   │   ├── pages/CategoriesListPage.tsx
│   │   ├── schemas/categorySchema.ts
│   │   └── types/category.types.ts
│   └── blogs/
│       ├── api/blogApi.ts
│       ├── components/
│       ├── hooks/useBlogs.ts
│       ├── pages/BlogsListPage.tsx
│       ├── schemas/blogSchema.ts
│       └── types/blog.types.ts
│
├── services/
│   ├── apiClient.ts        # Central Axios instance with interceptors
│   └── apiEndpoints.ts     # Route mapping matching Laravel API endpoints
│
├── store/
│   └── authStore.ts        # Zustand auth state store
│
├── theme/
│   ├── index.ts            # MUI typography & component overrides
│   └── palette.ts          # Clean modern light color palette
│
├── types/
│   └── common.types.ts     # Shared pagination, API response & table types
│
└── utils/
    ├── constants.ts        # API URL, storage URL, status constants
    ├── formatters.ts       # Day.js date and URL formatters
    └── helpers.ts          # Error message parser & debounce utilities
```

---

## 4. Environment Configuration

Create or verify the `.env` file in the root directory:

```env
# Backend API Base URL (without trailing slash)
VITE_API_BASE_URL=http://localhost/laravel-api

# Backend Storage URL for uploaded images
VITE_STORAGE_BASE_URL=http://localhost/laravel-api/storage
```

---

## 5. Installation & Execution

### Prerequisites
- Node.js >= 18
- Running Laravel Backend API (`http://localhost/laravel-api`)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The application will launch at:
`http://localhost:3000`

---

## 6. Default Admin Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `password` |
| Editor | `editor@example.com` | `password` |
| Author | `author@example.com` | `password` |

*Quick login buttons are also provided on the Login page for rapid testing.*

---

## 7. Production Build

To build the project for production:

```bash
npm run build
```

This compiles TypeScript and bundles the assets into the `/dist` directory with vendor code splitting.

To preview the production build locally:

```bash
npm run preview
```
