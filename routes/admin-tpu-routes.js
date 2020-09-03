const express = require('express');
const router = express.Router();
const adminTpuControllers = require('../controllers/admin-tpu-controllers');

// Dashboard route
router.get('/', adminTpuControllers.dashboard);

// Data makam routes
router.route('/data-makam') 
    .get(adminTpuControllers.dataMakam);

// Data Pendaftaran Baru
router.get('/data-pendaftaran-baru', adminTpuControllers.dataPendaftarBaru);
router.get('/foto-ktp-jenazah/:nikJenazah', adminTpuControllers.getKtpJenazah);
router.get('/foto-kk-jenazah/:nikJenazah', adminTpuControllers.getKkJenazah);
router.get('/foto-skm-jenazah/:nikJenazah', adminTpuControllers.getSkmJenazah);
router.get('/cetak-data-pendaftar-baru', adminTpuControllers.cetakDataDaftarBaru);
router.post('/check-lokasi', adminTpuControllers.checkLoc);
router.post('/add-daftar-baru', adminTpuControllers.addDataDaftarBaru);
router.post('/update-daftar-baru', adminTpuControllers.updateDataDaftarBaru);
router.post('/delete-daftar-baru', adminTpuControllers.deletePendaftar);

// Data Pendaftaran Tumpang
router.get('/data-pendaftaran-tumpang', adminTpuControllers.dataPendaftarTumpang);
router.get('/foto-tumpang-jenazah/:nikJenazah', adminTpuControllers.getTumpanganJenazah);
router.get('/cetak-data-pendaftar-tumpang', adminTpuControllers.cetakDataDaftarTumpang);
router.post('/delete-daftar-tumpang', adminTpuControllers.deletePendaftar);
router.post('/add-daftar-tumpang', adminTpuControllers.addDataPendaftarTumpang);
router.post('/update-daftar-tumpang', adminTpuControllers.updateDataDaftarTumpang);

// Data Perpanjangan
router.get('/data-perpanjang', adminTpuControllers.dataPerpanjangan);
router.get('/foto-ktp-perpanjang/:email/:nikJenazah', adminTpuControllers.dataPerpanjangGetKtp);
router.get('/foto-kk-perpanjang/:email/:nikJenazah', adminTpuControllers.dataPerpanjangGetKk);
router.get('/foto-iptm-perpanjang/:email/:nikJenazah', adminTpuControllers.dataPerpanjangGetIptm);
router.post('/update-perpanjang', adminTpuControllers.updatePerpanjang);
router.get('/cetak-data-perpanjang', adminTpuControllers.cetakDataPerpanjang);
router.post('/hapus-data-perpanjang', adminTpuControllers.deletePerpanjang);

// Data nisan routes
router.get('/data-nisan', adminTpuControllers.dataNisan);
router.get('/foto-model-nisan/:nisan', adminTpuControllers.getFotoModelNisan);
router.get('/cetak-pesan-nisan', adminTpuControllers.cetakPesanNisan);
router.post('/add-pesan-nisan', adminTpuControllers.addPesanNisan);
router.post('/update-pesan-nisan', adminTpuControllers.updatePesanNisan);
router.post('/delete-pesan-nisan', adminTpuControllers.deletePesanNisan);

// Data Pembayaran routes
router.get('/data-pembayaran', adminTpuControllers.dataPembayaran);
router.get('/cetak-data-pembayaran', adminTpuControllers.cetakDataPembayaran);

// Data Pegawai routes
router.get('/data-pegawai', adminTpuControllers.dataPegawai);
router.post('/tambah-data-pegawai', adminTpuControllers.tambahDataPegawai);
router.post('/hapus-data-pegawai', adminTpuControllers.hapusDataPegawai);
router.get('/cetak-data-pegawai', adminTpuControllers.cetakDataPegawai);
router.post('/update-date-pegawai', adminTpuControllers.updateDataPegawai);

// Profile TPU routes
router.route('/profile-tpu') 
    .get(adminTpuControllers.profile)
    .post(adminTpuControllers.updateProfile);

// Data pesan routes
router.route('/pesan') 
    .get(adminTpuControllers.pesan);
router.get('/get-pesan/:tujuan', adminTpuControllers.getPesan);
router.post('/send-pesan', adminTpuControllers.sendPesan);
router.get('/get-image/:imageName', adminTpuControllers.getChatImage);
router.get('/get-file/:fileName', adminTpuControllers.getChatFile);
router.post('/send-item', adminTpuControllers.sendItem);

// Logout admin TPU
router.get('/logout/:kdAdmin', adminTpuControllers.logout);

module.exports = router;