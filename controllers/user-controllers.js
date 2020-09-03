require('dotenv').config({path:__dirname + '../.env'});
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

// Multer upload file configuration
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log('masuk dest');
        if(file.fieldname == 'suratKeteranganMeninggal') {
            callback(null, __dirname + '../../asset/images/skm/');
        }
        if(file.fieldname == 'ktpJenazah') {
            callback(null, __dirname + '../../asset/images/ktp-jenazah/');
        }
        if(file.fieldname == 'kkJenazah') {
            callback(null, __dirname + '../../asset/images/kk-jenazah/');
        }
        if(file.fieldname == 'suratTumpang') {
            callback(null, __dirname + '../../asset/images/tumpang/');
        }
        if(file.fieldname == 'kkField') {
            console.log('masuk Kk');
            callback(null, __dirname + '../../asset/images/kk-ahli-waris/');
        }
        if(file.fieldname == 'ktpField') {
            callback(null, __dirname + '../../asset/images/ktp-ahli-waris/');
        }
        if(file.fieldname == 'perpanjangIptm') {
            callback(null, __dirname + '../../asset/images/perpanjang/');
        }
    },
    filename: (req, file, callback) => {
        var newName = req.body.nik;
        console.log('namanya ', newName);
        if(!req.body.nik && !req.body.perpanjangNik) {
            newName = req.cookies.kuburin;
        } else if(!req.body.nik && req.body.perpanjangNik) {
            newName = req.body.perpanjangNik;
        }
        callback(null, newName + path.extname(file.originalname));
    }
});
// const upload = multer({storage: storage}).fields([{name: 'suratKeteranganMeninggal'}, {name: 'ktpJenazah'}, {name: 'kkJenazah'}, {name: 'suratTumpang'}, {name: 'kkField'}]);
// const upload = multer({storage: storage}).single('kkField');
const userModels = require('../models/user-models');
const { join, resolve } = require('path');
const { data } = require('jquery');

// Save user location with cookie

// Authentication with cookie
function auth(req, res) {
    if(req.cookies.kuburin) {
        return true;
    } else {
        return false;
    }
}

function loginException(res) {
    res.redirect('/login');
}

// Display index / halaman utama
exports.halamanUtama = (req, res) => {
    var verif = auth(req);
    userModels.getNotifications(req.cookies.kuburin)
    .then(data => {
        res.render('halaman-utama', {
            layout: 'layouts/user-layout',
            halaman: 'putih',
            footer: 'non-fixed',
            title: 'KUBURIN',
            logged: verif,
            notifikasi: data
        })
    })
    .catch(error => console.error(error))
}

// Display login page
exports.login = (req, res) => {
    var verif = auth(req);
    var isNotif = false;
    if(req.cookies.loginNotif) {
        isNotif = true;
        res.clearCookie('loginNotif');
    }
    res.render('user-login', {
        layout: 'layouts/user-layout',
        halaman: 'hijau',
        footer: 'fixed',
        title: 'LOGIN',
        notification: isNotif,
        logged: verif
    })
}

// Login ahli waris
exports.loginAhliWaris = (req, res, next) => {
    userModels.login(req.body.email)
    .then(auth => {
        if(auth.is_existed == false) {
            res.cookie('loginNotif', null, {httpOnly: true});
            res.redirect('/login');
        } else {
            bcrypt.compare(req.body.password, auth.ahli_waris_password, (err, result) => {
                if(err) throw err;
                if(result == true) {
                    userModels.updateLoginTime(req.body.email)
                    .then(() => {
                        res.cookie('kuburin', req.body.email, {httpOnly: false, maxAge: 3600000});
                        res.redirect('/');
                    })
                    .catch(error => console.error(error));
                } else {
                    res.cookie('loginNotif', null, {httpOnly: true});
                    res.redirect('/login');
                }
            })
        }
    })
    .catch(err => console.error(err));
}

// Logout ahli waris
exports.logoutAhliWaris = (req, res) => {
    res.clearCookie('kuburin');
    res.redirect('/');
}

// Display register user page
exports.register = (req, res) => {
    var verif = auth(req);
    var isNotif = false;
    if(req.cookies.registerNotif) {
        isNotif = true;
        res.clearCookie('registerNotif');
    }
    res.render('user-register', {
        layout: 'layouts/user-layout',
        halaman: 'hijau',
        footer: 'fixed',
        title: 'REGISTER',
        notification: isNotif,
        logged: verif
    })
}

// Make user for role ahli waris
exports.makeAhliWaris = (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        if(err) throw err;    
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) throw err;
            userModels.daftar( req.body.nik, req.body.namaDepan, req.body.namaBelakang, req.body.email, hash)
            .then(data => {
                return data.ahli_waris_inserted;
            })
            .then(isInserted => {
                if(isInserted > 0) {
                    res.redirect('/login');
                } else {
                    res.cookie('registerNotif', null, {httpOnly: true});
                    res.redirect('/register');
                }
            })
            .catch(err => console.error(err));
        })
    })
}

// Display kontak kami page
exports.kontakKami = (req, res) => {
    var verif = auth(req);
    res.render('user-kontak-kami', {
        layout: 'layouts/user-layout',
        halaman: 'hijau',
        footer: 'fixed',
        title: 'KONTAK KAMI',
        logged: verif
    })
}

// status pembayaran
exports.statusPembayaran = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        // var kdPembayaran;
        // var namaAhliWaris;
        // var alamat;
        // var telepon;
        // var metodePembayaran;
        // var jumlahPembayaran;
        const pembayaran = (pembayaran, nikJenazah) => new Promise((resolve, reject) => {
            var result = {};
            var cookieName;
            switch(req.params.pembayaran) {
                case 'makamBaru' :
                    console.log('masuk pembayaran makam baru');
                    console.log('pembayaran', pembayaran, ' nik ', nikJenazah);
                    cookieName = 'sewaMakam';
                    userModels.statusPembayaranMakamBaru(nikJenazah)
                    .then(data => {
                        result.kdPembayaran = data.kd_pembayaran;
                        result.namaPembayaran = data.nama_pembayaran;
                        result.namaAhliWaris = data.nama_depan_ahli + ' ' + data.nama_belakang_ahli;
                        result.alamat = data.alamat_ahli;
                        result.telepon = data.telepon_ahli;
                        result.metodePembayaran = data.metode_pembayaran;
                        result.jumlahPembayaran = data.jumlah_pembayaran;
                        res.clearCookie(cookieName);
                        resolve(result);
                    })
                    .catch(error => console.error(error));
                break;
                case 'tumpangTindih' :
                    console.log('masuk pembayaran tumpang tindih');
                    console.log('pembayaran', pembayaran, ' nik ', nikJenazah);
                    cookieName = 'tumpangTindih';
                    userModels.statusPembayaranMakamBaru(nikJenazah)
                    .then(data => {
                        result.kdPembayaran = data.kd_pembayaran;
                        result.namaPembayaran = data.nama_pembayaran;
                        result.namaAhliWaris = data.nama_depan_ahli + ' ' + data.nama_belakang_ahli;
                        result.alamat = data.alamat_ahli;
                        result.telepon = data.telepon_ahli;
                        result.metodePembayaran = data.metode_pembayaran;
                        result.jumlahPembayaran = data.jumlah_pembayaran;
                        res.clearCookie(cookieName);
                        resolve(result);
                    })
                    .catch(error => console.error(error));
                break;
                case 'perpanjang' :
                    console.log('masuk pembayaran perpanjang');
                    console.log('pembayaran', pembayaran, ' nik ', nikJenazah);
                    cookieName = 'perpanjang';
                    userModels.statusPembayaranPerpanjang(nikJenazah)
                    .then(data => {
                        result.kdPembayaran = data.kd_pembayaran;
                        result.namaPembayaran = data.nama_pembayaran;
                        result.namaAhliWaris = data.nama_depan_ahli + ' ' + data.nama_belakang_ahli;
                        result.alamat = data.alamat_ahli;
                        result.telepon = data.telepon_ahli;
                        result.metodePembayaran = data.metode_pembayaran;
                        result.jumlahPembayaran = data.jumlah_pembayaran;
                        res.clearCookie(cookieName);
                        resolve(result);
                    })
                    .catch(error => console.error(error));
                break;
                case 'nisan' :
                    console.log('masuk pembayaran nisan');
                    console.log('pembayaran', pembayaran, ' nik ', nikJenazah);
                    cookieName = 'nisan';
                    userModels.statusPembayaranNisan(nikJenazah)
                    .then(data => {
                        result.kdPembayaran = data.kd_pembayaran;
                        result.namaPembayaran = data.nama_pembayaran;
                        result.namaAhliWaris = data.nama_depan_ahli + ' ' + data.nama_belakang_ahli;
                        result.alamat = data.alamat_ahli;
                        result.telepon = data.telepon_ahli;
                        result.metodePembayaran = data.metode_pembayaran;
                        result.jumlahPembayaran = data.jumlah_pembayaran;
                        res.clearCookie(cookieName);
                        resolve(result);
                    })
                    .catch(error => console.error(error));
                break;
            }
        });
        
        pembayaran(req.params.pembayaran, req.params.nikJenazah)
        .then(data => {
            userModels.getNotifications(req.cookies.kuburin)
            .then(dataNotif => {
                res.render('user-status-pembayaran', {
                    layout: 'layouts/user-layout',
                    halaman: 'hijau',
                    footer: 'fixed',
                    title: 'STATUS PEMBAYARAN',
                    logged: verif,
                    notifikasi: dataNotif,
                    noPembayaran: data.kdPembayaran,
                    namaPembayaran: data.namaPembayaran,
                    namaAhliWaris: data.namaAhliWaris,
                    alamat: data.alamat,
                    telepon: data.telepon,
                    metodePembayaran: data.metodePembayaran,
                    jumlahPembayaran: data.jumlahPembayaran
                })
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

// List TPU
exports.listTpu = (req, res) => {
    var verif = auth(req);
    userModels.listTpu()
    .then(listTpu => {
        res.render('user-list-tpu', {
            layout: 'layouts/user-layout',
            halaman: 'hijau',
            footer: 'fixed',
            title: 'LIST TPU',
            logged: verif,
            listTpu: listTpu
        })
    })
    .catch(error => console.error(error));
}

exports.getJenazahTpu = (req, res) => {
    var verif = auth(req);
    console.log('triggered ', req.params.kdTpu);
    userModels.getJenazahTpu(req.params.kdTpu.trim())
    .then(data => {
        console.table(data);
        res.send(data);
    })
    .catch(error => console.error(error));
}

// List model nisan
exports.listNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            userModels.listNisan(),
            userModels.listJenazahAgama(req.cookies.kuburin),
            userModels.getNotifications(req.cookies.kuburin)
        ])
        .then(data => {
            res.render('user-list-nisan', {
                layout: 'layouts/user-layout',
                halaman: 'hijau',
                footer: 'fixed',
                title: 'LIST NISAN',
                logged: verif,
                notifikasi: data[2],
                listNisan: data[0],
                listJenazah: data[1]
            })
        })
        .catch(error => console.error(error))
    } else {
        loginException(res);
    }
}

// Get nisan image
exports.fotoNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var filePath = __dirname + '/../asset/images/nisan/' + req.params.fotoNisan;
        res.sendFile(path.resolve(filePath));
    } else {
        loginException(res);
    }
}

// Profile user
exports.profile = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            userModels.jenazahAhliWaris(req.cookies.kuburin),
            userModels.getNotifications(req.cookies.kuburin)
        ])
        .then(data => {
            res.render('user-profile', {
                layout: 'layouts/user-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                title: 'PROFILE',
                logged: verif,
                notifikasi: data[1],
                dataJenazah: data[0]
            })
        })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

// Akun user
exports.akun = (req, res) => {
    var verif = auth(req);
    var passwordNotif = req.cookies.updatePasswordNotif ? true : false;
    if(verif == true) {
        Promise.all([
            userModels.dataAkun(req.cookies.kuburin),
            userModels.getNotifications(req.cookies.kuburin)
        ])
        .then(data => {
            res.render('user-akun', {
                layout: 'layouts/user-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                title: 'AKUN',
                logged: verif,
                notifikasi: data[1],
                passwordNotif: passwordNotif,
                dataAkun: data[0]
            })
        })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

exports.updateAkun = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var kelamin = req.body.ubahKelamin == 'wanita' ? true : false;
        userModels.updateAkun(
            req.body.ubahNik.trim(), 
            req.body.ubahNewNik.trim(), 
            req.body.ubahNamaDepan, 
            req.body.ubahNamaBelakang, 
            req.body.ubahAlamat, 
            req.body.ubahKelurahan, 
            req.body.ubahKecamatan, 
            req.body.ubahKodePos.trim(), 
            req.body.ubahKotkab, 
            req.body.ubahProvinsi, 
            req.body.ubahTelepon.trim(), 
            kelamin, 
            req.body.ubahEmail, 
            req.body.ubahNoKk.trim(), 
            req.body.ubahNewNoKk.trim()
        )
        .then(() => { res.redirect('/akun') })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

exports.updatePassword = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        userModels.login(req.cookies.kuburin)
        .then(auth => {
            if(auth.is_existed == false) {
                res.cookie('loginNotif', null, {httpOnly: true});
                res.redirect('/login');
            } else {
                bcrypt.compare(req.body.passwordLama, auth.ahli_waris_password, (err, result) => { 
                    if(err) throw err;
                    if(result == true) {
                        bcrypt.genSalt(10, (error, salt) => {
                            if(error) throw error;
                            bcrypt.hash(req.body.passwordBaru, salt, (error, hash) => {
                                if(error) throw error;
                                userModels.updatePassword(req.cookies.kuburin, hash)
                                .then(() => {res.redirect('/akun')} )
                                .catch(error => console.error(error));
                            });
                        })
                    } else {
                        res.cookie('updatePasswordNotif', null, {httpOnly: true});
                        res.redirect('/login');
                    }
                })
            }
        })
        .catch(err => console.error(err));
    } else {
        loginException(res);
    }
}

// Perpanjang makam user
exports.perpanjangMakam = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            userModels.getPerpanjangAhli(req.cookies.kuburin),
            userModels.getNotifications(req.cookies.kuburin)
        ])
        .then(data => {
            res.render('user-perpanjang-makam', {
                layout: 'layouts/user-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                title: 'PERPANJANG MAKAM',
                logged: verif,
                notifikasi: data[1],
                dataPerpanjang: data[0]
            })
        })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

// Status Pendaftaran jenazah
exports.statusPendaftaran = (req, res) => {
    var notif = false;
    if(req.cookies.statusPendaftaran) {
        res.clearCookie('statusPendaftaran');
        notif = true;
    }
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            userModels.statusPendaftaran(req.cookies.kuburin),
            userModels.getNotifications(req.cookies.kuburin)
        ])
        .then(data => {
            res.render('user-status-pendaftaran', {
                layout: 'layouts/user-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                title: 'PROFILE',
                logged: verif,
                notifikasi: data[1],
                dataPendaftar: data[0],
                notif: notif
            })
        })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

// Rekomendasi TPU
exports.rekomendasiTpu = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var userLat = req.body.lat;
        var userLong = req.body.long;
        var userLoc = {
            latitude: req.body.lat,
            longtitude: req.body.long
        }
        const nikJenazah = req.body.nikJenazah;

        // SAW method
        var penilaianKriteria = (listTpu) => new Promise((resolve, reject) => {
            // Array rating kecocokan
            var ratingKecocokan = [];
            const kriteriaException = (title) => `Error, ${title} value is not in the range`;
        
            listTpu.forEach(tpu => {
                var kriteria = {};
        
                // insert kdTpu for identifier
                kriteria.kdTpu = tpu.kd_tpu;
                // Masukkan rating untuk kriteria 1
                const indikatorHarga1 = 0;
                const indikatorHarga2 = 40000;
                const indikatorHarga3 = 60000;
                const indikatorHarga4 = 80000;
                const indikatorHarga5 = 100000;
        
                if(tpu.harga >= indikatorHarga1 && tpu.harga < indikatorHarga2) {
                    console.log('harganya ', tpu.harga);
                    console.log('bobot 5')
                    kriteria.harga = 5;
                } else if(tpu.harga >= indikatorHarga2 && tpu.harga < indikatorHarga3) {
                    console.log('harganya ', tpu.harga);
                    console.log('bobot 4')
                    kriteria.harga = 4;
                } else if(tpu.harga >= indikatorHarga3 && tpu.harga < indikatorHarga4) {
                    console.log('harganya ', tpu.harga);
                    console.log('bobot 3')
                    kriteria.harga = 3;
                } else if(tpu.harga >= indikatorHarga4 && tpu.harga < indikatorHarga5) {
                    console.log('harganya ', tpu.harga);
                    console.log('bobot 2')
                    kriteria.harga = 2;
                } else if(tpu.harga >= indikatorHarga5) {
                    console.log('harganya ', tpu.harga);
                    console.log('bobot 1')
                    kriteria.harga = 1;
                } else {
                    console.log('harganya ', tpu.harga);
                    console.log('bobot 0')
                    kriteria.harga = 0;
                    // reject(kriteriaException('harga'));
                }
        
                // Masukkan rating untuk kriteria 3
                // Tunggu perubahan
        
                var indikatorJumlahMakam1 = 0;
                var indikatorJumlahMakam2 = 100;
                var indikatorJumlahMakam3 = 200;
                var indikatorJumlahMakam4 = 500;
                var indikatorJumlahMakam5 = 1000;
                // var maksimalPetakPerBlad = 30;
                // var maksimalBladPerBlok = 30;
                // var tambahBlad = false;
                // var jumlahMakam;
        
                // if((tpu.petak_terakhir + 1) > maksimalPetakPerBlad) {
                //     tambahBlad = true;
                //     tpu.petak_terakhir = 1;
                // } else {
                //     tpu.petak_terakhir = tpu.petak_terakhir + 1;
                // }
        
                // if(tambahBlad == true) {
                //     if((tpu.blad_terakhir + 1) > maksimalBladPerBlok) {
                //         maksimalPetakPerBlad = 0;
                //         maksimalBladPerBlok = 0;
                //         tpu.petak_terakhir = 0;
                //         tpu.blad_terakhir = 0;
                //     } else {
                //         tpu.blad_terakhir = tpu.blad_terakhir + 1;
                //     }
                // }
                // console.log('petaknya ', tpu.petak_terakhir);
                // console.log('max petaknya ', maksimalPetakPerBlad);
                // console.log('bladnya ', tpu.blad_terakhir);
                // console.log('max bladnya ', maksimalBladPerBlok);
                // jumlahMakam = (maksimalPetakPerBlad - tpu.petak_terakhir) + ((maksimalBladPerBlok - tpu.blad_terakhir) * maksimalPetakPerBlad);
                // console.log('jumlah makamnya ', jumlahMakam);

                // Fixed
                jumlahMakam = tpu.makam_kosong;
                
                if(jumlahMakam >= indikatorJumlahMakam1 && jumlahMakam < indikatorJumlahMakam2) {
                    console.log('jumlah makam ', jumlahMakam);
                    console.log('bobot 1');
                    kriteria.jumlahMakam = 1;
                } else if(jumlahMakam >= indikatorJumlahMakam2 && jumlahMakam < indikatorJumlahMakam3) {
                    console.log('jumlah makam ', jumlahMakam);
                    console.log('bobot 2');
                    kriteria.jumlahMakam = 2;
                } else if(jumlahMakam >= indikatorJumlahMakam3 && jumlahMakam < indikatorJumlahMakam4) {
                    console.log('jumlah makam ', jumlahMakam);
                    console.log('bobot 3');
                    kriteria.jumlahMakam = 3;
                } else if(jumlahMakam >= indikatorJumlahMakam4 && jumlahMakam < indikatorJumlahMakam5) {
                    console.log('jumlah makam ', jumlahMakam);
                    console.log('bobot 4');
                    kriteria.jumlahMakam = 4;
                } else if(jumlahMakam >= indikatorJumlahMakam5) {
                    console.log('jumlah makam ', jumlahMakam);
                    console.log('bobot 5');
                        kriteria.jumlahMakam = 5;
                } else {
                    console.log('jumlah makam ', jumlahMakam);
                    console.log('bobot 0');
                    kriteria.jumlahMakam = 0;
                    // reject(kriteriaException('jumlah Makam'));
                }
        
                // ratingKecocokan.push(kriteria);
                nilaiKriteriaJarak(userLoc.longtitude, userLoc.latitude, tpu.longtitude, tpu.latitude)
                .then(nilaiJarak => {
                    if(!isNaN(nilaiJarak)) {
                        kriteria.jarak = nilaiJarak
                        ratingKecocokan.push(kriteria);
                        if(ratingKecocokan.length == listTpu.length) {
                            console.log('Penilaian Jarak');
                            console.table(ratingKecocokan);
                            resolve(ratingKecocokan);
                        }
                    } else {
                        reject(kriteriaException('Jarak'));
                    }
                })
                .catch(error => console.error(error));
            });
            console.table(ratingKecocokan);
            // return ratingKecocokan;
        });

        // Get maximum value for requested criteria
        function getMax(namaKriteria, nilaiKriteria) {
            max = 0;
            switch(namaKriteria) {
                case 'harga' :
                    max = Math.max.apply(Math, nilaiKriteria.map(kriteria => {
                        console.log('nilai max dari harga ', nilaiKriteria);
                        console.log('ialah ', kriteria.harga);
                        return kriteria.harga;
                    }));
                break;
                case 'jumlahMakam' :
                    max = Math.max.apply(Math, nilaiKriteria.map(kriteria => {
                        console.log('nilai max dari jumlahMakam ', nilaiKriteria);
                        console.log('ialah ', kriteria.jumlahMakam);
                        return kriteria.jumlahMakam;
                    }));
                break;
                case 'jarak' :
                    max = Math.max.apply(Math, nilaiKriteria.map(kriteria => {
                        console.log('nilai max dari jarak ', nilaiKriteria);
                        console.log('ialah ', kriteria.jarak);
                        return kriteria.jarak;
                    }));
                break;
                default :
                    console.log('masuk default max, ', 0);
                    max;
            }
            return max;
        }

        // Masukkan rating untuk kriteria 2
        // Get distance from OSRM routes
        var nilaiKriteriaJarak = (fromLong, fromLat, toLong, toLat) => new Promise((resolve, reject) => { 
            const jarakException = 'nilaiKriteriaJarak failed';
            const indikatorJarak1 = 0;
            const indikatorJarak2 = 2;
            const indikatorJarak3 = 3;
            const indikatorJarak4 = 4;
            const indikatorJarak5 = 5;

            fetch(`http://127.0.0.1:5000/route/v1/driving/${fromLong},${fromLat};${toLong.trim()},${toLat.trim()}?exclude=motorway`)
            .then(mapResult => {
                if(mapResult.status == 200) {
                    return mapResult.json()
                } else {
                    console.log('status != 200');
                    return jarakException;
                }
            })
            .then(mapResult => {
                // resolve(mapResult['routes'][0].distance);
                if(mapResult != jarakException){
                    var nilai;
                    var jarak = mapResult['routes'][0].distance / 1000;
                    if(jarak >= indikatorJarak1 && jarak < indikatorJarak2) {
                        console.log('jaraknya ' +  jarak + ' bobotnya 5');
                        nilai = 5;
                    } else if(jarak >= indikatorJarak2 && jarak < indikatorJarak3) {
                        console.log('jaraknya ' +  jarak + ' bobotnya 4');
                        nilai = 4;
                    } else if(jarak >= indikatorJarak3 && jarak < indikatorJarak4) {
                        console.log('jaraknya ' +  jarak + ' bobotnya 3');
                        nilai = 3;
                    } else if(jarak >= indikatorJarak4 && jarak < indikatorJarak5) {
                        console.log('jaraknya ' +  jarak + ' bobotnya 2');
                        nilai = 2;
                    } else if(jarak > indikatorJarak5){
                        console.log('jaraknya ' +  jarak + ' bobotnya 1');
                        nilai = 1;
                    } else {
                        console.log('jaraknya ' +  jarak + ' bobotnya default');
                        nilai = jarakException;
                    }
                    resolve(nilai);
                } else {
                    reject(jarakException);
                }
            })
            .catch(error => console.error(error));
        });

        userModels.rekomendasiTpu(req.body.blok, req.body.agama)
        .then(listTpu => {
            // Ubah nanti, ini hanya sementara untuk value blad
            // listTpu.forEach(tpu => {
            //     tpu.blad_terakhir = tpu.jumlah_petak / 20;
            // })
            
            // Berdasarkan kriteria 1, 2 dan 3
            const nilaiBobotKriteria = [3, 5, 4];
            penilaianKriteria(listTpu)
            .then(nilaiKriteria => {
                if(nilaiKriteria == 'nilaiKriteria failed') {
                    res.cookie('statusPendaftaran', null, {httpOnly: true});
                    res.redirect('/status-pendaftaran');
                } else {

                    // console.log('dalam rekomen');
                    // console.table(nilaiKriteria);
                    normalizedMatrix = [];
                    var maxHarga = getMax('harga', nilaiKriteria);
                    var maxJumlahMakam = getMax('jumlahMakam', nilaiKriteria);
                    var maxJarak = getMax('jarak', nilaiKriteria);
                    // console.log('max harga' + maxHarga + ', max jumlah makam ' + maxJumlahMakam + ', max jarak' + maxJarak);
    
                    // Normalisasi Matriks
                    nilaiKriteria.forEach(tpu => {
                        var elementMatrix = {};
                        elementMatrix.kdTpu = tpu.kdTpu;
                        elementMatrix.normalisasiHarga = tpu.harga / maxHarga
                        console.log('normalisasi harga ' + tpu.harga + ' / ' + maxHarga);
                        elementMatrix.normalisasiMakamKosong = tpu.jumlahMakam / maxJumlahMakam;
                        console.log('normalisasi jumlah makam ' + tpu.jumlahMakam + ' / ' + maxJumlahMakam);
                        elementMatrix.normalisasiJarak = tpu.jarak / maxJarak;
                        console.log('normalisasi jarak ' + tpu.jarak + ' / ' + maxJarak);
                        normalizedMatrix.push(elementMatrix);
                    })
                    console.log('hasil normalisasi');
                    console.table(normalizedMatrix);
    
                    // Ranking
                    var listRank = [];
                    normalizedMatrix.forEach(tpu => {
                        var rank = {};
                        rank.kdTpu = tpu.kdTpu;
                        console.log('kdnya ', rank.kdTpu);
                        rank.nilaiBobot = (nilaiBobotKriteria[0] * tpu.normalisasiHarga) + (nilaiBobotKriteria[1] * tpu.normalisasiMakamKosong) + (nilaiBobotKriteria[2] * tpu.normalisasiJarak);
                        console.log(`(${nilaiBobotKriteria[0]} * ${tpu.normalisasiHarga}) + (${nilaiBobotKriteria[1]} * ${tpu.normalisasiMakamKosong}) + (${nilaiBobotKriteria[2]} * ${tpu.normalisasiJarak})`);
                        // console.log('nilai dari kdTPu '+ tpu.kdTpu + ' ialah ' + score);
                        listRank.push(rank);
                    })
                    console.log('table nilai bobot');
                    console.table(listRank);
    
                    // Insert nilai bobot into listTpu
                    listTpu.forEach(tpu => {
                        listRank.filter(rank => {   
                            if(rank['kdTpu'] == tpu.kd_tpu) {
                                tpu.nilaiBobot = rank['nilaiBobot'];
                                return rank;
                            }
                        })
                    });
                    console.log('hasil akhir SAW');
                    console.table(listTpu);
    
                    // Sort by higher nilaiBobot
                    listTpu.sort((a, b) => b.nilaiBobot - a.nilaiBobot);
                    console.log('hasil SAW sorted');
                    console.table(listTpu);

                    // send response to UI / browser
                    userModels.getNotifications(req.cookies.kuburin)
                    .then(data => {
                        res.render('user-rekomendasi-tpu', {
                            layout: 'layouts/user-layout',
                            halaman: 'hijau',
                            footer: 'fixed',
                            title: 'REKOMENDASI TPU',
                            logged: verif,
                            notifikasi: data,
                            jenazah: req.params.nikJenazah,
                            listTpu: listTpu,
                            userLoc: userLoc,
                            makamCriteria : {nikJenazah: nikJenazah, agamaJenazah: req.body.agama, blok: req.body.blok}
                        })
                    })
                    .catch(error => console.error(error));
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error));
    }
}

exports.sewaMakamBaru = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        res.clearCookie('sewaMakam', 'tumpangTindih', 'perpanjang', 'nisan');
        res.cookie('sewaMakam', {
            jenisDaftar: true, 
            selectedTpu: req.body.selectedTpu, 
            nikJenazah: req.body.nikJenazah, 
            blok: req.body.blokJenazah, 
            blad: req.body.newBlad, 
            petak: req.body.newPetak,
            namaPembayaran: 'Sewa Makam Baru',
            harga: req.body.hargaMakam
        }, {httpOnly: true});
        res.redirect('/metode-pembayaran');
    } else {
        loginException(res);
    }
}

exports.sewaMakamTumpang = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        res.clearCookie('sewaMakam', 'tumpangTindih', 'perpanjang', 'nisan');
        userModels.hargaSewaTumpang(req.body.kdLokasi)
        .then(data => {
            res.cookie('tumpangTindih', {
                nikJenazah: req.body.nikJenazah, 
                namaPembayaran: 'Sewa Makam Tumpang Tindih', 
                harga: data.harga_sewa_tumpang
            }, {httpOnly: true});
            res.redirect('/metode-pembayaran');
        })
    } else {
        loginException(res);
    }
}

// Buy Nisan for selected jenazah
exports.buyNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        res.clearCookie('sewaMakam', 'tumpangTindih', 'perpanjang', 'nisan');
        res.cookie('nisan', {
            nikJenazah: req.params.nikJenazah, 
            kdNisan: req.params.kdNisan,
            namaPembayaran: 'Nisan Baru'
        }, {httpOnly: true});
        res.redirect('/metode-pembayaran');
    } else {
        loginException(res);
    }
}

// Expand expired time by nik
exports.perpanjangSewa = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        // res.clearCookie('sewaMakam', 'tumpangTindih', 'perpanjang', 'nisan');
        const upload = multer({storage: storage}).single('perpanjangIptm');
        upload(req, res, (error) => {
            if(error) throw error;
            userModels.insertPerpanjang(req.file.filename, req.body.perpanjangNik)
            .then(() => {
                res.redirect('/status-perpanjangan');
                // userModels.hargaPerpanjang(req.body.perpanjangNik)
                // .then(data => {
                //     res.cookie('perpanjang', {
                //         nikJenazah: req.body.perpanjangNik, 
                //         namaPembayaran: 'Perpanjang Makam', 
                //         harga: data.harga_perpanjang
                //     }, {httpOnly: true});
                //     res.redirect('/metode-pembayaran');
                // })
                // .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
        })
    }
}

// Make cookie for selected confirmed perpanjang makam
exports.selectedPerpanjang = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        res.clearCookie('sewaMakam', 'tumpangTindih', 'perpanjang', 'nisan');
        userModels.hargaPerpanjang(req.params.nikJenazah)
        .then(data => {
            res.cookie('perpanjang', {
                nikJenazah: req.params.nikJenazah, 
                namaPembayaran: 'Perpanjang Makam', 
                harga: req.params.harga
            }, {httpOnly: true});
            res.redirect('/metode-pembayaran');
        })
        .catch(error => console.error(error));
    }
}

// Metode pembayaran user
exports.metodePembayaran = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var pembayaran;
        if(req.cookies.sewaMakam) {
            pembayaran = 'makamBaru';
        } else if(req.cookies.tumpangTindih) {
            pembayaran = 'tumpangTindih';
        } else if(req.cookies.perpanjang) {
            pembayaran = 'perpanjang';
        } else if(req.cookies.nisan) {
            pembayaran = 'nisan';
        }
        userModels.getNotifications(req.cookies.kuburin)
        .then(data => {
            res.render('user-metode-pembayaran', {
                layout: 'layouts/user-layout',
                halaman: 'hijau',
                footer: 'fixed',
                title: 'METODE PEMBAYARAN',
                logged: verif,
                notifikasi: data,
                pembayaran: pembayaran
            })
        })
        .catch(error => console.error(error))
    } else {
        loginException(res);
    }
}

exports.processingPembayaran = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var namaPembayaran;
        var metodePembayaran = req.body.metodePembayaran == 'transfer' ? true : false;
        switch(req.body.pembayaran) {
            case 'makamBaru' :
                console.log('masuk makam baru');
                console.log('pembayaran', req.body.pembayaran, ' metode ', req.body.metodePembayaran);
                userModels.sewaMakamBaru(
                    req.cookies.kuburin, 
                    req.cookies.sewaMakam.nikJenazah.trim(), 
                    req.body.pembayaran, 
                    req.cookies.sewaMakam.namaPembayaran, 
                    metodePembayaran, 
                    req.cookies.sewaMakam.blok, 
                    req.cookies.sewaMakam.petak, 
                    req.cookies.sewaMakam.selectedTpu, 
                    req.cookies.sewaMakam.blad, 
                    req.cookies.sewaMakam.harga
                )
                .then(() => {
                    res.redirect('/status-pembayaran/' + req.body.pembayaran + '/' + req.cookies.sewaMakam.nikJenazah.trim());
                })
                .catch(error => console.error(error));

            break;
            case 'tumpangTindih' :
                console.log('masuk tumpang tindih');
                console.log('pembayaran', req.body.pembayaran, ' metode ', req.body.metodePembayaran);
                userModels.sewaMakamTumpang(
                    req.cookies.kuburin,
                    req.cookies.tumpangTindih.nikJenazah.trim(),
                    req.body.pembayaran,
                    req.cookies.tumpangTindih.namaPembayaran,
                    metodePembayaran,
                    req.cookies.tumpangTindih.harga
                )
                .then(() => {
                    res.redirect('/status-pembayaran/' + req.body.pembayaran + '/' + req.cookies.tumpangTindih.nikJenazah.trim());
                })
                .catch(error => console.error(error));
            break;
            case 'perpanjang' :
                console.log('masuk perpanjang');
                console.log('pembayaran', req.body.pembayaran, ' metode ', req.body.metodePembayaran);
                userModels.perpanjangSewa(
                    req.cookies.kuburin,
                    req.cookies.perpanjang.nikJenazah.trim(),
                    req.body.pembayaran,
                    req.cookies.perpanjang.namaPembayaran,
                    metodePembayaran,
                    req.cookies.perpanjang.harga
                )
                .then(() => {
                    res.redirect('/status-pembayaran/' + req.body.pembayaran + '/' + req.cookies.perpanjang.nikJenazah.trim());
                })
                .catch(error => console.error(error));
            break;
            case 'nisan' :
                console.log('masuk nisan');
                console.log('pembayaran', req.body.pembayaran, ' metode ', req.body.metodePembayaran);
                userModels.buyNisan(
                    req.cookies.kuburin,
                    req.cookies.nisan.nikJenazah,
                    req.cookies.nisan.kdNisan,
                    metodePembayaran,
                    req.body.pembayaran,
                    req.cookies.nisan.namaPembayaran
                )
                .then(() => {
                    res.redirect('/status-pembayaran/' + req.body.pembayaran + '/' + req.cookies.nisan.nikJenazah.trim());
                })
                .catch(error => console.error(error));
            break;
        }
    } else {
        loginException(res);
    }
}

// Pendaftaran jenazah
exports.daftarJenazah = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            userModels.dataAkun(req.cookies.kuburin),
            userModels.getNotifications(req.cookies.kuburin)
        ])
        .then(data => {
            res.render('user-daftar-jenazah', {
                layout: 'layouts/user-layout',
                halaman: 'putih',
                footer: 'non-fixed',
                title: 'DAFTAR JENAZAH',
                logged: verif,
                notifikasi: data[1],
                dataAkun: data[0]
            })
        })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

exports.tambahDaftarJenazah = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        console.log('masukko');
        const upload = multer({storage: storage}).fields([{name: 'suratKeteranganMeninggal'}, {name: 'ktpJenazah'}, {name: 'kkJenazah'}, {name: 'suratTumpang'}]);
        upload(req, res, (error) => {
            if(error) throw error;
            console.log('filenya ', req.files['ktpJenazah'][0].filename);
            var jenisDaftar = req.body.jenisPendaftaran == 'baru' ? true : false;
            var kelamin = req.body.kelamin == 'wanita' ? true : false;
            var suratTumpang = req.files['suratTumpang'] ? req.files['suratTumpang'][0].filename : null;
            var nikTumpang = req.body.nikTumpang.length < 1 ? null : req.body.nikTumpang;
            console.log(req.body.email);

            userModels.daftarJenazah(
                req.body.email,
                req.body.nik,
                req.body.namaJenazah,
                req.body.tglLahir,
                req.body.tempat,
                kelamin,
                req.body.agama,
                req.body.alamat,
                req.body.tglWafat,
                req.body.tglMakam,
                req.files['ktpJenazah'][0].filename,
                req.files['kkJenazah'][0].filename,
                req.files['suratKeteranganMeninggal'][0].filename,
                suratTumpang,
                jenisDaftar,
                req.body.blok,
                nikTumpang
            )
            .then(() => {res.redirect('/profile')} )
            .catch(error => console.error(error));
        });
    } else {
        loginException(res);
    }
}

// Controller for menu Status Pembayaran
exports.transaksiAhliWaris = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            userModels.statusPembayaranAhliWaris(req.cookies.kuburin),
            userModels.getNotifications(req.cookies.kuburin)
        ])
        .then(data => {
            res.render('user-transaksi', {
                layout: 'layouts/user-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                title: 'PROFILE',
                logged: verif,
                notifikasi: data[1],
                dataTransaksi: data[0]
            })
        })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

// Store KTP ahli waris
exports.addKtpAhli = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const upload = multer({storage: storage}).single('ktpField');
        upload(req, res, (error) => {
            if(error) throw error;
            console.log(req.file.filename);
            userModels.addFotoKtpAhli(req.cookies.kuburin, req.file.filename)
            .then(() => {
                res.redirect('/profile');
            })
            .catch(error => console.error(error));
        })
    } else {
        loginException(res);
    }
}

// Get KTP ahli waris
exports.getKtpAhliWaris = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var filePath = __dirname + '/../asset/images/ktp-ahli-waris/';
        userModels.getFotoKtpAhli(req.cookies.kuburin)
        .then(data => {
            if(data.get_ktp_ahli == null || data.get_ktp_ahli.length < 1) {
                console.log('datanya ', data);
                res.send(data);
            } else {
                filePath += data.get_ktp_ahli;
                console.log('pathnya ', filePath);
                res.sendFile(path.resolve(filePath));
            }
        })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

// Store KK ahli waris
exports.addKkAhli = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const upload = multer({storage: storage}).single('kkField');
        upload(req, res, (error) => {
            if(error) throw error;
            console.log(req.file.filename);
            userModels.addFotoKkAhli(req.cookies.kuburin, req.file.filename)
            .then(() => {
                res.redirect('/profile');
            })
            .catch(error => console.error(error));
        })
    } else {
        loginException(res);
    }
}

// Get KK ahli waris
exports.getKkAhliWaris = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var filePath = __dirname + '/../asset/images/kk-ahli-waris/';
        userModels.getFotoKkAhli(req.cookies.kuburin)
        .then(data => {
            if(data.get_kk_ahli == null || data.get_kk_ahli.length < 1) {
                console.log('datanya ', data);
                res.send(data);
            } else {
                filePath += data.get_kk_ahli;
                console.log('pathnya ', filePath);
                res.sendFile(path.resolve(filePath));
            }
        })
        .catch(error => console.error(error));
    } else {
        loginException(res);
    }
}

// Get status of perpanjangan makam
exports.statPerpanjangAhli = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        Promise.all([
            userModels.statusPerpanjangAhli(req.cookies.kuburin),
            userModels.getNotifications(req.cookies.kuburin)
        ])
        .then(data => {
            res.render('user-status-perpanjang', {
                layout: 'layouts/user-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                title: 'PROFILE',
                logged: verif,
                notifikasi: data[1],
                statusPerpanjang: data[0]
            })
        })
        .catch(error => console.error(error));
    }
}

// Join or leave roomchat
exports.userSocket = (socket, io) => {
    // Join/leave chatroom function
    function chatRoom(data, command) {
        if(command == 'join') {
            console.log('join to roomchat', data);
            socket.join(data)
        } else {
            console.log('leave from roomchat ', data);
            socket.leave(data);
        }
    }

    // Join chatroom for user
    socket.on('joinNotif', (data) => {
        // console.log('join to roomchat ', data.roomName);
        // socket.join(data)
        chatRoom(data, 'join');
    })
    // Leave chatroom for user
    socket.on('leaveNotif', (data) => {
        // console.log('leave from roomchat ', data);
        // socket.leave(data);
        chatRoom(data, 'leave');
    })

    // Passing Notification from PTSP/Bank
    socket.on('passNotif', (data) => {
        chatRoom(data.dest, 'join');
        console.log('datanya', data.content);
        io.to(data.dest).emit('notif', {content: data.content, date: data.date});
        chatRoom(data.dest, 'leave');
    })
}

exports.checkKadaluarsa = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        userModels.checkKadaluarsa(req.cookies.kuburin)
        .then(result => {
            res.send(JSON.stringify(result));
        })
        .catch(error => console.error(error));
    } else {
        res.sendStatus(500);
    }
}

exports.addNotfication = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        console.table(req.body);
        var getDate = (data) => new Promise((resolve, reject) => {
            var listDate = [];
            data.forEach(notif => {
                userModels.addNotification(notif.kdNotif, notif.content, notif.nik)
                .then(result => {
                    var dateObj = {};
                    dateObj.content = notif.content; 
                    dateObj.tglInserted = result.date_inserted;
                    listDate.push(dateObj);
                    if(listDate.length == data.length) {
                        resolve(listDate);
                    }
                })
                .catch(error => console.error(error));
            })
        });
        getDate(req.body)
        .then(data => {
            res.send(JSON.stringify(data));
        })
        .catch(error => console.error(error))

    } else {
        res.sendStatus(500);
    }
}