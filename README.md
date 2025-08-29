# Twitter Clone 🐦

Sebuah aplikasi klon Twitter lengkap yang dibangun dengan teknologi modern untuk pembelajaran dan demonstrasi full-stack development dengan fitur autentikasi dan real-time communication.

## 🚀 Teknologi yang Digunakan

### Backend
- **[Hono](https://hono.dev/)** - Framework web super cepat untuk TypeScript
- **[Bun](https://bun.sh/)** - Runtime JavaScript yang cepat dengan built-in bundler
- **[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)** - Real-time bidirectional communication
- **[JWT](https://jwt.io/)** - JSON Web Tokens untuk autentikasi stateless
- **[bcrypt](https://www.npmjs.com/package/bcryptjs)** - Password hashing untuk keamanan
- **TypeScript** - Superset JavaScript dengan type safety

### Frontend
- **[React 19](https://react.dev/)** - Library untuk membangun user interface
- **[Vite](https://vitejs.dev/)** - Build tool yang cepat untuk development
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[Context API](https://react.dev/reference/react/useContext)** - State management global
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Styling modern dengan responsive design

### Fitur Utama
- ✅ **Autentikasi Pengguna** - Register, login, logout dengan JWT
- ✅ **Posting Tweet** - Membuat tweet dengan validasi 280 karakter
- ✅ **Timeline Real-time** - Melihat tweet baru secara langsung
- ✅ **WebSocket Connection** - Real-time updates tanpa refresh
- ✅ **Protected Routes** - Halaman yang memerlukan autentikasi
- ✅ **Type-safe API** - Komunikasi aman dengan Hono RPC
- ✅ **Responsive Design** - UI yang menarik di desktop dan mobile
- ✅ **Error Handling** - Penanganan error yang komprehensif
- ✅ **Loading States** - Feedback visual untuk user experience

## 📁 Struktur Proyek

```
twitter-clone/
├── client/          # Frontend React aplikasi
│   ├── src/
│   │   ├── components/  # Komponen React (Header, Tweet, TweetForm, dll)
│   │   ├── contexts/    # Context providers (AuthContext untuk state global)
│   │   ├── hooks/       # Custom hooks (useWebSocket, useAuth)
│   │   ├── lib/         # API client dan utilities (Hono RPC client)
│   │   ├── types/       # Type definitions (User, Tweet, Auth interfaces)
│   │   └── ...
│   └── package.json
├── server/          # Backend Hono API
│   ├── src/
│   │   ├── index.ts     # Server utama dan routes (API endpoints)
│   │   ├── auth.ts      # Authentication logic (JWT, bcrypt)
│   │   ├── websocket.ts # WebSocket server (real-time communication)
│   │   └── types.ts     # Type definitions (shared dengan frontend)
│   └── package.json
└── README.md
```

## 🛠️ Instalasi dan Setup

### Prasyarat
- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [Bun](https://bun.sh/) (untuk backend)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/) (untuk frontend)

### 1. Clone Repository
```bash
git clone <repository-url>
cd twitter-clone
```

### 2. Setup Backend (Server)
```bash
cd server
bun install
bun dev
```

**Backend Services:**
- HTTP API Server: `http://localhost:3000`
- WebSocket Server: `ws://localhost:8080`

### 3. Setup Frontend (Client)
Buka terminal baru:
```bash
cd client
npm install
npm run dev
```

**Frontend Application:** `http://localhost:5173`

### 4. Environment Variables (Opsional)
Untuk production, buat file `.env` di folder `server/`:
```bash
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
WS_PORT=8080
```

## 🎯 Cara Menggunakan

1. **Jalankan Backend**: Pastikan server Hono berjalan di port 3000 dan WebSocket di port 8080
2. **Jalankan Frontend**: Buka aplikasi React di browser (`http://localhost:5173`)
3. **Register/Login**: Buat akun baru atau login dengan akun yang sudah ada
4. **Buat Tweet**: Setelah login, gunakan form untuk menulis tweet baru (max 280 karakter)
5. **Timeline Real-time**: Lihat tweet dari semua pengguna yang update secara real-time
6. **WebSocket Status**: Monitor status koneksi WebSocket di bagian atas aplikasi

### Fitur Autentikasi
- **Register**: Buat akun dengan username, email, dan password
- **Login**: Masuk dengan email dan password
- **Protected Routes**: Halaman timeline hanya bisa diakses setelah login
- **Auto Logout**: Token JWT akan expired setelah 7 hari

### Fitur Real-time
- **Live Updates**: Tweet baru akan muncul otomatis tanpa refresh
- **Connection Status**: Indikator status koneksi WebSocket
- **Auto Reconnect**: Otomatis reconnect jika koneksi terputus

## 🔧 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Mendaftarkan user baru

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-20T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`
Login user yang sudah terdaftar

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-20T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Tweet Endpoints

#### GET `/api/tweets`
Mengambil semua tweet yang tersedia

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "tweet-123",
    "author": "johndoe",
    "content": "Hello World!",
    "timestamp": "2024-01-20T10:30:00.000Z",
    "userId": "user-123"
  }
]
```

#### POST `/api/tweets`
Membuat tweet baru (memerlukan autentikasi)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "content": "Tweet content here (max 280 characters)"
}
```

**Response:**
```json
{
  "id": "tweet-456",
  "author": "johndoe",
  "content": "Tweet content here (max 280 characters)",
  "timestamp": "2024-01-20T10:35:00.000Z",
  "userId": "user-123"
}
```

### WebSocket Connection

#### WS `ws://localhost:8080?token=<jwt-token>`
Koneksi WebSocket untuk real-time updates

**Connection:**
- Memerlukan JWT token sebagai query parameter
- Otomatis menerima broadcast tweet baru
- Heartbeat mechanism untuk menjaga koneksi

**Message Format:**
```json
{
  "type": "new_tweet",
  "data": {
    "id": "tweet-789",
    "author": "janedoe",
    "content": "Real-time tweet!",
    "timestamp": "2024-01-20T10:40:00.000Z",
    "userId": "user-456"
  }
}
```

## 🏗️ Arsitektur

### System Architecture
Aplikasi ini menggunakan arsitektur modern dengan pemisahan yang jelas antara frontend dan backend:

**🔄 Alur Data:**
1. **Frontend** mengirim request ke **Backend API** (HTTP/HTTPS)
2. **Backend** memproses data dan menyimpan di memori
3. **WebSocket** mengirim update real-time ke semua client yang terhubung
4. **Frontend** menerima update dan memperbarui UI secara otomatis

**🔐 Keamanan:**
- JWT token untuk autentikasi stateless
- Password di-hash dengan bcrypt (salt + hash)
- Protected routes di frontend dan backend
- Authorization middleware untuk API endpoints
- WebSocket authentication dengan JWT token

**📡 Komunikasi:**
- **HTTP REST API** untuk operasi CRUD (Create, Read, Update, Delete)
- **WebSocket** untuk real-time updates dan live communication
- **Type-safe** communication menggunakan Hono RPC

### Type-Safe Communication
Proyek ini menggunakan **Hono RPC** untuk komunikasi type-safe antara frontend dan backend:

1. **Server** mengekspor type `AppType` yang mendefinisikan semua routes
2. **Client** menggunakan `hc<AppType>()` untuk membuat client yang type-safe
3. **TypeScript** memastikan semua API calls memiliki type yang benar
4. **Shared Types** digunakan di frontend dan backend untuk konsistensi

### Data Flow
```
User Action → React Component → Auth Context → Hono RPC Client → Hono Server → JWT Middleware → In-Memory Storage
                    ↓                                                                    ↓
UI Update ← React State ← WebSocket ← WebSocket Server ← Broadcast ← Data Processing
```

### Authentication Flow
```
Login/Register → JWT Token → Local Storage → Authorization Header → Protected Routes
       ↓                                                                    ↓
Auth Context → Global State → Component Access → API Calls → WebSocket Connection
```

## 🎨 Styling

Proyek ini menggunakan **CSS3 murni** dengan pendekatan modern dan sistem desain yang konsisten:

### 🎯 Design System
- **CSS Variables** untuk theming yang konsisten dan mudah diubah
- **Component-based styling** dengan CSS modules
- **Mobile-first** responsive design untuk semua device
- **Accessibility-focused** dengan proper contrast dan focus states
- **Smooth animations** dan transitions untuk UX yang lebih baik
- **Typography scale** yang konsisten untuk hierarki konten

### 🎨 Color Palette
```css
:root {
  /* Primary Colors */
  --primary-color: #1da1f2;        /* Twitter Blue */
  --primary-hover: #1991db;        /* Darker blue for hover */
  --primary-light: #e8f4fd;        /* Light blue for backgrounds */
  
  /* Neutral Colors */
  --background-color: #ffffff;      /* Main background */
  --surface-color: #f7f9fa;        /* Card/surface background */
  --text-primary: #14171a;          /* Primary text */
  --text-secondary: #657786;       /* Secondary text */
  --text-muted: #aab8c2;           /* Muted text */
  
  /* Border & Divider */
  --border-color: #e1e8ed;         /* Default borders */
  --border-light: #f7f9fa;         /* Light borders */
  
  /* Status Colors */
  --success-color: #17bf63;        /* Success states */
  --error-color: #e0245e;          /* Error states */
  --warning-color: #ffad1f;        /* Warning states */
  
  /* Interactive States */
  --hover-background: #f7f9fa;     /* Hover backgrounds */
  --focus-ring: #1da1f2;           /* Focus ring color */
}
```

### 📱 Responsive Breakpoints
```css
/* Mobile First Approach */
.container {
  /* Mobile: 320px+ */
  padding: 1rem;
}

@media (min-width: 768px) {
  /* Tablet */
  .container {
    padding: 2rem;
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .container {
    max-width: 1024px;
    margin: 0 auto;
  }
}
```

### 🎭 Component Architecture
- **Atomic Design** principles untuk komponen yang reusable
- **BEM methodology** untuk naming convention yang konsisten
- **CSS Custom Properties** untuk dynamic theming
- **Logical Properties** untuk better internationalization support
- **Container Queries** untuk responsive components (future-ready)

## 🔮 Pengembangan Selanjutnya

### ✅ Fitur yang Sudah Diimplementasikan
- **✅ Autentikasi User** - Login/Register dengan JWT dan bcrypt
- **✅ Real-time Updates** - WebSockets untuk live tweet updates
- **✅ Protected Routes** - Route protection di frontend dan backend
- **✅ Type-safe API** - Hono RPC untuk komunikasi yang aman
- **✅ Error Handling** - Comprehensive error handling dan loading states
- **✅ Responsive Design** - Mobile-friendly UI dengan CSS modern

### 🔄 Fitur yang Sedang Dikembangkan
- **🔄 Testing Suite** - Unit tests, integration tests, dan E2E tests
- **🔄 Performance Optimization** - Code splitting dan lazy loading

### 📋 Fitur yang Bisa Ditambahkan Selanjutnya
- **Database Persistence** - Integrasi dengan PostgreSQL/MongoDB untuk data permanen
- **Like & Retweet** - Interaksi dengan tweet (like, retweet, bookmark)
- **Komentar & Threads** - Reply pada tweet dan thread conversations
- **Follow System** - Following/followers dan personalized timeline
- **User Profiles** - Profile pages dengan bio, stats, dan tweet history
- **Media Upload** - Upload gambar, video, dan GIF
- **Search & Hashtags** - Full-text search dan trending topics
- **Notifications** - Real-time notifications untuk mentions, likes, follows
- **Direct Messages** - Private messaging system
- **Mobile App** - React Native atau Progressive Web App (PWA)
- **Admin Dashboard** - Content moderation dan analytics
- **Email Verification** - Email confirmation untuk registrasi
- **Password Reset** - Forgot password functionality
- **Two-Factor Authentication** - Enhanced security dengan 2FA
- **Dark Mode** - Theme switching untuk user experience

### 🛠️ Teknologi yang Bisa Diintegrasikan
- **Database**: Prisma + PostgreSQL atau MongoDB + Mongoose
- **File Storage**: Cloudinary, AWS S3, atau Supabase Storage
- **Email Service**: SendGrid, Mailgun, atau Resend
- **Caching**: Redis untuk session management dan caching
- **Search Engine**: Elasticsearch atau Algolia untuk advanced search
- **Analytics**: Google Analytics atau Mixpanel
- **Monitoring**: Sentry untuk error tracking
- **Deployment**: 
  - Frontend: Vercel, Netlify, atau GitHub Pages
  - Backend: Railway, Render, atau AWS/Google Cloud
- **CI/CD**: GitHub Actions atau GitLab CI
- **Testing**: Jest, Vitest, Playwright untuk E2E testing

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📝 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan demonstrasi. Silakan gunakan dan modifikasi sesuai kebutuhan.

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) untuk framework backend yang luar biasa
- [React](https://react.dev/) untuk library frontend yang powerful
- [Vite](https://vitejs.dev/) untuk development experience yang cepat
- [Bun](https://bun.sh/) untuk runtime JavaScript yang super cepat

---

**Happy Coding! 🚀**

Jika ada pertanyaan atau masalah, jangan ragu untuk membuat issue di repository ini.