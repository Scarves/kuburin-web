const adminTpuModels = require('../models/admin-tpu-models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfMakePrinter = require('pdfmake');

// Multer upload file configuration
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log('masuk dest');
        if(file.fieldname == 'tambahSkm' || file.fieldname == 'ubahSkm') {
            console.log('ubah SKM masuk');
            console.table(file);
            callback(null, __dirname + '../../asset/images/skm/');
        }
        if(file.fieldname == 'tambahKtp' || file.fieldname == 'ubahKtp') {
            console.log('ubah KTP masuk');
            callback(null, __dirname + '../../asset/images/ktp-jenazah/');
        }
        if(file.fieldname == 'tambahKk' || file.fieldname == 'ubahKk') {
            console.log('ubah KK masuk');
            callback(null, __dirname + '../../asset/images/kk-jenazah/');
        }
        if(file.fieldname == 'tambahIptm' || file.fieldname == 'ubahIptm') {
            callback(null, __dirname + '../../asset/images/tumpang/');
        }
        if(file.fieldname == 'kkField') {
            console.log('masuk Kk');
            callback(null, __dirname + '../../asset/images/kk-ahli-waris/');
        }
        if(file.fieldname == 'ktpField') {
            callback(null, __dirname + '../../asset/images/ktp-ahli-waris/');
        }
        if(file.fieldname == 'perpanjangIptm' || file.fieldname == 'ubahIptmPerpanjang') {
            callback(null, __dirname + '../../asset/images/perpanjang/');
        }
        if(file.fieldname == 'chatImage') {
            callback(null, __dirname + '../../asset/images/chat/');
        }
        if(file.fieldname == 'chatFile') {
            console.log('masukin file');
            console.log(req.body);
            callback(null, __dirname + '../../asset/files/chat/');
        }
    },
    filename: (req, file, callback) => {
        var newName;
        // console.log('nama aslinya ', file.originalname);
        // if(file.fieldname == 'gantiIptm') {
        //     console.log('entered conditional event', req.body.nikPerpanjang);
        //     newName = req.body.nikPerpanjang;
        // }
        // callback(null, newName + path.extname(file.originalname));
        // if(!req.body.nik && !req.body.perpanjangNik) {
        //     newName = req.body.nikSelectedAhli;
        // } else if(!req.body.nik && req.body.perpanjangNik) {
        //     newName = req.body.perpanjangNik;
        // }
        if(file.fieldname == 'chatFile') {
            console.log('renaming file');
            console.log(req.body);
            newName = req.body.renameFileField;
        }
        if(file.fieldname == 'chatImage') {
            console.log('renaming image');
            newName = req.body.renameImageField;
        }
        if(!req.body.tambahNik && req.body.ubahNik) {
            newName = req.body.ubahNik.trim();
        }
        if(!req.body.ubahNik && req.body.tambahNik) {
            newName = req.body.tambahNik;
        }
        if(req.body.ubahKdPerpanjang && req.body.ubahPerpanjangNik) {
            newName = req.body.ubahKdPerpanjang;
        }
        callback(null, newName + path.extname(file.originalname));
    }
});

// Cookie Validator
function auth(req, res) {
    if(req.cookies.kuburinSystem && req.cookies.kuburinSystem.jenisAdmin.trim() == 'tpu') {
        return true;
    } else {
        console.log('masuk false');
        return false;
    }
}

// Converting data into formatted pdf report
function createPdfBinary(judulLaporan, dataTable, namaKepala, namaAdmin, namaTpu, page, callback) {
    var logoImage = __dirname + '/../asset/images/web/logo-dki.png';
    var pageMode = 'potrait';
    if(page == 'wide') {
        pageMode = 'landscape';
    }
    var template = {
        header: {
            image: logoImage,
            width: 70,
            height: 70,
            alignment: 'center',
            margin: [ 0, 15, 0, 10 ],
        },
        pageSize: 'A3',
        pageOrientation: pageMode,
        content: [
            {
                text: 'TPU '.concat(namaTpu),
                margin: [0,60,0,5],
                alignment: 'center',
                fontSize: 20
            },
            {
                text: 'Lorem ipsum awd ksfad kdcadf edahhasdas asdasdhjasd kefaehdfae adgadAW AEFSJEFISE HSDVadfadf ajefaed aefjahedua aefjhaesfjhsa asejfhasejfhae jahefjaehf ',
                alignment: 'center'
            },
            {// Garis pembatas
                layout: 'lightHorizontalLines', // optional
                table: {
                    headerRows: 1,
                    widths: ['*'],
            
                    body: [
                        [ ' '],
                        [ ' ' ]
                    ]
                },
                margin: [0,0,0,25]
            },
            judulLaporan,
            dataTable,
            {
                margin:[0,15,0,50],
                alignment: 'center',
                columns: ['Admin','Kepala']
            },
            {
                columns:[
                    {alignment:'center', canvas: [{ type: 'line', x1: 0, y1: 5, x2: 130, y2: 5, lineWidth: 3 }]},
                    {alignment:'center', canvas: [{ type: 'line', x1: 0, y1: 5, x2: 130, y2: 5, lineWidth: 3 }]}
                ]
            },
            {
                columns: [{alignment: 'center', text:namaAdmin}, {alignment: 'center', text:namaKepala}]
            }

        ],
        footer: 
            function(currentPage, pageCount) { 
                return [
                    {text: currentPage.toString() + ' / ' + pageCount, alignment: 'center'},
                ]

            }
    };

	var fontDescriptors = {
		Roboto: {
			normal: path.join(__dirname, '../asset/fonts/Roboto-Regular.ttf'),
			bold: path.join(__dirname, '../asset/fonts/Roboto-Medium.ttf'),
			italics: path.join(__dirname, '../asset/fonts/Roboto-Italic.ttf'),
			bolditalics: path.join(__dirname, '../asset/fonts/Roboto-MediumItalic.ttf')
		}
    };

	var printer = new pdfMakePrinter(fontDescriptors);

	var doc = printer.createPdfKitDocument(template);

	var chunks = [];
	var result;

	doc.on('data', function (chunk) {
		chunks.push(chunk);
	});
	doc.on('end', function () {
        result = Buffer.concat(chunks);
        callback(result);
		// callback('data:application/pdf;base64,' + result.toString('base64')); // doesn't works
    });
    // doc.pipe(fs.createWriteStream('coba')); // Save into local folder
	doc.end();
}

// Dashboard admin TPU
exports.dashboard = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        adminTpuModels.dashboard(req.cookies.kuburinSystem.kdTpu)
        .then(data => {
            console.log(req.cookies.kuburinSystem.jenisAdmin);
            res.render('admin-dashboard', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'Dashboard',
                search: null,
                edit: false,
                adminType: 'tpu',
                firstCard: data.pendaftar_baru_today,
                secondCard: data.pendaftar_tumpangan_today,
                thirdCard: data.perpanjang_today,
                fourthCard: data.nisan_today,
                fifthCard: data.makam_kosong,
                kdAdmin: req.cookies.kuburinSystem.kdAdmin
            })
        })
    .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// list data makam
exports.dataMakam = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        res.render('admin-data-makam', {
            layout: 'layouts/admin-layout',
            halaman: 'hijau',
            footer: 'non-fixed',
            logged: true,
            title: 'DATA MAKAM',
            search: true,
            edit: false,
            adminType: 'tpu',
            kdAdmin: req.cookies.kuburinSystem.kdAdmin
        })
    } else {
        res.redirect('/admin/login');
    }
}

// List data nisan
exports.dataNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            adminTpuModels.dataPesanNisan(req.cookies.kuburinSystem.kdTpu),
            adminTpuModels.listJenazahNisan(req.cookies.kuburinSystem.kdTpu),
            adminTpuModels.listNisan()
        ])
        .then(data => {
            res.render('admin-data-nisan', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'DATA NISAN',
                search: true,
                edit: true,
                adminType: 'tpu',
                kdAdmin: req.cookies.kuburinSystem.kdAdmin,
                listNisan: data[0],
                listJenazah: data[1],
                listModelNisan: data[2]
            })
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.getFotoModelNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var filePathModelNisan = __dirname + '/../asset/images/nisan/';
        res.sendFile(
            path.resolve(filePathModelNisan += req.params.nisan)
        );
    } else {
        res.redirect('/admin/login');
    }
}

exports.addPesanNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var statusPembayaran = req.body.tambahStatusPembayaran == 'true' ? true : false;
        adminTpuModels.addPesanNisan(req.body.selectedNikJenazah, req.body.selectedKodeNisan, statusPembayaran)
        .then(() => {
            res.redirect('/admin-tpu/data-nisan');
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.updatePesanNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var statusPembayaran = req.body.ubahStatusPembayaran == 'true' ? true : false;
        adminTpuModels.updatePesanNisan(req.body.ubahSelectedJenazah, req.body.ubahKdNisan, statusPembayaran)
        .then(() => {
            res.redirect('/admin-tpu/data-nisan');
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.deletePesanNisan = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        var listHapus = req.body.listHapus;
        for(i = 0; i < listHapus.length; i++) {
            adminTpuModels.deletePesanNisan(listHapus[i])
            .catch(error => {
                console.error(error);
                res.send({status: 500});
            });
        }
        res.send({status: 200});
    } else {
        res.redirect('/admin/login');
    }
}

exports.cetakPesanNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const kdAdmin = req.cookies.kuburinSystem.kdAdmin;
        const kdTpu = req.cookies.kuburinSystem.kdTpu;
        Promise.all([
            adminTpuModels.getKepalaTpu(kdTpu),
            adminTpuModels.getNamaAdmin(kdAdmin),
            adminTpuModels.getNamaTpu(kdTpu),
            adminTpuModels.cetakPesanNisan(kdTpu)
        ])
        .then(data => {
            var count = 1;
            datanya = [];
            var namaAdmin = data[1].nama_depan + ' ' + data[1].nama_belakang;
            console.log(namaAdmin);
            datanya.push([
                'No', 
                'Kode Nisan', 
                'Model Nisan', 
                'Blok',
                'Blad',
                'Petak', 
                'Tanggal Makam', 
                'Tanggal Pemesanan',
                'Status Pembayaran'
            ]);
            data[3].forEach(nisan => {
                var tglPemesanan = nisan.tgl_pemesanan == null ? '-' : nisan.tgl_pemesanan;
                datanya.push([
                    count, 
                    nisan.kd_nisan, 
                    nisan.model_nisan, 
                    nisan.blok,
                    nisan.blad,
                    nisan.petak, 
                    nisan.tgl_makam, 
                    tglPemesanan,
                    nisan.status_pembayaran
                ]);
                count++;
            });
            console.table(datanya);
            var judulLaporan = [{
                text: 'Laporan Data Pemesanan Nisan',
                fontSize: 15,
                alignment: 'center',
                margin: [0,0,0,10]
            },{
                text: 'Data Pendaftaran Tumpangan Per Tanggal',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,5]
            },{
                text: 'Periode: ',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,20]
            }];
            var dataTable = {
                table: {
                    headerRows: 1,
                    widths: [20, 100, 60, 65, 40, 40, 75, 75, '*'],
                    body:datanya,
                    alignment: 'center'
                }
            };
    
            createPdfBinary(judulLaporan, dataTable, data[0].get_kepala_tpu, namaAdmin, data[2].get_nama_tpu, '', function (binary) {
                res.contentType('application/pdf');
                res.send(binary);
            }, function (error) {
                res.send('ERROR:' + error);
            });
        })
        .catch(error => console.error(error))
    } else {
        res.redirect('/admin/login');
    }
}

exports.dataPegawai = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            adminTpuModels.dataPegawai(req.cookies.kuburinSystem.kdTpu),
            adminTpuModels.listJabatan()
        ])
        .then(data => {
            res.render('admin-data-pegawai', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'DATA PEGAWAI',
                search: true,
                edit: true,
                adminType: 'tpu',
                kdAdmin: req.cookies.kuburinSystem.kdAdmin,
                dataPegawai: data[0],
                listJabatan: data[1]
            })
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Add Data Pegawai
exports.tambahDataPegawai = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        var kelamin = req.body.tambahJenisKelamin == 'wanita'? true : false;
        var gaji = req.body.tambahJumlahGaji.split('.').join('');
        adminTpuModels.tambahDataPegawai(
            req.cookies.kuburinSystem.kdTpu, 
            req.body.tambahGolongan, 
            req.body.tambahKotaKabupaten, 
            req.body.tambahJabatan, 
            req.body.tambahTunjangan, 
            req.body.tambahProvinsi, 
            gaji, 
            req.body.tambahAlamat, 
            req.body.tambahTelepon, 
            req.body.tambahMulaiBekerja, 
            req.body.tambahKelurahan, 
            kelamin,
            req.body.tambahNamaDepan, 
            req.body.tambahKecamatan, 
            req.body.tambahEmail, 
            req.body.tambahNamaBelakang, 
            req.body.tambahKodePos, 
            req.body.tambahNik
        ).then(data => {
            res.redirect('/admin-tpu/data-pegawai');
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Update data pegawai
exports.updateDataPegawai = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        var kelamin = req.body.ubahJenisKelamin == 'wanita'? true : false;
        var gaji = req.body.ubahJumlahGaji.split('.').join('');
        adminTpuModels.updateDataPegawai(
            req.cookies.kuburinSystem.kdTpu, 
            req.body.ubahKdPegawai, 
            req.body.ubahGolongan, 
            req.body.ubahKotaKabupaten, 
            req.body.ubahJabatan, 
            req.body.ubahTunjangan, 
            req.body.ubahProvinsi, 
            gaji, 
            req.body.ubahAlamat, 
            req.body.ubahTelepon, 
            req.body.ubahMulaiBekerja,
            req.body.ubahKelurahan, 
            kelamin,
            req.body.ubahNamaDepan, 
            req.body.ubahKecamatan, 
            req.body.ubahEmail, 
            req.body.ubahNamaBelakang, 
            req.body.ubahKodePos, 
            req.body.ubahNik.trim(), 
            req.body.ubahStatusPegawai
        )
        .then(() => {
            res.redirect('/admin-tpu/data-pegawai');
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Hapus data pegawai
exports.hapusDataPegawai = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        var listHapus = req.body.listHapus;
        for(i = 0; i < listHapus.length; i++) {
            adminTpuModels.hapusDataPegawai(listHapus[i])
            .catch(error => {
                console.error(error);
                res.send({status: 500});
            });
        }
        res.send({status: 200});
        // listHapus.forEach(element => {
            // adminTpuModels.hapusDataPegawai(element)
            // .then(result => {
            //     console.log('hasilnya ', result.delete_pegawai);
            // })
            // .catch(error => console.error(error));
        // })
        // adminTpuModels.hapusDataPegawai(req.params.kdPegawai)
        // .then(result => {
            // res.send(result);
        // })
        // .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Cetak Data Pegawai 
exports.cetakDataPegawai = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        const kdAdmin = req.cookies.kuburinSystem.kdAdmin;
        const kdTpu = req.cookies.kuburinSystem.kdTpu;
        Promise.all([
            adminTpuModels.getKepalaTpu(kdTpu),
            adminTpuModels.getNamaAdmin(kdAdmin),
            adminTpuModels.getNamaTpu(kdTpu),
            adminTpuModels.cetakDataPegawai(kdTpu)
        ])
        .then(data => {
            var count = 1;
            datanya = [];
            var namaAdmin = data[1].nama_depan + ' ' + data[1].nama_belakang;
            console.log(namaAdmin);
            datanya.push(['No', 'Kode Pegawai', 'Jabatan' ,'Gaji', 'Lama Bekerja', 'Nama Depan', 'Nama Belakang']);
            data[3].forEach(pegawai => {
                if(pegawai.gaji == null) {
                    pegawai.gaji = '-';
                }
                var lamaBekerja = (pegawai.lama_bekerja.years || 0) + ' tahun ' + (pegawai.lama_bekerja.mons || 0) + ' bulan ' + (pegawai.lama_bekerja.days || 0) + ' hari';
                console.log('lama bekerja');
                console.table(lamaBekerja);
                datanya.push([count, pegawai.kd_pegawai, pegawai.jabatan, pegawai.gaji, lamaBekerja, pegawai.nama_depan, pegawai.nama_belakang]);
                count++;
            });
            console.table(datanya);
            var judulLaporan = [{
                text: 'Laporan Data Pegawai',
                fontSize: 15,
                alignment: 'center',
                margin: [0,0,0,10]
            },{
                text: 'Data Pegawai Per Tanggal',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,5]
            },{
                text: 'Periode: ',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,20]
            }];
            var dataTable = {// Garis pembatas
                table: {
                    headerRows: 1,
                    widths: [20, '*', '*', '*', '*', '*', '*'],
                    body:datanya
                }
            };
    
            createPdfBinary(judulLaporan, dataTable, data[0].get_kepala_tpu, namaAdmin, data[2].get_nama_tpu, '', function (binary) {
                res.contentType('application/pdf');
                res.send(binary);
            }, function (error) {
                res.send('ERROR:' + error);
            });
        })
        .catch(error => console.error(error))
    }
}

// Profile TPU
exports.profile = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        adminTpuModels.profileTpu(req.cookies.kuburinSystem.kdTpu)
    .then(data => {
        console.log(data);
        res.render('admin-profile-tpu', {
            layout: 'layouts/admin-layout',
            halaman: 'hijau',
            footer: 'non-fixed',
            logged: true,
            title: 'PROFILE TPU',
            search: true,
            edit: false,
            adminType: 'tpu',
            dataTpu: data,
            kdAdmin: req.cookies.kuburinSystem.kdAdmin
        })
    })
    .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.updateProfile = (req, res) => {
    var verif = auth(req);
    if(verif == true){
        adminTpuModels.updateProfileTpu(
            req.body.kdTpu.trim(), 
            req.body.ubahNikKepala.trim(), 
            req.body.ubahNewNikKepala.trim(), 
            req.body.ubahNamaTpu, 
            req.body.ubahNamaDepanKepalaTpu, 
            req.body.ubahNamaBelakangKepalaTpu, 
            req.body.ubahAlamatTpu, 
            req.body.ubahKodePos, 
            req.body.ubahLongtitude, 
            req.body.ubahLatitude, 
            req.body.ubahLuasTpu, 
            req.body.ubahIslamAA01,
            req.body.ubahIslamAA02,
            req.body.ubahIslamA001,
            req.body.ubahIslamA002,
            req.body.ubahIslamA003,
            req.body.ubahKristenAA01,
            req.body.ubahKristenAA02,
            req.body.ubahKristenA001,
            req.body.ubahKristenA002,
            req.body.ubahKristenA003,
            req.body.ubahHbAA01,
            req.body.ubahHbAA02,
            req.body.ubahHbA001,
            req.body.ubahHbA002,
            req.body.ubahHbA003
        )
        .then((result) => { 
            if(result.tpu_update == true) {
                var kdAdmin = req.cookies.kuburinSystem.kdAdmin.trim();
                res.clearCookie('kuburinSystem');
                res.cookie('kuburinSystem', {jenisAdmin: 'tpu', kdAdmin: kdAdmin, kdTpu: result.new_kd_tpu}, {httpOnly: true, maxAge:3600000});
                res.redirect('/admin-tpu/profile-tpu');
            } else {
                res.redirect('/admin-tpu/profile-tpu');
            }
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Pesan antar Admin
exports.pesan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        adminTpuModels.getAdmin(req.cookies.kuburinSystem.kdAdmin.trim())
        .then(listAdmin => {
            res.render('admin-pesan', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'PESAN',
                search: true,
                edit: false,
                adminType: 'tpu',
                kdAdmin: req.cookies.kuburinSystem.kdAdmin,
                listAdmin:listAdmin
            })
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.getPesan = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminTpuModels.getPesan(req.cookies.kuburinSystem.kdAdmin.trim(), req.params.tujuan)
        .then(pesan => {
            res.send(pesan);
        })
        .catch(error => res.send({status: 'Internal Server Error', error: error}));
    } else {
        res.send({status: 'Login First'});
    }
}

exports.sendPesan = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        console.log(
            req.body.pesan, 
            req.body.tujuan, 
            req.body.foto, 
            req.body.file, 
            req.cookies.kuburinSystem.kdAdmin.trim()
        );
        adminTpuModels.insertPesan(req.body.pesan, req.body.tujuan, req.body.foto, req.body.file, req.cookies.kuburinSystem.kdAdmin.trim())
        .then(result => {
            res.send(result);
        })
        .catch(error => res.send({status: 'Internal Server Error', error: error}));
    } else {
        res.send({status: 'Login First'});
    }
}

// upload file or image or both into server
exports.sendItem = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        const upload = multer({storage: storage}).fields([{name: 'chatImage'}, {name: 'chatFile'}]);
        upload(req, res, (error) => {
            if(error) throw error;
            console.log('isi reqnya');
            console.log(req.body);
            // console.log('nama imgnya', req.files['chatImage'][0].filename);
            // console.log('nama filenya', req.files['chatFile'][0].filename);
            res.send('success');
        })
    } else {
        res.redirect('/admin/login');
    }
}

// get image from chat folder
exports.getChatImage = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        var chatImage = __dirname + '/../asset/images/chat/';
        chatImage += req.params.imageName;
        res.sendFile(path.resolve(chatImage));
    } else {
        res.redirect('/admin/login');
    }
}

// Get file from chat folder
exports.getChatFile = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        var chatFile = __dirname + '/../asset/files/chat/';
        chatFile += req.params.fileName;
        res.sendFile(path.resolve(chatFile));
    } else {
        res.redirect('/admin/login');
    }
}

exports.logout = (req, res) => {
    adminTpuModels.logout(req.params.kdAdmin)
    .then(data => {
        if(data.is_logout == true) {
            res.clearCookie('kuburinSystem');
            res.redirect('/');
        } else {
            res.redirect('/admin-tpu');
        }
    })
    .catch(error => console.error(error));
}

exports.dataPembayaran = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        adminTpuModels.dataPembayaran(req.cookies.kuburinSystem.kdTpu)
        .then(data => {
            res.render('admin-data-pembayaran', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'DATA PEMBAYARAN',
                search: true,
                edit: true,
                adminType: 'tpu',
                kdAdmin: req.cookies.kuburinSystem.kdAdmin,
                dataPembayaran: data
            })
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.cetakDataPembayaran = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const kdAdmin = req.cookies.kuburinSystem.kdAdmin;
        const kdTpu = req.cookies.kuburinSystem.kdTpu;
        Promise.all([
            adminTpuModels.getKepalaTpu(kdTpu),
            adminTpuModels.getNamaAdmin(kdAdmin),
            adminTpuModels.getNamaTpu(kdTpu),
            adminTpuModels.dataPembayaran(kdTpu)
        ])
        .then(data => {
            var count = 1;
            datanya = [];
            var namaAdmin = data[1].nama_depan + ' ' + data[1].nama_belakang;
            console.log(namaAdmin);
            datanya.push(['No', 'Kode Pembayaran', 'Nama Pembayaran' ,'Metode Pembayaran', 'Status Pembayaran', 'Tanggal Pembayaran']);
            data[3].forEach(pembayaran => {
                datanya.push([count, pembayaran.kd_pembayaran, pembayaran.nama_pembayaran, pembayaran.metode_pembayaran, pembayaran.status_pembayaran, pembayaran.tgl_pembayaran]);
                count++;
            });
            console.table(datanya);
            var judulLaporan = [{
                text: 'Laporan Data Pembayaran',
                fontSize: 15,
                alignment: 'center',
                margin: [0,0,0,10]
            },{
                text: 'Data Pembayaran Per Tanggal',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,5]
            },{
                text: 'Periode: ',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,20]
            }];
            var dataTable = {// Garis pembatas
                table: {
                    headerRows: 1,
                    widths: [20, '*', '*', '*', '*', '*'],
                    body:datanya
                }
            };
    
            createPdfBinary(judulLaporan, dataTable, data[0].get_kepala_tpu, namaAdmin, data[2].get_nama_tpu, '', function (binary) {
                res.contentType('application/pdf');
                res.send(binary);
            }, function (error) {
                res.send('ERROR:' + error);
            });
        })
        .catch(error => console.error(error))
    } else {
        res.redirect('/admin/login');
    }
}

exports.dataPerpanjangan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        adminTpuModels.dataPerpanjangan(req.cookies.kuburinSystem.kdTpu)
        .then(data => {
            res.render('admin-data-perpanjangan', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'DATA PERPANJANGAN',
                search: true,
                edit: true,
                adminType: 'tpu',
                kdAdmin: req.cookies.kuburinSystem.kdAdmin,
                dataPerpanjang: data
            })
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Get Foto KTP Ahli Waris
exports.dataPerpanjangGetKtp = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var filePathKtpAhli = __dirname + '/../asset/images/ktp-ahli-waris/';
        adminTpuModels.dataPerpanjangFoto(req.params.email, req.params.nikJenazah)
        .then(data => {
            res.sendFile(
                path.resolve(filePathKtpAhli += data.foto_ktp_ahli)
            );
        })
        .catch(error => console.error(error));

    } else {
        res.redirect('/admin/login');
    }
}

// Get Foto Kk Ahli Waris
exports.dataPerpanjangGetKk = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var filePathKkAhli = __dirname + '/../asset/images/kk-ahli-waris/';
        adminTpuModels.dataPerpanjangFoto(req.params.email, req.params.nikJenazah)
        .then(data => {
            res.sendFile(
                path.resolve(filePathKkAhli += data.foto_kk_ahli)
            );
        })
        .catch(error => console.error(error));

    } else {
        res.redirect('/admin/login');
    }
}

// Get Foto IPTM Perpanjang
exports.dataPerpanjangGetIptm = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var fileIptmPerpajang = __dirname + '/../asset/images/perpanjang/';
        adminTpuModels.dataPerpanjangFoto(req.params.email, req.params.nikJenazah)
        .then(data => {
            res.sendFile(
                path.resolve(fileIptmPerpajang += data.foto_iptm_perpanjang)
            );
        })
        .catch(error => console.error(error));

    } else {
        res.redirect('/admin/login');
    }
}

// Update foto IPTM perpanjang
exports.updatePerpanjang = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const upload = multer({storage: storage}).single('ubahIptmPerpanjang');
        upload(req, res, (error) => {
            if(error) throw error;
            var iptmPerpanjang = req.file.filename ? req.file.filename : null;
            adminTpuModels.updatePerpanjang(req.body.ubahKdPerpanjang, req.body.ubahStatusPembayaran, iptmPerpanjang)
            .then( () => {
                res.redirect('/admin-tpu/data-perpanjang');
            })
            .catch(error => console.error(error));
        })
    } else {
        res.redirect('/admin/login');
    }
}

// Cetak data perpanjangan
exports.cetakDataPerpanjang = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const kdAdmin = req.cookies.kuburinSystem.kdAdmin;
        const kdTpu = req.cookies.kuburinSystem.kdTpu;
        Promise.all([
            adminTpuModels.getKepalaTpu(kdTpu),
            adminTpuModels.getNamaAdmin(kdAdmin),
            adminTpuModels.getNamaTpu(kdTpu),
            adminTpuModels.dataPerpanjangan(kdTpu)
        ])
        .then(data => {
            var count = 1;
            datanya = [];
            var namaAdmin = data[1].nama_depan + ' ' + data[1].nama_belakang;
            console.log(namaAdmin);
            datanya.push([
                'No', 
                'Kode Daftar', 
                'Nama Jenazah', 
                'Kelamin Jenazah', 
                'Agama Jenazah', 
                'Nama Ahli Waris', 
                'Tgl. Perpanjang', 
                'Status Perpanjang', 
                'Blok', 
                'Blad', 
                'Petak', 
                'Tgl. Kadaluarsa', 
                'Status Pembayaran'
            ]);
            data[3].forEach(perpanjang => {
                var statusPembayaran;
                if(perpanjang.status_pembayaran == true) {
                    statusPembayaran = 'Dibayar';
                } else if(perpanjang.status_pembayaran == false) {
                    statusPembayaran = 'Belum';
                }
                datanya.push([
                    count, 
                    perpanjang.kd_daftar, 
                    perpanjang.nama_jenazah, 
                    perpanjang.kelamin, 
                    perpanjang.agama_jenazah, 
                    perpanjang.nama_ahli,
                    perpanjang.tgl_perpanjang,
                    perpanjang.status_perpanjang,
                    perpanjang.blok,
                    perpanjang.blad,
                    perpanjang.petak,
                    perpanjang.tgl_kadaluarsa,
                    statusPembayaran
                ]);
                count++;
            });
            console.table(datanya);
            var judulLaporan = [{
                text: 'Laporan Data Perpanjang',
                fontSize: 15,
                alignment: 'center',
                margin: [0,0,0,10]
            },{
                text: 'Data Perpanjang Per Tanggal',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,5]
            },{
                text: 'Periode: ',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,20]
            }];
            var dataTable = {// Garis pembatas
                table: {
                    headerRows: 1,
                    widths: [20, '*', '*', 65, 70, '*',75, 65, 30, 30, 35, 75, 70],
                    body:datanya
                }
            };
    
            createPdfBinary(judulLaporan, dataTable, data[0].get_kepala_tpu, namaAdmin, data[2].get_nama_tpu, 'wide', function (binary) {
                res.contentType('application/pdf');
                res.send(binary);
            }, function (error) {
                res.send('ERROR:' + error);
            });
        })
        .catch(error => console.error(error))
    } else {
        res.redirect('/admin/login');
    }
}

exports.deletePerpanjang = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var listHapus = req.body.listHapus;
        for(i = 0; i < listHapus.length; i++) {
            adminTpuModels.deletePerpanjang(listHapus[i])
            .catch(error => {
                console.error(error);
                res.send({status: 500});
            });
        }
        res.send({status: 200});
    } else {
        res.redirect('/admin/login');
    }
}

exports.dataPendaftarBaru = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            adminTpuModels.dataPendaftarBaru(req.cookies.kuburinSystem.kdTpu),
            adminTpuModels.getAhliWaris()
        ])
        .then(data => {
            res.render('admin-data-pendaftaran-baru', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'DATA PENDAFTARAN BARU',
                search: true,
                edit: true,
                adminType: 'tpu',
                kdAdmin: req.cookies.kuburinSystem.kdAdmin,
                dataPendaftar: data[0],
                dataAhliWaris: data[1]
            })
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.getKtpJenazah = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        console.log('ambil ktp');
        var fileKtp = __dirname + '/../asset/images/ktp-jenazah/';
        adminTpuModels.getFotoJenazah(req.params.nikJenazah)
        .then(data => {
            
            console.log('urlnya ', fileKtp += data.foto_ktp);
            res.sendFile(
                path.resolve(fileKtp)
            );
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.getKkJenazah = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var fileKk = __dirname + '/../asset/images/kk-jenazah/';
        adminTpuModels.getFotoJenazah(req.params.nikJenazah)
        .then(data => {
            res.sendFile(
                path.resolve(fileKk += data.foto_kk)
            );
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.getSkmJenazah = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var fileSkm = __dirname + '/../asset/images/skm/';
        adminTpuModels.getFotoJenazah(req.params.nikJenazah)
        .then(data => {
            res.sendFile(
                path.resolve(fileSkm += data.foto_skm)
            );
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.checkLoc = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        adminTpuModels.checkLoc(req.cookies.kuburinSystem.kdTpu, req.body.blok, req.body.blad, req.body.petak)
        .then(result => {
            console.log('hasil post : ', result)
            res.send(result);
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.addDataDaftarBaru = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const upload = multer({storage: storage}).fields([{name: 'tambahSkm'}, {name: 'tambahKtp'}, {name: 'tambahKk'}]);
        upload(req, res, (error) => {
            if(error) throw error;
            var kelamin = req.body.tambahKelamin == 'Pria' ? false : true;
            var statusPembayaran = req.body.tambahStatusPembayaran == 'y' ? true : false;
            adminTpuModels.addDaftarBaru(
                req.cookies.kuburinSystem.kdTpu, 
                req.body.tambahNik, 
                req.body.tambahNamaJenazah, 
                req.body.tambahTglLahir, 
                req.body.tambahTmptLahir, 
                kelamin, 
                req.body.tambahAgama, 
                req.body.tambahAlamatJenazah, 
                req.body.tambahTglWafat, 
                req.body.tambahTglMakam, 
                req.files['tambahKtp'][0].filename, 
                req.files['tambahKk'][0].filename, 
                req.files['tambahSkm'][0].filename, 
                req.body.nikSelectedAhli, 
                req.body.tambahBlok, 
                req.body.tambahBlad, 
                req.body.tambahPetak,
                statusPembayaran
            )
            .then(() => {
                res.redirect('/admin-tpu/data-pendaftaran-baru');
            })
            .catch(error => console.error(error));
        })
    } else {
        res.redirect('/admin/login');
    }
}

exports.updateDataDaftarBaru = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const upload = multer({storage: storage}).fields([{name: 'ubahSkm'}, {name: 'ubahKtp'}, {name: 'ubahKk'}]);
        upload(req, res, (error) => {
            if(error) throw error;
            console.log('Terupload');
            var skm = req.files['ubahSkm'] ? req.files['ubahSkm'][0].filename : null;
            var ktp = req.files['ubahKtp'] ? req.files['ubahKtp'][0].filename : null;
            var kk = req.files['ubahKk'] ? req.files['ubahKk'][0].filename : null;
            var kelamin = req.body.ubahKelamin == 'Wanita' ? true : false;
            console.log(skm, ktp, kk);
            adminTpuModels.updateDaftarBaru(
                req.body.ubahNikSelectedAhli,
                req.body.oldNikAhli, 
                req.body.ubahNik, 
                req.body.oldNikJenazah, 
                req.body.ubahNamaJenazah, 
                kelamin, 
                req.body.ubahTglLahir, 
                req.body.ubahTmptLahir, 
                req.body.ubahAgama, 
                req.body.ubahAlamatJenazah, 
                req.body.ubahTglWafat, 
                req.body.ubahTglMakam, 
                req.body.ubahBlok, 
                req.body.ubahBlad, 
                req.body.ubahPetak, 
                ktp, 
                kk, 
                skm, 
                req.body.ubahStatusPembayaran
            )
            .then(result => {
                console.log('hasilnya', result.update_data_daftar_baru);
                res.redirect('/admin-tpu/data-pendaftaran-baru');
            })
            .catch(error => console.error(error));
        })
    } else {
        res.redirect('/admin/login');
    }
}

exports.deletePendaftar = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var listHapus = req.body.listHapus;
        for(i = 0; i < listHapus.length; i++) {
            adminTpuModels.deletePendaftar(listHapus[i])
            .catch(error => {
                console.error(error);
                res.send({status: 500});
            });
        }
        res.send({status: 200});
    } else {
        res.redirect('/admin/login');
    }
}

exports.cetakDataDaftarBaru = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const kdAdmin = req.cookies.kuburinSystem.kdAdmin;
        const kdTpu = req.cookies.kuburinSystem.kdTpu;
        Promise.all([
            adminTpuModels.getKepalaTpu(kdTpu),
            adminTpuModels.getNamaAdmin(kdAdmin),
            adminTpuModels.getNamaTpu(kdTpu),
            adminTpuModels.dataPendaftarBaru(kdTpu)
        ])
        .then(data => {
            var count = 1;
            datanya = [];
            var namaAdmin = data[1].nama_depan + ' ' + data[1].nama_belakang;
            console.log(namaAdmin);
            datanya.push([
                'No', 
                'Kode Daftar', 
                'Nama Jenazah', 
                'Tanggal Lahir',
                'Tempat Lahir',
                'Kelamin Jenazah', 
                'Agama Jenazah', 
                'Alamat Jenazah',
                'Tanggal Wafat',
                'Tanggal Makam',
                'Nama Ahli Waris', 
                'Status Pendaftaran'
            ]);
            data[3].forEach(pendaftar => {
                datanya.push([
                    count, 
                    pendaftar.kd_daftar, 
                    pendaftar.nama_jenazah, 
                    pendaftar.tgl_lahir,
                    pendaftar.tmpt_lahir,
                    pendaftar.kelamin, 
                    pendaftar.agama_jenazah, 
                    pendaftar.alamat_jenazah,
                    pendaftar.tgl_wafat,
                    pendaftar.tgl_makam,
                    pendaftar.nama_ahli,
                    pendaftar.status_daftar
                ]);
                count++;
            });
            console.table(datanya);
            var judulLaporan = [{
                text: 'Laporan Data Pendaftaran Baru',
                fontSize: 15,
                alignment: 'center',
                margin: [0,0,0,10]
            },{
                text: 'Data Pendaftaran Baru Per Tanggal',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,5]
            },{
                text: 'Periode: ',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,20]
            }];
            var dataTable = {// Garis pembatas
                table: {
                    headerRows: 1,
                    widths: [20, '*', '*', 65, 90, 70,75, 65, 65, 65, '*', 70],
                    body:datanya
                }
            };
    
            createPdfBinary(judulLaporan, dataTable, data[0].get_kepala_tpu, namaAdmin, data[2].get_nama_tpu, 'wide', function (binary) {
                res.contentType('application/pdf');
                res.send(binary);
            }, function (error) {
                res.send('ERROR:' + error);
            });
        })
        .catch(error => console.error(error))
    } else {
        res.redirect('/admin/login');
    }
}

exports.dataPendaftarTumpang = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            adminTpuModels.dataPendaftarTumpang(req.cookies.kuburinSystem.kdTpu),
            adminTpuModels.getAhliWaris(),
            adminTpuModels.getDataMakam(req.cookies.kuburinSystem.kdTpu)
        ])
        .then(data => {
            res.render('admin-data-pendaftaran-tumpang', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'DATA PENDAFTARAN TUMPANG',
                search: true,
                edit: true,
                adminType: 'tpu',
                kdAdmin: req.cookies.kuburinSystem.kdAdmin,
                dataPendaftar: data[0],
                dataAhliWaris: data[1],
                dataMakam: data[2]
            })
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.getTumpanganJenazah = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var fileTumpang = __dirname + '/../asset/images/tumpang/';
        adminTpuModels.getFotoTumpang(req.params.nikJenazah)
        .then(data => {
            res.sendFile(
                path.resolve(fileTumpang += data.foto_tumpangan)
            );
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.addDataPendaftarTumpang = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const upload = multer({storage: storage}).fields([{name: 'tambahSkm'}, {name: 'tambahKtp'}, {name: 'tambahKk'}, {name: 'tambahIptm'}]);
        upload(req, res, (error) => {
            if(error) throw error;
            var kelamin = req.body.tambahKelamin == 'Pria' ? false : true;
            var statusPembayaran = req.body.tambahStatusPembayaran == 'y' ? true : false;
            console.log(
                req.cookies.kuburinSystem.kdTpu, 
                req.body.tambahNik, 
                req.body.tambahNamaJenazah, 
                req.body.tambahTglLahir, 
                req.body.tambahTmptLahir, 
                kelamin, 
                req.body.tambahAgama, 
                req.body.tambahAlamatJenazah, 
                req.body.tambahTglWafat, 
                req.body.tambahTglMakam, 
                req.files['tambahKtp'][0].filename, 
                req.files['tambahKk'][0].filename, 
                req.files['tambahSkm'][0].filename, 
                req.files['tambahIptm'][0].filename, 
                req.body.nikSelectedAhli, 
                req.body.selectedLokasi,
                statusPembayaran,
                req.body.selectedBlok
            );
            adminTpuModels.addDaftarTumpang(
                req.cookies.kuburinSystem.kdTpu, 
                req.body.tambahNik, 
                req.body.tambahNamaJenazah, 
                req.body.tambahTglLahir, 
                req.body.tambahTmptLahir, 
                kelamin, 
                req.body.tambahAgama, 
                req.body.tambahAlamatJenazah, 
                req.body.tambahTglWafat, 
                req.body.tambahTglMakam, 
                req.files['tambahKtp'][0].filename, 
                req.files['tambahKk'][0].filename, 
                req.files['tambahSkm'][0].filename, 
                req.files['tambahIptm'][0].filename, 
                req.body.nikSelectedAhli, 
                req.body.selectedLokasi,
                statusPembayaran,
                req.body.selectedBlok
            )
            .then(() => {
                res.redirect('/admin-tpu/data-pendaftaran-tumpang');
            })
            .catch(error => console.error(error));
        })
    } else {
        res.redirect('/admin/login');
    }
}

exports.updateDataDaftarTumpang = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const upload = multer({storage: storage}).fields([{name: 'ubahSkm'}, {name: 'ubahKtp'}, {name: 'ubahKk'}, {name: 'ubahIptm'}]);
        upload(req, res, (error) => {
            if(error) throw error;
            console.log('Terupload');
            var skm = req.files['ubahSkm'] ? req.files['ubahSkm'][0].filename : null;
            var ktp = req.files['ubahKtp'] ? req.files['ubahKtp'][0].filename : null;
            var kk = req.files['ubahKk'] ? req.files['ubahKk'][0].filename : null;
            var iptm = req.files['ubahIptm'] ? req.files['ubahIptm'][0].filename : null;
            var kelamin = req.body.ubahKelamin == 'Wanita' ? true : false;
            console.log(skm, ktp, kk);
            adminTpuModels.updateDaftarTumpang(
                req.body.ubahNikSelectedAhli, 
                req.body.oldNikAhli, 
                req.body.ubahNik, 
                req.body.oldNikJenazah, 
                req.body.ubahSelectedLokasi,
                req.body.ubahNamaJenazah, 
                kelamin, 
                req.body.ubahTglLahir, 
                req.body.ubahTmptLahir, 
                req.body.ubahAgama, 
                req.body.ubahAlamatJenazah, 
                req.body.ubahTglWafat, 
                req.body.ubahTglMakam,  
                ktp, 
                kk, 
                skm, 
                iptm,
                req.body.ubahStatusPembayaran
            )
            .then(result => {
                console.log('hasilnya', result.update_data_daftar_baru);
                res.redirect('/admin-tpu/data-pendaftaran-tumpang');
            })
            .catch(error => console.error(error));
        })
    } else {
        res.redirect('/admin/login');
    }
}

exports.cetakDataDaftarTumpang = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const kdAdmin = req.cookies.kuburinSystem.kdAdmin;
        const kdTpu = req.cookies.kuburinSystem.kdTpu;
        Promise.all([
            adminTpuModels.getKepalaTpu(kdTpu),
            adminTpuModels.getNamaAdmin(kdAdmin),
            adminTpuModels.getNamaTpu(kdTpu),
            adminTpuModels.dataPendaftarTumpang(kdTpu)
        ])
        .then(data => {
            var count = 1;
            datanya = [];
            var namaAdmin = data[1].nama_depan + ' ' + data[1].nama_belakang;
            console.log(namaAdmin);
            datanya.push([
                'No', 
                'Kode Daftar', 
                'Nama Jenazah', 
                'Tanggal Lahir',
                'Tempat Lahir',
                'Kelamin Jenazah', 
                'Agama Jenazah', 
                'Alamat Jenazah',
                'Tanggal Wafat',
                'Tanggal Makam',
                'Nama Ahli Waris', 
                'Status Pendaftaran'
            ]);
            data[3].forEach(pendaftar => {
                datanya.push([
                    count, 
                    pendaftar.kd_daftar, 
                    pendaftar.nama_jenazah, 
                    pendaftar.tgl_lahir,
                    pendaftar.tmpt_lahir,
                    pendaftar.kelamin, 
                    pendaftar.agama_jenazah, 
                    pendaftar.alamat_jenazah,
                    pendaftar.tgl_wafat,
                    pendaftar.tgl_makam,
                    pendaftar.nama_ahli,
                    pendaftar.status_daftar
                ]);
                count++;
            });
            console.table(datanya);
            var judulLaporan = [{
                text: 'Laporan Data Pendaftaran Tumpangan',
                fontSize: 15,
                alignment: 'center',
                margin: [0,0,0,10]
            },{
                text: 'Data Pendaftaran Tumpangan Per Tanggal',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,5]
            },{
                text: 'Periode: ',
                fontSize: 10,
                alignment: 'center',
                margin: [0,0,0,20]
            }];
            var dataTable = {// Garis pembatas
                table: {
                    headerRows: 1,
                    widths: [20, '*', '*', 65, 90, 70,75, 65, 65, 65, '*', 70],
                    body:datanya
                }
            };
    
            createPdfBinary(judulLaporan, dataTable, data[0].get_kepala_tpu, namaAdmin, data[2].get_nama_tpu, 'wide', function (binary) {
                res.contentType('application/pdf');
                res.send(binary);
            }, function (error) {
                res.send('ERROR:' + error);
            });
        })
        .catch(error => console.error(error))
    } else {
        res.redirect('/admin/login');
    }
}