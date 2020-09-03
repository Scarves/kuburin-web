const adminModels = require('../models/admin-models');
const path = require('path');
const fs = require('fs');
const pdfMakePrinter = require('pdfmake');
const bcrypt = require('bcrypt');
const { isObject } = require('util'); // Idk, it generates itself maybe, if it is not depends on the main code then remove it
const multer = require('multer');

// Multer upload file configuration
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log('masuk dest');
        if(file.fieldname == 'chatImage') {
            callback(null, __dirname + '../../asset/images/chat/');
        }
        if(file.fieldname == 'chatFile') {
            console.log('masukin file');
            console.log(req.body);
            callback(null, __dirname + '../../asset/files/chat/');
        }
        if(file.fieldname == 'tambahGambarNisan' || file.fieldname == 'ubahGambarNisan') {
            callback(null, __dirname + '../../asset/images/nisan/');
        }
    },
    filename: (req, file, callback) => {
        var newName;
        if(file.fieldname == 'chatFile') {
            console.log('renaming file');
            console.log(req.body);
            newName = req.body.renameFileField;
        }
        if(file.fieldname == 'chatImage') {
            console.log('renaming image');
            newName = req.body.renameImageField;
        }
        if(file.fieldname == 'tambahGambarNisan') {
            newName = req.body.tambahKdNisan;
        }
        if(file.fieldname == 'ubahGambarNisan') {
            newName = req.body.ubahKdNisan;
        }
        callback(null, newName + path.extname(file.originalname));
    }
});


// Cookie Validator
function auth(req, res) {
    if(req.cookies.kuburinSystem && req.cookies.kuburinSystem.jenisAdmin == 'pusat') {
        
        return true;
    } else {
        return false;
    }
}

function loginException(res) {
    res.cookie('loginNotif', null, {httpOnly: true});
    res.redirect('/admin/login');
}

var listRoom = [];
function registingRoom(dataPesan) {
    console.log('buat room baru');
    var newRoom = {};
    newRoom.roomName = dataPesan.pengirim + dataPesan.tujuan;
    newRoom.adminSatu = dataPesan.pengirim;
    newRoom.adminDua = dataPesan.tujuan;
    listRoom.push(newRoom);
    return newRoom;
}
function findRoom(dataPesan) {
    console.log('finding room');
    var result = listRoom.filter(data => {
        if((data['adminSatu'] == dataPesan.pengirim && data['adminDua'] == dataPesan.tujuan) || (data['adminSatu'] == dataPesan.tujuan && data['adminDua'] == dataPesan.pengirim)) {
            return dataPesan;
        }
    })
    return result;
}
exports.message = (socket, io) => {
    socket.on('pesan', (data) => {
        var getRoom;
        console.log('isi listRoom');
        console.table(listRoom);
        getRoom = findRoom(data);
        console.log('room namenya ', getRoom[0].roomName);
        console.log(data);
        io.to(getRoom[0].roomName).emit('pesan', data);
    })

    // Join user to new chat
    socket.on('chatWith',(data) => {
        console.log('meminta chat dengan ', data);
        var roomName, rooms;
        if(listRoom.length > 0) {
            rooms = findRoom(data);
            console.log('hasil filter ', rooms);
            if(rooms.length == 0) {
                roomName = registingRoom(data).roomName;
            } else {
                roomName = rooms[0].roomName;
            }
        } else {
            roomName = registingRoom(data).roomName;
        }
        socket.join(roomName);
        console.log('chat with nama room ', roomName);
    })

    socket.on('closeChat', (data) => {
        console.log(data.pengirim + ' menutup chat dengan ' + data.tujuan);
        var getRoom;
        getRoom = findRoom(data);
        socket.leave(getRoom[0].roomName);
    })
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


// Converting data into formatted pdf report
function createPdfBinary(judulLaporan, dataTable, namaKepala, namaAdmin, callback) {
    var logoImage = __dirname + '/../asset/images/web/logo-dki.png';

    var template = {
        header: {
            image: logoImage,
            width: 70,
            height: 70,
            alignment: 'center',
            margin: [ 0, 15, 0, 10 ],
        },
        content: [
            {
                text: 'HEADING',
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

/* Authentication / Login methods */
// Display login admin pusat
exports.login = (req, res) => {
    var isLogin, isNotif = false;
    if(req.cookies.loginNotif) {
        isNotif = true;
        res.clearCookie('loginNotif');
    } else {
        isNotif = false;
    }
    res.render('admin-login', {
        layout: 'layouts/admin-layout',
        halaman: 'hijau',
        footer: 'fixed',
        logged: false,
        title: 'LOGIN',
        search: null,
        edit: false,
        notification: isNotif,
        kdAdmin: ''
    })
}

// Login / Auth for admin
exports.loginAdmin = (req, res) => {
    console.log(req.body.kdAdmin);
    adminModels.login(req.body.kdAdmin)
        .then(getAdmin => {
            if(getAdmin.is_exist == true) {
                bcrypt.compare(req.body.password, getAdmin.get_password, (error, result) => {
                    if(error) throw error;
                    if(result == true) {
                        adminModels.updateLoginTime(req.body.kdAdmin)
                        .then(() => {
                            res.cookie('kuburinSystem', {jenisAdmin: getAdmin.get_jenis_admin, kdAdmin: req.body.kdAdmin, kdTpu: getAdmin.get_kd_tpu}, {httpOnly: true, maxAge:3600000});
                            if(getAdmin.get_jenis_admin == 'pusat'){
                                res.redirect('/admin');
                            } else {
                                res.redirect('/admin-tpu');
                            }
                        })
                        .catch(error => console.error(error));
                    } else {
                        loginException(res);
                    }
                })
            } else {
                loginException(res);
            }
            // if(getAdmin.get_password == req.body.password) {
                // res.cookie('kuburinSystem', getAdmin.get_jenis_admin, {httpOnly: true, maxAge:3600000});
                // res.redirect('/admin');
            // } else {
                // res.cookie('loginNotif', null, {httpOnly: true});
                // res.redirect('/admin/login');
            // }
        })
        .catch(error => console.error(error));
}

/* Admin Pusat methods */

// Dashboard admin pusat
exports.dashboard = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.dashboard()
            .then(data => {
                res.render('admin-dashboard', {
                    layout: 'layouts/admin-layout',
                    halaman: 'hijau',
                    footer: 'non-fixed',
                    logged: true,
                    title: 'DASHBOARD',
                    search: null,
                    edit: false,
                    adminType: req.cookies.kuburinSystem.jenisAdmin.trim(),
                    firstCard: data.jumlah_ahli_waris,
                    secondCard: data.jumlah_tpu,
                    thirdCard: data.jumlah_pengunjung,
                    fourthCard: data.jumlah_admin_tpu,
                    fifthCard: data.jumlah_admin_aktif,
                    kdAdmin: ''
                })
            })
            .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// List data ahli waris
exports.dataAhliWaris = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        // admin-data-ahli-waris
        adminModels.dataAhliWaris()
            .then(data => {
                res.render('admin-data-ahli-waris', {
                    layout: 'layouts/admin-layout',
                    halaman: 'hijau',
                    footer: 'non-fixed',
                    logged: true,
                    title: 'DATA AHLI WARIS',
                    search: 'asd',
                    edit: true,
                    adminType: req.cookies.kuburinSystem.jenisAdmin.trim(),
                    dataAhliWaris: data,
                    kdAdmin: ''
                })
            })
            .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.deleteDataAhliWaris = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.deleteAhliWaris(req.params.nik, req.params.kdAhliWaris)
            .then(result => {
                res.redirect('/admin/data-ahli-waris');
            })
            .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}
// Cetak Data Ahli Waris
exports.cetakDataAhliWaris = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        const namaKepala = '';
        const kdAdmin = req.cookies.kuburinSystem.kdAdmin;
        Promise.all([
            adminModels.getNamaAdmin(kdAdmin),
            adminModels.cetakDataAhliWaris()
        ])
        .then(data => {
            var count = 1;
            datanya = [];
            var namaAdmin = data[0].nama_depan + ' ' + data[0].nama_belakang;
            console.log(namaAdmin);
            datanya.push(['No', 'Kode Ahli Waris', 'Nama Depan', 'Nama Belakang', 'NIK', 'Tanggal Terakhir Login']);
            data[1].forEach(ahliWaris => {
                if(ahliWaris.tgl_terakhir_login == null) {
                    ahliWaris.tgl_terakhir_login = '-';
                }
                datanya.push([count, ahliWaris.kd_ahli_waris, ahliWaris.nama_depan, ahliWaris.nama_belakang, ahliWaris.nik, ahliWaris.tgl_terakhir_login]);
                count++;
            });
            console.table(datanya);
            var judulLaporan = [{
                text: 'Laporan Data Ahli Waris',
                fontSize: 15,
                alignment: 'center',
                margin: [0,0,0,10]
            },{
                text: 'Ahli waris per tanggal',
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
                    widths: [20, 60, '*', '*', '*', '*'],
                    body:datanya
                }
            };
    
            createPdfBinary(judulLaporan, dataTable, namaKepala, namaAdmin, function (binary) {
                res.contentType('application/pdf');
                res.send(binary);
            }, function (error) {
                res.send('ERROR:' + error);
            });
        })
        .catch(error => console.error(error))
    }
}

// Try and error purposes
exports.getDataAhliWaris = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.dataAhliWaris()
            .then(data => {
                console.log('data ahli waris diambil')
                res.json(data);
            })
            .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}


// List data jenazah
exports.getDataJenazah = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.dataJenazah(req.params.kdAhliWaris)
            .then(data => {
                res.json(data);
            })
            .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// List Data TPU
exports.dataTpu = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.dataTpu()
            .then(data => {
                res.render('admin-data-tpu', {
                    layout: 'layouts/admin-layout',
                    halaman: 'hijau',
                    footer: 'non-fixed',
                    logged: true,
                    title: 'DATA TPU',
                    search: 'asd',
                    edit: true,
                    adminType: req.cookies.kuburinSystem.jenisAdmin.trim(),
                    dataTpu: data,
                    kdAdmin: ''
                })
            })
            .catch(err => console.error(err));
    } else {
        res.redirect('/admin/login');
    }
}

// List Data Pegawai per TPU
exports.getDataPegawai = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.dataPegawai(req.params.kdTpu)
            .then(data => {
                res.json(data);
            })
            .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Delete data tpu controller
exports.deleteDataTpu = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.deleteDataTpu(req.params.kdTpu)
            .then(data => {
                res.redirect('/admin/data-tpu');
            })
            .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Add data Tpu controller
exports.addDataTpu = (req, res) => {
    console.log('nama tpunya ');
    console.log(req.body.coba);
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.addDataTpu(
            req.body.tambahNamaTpu,
            req.body.tambahNikKepalaTpu,
            req.body.tambahNamaDepanKepalaTpu,
            req.body.tambahNamaBelakangKepalaTpu,
            req.body.tambahAlamatTpu,
            req.body.tambahKodePos,
            req.body.tambahLongtitude,
            req.body.tambahLatitude,
            req.body.tambahLuasTpu,
            req.body.tambahIslamAA01, 
            req.body.tambahIslamAA02, 
            req.body.tambahIslamA001,
            req.body.tambahIslamA002,
            req.body.tambahIslamA003, 
            req.body.tambahKristenAA01, 
            req.body.tambahKristenAA02,
            req.body.tambahKristenA001,
            req.body.tambahKristenA002,
            req.body.tambahKristenA003,
            req.body.tambahHbAA01,
            req.body.tambahHbAA02,
            req.body.tambahHbA001,
            req.body.tambahHbA002,
            req.body.tambahHbA003
        )
        .then(() => res.redirect('/admin/data-tpu') )
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Update data Tpu controller
exports.updateDataTpu = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.updateDataTpu(
            req.params.kdTpu, 
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
        .then(() => res.redirect('/admin/data-tpu') )
        .catch( error => console.error(error) );
    } else {
        res.redirect('/admin/login');
    }
}

// Cetak Data TPU
exports.cetakDataTpu = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        const namaKepala = '';
        const kdAdmin = req.cookies.kuburinSystem.kdAdmin;
        Promise.all([
            adminModels.getNamaAdmin(kdAdmin),
            adminModels.cetakDataTpu()
        ])
        .then(data => {
            var count = 1;
            datanya = [];
            var namaAdmin = data[0].nama_depan + ' ' + data[0].nama_belakang;
            console.log(namaAdmin);
            datanya.push(['No', 'Kode TPU', 'Nama TPU' ,'Jumlah Makam', 'Luas TPU', 'Terisi', 'Alamat']);
            data[1].forEach(tpu => {
                datanya.push([count, tpu.kd_tpu, tpu.nama_tpu, tpu.jumlah_makam, tpu.luas_tpu, tpu.makam_terisi, tpu.alamat]);
                count++;
            });
            console.table(datanya);
            var judulLaporan = [{
                text: 'Laporan Data TPU',
                fontSize: 15,
                alignment: 'center',
                margin: [0,0,0,10]
            },{
                text: 'TPU Per Bulan',
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
                    widths: [20, 85, 70, 45, 50, 40, '*'],
                    body:datanya
                }
            };
    
            createPdfBinary(judulLaporan, dataTable, namaKepala, namaAdmin, function (binary) {
                res.contentType('application/pdf');
                res.send(binary);
            }, function (error) {
                res.send('ERROR:' + error);
            });
        })
        .catch(error => console.error(error))
    }
}

// List data admin
exports.dataAdmin = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        Promise.all([
            adminModels.dataAdmin(),
            adminModels.dataAdminTpu(),
            adminModels.listTpu()
        ])
        .then(data => {
            Array.prototype.push.apply(data[0], data[1]);
            res.render('admin-data-admin', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'DATA ADMIN',
                search: 'asd',
                edit: true,
                adminType: req.cookies.kuburinSystem.jenisAdmin.trim(),
                dataAdmin: data[0],
                listTpu: data[2],
                kdAdmin: ''
            })
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

// Add data admin
exports.addDataAdmin = (req, res) => {
    var verif = auth(req, res);
    var kelamin = req.body.tambahKelamin == 'wanita' ? true : false;
    var jenisAdmin = req.body.tambahJenisAdmin == 'adminPusat' ? true : false;

    if(verif == true) {
        bcrypt.genSalt(10, (error, salt) => {
            if(error) throw error;
            bcrypt.hash(req.body.tambahPassword, salt, (error, hash) => {
                if(error) throw error;
                adminModels.addDataAdmin(
                    req.body.tambahNik, 
                    req.body.tambahNamaDepanAdmin, 
                    req.body.tambahNamaBelakangAdmin, 
                    req.body.tambahAlamat, 
                    req.body.tambahKelurahan, 
                    req.body.tambahKecamatan, 
                    req.body.tambahKodePos, 
                    req.body.tambahKotaKabupaten, 
                    req.body.tambahProvinsi, 
                    req.body.tambahTelepon, 
                    kelamin, 
                    req.body.tambahEmail, 
                    hash, 
                    jenisAdmin, 
                    req.body.tambahKodeAdmin, 
                    req.body.tambahSelectedTpu
                )
                .then(() => { res.redirect('/admin/data-admin') })
                .catch(error => console.error(error));
            })
        });
    } else {
        res.redirect('/admin/login');
    }
}

exports.deleteDataAdmin = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.deleteDataAdmin(req.params.kdAdmin, req.params.nik)
        .then(() => { res.redirect('/admin/data-admin') })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.updateDataAdmin = (req, res) => {
    var verif = auth(req, res);
    var kelamin = req.body.ubahKelamin == 'wanita' ? true : false;
    var jenisAdmin = req.body.ubahJenisAdmin == 'true' ? true : false;

    if(verif == true) {
        bcrypt.genSalt(10, (error, salt) => {
            if(error) throw error;
            bcrypt.hash(req.body.ubahPassword, salt, (error, hash) => {
                if(error) throw error;
                adminModels.updateDataAdmin(
                    req.body.ubahOldNik, 
                    req.body.ubahNik,
                    req.body.ubahNamaDepanAdmin, 
                    req.body.ubahNamaBelakangAdmin, 
                    req.body.ubahAlamat, 
                    req.body.ubahKelurahan, 
                    req.body.ubahKecamatan, 
                    req.body.ubahKodePos, 
                    req.body.ubahKotaKabupaten, 
                    req.body.ubahProvinsi, 
                    req.body.ubahTelepon, 
                    kelamin, 
                    req.body.ubahEmail, 
                    hash, 
                    jenisAdmin, 
                    req.body.ubahOldKdAdmin, 
                    req.body.ubahKodeAdmin, 
                    req.body.ubahOldKdTpu,
                    req.body.ubahSelectedTpu
                )
                .then(() => { res.redirect('/admin/data-admin') })
                .catch(error => console.error(error));
            })
        })
    } else {
        res.redirect('/admin/login');
    }
}

// Cetak Data TPU
exports.cetakDataAdmin = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        const namaKepala = '';
        const kdAdmin = req.cookies.kuburinSystem.kdAdmin;
        Promise.all([
            adminModels.getNamaAdmin(kdAdmin),
            adminModels.cetakDataAdmin()
        ])
        .then(data => {
            var count = 1;
            datanya = [];
            var namaAdmin = data[0].nama_depan + ' ' + data[0].nama_belakang;
            console.log(namaAdmin);
            datanya.push(['No', 'Kode Admin', 'Nama Admin' ,'Terakhir Login', 'Tanggal Dibuat', 'Jenis Admin']);
            data[1].forEach(admin => {
                var namaAdmin = admin.nama_depan + ' ' + admin.nama_belakang;
                if(admin.terakhir_login == null) {
                    admin.terakhir_login = '-';
                }
                datanya.push([count, admin.kd_admin, namaAdmin, admin.terakhir_login, admin.tanggal_dibuat, admin.jenis_admin]);
                count++;
            });
            console.table(datanya);
            var judulLaporan = [{
                text: 'Laporan Data Admin',
                fontSize: 15,
                alignment: 'center',
                margin: [0,0,0,10]
            },{
                text: 'Admin per Tahun',
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
                    widths: [20, 85, '*', '*', '*', 40],
                    body:datanya
                }
            };
    
            createPdfBinary(judulLaporan, dataTable, namaKepala, namaAdmin, function (binary) {
                res.contentType('application/pdf');
                res.send(binary);
            }, function (error) {
                res.send('ERROR:' + error);
            });
        })
        .catch(error => console.error(error))
    }
}

exports.pesan = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.getAdmin(req.cookies.kuburinSystem.kdAdmin.trim())
        .then(listAdmin => {
            console.log('list admin ', listAdmin);
            res.render('admin-pesan', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'PESAN',
                search: 'asd',
                edit: true,
                adminType: req.cookies.kuburinSystem.jenisAdmin.trim(),
                kdAdmin: req.cookies.kuburinSystem.kdAdmin.trim(),
                listAdmin: listAdmin
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
        adminModels.getPesan(req.cookies.kuburinSystem.kdAdmin.trim(), req.params.tujuan)
        .then(pesan => {
            res.send(pesan);
        })
        .catch(error => res.send({status: 'Internal Server Error', error: error}));
    } else {
        res.send({status: 'Login First'});
    }
}

// { // Option untuk fetch POST method
//     method: 'POST',
//     headers: {
//           'Content-Type': 'application/json'
//       },
//     body: JSON.stringify({ 
//           title: "foo", 
//           body: "bar", 
//           userId: 1 
//       })
//   }
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
        // var foto = req.body.foto === undefined ? null : req.body.foto;
        // var file = req.body.file === undefined ? null : req.body.file;
        adminModels.insertPesan(req.body.pesan, req.body.tujuan, req.body.foto, req.body.file, req.cookies.kuburinSystem.kdAdmin.trim())
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

// Logout admin pusat
exports.logout = (req, res) => {
    res.clearCookie('kuburinSystem');
    res.redirect('/');
}

// Route for print any report
exports.print = (req, res) => {
    res.render('prints/admin-data-ahli-waris', {
        layout: 'layouts/print-layout'
    })
}

// Model Nisan Page
exports.dataNisan = (req, res) => {
    var verif = auth(req, res);
    if(verif == true) {
        adminModels.dataNisan()
        .then(data => {
            res.render('admin-model-nisan', {
                layout: 'layouts/admin-layout',
                halaman: 'hijau',
                footer: 'non-fixed',
                logged: true,
                title: 'DATA NISAN',
                search: 'asd',
                edit: true,
                adminType: req.cookies.kuburinSystem.jenisAdmin.trim(),
                dataNisan: data,
                kdAdmin: ''
            })
        })
    } else {
        res.redirect('/admin/login');
    }
}

exports.getFotoNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        var fotoNisanPath = __dirname + '/../asset/images/nisan/';
        res.sendFile(
            path.resolve(fotoNisanPath += req.params.gambarNisan)
        );
    } else {
        res.redirect('/admin/login');
    }
}

exports.kdNisanGenerate = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        adminModels.kdNisanGenerate()
        .then(data => {
            res.send(data);
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}

exports.addDataNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const upload = multer({storage: storage}).single('tambahGambarNisan');
        upload(req, res, (error) => {
            if(error) throw error;
            adminModels.addDataNisan(req.body.tambahKdNisan, req.file.filename, req.body.tambahNamaNisan, req.body.tambahHargaNisan, req.body.tambahModelNisan)
            .then(() => {
                res.redirect('/admin/data-nisan');
            })
            .catch(error => console.error(error));
        })
    } else {
        res.redirect('/admin/login');
    }
}

exports.updateNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        const upload = multer({storage: storage}).single('ubahGambarNisan');
        upload(req, res, (error) => {
            if(error) throw error;
            var gambarNisan = req.file.filename ? req.file.filename : null;
            adminModels.updateDataNisan(req.body.ubahKdNisan, req.body.ubahNamaNisan, req.body.ubahHargaNisan, req.body.ubahModelNisan, gambarNisan)
            .then(() => {
                res.redirect('/admin/data-nisan');
            })
            .catch(error => console.error(error));
        })
    } else {
        res.redirect('/admin/login');
    }
}

exports.deleteNisan = (req, res) => {
    var verif = auth(req);
    if(verif == true) {
        adminModels.deleteDataNisan(req.params.kdNisan)
        .then(() => {
            res.redirect('/admin/data-nisan');
        })
        .catch(error => console.error(error));
    } else {
        res.redirect('/admin/login');
    }
}