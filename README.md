# TaskFlow Manager

Aplikasi manajemen tugas (To-Do List) modern yang dibangun menggunakan ekosistem React. Aplikasi ini berfungsi sepenuhnya secara offline dengan mensimulasikan perilaku server sungguhan (latensi, error, dan autentikasi).

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| State Management | Zustand 5 |
| Data Fetching | Axios + TanStack React Query 5 |
| Form & Validasi | React Hook Form 7 + Zod 4 |
| Routing | React Router DOM 7 |
| Unit Testing | Vitest + JSDOM |
| Notifikasi | React Hot Toast |

## Cara Menjalankan

### Prasyarat

- Node.js >= 18
- npm >= 9

### Instalasi

```bash
git clone https://github.com/ryudhis/taskflow-manager.git
cd taskflow-manager
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

### Menjalankan Test

```bash
# Menjalankan semua test sekali
npm test

# Menjalankan test dalam mode watch
npm run test:watch
```

### Build Produksi

```bash
npm run build
npm run preview
```

### Kredensial Login

| Field | Value |
|---|---|
| Email | admin@taskflow.com |
| Password | admin123 |

## Struktur Folder

```
src/
├── api/                    # Abstraksi Mock API & Tests
│   ├── axios.ts            # Axios instance + interceptors
│   ├── auth.service.ts     # Mock auth (login, verify token)
│   ├── auth.service.test.ts
│   ├── task.service.ts     # Mock CRUD task + bulk operations
│   └── task.service.test.ts
├── components/
│   ├── ui/                 # Komponen UI reusable
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   ├── Modal.tsx
│   │   └── Select.tsx
│   ├── layout/             # Layout wrapper
│   │   ├── Header.tsx
│   │   └── AppLayout.tsx
│   ├── task/               # Komponen terkait task
│   │   ├── TaskForm.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskEditModal.tsx
│   │   ├── TaskEmptyState.tsx
│   │   └── TaskListSkeleton.tsx
│   ├── filter/             # Search & filter
│   │   ├── FilterBar.tsx
│   │   └── SearchInput.tsx
│   └── bulk/               # Bulk actions
│       └── BulkActionBar.tsx
├── hooks/                  # Custom hooks
│   ├── useAuth.ts          # Auth hooks (login, logout)
│   └── useTasks.ts         # React Query hooks (CRUD + optimistic updates)
├── lib/                    # Utilities & Tests
│   ├── storage.ts          # Type-safe localStorage wrapper
│   └── storage.test.ts
├── pages/                  # Halaman
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── routes/                 # Routing
│   ├── index.tsx           # Router config
│   └── PrivateRoute.tsx    # Auth guard
├── stores/                 # Zustand stores & Tests
│   ├── auth.store.ts       # Auth state + persist
│   ├── auth.store.test.ts
│   ├── filter.store.ts     # Filter, search, selection state
│   ├── filter.store.test.ts
│   ├── theme.store.ts      # Theme (light/dark/system) + persist
│   └── theme.store.test.ts
├── schemas/                # Zod validation
│   ├── auth.schema.ts
│   └── task.schema.ts
├── test/                   # Test setup & configuration
│   └── setup.ts
├── types/                  # TypeScript interfaces
│   └── index.ts
├── App.tsx                 # Root component + providers
├── main.tsx                # Entry point
└── index.css               # Global styles + animations
```

## Arsitektur

### Pemisahan 3-Layer

1. **UI Layer** — Komponen React murni presentational, tidak mengakses localStorage secara langsung.
2. **State Layer** — Zustand stores hanya untuk non-server state (auth session, filter, selection, theme).
3. **Data Layer** — React Query sebagai satu-satunya source of truth untuk data task. Mock API Service membungkus semua operasi CRUD.

### Mock API

Menggunakan pembungkus Promise manual sebagai pengganti database. Setiap API call memiliki:
- Simulasi latensi 800ms-1000ms
- ~5% chance random error pada operasi mutasi
- Axios interceptors untuk auth header injection dan 401 handling

### Unit Testing

Aplikasi mencakup unit testing yang komprehensif menggunakan **Vitest** dan **JSDOM** untuk memastikan logika bisnis berjalan dengan sesuai:
- **API Services**: Testing skenario login, verifikasi token, dan operasi CRUD (termasuk penanganan error).
- **Zustand Stores**: Testing perubahan state global untuk autentikasi, filter, dan tema.
- **Utilities**: Testing integritas data pada wrapper `localStorage`.
- **Mock Timers**: Menggunakan `vi.useFakeTimers()` untuk testing fungsi async tanpa menunggu latensi asli.

### Optimistic Updates

Semua mutations (create, update, delete, bulk) menggunakan optimistic updates:
1. `onMutate` — Snapshot cache → update cache optimistically
2. `onError` — Rollback ke snapshot + toast error
3. `onSettled` — `invalidateQueries` untuk re-sync

## Fitur

- Login/Logout dengan mock auth (kredensial hardcoded)
- Session persist (survive page refresh)
- Private route guard
- CRUD task (create, read, update, delete)
- Edit task via modal dialog
- Priority (Rendah/Sedang/Tinggi) dan tenggat waktu
- Global search dengan debounce 300ms
- Filter status (Semua/Selesai/Belum Selesai)
- Multi-select dengan checkbox
- Bulk actions (hapus massal, selesaikan massal)
- Select all berdasarkan filter aktif
- Dark mode toggle (Light/Dark/System)
- Skeleton loading states
- Error handling dengan toast notifications
- Responsive design (mobile-first)

## Asumsi

- Aplikasi bersifat single-user (tidak ada multi-tenancy)
- Data disimpan di localStorage, sehingga terbatas pada satu browser/device
- Token autentikasi bersifat statis (mock), tidak memiliki expiry
- Tidak ada sorting tugas (urutan berdasarkan waktu pembuatan, terbaru di atas)

## Tantangan

- **Zod v4 + React Hook Form**: Terdapat ketidakcocokan tipe antara input/output type inference dari Zod v4 dengan resolver react-hook-form. Diselesaikan dengan menggunakan `z.union()` dan menghindari `.optional().default()`.
- **Tailwind CSS v4**: Konfigurasi dark mode variant menggunakan `@custom-variant dark` yang berbeda dari v3.
- **Simulasi Error**: Menyeimbangkan antara mendemonstrasikan error handling tanpa membuat pengalaman pengguna terganggu (5% error rate).

## Saran Improvisasi

- Menambahkan fitur drag-and-drop untuk reorder task
- Implementasi subtask/checklist di dalam task
- Menambahkan kategori/label (tag) pada task
- Fitur export/import data (JSON/CSV)
- Undo action (misal: undo delete)
- Sorting berdasarkan prioritas, tanggal, atau status
- Animasi transisi antar halaman
