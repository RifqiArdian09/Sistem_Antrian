# 🎫 Sistem Antrian Digital

Sistem antrian digital modern dengan notifikasi suara otomatis yang dibangun menggunakan Laravel 12 dan React TypeScript.

## ✨ Fitur Utama

- 🎯 **3 Interface Utama**: User, Display, dan Staff Panel
- 🔊 **Notifikasi Suara Otomatis** menggunakan Web Speech API
- ⚡ **Real-time Updates** untuk status antrian
- 🎨 **Modern UI/UX** dengan animasi dan gradients
- 📊 **Dashboard Management** untuk kelola layanan

## 🖥️ Interface

### 1. 👥 User Interface (`/queues`)
Interface untuk pengunjung mengambil nomor antrian:
- Pilih layanan yang tersedia
- Lihat statistik antrian real-time
- Ambil nomor antrian dengan satu klik
- Riwayat antrian terbaru

### 2. 📺 Display Interface (`/display`)
Layar tampilan antrian untuk area tunggu:
- Tampilan fullscreen dengan background gelap
- Nomor yang dipanggil dengan animasi pulse
- Notifikasi suara otomatis dalam Bahasa Indonesia
- Auto-refresh setiap 5 detik
- Jam dan tanggal real-time

### 3. 👨‍💼 Staff Interface (`/counters`)
Panel kontrol untuk petugas loket:
- Kelola antrian per layanan
- Panggil nomor antrian berikutnya
- Tandai antrian sebagai selesai
- Statistik real-time per layanan

### 4. ⚙️ Service Management (`/services`)
Panel admin untuk kelola layanan:
- Tambah/edit/hapus layanan
- Atur kode prefix antrian
- Preview nomor antrian
- Dashboard management


## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/RifqiArdian09/Sistem_Antrian.git
cd Sistem_Antrian
```

### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Setup
```bash
# Create database (SQLite)
touch database/database.sqlite

# Run migrations and seeders
php artisan migrate:fresh --seed
```

### 5. Build Assets
```bash
# Build for development
npm run dev

# Or build for production
npm run build
```

### 6. Start Development Server
```bash
# Start Laravel server
php artisan serve

# In another terminal, start Vite dev server (if using npm run dev)
npm run dev
```

## 📊 Database Structure

### Services Table
- `id` - Primary key
- `name` - Nama layanan (Customer Service, Teller, dll)
- `prefix` - Kode prefix (A, B, C, dll)

### Counters Table
- `id` - Primary key
- `name` - Nama loket
- `service_id` - Foreign key ke services

### Queues Table
- `id` - Primary key
- `service_id` - Foreign key ke services
- `counter_id` - Foreign key ke counters (nullable)
- `number` - Nomor urut antrian
- `queue_code` - Kode antrian lengkap (A001, B002, dll)
- `status` - Status: waiting, called, completed, skipped
- `customer_name` - Nama customer (optional)

## 🎯 Usage

### Untuk Pengunjung:
1. Akses `/queues`
2. Pilih layanan yang diinginkan
3. Klik "Ambil Nomor Antrian"
4. Simpan nomor antrian yang diberikan

### Untuk Display:
1. Akses `/display` di layar besar
2. Sistem akan menampilkan nomor yang dipanggil
3. Notifikasi suara otomatis akan berbunyi
4. Auto-refresh setiap 5 detik

### Untuk Petugas:
1. Login ke sistem
2. Akses `/counters`
3. Klik "Panggil Selanjutnya" untuk memanggil antrian
4. Klik "Selesai" setelah melayani customer

### Untuk Admin:
1. Login ke sistem
2. Akses `/services`
3. Kelola layanan (tambah/edit/hapus)
4. Atur kode prefix untuk setiap layanan

## 🔊 Voice Notifications

Sistem menggunakan Web Speech API untuk notifikasi suara:
- Bahasa: Indonesia
- Format: "Nomor antrian A 0 0 1, silakan menuju ke loket yang tersedia"
- Auto-play saat ada antrian baru dipanggil
- Dapat diatur kecepatan dan nada suara

## 🎨 Customization

### Mengubah Tema Warna:
Edit file `tailwind.config.js` untuk mengubah color scheme.

### Menambah Bahasa Suara:
Edit file `resources/js/pages/display/index.tsx` pada fungsi `playNotification()`.

### Mengubah Auto-refresh Interval:
Edit script di bagian bawah file display untuk mengubah interval refresh.

## 📱 Responsive Design

Sistem fully responsive untuk:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Screen (1280px+)

## 🔐 Authentication

Menggunakan Laravel Breeze dengan fitur:
- Login/Register
- Password Reset
- Email Verification
- Profile Management

## 🚦 Routes

```php
// Public routes
GET  /              - Welcome page
GET  /display       - Display interface (public)

// Authenticated routes
GET  /dashboard     - Dashboard
GET  /queues        - User interface
POST /queues/take/{service} - Ambil antrian
GET  /counters      - Staff interface
POST /counters/call/{service} - Panggil antrian
POST /queues/{queue}/complete - Selesaikan antrian
GET  /services      - Service management
POST /services      - Tambah layanan
PUT  /services/{service} - Update layanan
DELETE /services/{service} - Hapus layanan
```

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run with coverage
php artisan test --coverage
```

## 📦 Production Deployment

### 1. Environment
```bash
# Set production environment
APP_ENV=production
APP_DEBUG=false
```

### 2. Optimize
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Build production assets
npm run build
```

### 3. Web Server
Configure web server (Apache/Nginx) to point to `public/` directory.

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👨‍💻 Author

**Rifqi Ardian**
- GitHub: [@RifqiArdian09](https://github.com/RifqiArdian09)
- Repository: [Sistem_Antrian](https://github.com/RifqiArdian09/Sistem_Antrian)

## 🙏 Acknowledgments

- Laravel Team untuk framework yang amazing
- React Team untuk library frontend
- Tailwind CSS untuk utility-first CSS
- Shadcn/ui untuk komponen UI yang beautiful
- Lucide untuk icon set yang comprehensive

---

⭐ **Star repository ini jika membantu!** ⭐
