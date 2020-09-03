const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin-controllers');

// Root routes for admin pusat
router.get('/', adminControllers.dashboard);

// Authentication routes
router.route('/login')
    .get(adminControllers.login)
    .post(adminControllers.loginAdmin);
router.get('/logout', adminControllers.logout);

// Data Ahli Waris routes
router.route('/data-ahli-waris')
    .get(adminControllers.dataAhliWaris);
router.get('/get-data-jenazah/:kdAhliWaris', adminControllers.getDataJenazah);
router.get('/delete-ahli-waris/:nik/:kdAhliWaris', adminControllers.deleteDataAhliWaris);
router.get('/cetak-data-ahli-waris', adminControllers.cetakDataAhliWaris);

// Data TPU routes
router.route('/data-tpu')
    .get(adminControllers.dataTpu);
router.post('/add-data-tpu', adminControllers.addDataTpu);
router.get('/get-data-pegawai/:kdTpu', adminControllers.getDataPegawai);
router.get('/delete-data-tpu/:kdTpu', adminControllers.deleteDataTpu);
router.post('/update-data-tpu/:kdTpu', adminControllers.updateDataTpu);
router.get('/cetak-data-tpu', adminControllers.cetakDataTpu);

// Data admin routes
router.route('/data-admin')
    .get(adminControllers.dataAdmin);
router.post('/add-data-admin', adminControllers.addDataAdmin);
router.get('/delete-data-admin/:kdAdmin/:nik', adminControllers.deleteDataAdmin);
router.post('/update-data-admin', adminControllers.updateDataAdmin);
router.get('/cetak-data-admin', adminControllers.cetakDataAdmin);

// Data Nisan routes
router.get('/data-nisan', adminControllers.dataNisan);
router.get('/get-foto-nisan/:gambarNisan', adminControllers.getFotoNisan);
router.get('/get-kd-nisan', adminControllers.kdNisanGenerate);
router.post('/add-nisan', adminControllers.addDataNisan);
router.post('/update-nisan', adminControllers.updateNisan);
router.get('/delete-nisan/:kdNisan', adminControllers.deleteNisan);

// Data Pesan Routes
router.get('/pesan', adminControllers.pesan);
router.get('/get-pesan/:tujuan', adminControllers.getPesan);
router.post('/send-pesan', adminControllers.sendPesan);
router.post('/send-item', adminControllers.sendItem);
router.get('/get-image/:imageName', adminControllers.getChatImage);
router.get('/get-file/:fileName', adminControllers.getChatFile);

    
router.get('/print/:title/:id', adminControllers.print);

module.exports = router;