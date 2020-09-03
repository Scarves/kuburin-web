const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user-controllers.js');

router.get('/', userControllers.halamanUtama);

router.route('/login')
    .get(userControllers.login)
    .post(userControllers.loginAhliWaris);

router.get('/logout', userControllers.logoutAhliWaris);

router.get('/check-kadaluarsa', userControllers.checkKadaluarsa);
router.post('/add-notification', userControllers.addNotfication);

router.route('/register')
    .get(userControllers.register)
    .post(userControllers.makeAhliWaris);
    // .post((req, res) => {
    //     console.log(req.body.nik);
    // })

router.route('/kontak-kami')
    .get(userControllers.kontakKami);

router.get('/status-pembayaran/:pembayaran/:nikJenazah', userControllers.statusPembayaran);

router.get('/tpu', userControllers.listTpu);

router.get('/nisan', userControllers.listNisan);
router.get('/get-foto-nisan/:fotoNisan', userControllers.fotoNisan);
router.get('/pilih-nisan/:kdNisan/:nikJenazah', userControllers.buyNisan);

router.get('/profile', userControllers.profile);
router.get('/get-kk', userControllers.getKkAhliWaris);
router.get('/get-ktp', userControllers.getKtpAhliWaris);
router.post('/add-ktp', userControllers.addKtpAhli);
router.post('/add-kk', userControllers.addKkAhli);

router.get('/akun', userControllers.akun);
router.post('/akun/update-akun', userControllers.updateAkun);
router.post('/akun/update-password', userControllers.updatePassword);

router.route('/perpanjang-makam') 
    .get(userControllers.perpanjangMakam)
    .post(userControllers.perpanjangSewa);

router.get('/status-pendaftaran', userControllers.statusPendaftaran);

router.get('/status-perpanjangan', userControllers.statPerpanjangAhli);

router.get('/selected-perpanjang/:nikJenazah/:harga', userControllers.selectedPerpanjang);

router.post('/pembayaran-tumpang', userControllers.sewaMakamTumpang);

router.get('/status-pembayaran', userControllers.transaksiAhliWaris);

router.post('/rekomendasi-tpu', userControllers.rekomendasiTpu);
router.post('/sewa-makam-baru', userControllers.sewaMakamBaru);

router.route('/metode-pembayaran')
    .get(userControllers.metodePembayaran)
    .post(userControllers.processingPembayaran);

router.route('/daftar-jenazah')
    .get(userControllers.daftarJenazah)
    .post(userControllers.tambahDaftarJenazah);

router.get('/get-jenazah-tpu/:kdTpu', userControllers.getJenazahTpu);

module.exports = router;