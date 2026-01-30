# NoteApp - APK Build Guide 📱

## Cara Mendapatkan APK dari GitHub Actions

### Langkah 1: Upload ke GitHub
1. Buat repository baru di GitHub (private/public)
2. Di folder proyek ini, jalankan:
```bash
git init
git add .
git commit -m "Initial commit with Android build"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### Langkah 2: Download APK
Setelah push selesai:
1. Buka repository GitHub di browser
2. Klik tab **"Actions"** di atas
3. Pilih workflow **"Build Android APK"** yang baru saja berjalan
4. Tunggu hingga selesai (✅ hijau)
5. Scroll ke bawah, bagian **"Artifacts"**
6. Download file **NoteApp-Debug.zip**
7. Extract dan install file `app-debug.apk` ke HP Android

### Langkah 3: Update Aplikasi (Kapan Aja)
Setiap kali kamu ubah kode:
```bash
git add .
git commit -m "Update fitur xyz"
git push
```

GitHub akan otomatis build APK baru! 🚀

## Info Penting
- **App Name**: NoteApp
- **Package**: com.noteapp.app
- **Icon**: Sudah terpasang (pastel mint & pink)
- **Build Type**: Debug (untuk testing)

## Troubleshooting
Jika build gagal di GitHub, cek tab "Actions" untuk error detailnya.
