# Twitter Clone 🐦

Sebuah aplikasi klon Twitter sederhana yang dibangun dengan teknologi modern untuk pembelajaran dan demonstrasi full-stack development.

## 🚀 Teknologi yang Digunakan

### Backend
- **[Hono](https://hono.dev/)** - Framework web super cepat untuk TypeScript
- **[Bun](https://bun.sh/)** - Runtime JavaScript yang cepat dengan built-in bundler
- **TypeScript** - Superset JavaScript dengan type safety

### Frontend
- **[React](https://react.dev/)** - Library untuk membangun user interface
- **[Vite](https://vitejs.dev/)** - Build tool yang cepat untuk development
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Styling modern

### Fitur Utama
- ✅ Menampilkan daftar tweet
- ✅ Membuat tweet baru
- ✅ Real-time updates
- ✅ Type-safe API dengan Hono RPC
- ✅ Responsive design
- ✅ Character counter (280 karakter)

## 📁 Struktur Proyek

```
twitter-clone/
├── client/          # Frontend React aplikasi
│   ├── src/
│   │   ├── components/  # Komponen React
│   │   ├── lib/        # API client dan utilities
│   │   └── ...
│   └── package.json
├── server/          # Backend Hono API
│   ├── src/
│   │   ├── index.ts    # Server utama dan routes
│   │   └── types.ts    # Type definitions
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

Server akan berjalan di `http://localhost:3000`

### 3. Setup Frontend (Client)
Buka terminal baru:
```bash
cd client
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🎯 Cara Menggunakan

1. **Jalankan Backend**: Pastikan server Hono berjalan di port 3000
2. **Jalankan Frontend**: Buka aplikasi React di browser
3. **Buat Tweet**: Gunakan form di bagian atas untuk menulis tweet baru
4. **Lihat Tweet**: Semua tweet akan ditampilkan dalam urutan terbaru

## 🔧 API Endpoints

### GET `/api/tweets`
Mengambil semua tweet yang tersedia

**Response:**
```json
[
  {
    "id": "1",
    "author": "User",
    "content": "Hello World!",
    "timestamp": "2024-01-20T10:30:00.000Z"
  }
]
```

### POST `/api/tweets`
Membuat tweet baru

**Request Body:**
```json
{
  "author": "User",
  "content": "Tweet content here"
}
```

**Response:**
```json
{
  "id": "2",
  "author": "User",
  "content": "Tweet content here",
  "timestamp": "2024-01-20T10:35:00.000Z"
}
```

## 🏗️ Arsitektur

### Type-Safe Communication
Proyek ini menggunakan **Hono RPC** untuk komunikasi type-safe antara frontend dan backend:

1. **Server** mengekspor type `AppType` yang mendefinisikan semua routes
2. **Client** menggunakan `hc<AppType>()` untuk membuat client yang type-safe
3. **TypeScript** memastikan semua API calls memiliki type yang benar

### Data Flow
```
User Input → React Component → Hono RPC Client → Hono Server → In-Memory Storage
                    ↓
UI Update ← React State ← API Response ← JSON Response ← Data Processing
```

## 🎨 Styling

Aplikasi menggunakan CSS custom dengan:
- **Responsive design** untuk berbagai ukuran layar
- **Modern UI** dengan shadow dan border radius
- **Color scheme** yang mirip dengan Twitter
- **Hover effects** dan transitions

## 🔮 Pengembangan Selanjutnya

### Fitur yang Bisa Ditambahkan:
- 🔐 **Autentikasi pengguna** (login/register)
- 💾 **Database integration** (PostgreSQL, SQLite)
- ❤️ **Like dan Retweet** functionality
- 💬 **Komentar** pada tweet
- 🔄 **Real-time updates** dengan WebSockets
- 📱 **Mobile app** dengan React Native
- 🖼️ **Upload gambar** untuk tweet
- 👤 **Profil pengguna** dan following system
- 🔍 **Search** dan hashtags
- 📊 **Analytics dashboard**

### Teknologi yang Bisa Diintegrasikan:
- **Database**: Prisma + PostgreSQL
- **Authentication**: Auth0, Clerk, atau custom JWT
- **File Upload**: Cloudinary, AWS S3
- **Real-time**: Socket.io, Pusher
- **Deployment**: Vercel, Netlify, Railway
- **Testing**: Jest, Cypress, Playwright

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