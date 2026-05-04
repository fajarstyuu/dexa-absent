# dexa-absent

Sistem manajemen absensi yang dikembangkan dengan menggunakan React/Vite di sisi Frontend dan NestJS berserta Prisma di sisi Backend.
Aplikasi ini dilengkapi dengan docker-compose untuk memudahkan proses deployment dan pengelolaan lingkungan pengembangan.
Aplikasi ini dilengkapi dengan redis untuk caching dan optimasi performa, serta menggunakan JWT untuk autentikasi dan otorisasi pengguna.

## 👉 Tujuan Project

Project ini dikembangkan sebagai jawaban dari technical test yang diberikan oleh Dexa Group. Tujuannya adalah untuk menunjukkan kemampuan dalam mengembangkan aplikasi manajemen absensi yang efisien, mudah digunakan, dan dapat diandalkan.

## 📝 Deskripsi Project

Project ini dirancang untuk memudahkan manajemen karyawan, peran (role), serta pencatatan absensi. Beberapa fitur utama meliputi:

- Autentikasi dan otorisasi pengguna.
- Manajemen data karyawan dan role.
- Pencatatan dan pelacakan absensi harian.
- Dashboard dan tabel absensi.

## 📚 API Documentation

Dokumentasi API lengkap untuk project ini tersedia via Apidog dan dapat diakses melalui link berikut:

- [API Documentation - Apidog](https://6w012mfaew.apidog.io/)

## 🗂 Entity Relationship Diagram (ERD)

Berikut adalah struktur diagram ERD (Entity Relationship Diagram) dari aplikasi ini:

![ERD Diagram](<./lPFHRjem58Rl_HHdxAPeGwKjqTO9eMQGg57RqB6m6uIGIKwBXMD7ZgsIjNltnMa4WMbSJ5gviixtOPt_nrpbcYfjKWxUP0GZt51mbpaAJSYx11-OGCWKIwag5ciiJZPjw2y7VJFOz4_De7-w76or1wcGFOgjngp3Tbn8lH26SmitC0l74OJJszlvLh2GBZdMmYia-Pg9Z2gQ0YybNMG8KkcLR00bZKXYgGGgS1hpcDCy%20(1).png>)

## 📝 Step By Step

1. Clone repository ini ke lokal Anda.
2. Masuk ke direktori `server` dan jalankan perintah berikut untuk menginstall dependencies:
   ```bash
   npm install
   ```
3. Jalankan perintah berikut untuk menjalankan aplikasi backend:
   ```bash
   npm run start:dev
   ```
4. Masuk ke direktori `client` dan jalankan perintah berikut untuk menginstall dependencies:
   ```bash
   npm install
   ```
5. Jalankan perintah berikut untuk menjalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
6. Run docker compose untuk menjalankan database dan redis:
   ```bash
   docker-compose up -d
   ```
7. Lakukan migrasi database oleh prisma dengan perintah berikut:
   ```bash
   npx prisma migrate dev
   ```
8. Jalankan seeding database untuk mengisi data awal:
   ```bash
   npx prisma db seed
   ```
9. Akses aplikasi melalui browser di alamat `http://localhost:5173` untuk melihat hasilnya.
