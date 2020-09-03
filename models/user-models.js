// require('dotenv').config({path:__dirname + '../'});
const Pool = require('pg').Pool;
const pgFormat = require('pg-format');
const { metodePembayaran } = require('../controllers/user-controllers');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_URL,
    database: process.env.DB_NAME
});
// pool.query('select * from coba()', (error, result) => {
//     if(error) throw error;
//     console.log(result.rows);
// })

// async function abc() {
//     var aaa =  await pool.query('select * from coba()', (err, result) => {
//         if(err) throw error;
//         // console.log(result.rows);
//         pool.end;
//         return result.rows;
//     });
//     return aaa;
// }

// abc()
// .then(data => console.log(data))
// .catch(err => console.error(err));

// contoh callback
// var abc = (data) => {
//     var a = 2;
//     var b = 3;
//     data(a, b);
// }

// abc(
//     (a, b) => {console.log(a + b)}
// );

// Contoh callback
// var abc = (data) => {
//     pool.query('select * from coba()', (err, result) => {
//         if(err) throw err;
//         data(result);
//         pool.end;
//     })
// }

// Contoh promise 1
// var abc = () => (new Promise((resolve, reject) => {
//     pool.query('select * from coba()', (err, result) => {
//         if(err) throw err;
//         resolve(result.rows);
//         pool.end;
//     })
// }));

// abc()
// .then(data => {
//     console.log(data); 
//     return data[0];
// })
// .then( formatedData => {
//     console.log(formatedData);
// })
// .catch(err => console.error(err));

// Contoh promise 2
// var abc = new Promise((resolve, reject) => {
//     pool.query('select * from coba()', (err, result) => {
//         if(err) throw err;
//         resolve(result.rows);
//         pool.end();
//     })
// })

// abc
// .then(data => console.log(data))
// .catch(err => console.error(err));

exports.daftar = (setNik, setNamaDepan, setNamaBelakang, setEmail, setPassword) => new Promise((resolve, reject) => {
    var sqlDaftar = `SELECT * FROM make_ahli_waris(
        '` + setNik + `',
        '` + setNamaDepan + `',
        '` + setNamaBelakang + `',
        '` + setEmail + `',
        '` + setPassword + `'
    )`;
    pool.query(sqlDaftar, (err, result) => {
        if (err) throw err;
        // console.log(result);
        resolve(result.rows[0]);
    })
});

exports.login = (setEmail) => new Promise((resolve, reject) => {
    var sqlLogin = `SELECT * FROM login_ahli_waris('${setEmail}')`;
    pool.query(sqlLogin, (err, result) => {
        if(err) throw err;
        resolve(result.rows[0]);
    })
});

exports.updateLoginTime = (kdAhliWaris) => new Promise((resolve, reject) => {
    var sqlUpdateTime = `SELECT * FROM login_time_ahli_waris('${kdAhliWaris}')`;
    pool.query(sqlUpdateTime, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.jenazahAhliWaris = (email) => new Promise((resolve, reject) => {
    var sqlJenazahAhli = `SELECT * FROM jenazah_ahli_waris('${email}')`;
    pool.query(sqlJenazahAhli, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
});

exports.dataAkun = (email) => new Promise((resolve, reject) => {
    var sqlDataAkun = `
        SELECT * FROM data_akun('${email}')
    `;
    pool.query(sqlDataAkun, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.updateAkun = (
    setNik, 
    setNewNik, 
	setNamaDepan, 
	setNamaBelakang, 
	setAlamat, 
	setKelurahan, 
	setKecamatan, 
	setKodePos, 
	setKotkab, 
    setProvinsi, 
	setTelepon, 
    setKelamin, 
	setEmail, 
	setNoKkk, 
	setNewNoKk
) => new Promise((resolve, reject) => {
    var sqlUpdateAkun = `
        select * from update_ahli_waris(
            '${setNik}', 
            '${setNewNik}', 
            '${setNamaDepan}', 
            '${setNamaBelakang}', 
            '${setAlamat}', 
            '${setKelurahan}', 
            '${setKecamatan}', 
            '${setKodePos}', 
            '${setKotkab}', 
            '${setProvinsi}', 
            '${setTelepon}', 
            ${setKelamin}, 
            '${setEmail}', 
            null,
            null,
            '${setNoKkk}', 
            '${setNewNoKk}'
        )
    `;
    pool.query(sqlUpdateAkun, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    });
});

exports.updatePassword = (email, password) => new Promise((resolve, reject) => {
    var sqlUpdatePassword = `SELECT * FROM update_password_ahli_waris('${email}', '${password}')`;
    console.log(email, password);
    pool.query(sqlUpdatePassword, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

exports.statusPendaftaran = (email) => new Promise((resolve, reject) => {
    var sqlStatusPendaftaran = `SELECT * FROM pendaftar_ahli('${email}')`;
    pool.query(sqlStatusPendaftaran, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

// Rekomendasi TPU
exports.rekomendasiTpu = (blok, agama) => new Promise((resolve, reject) => {
    var sqlRekomendasiTpu = `SELECT * FROM data_tpu_recomend('${blok}', '${agama}')`;
    pool.query(sqlRekomendasiTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    });
})

// Sewa makam baru
exports.sewaMakamBaru = (
    email, 
    nikJenazah, 
    pembayaran, 
    namaPembayaran, 
    metodePembayaran, 
    kdBlok, 
    petak, 
    kdTpu, 
    blad, 
    harga
) => new Promise((resolve, reject) => {
    // console.log(
    //     email, 
    //     nikJenazah, 
    //     pembayaran, 
    //     namaPembayaran, 
    //     metodePembayaran, 
    //     kdBlok, 
    //     petak, 
    //     kdTpu, 
    //     blad, 
    //     harga
    // );
    var sqlSewaMakamBaru = `SELECT * FROM sewa_makam_baru(
        '${email}', 
        '${nikJenazah}', 
        '${pembayaran}', 
        '${namaPembayaran}', 
        ${metodePembayaran}, 
        '${kdBlok}', 
        ${petak}, 
        '${kdTpu}', 
        '${blad}', 
        '${harga}'
    )`;
    pool.query(sqlSewaMakamBaru, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    });
})

// Status pembayaran for makamBaru
exports.statusPembayaranMakamBaru = (nikJenazah) => new Promise((resolve, reject) => {
    var sqlStatMakamBaru = `SELECT * FROM status_pembayaran_makam('${nikJenazah}')`;
    pool.query(sqlStatMakamBaru, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})
// Status pembayaran for tumpangTindih
exports.statusPembayaranPerpanjang = (nikJenazah) => new Promise((resolve, reject) => {
    var sqlStatTumpangTindih = `SELECT * FROM status_pembayaran_perpanjang('${nikJenazah}')`;
    pool.query(sqlStatTumpangTindih, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})
// Status pembayaran for nisan
exports.statusPembayaranNisan = (nikJenazah) => new Promise((resolve, reject) => {
    var sqlStatNisan = `SELECT * FROM status_pembayaran_nisan('${nikJenazah}')`;
    pool.query(sqlStatNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// Daftar Jenazah Baru & tumpang
exports.daftarJenazah = (
    setEmail,
	kdDaftar,
	namaJenazah,
	tglLahir,
	tempatLahir,
	kelamin,
	agama,
	alamat,
	tglWafat,
	tglMakam,
	fotoKtp,
	fotoKk,
	fotoSuratMeninggal,
	fotoIptm,
    jenisDaftar,
    blok,
    nikTumpang
) => new Promise((resolve, reject) => {
    var sqlDaftarJenazah = `
        SELECT * FROM  tambah_data_jenazah(
            '${setEmail}',
            '${kdDaftar}',
            '${namaJenazah}',
            '${tglLahir}',
            '${tempatLahir}',
            ${kelamin},
            '${agama}',
            '${alamat}',
            '${tglWafat}',
            '${tglMakam}',
            '${fotoKtp}',
            '${fotoKk}',
            '${fotoSuratMeninggal}',
            '${fotoIptm}',
            ${jenisDaftar},
            null,
            '${blok}',
            '${nikTumpang}'
        )
    `;

    pool.query(sqlDaftarJenazah, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    });
});

// Get harga by blok for sewa makam tumpang tindih
exports.hargaSewaTumpang = (kd_lokasi) => new Promise((resolve, reject) => {
    var getHargaTumpang = `SELECT * FROM harga_sewa_tumpang('${kd_lokasi}')`;
    pool.query(getHargaTumpang, (error, result) => {
        resolve(result.rows[0]);
    })
})

// Sewa Makam Tumpang
exports.sewaMakamTumpang = (
    email, 
    nikJenazah, 
    pembayaran, 
    namaPembayaran, 
    metodePembayaran, 
    harga
) => new Promise((resolve, reject) => {
    console.log(
        email, 
        nikJenazah, 
        pembayaran, 
        namaPembayaran, 
        metodePembayaran, 
        harga
    );
    var sqlSewaTumpang = `SELECT * FROM sewa_makam_tumpang(
        '${email}', 
        '${nikJenazah}', 
        '${pembayaran}', 
        '${namaPembayaran}', 
        ${metodePembayaran}, 
        ${harga}
    )`;

    pool.query(sqlSewaTumpang, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.insertPerpanjang = (iptm, nikJenazah) => new Promise((resolve, reject) => {
    var sqlInsertPerpanjang = `SELECT * FROM insert_perpanjang('${iptm}', '${nikJenazah}')`;
    // console.log(iptm, nikJenazah);
    pool.query(sqlInsertPerpanjang, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.hargaPerpanjang = (nikJenazah) => new Promise((resolve, reject) => {
    var sqlHargaPerpanjang = `SELECT * FROM harga_perpanjang('${nikJenazah}')`;
    pool.query(sqlHargaPerpanjang, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// Expand expired date for makam (perpanjang)
exports.perpanjangSewa = (
    email, 
    nikJenazah, 
    pembayaran, 
    namaPembayaran, 
    metodePembayaran, 
    harga
) => new Promise((resolve, reject) => {
    // console.log(
    //     email, 
    //     nikJenazah, 
    //     pembayaran, 
    //     namaPembayaran, 
    //     metodePembayaran, 
    //     harga
    // );
    var sqlPerpanjangSewa = `SELECT * FROM perpanjang_sewa(
        '${email}', 
        '${nikJenazah}', 
        '${pembayaran}', 
        '${namaPembayaran}', 
        ${metodePembayaran}, 
        ${harga}
    )`;

    pool.query(sqlPerpanjangSewa, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.listTpu = () => new Promise((resolve, reject) => {
    var sqlListTpu = `SELECT * FROM list_tpu()`;
    pool.query(sqlListTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.getJenazahTpu = (kdTpu) => new Promise((resolve, reject) => {
    var sqlGetJenazahTpu = `SELECT * FROM list_jenazah_tpu('${kdTpu}')`;
    pool.query(sqlGetJenazahTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

// Status pembayaran per Ahli Waris
exports.statusPembayaranAhliWaris = (email) => new Promise((resolve, reject) => {
    var sqlStatPembayaran = `SELECT * FROM status_pembayaran('${email}')`;
    pool.query(sqlStatPembayaran, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

// Store foto KK ahli waris
exports.addFotoKkAhli = (email, kk) => new Promise((resolve, reject) => {
    var sqlAddKk = `SELECT * FROM add_kk_ahli('${email}', '${kk}')`;
    pool.query(sqlAddKk, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// Get foto KK ahli waris
exports.getFotoKkAhli = (email) => new Promise((resolve, reject) => {
    var sqlFotoKk = `SELECT * FROM get_kk_ahli('${email}')`;
    pool.query(sqlFotoKk, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// Store foto KTP ahli waris
exports.addFotoKtpAhli = (email, ktp) => new Promise((resolve, reject) => {
    var sqlAddKtp = `SELECT * FROM add_ktp_ahli('${email}', '${ktp}')`;
    pool.query(sqlAddKtp, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// Get foto KTP ahli waris
exports.getFotoKtpAhli = (email) => new Promise((resolve, reject) => {
    var sqlFotoKtp = `SELECT * FROM get_ktp_ahli('${email}')`;
    pool.query(sqlFotoKtp, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// Get data makam that can be expand its expired date
exports.getPerpanjangAhli = (email) => new Promise((resolve, reject) => {
    var sqlGetPerpanjang = `SELECT * FROM perpanjang_makam_ahli('${email}')`;
    pool.query(sqlGetPerpanjang, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

// Get status of perpanjang
exports.statusPerpanjangAhli = (email) => new Promise((resolve, reject) => {
    var sqlStatPerpanjang = `SELECT * FROM perpanjang_ahli('${email}')`;
    pool.query(sqlStatPerpanjang, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.listNisan = () => new Promise((resolve, reject) => {
    var sqlListNisan = `SELECT * FROM tb_nisan`;
    pool.query(sqlListNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

// To matching with its nisan model
exports.listJenazahAgama = (email) => new Promise((resolve, reject) => {
    var sqlListJenazah = `SELECT * FROM list_jenazah_agama('${email}')`;
    pool.query(sqlListJenazah, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

// Buy nisan
exports.buyNisan = (
    email,
    nikJenazah, 
    kdNisan,
    metodePembayaran,
    pembayaran,
    namaPembayaran
) => new Promise((resolve, reject) => {
    var sqlBuyNisan = `SELECT * FROM buy_nisan(
        '${email}',
        '${nikJenazah}', 
        '${kdNisan}',
        ${metodePembayaran},
        '${pembayaran}',
        '${namaPembayaran}'
    )`;
    pool.query(sqlBuyNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.getNotifications = (email) => new Promise((resolve, reject) => {
    var sqlGetNotif = `SELECT * FROM get_notifikasi('${email}')`;
    pool.query(sqlGetNotif, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.checkKadaluarsa = (email) => new Promise((resolve, reject) => {
    var sqlCheckKdl = `SELECT * FROM kadaluarsa_check('${email}')`;
    pool.query(sqlCheckKdl, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.addNotification = (kdNotif, content, kdDaftar) => new Promise((resolve, reject) => {
    var sqlAddNotif = `SELECT * FROM insert_notifikasi('${kdNotif}', '${content}', '${kdDaftar}', null, null, null)`;
    pool.query(sqlAddNotif, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// daftar('1111', 'aaaa', 'dddd', '@gmaila', '121212')
// .then(data => console.log(data))
// .catch(err => console.error(err));
