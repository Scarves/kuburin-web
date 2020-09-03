const { Pool } = require('pg');
const pgFormat = require('pg-format');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_URL,
    database: process.env.DB_NAME
});
//  PADA MODEL JADIKAN FUNCTION~!!!!!!

// Login for admin pusat and admin tpu
exports.login = (kdAdmin) => new Promise((resolve, reject) => {
    var sqlLogin = `SELECT * FROM login_admin('${kdAdmin}')`;
    // console.log('passwordnya ', )
    pool.query(sqlLogin, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    }) 
});

exports.updateLoginTime = (kdAdmin) => new Promise((resolve, reject) => {
    var sqlUpdateTime = `SELECT * FROM login_time_admin('${kdAdmin}')`;
    pool.query(sqlUpdateTime, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// Get data for dashboard
exports.dashboard = () => new Promise((resolve, reject) => {
    var sqlDashboard = `SELECT * FROM dashboard_admin()`;
    pool.query(sqlDashboard, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

// Get data ahli waris
exports.dataAhliWaris = () => new Promise((resolve, reject) => {
    var sqlDataAhliWaris = `SELECT * FROM data_ahli_waris()`;
    pool.query(sqlDataAhliWaris, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
});

// Print data ahli waris
exports.cetakDataAhliWaris = () => new Promise((resolve, reject) => {
    var sqlCetakDataAhliWaris = `SELECT * FROM cetak_data_ahli_waris()`;
    pool.query(sqlCetakDataAhliWaris, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

// Get data jenazah from ahli waris
exports.dataJenazah = (kdAhliWaris) => new Promise((resolve, reject) => {
    var sqlDataJenazah = `SELECT * FROM select_all_jenazah('`+ kdAhliWaris +`')`;
    pool.query(sqlDataJenazah, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
});

// Delete ahli waris and its references
exports.deleteAhliWaris = (setNik, setKdAhliWaris) => new Promise((resolve, reject) => {
    var sqlDeleteAhliWaris = `SELECT * FROM delete_ahli_waris('`+ setNik +`', '`+ setKdAhliWaris +`')`;
    pool.query(sqlDeleteAhliWaris, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

// Get data TPU with kepala TPU
exports.dataTpu = () => new Promise((resolve, reject) => {
    var sqlDataTpu = `SELECT * FROM data_tpu()`;
    pool.query(sqlDataTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
});

// Get data pegawai per TPU
exports.dataPegawai = (kdTpu) => new Promise((resolve, reject) => {
    var sqlDataPegawai = `SELECT * FROM select_all_pegawai('`+ kdTpu +`')`;
    pool.query(sqlDataPegawai, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
});

// Delete data TPU and it references
exports.deleteDataTpu = (kdTpu) => new Promise((resolve, reject) => {
    var sqlDeleteTpu = `SELECT * FROM delete_tpu('`+ kdTpu +`')`;
    pool.query(sqlDeleteTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

// Add a Tpu
exports.addDataTpu = (
    namaTpu, 
    nikKepalaTpu, 
    namaDepanKepalaTpu, 
    namaBelakangKepalaTpu, 
    alamatTpu, 
    kdPos, 
    longtitude, 
    latitude, 
    luasTpu, 
    islamAA01, 
    islamAA02, 
    islamA001,
    islamA002,
    islamA003, 
    kristenAA01, 
    kristenAA02,
    kristenA001,
    kristenA002,
    kristenA003,
    hbAA01, 
    hbAA02, 
    hbA001, 
    hbA002, 
    hbA003
    ) => new Promise((resolve, reject) => {
        console.log(
            namaTpu, 
            nikKepalaTpu, 
            namaDepanKepalaTpu, 
            namaBelakangKepalaTpu, 
            alamatTpu, 
            kdPos, 
            longtitude, 
            latitude, 
            luasTpu, 
            islamAA01, 
            islamAA02, 
            islamA001,
            islamA002,
            islamA003, 
            kristenAA01, 
            kristenAA02,
            kristenA001,
            kristenA002,
            kristenA003,
            hbAA01, 
            hbAA02, 
            hbA001, 
            hbA002, 
            hbA003
        );
        var sqlAddTpu = `SELECT * FROM tambah_data_tpu(
            '${namaTpu}', 
            '${nikKepalaTpu}', 
            '${namaDepanKepalaTpu}', 
            '${namaBelakangKepalaTpu}', 
            '${alamatTpu}', 
            '${kdPos}', 
            '${longtitude}', 
            '${latitude}', 
            ${luasTpu}, 
            ${islamAA01}, 
            ${islamAA02}, 
            ${islamA001},
            ${islamA002},
            ${islamA003}, 
            ${kristenAA01}, 
            ${kristenAA02},
            ${kristenA001},
            ${kristenA002},
            ${kristenA003},
            ${hbAA01}, 
            ${hbAA02}, 
            ${hbA001}, 
            ${hbA002}, 
            ${hbA003}
        )`;
        pool.query(sqlAddTpu, (error, result) => {
            if(error) throw error;
            resolve(result.rows[0]);
        })
});

exports.updateDataTpu = (
    kdTpu, 
	nikKepalaTpu, 
	newNikKepalaTpu, 
	namaTpu, 
	namaDepanKepalaTpu, 
	namaBelakangKepalaTpu, 
	alamatTpu, 
	kodePos, 
	longtitude, 
	latitude, 
	luasTpu, 
    islamAA01,
	islamAA02,
	islamA001,
	islamA002,
	islamA003,
	kristenAA01,
	kristenAA02,
	kristenA001,
	kristenA002,
	kristenA003,
	hbAA01,
	hbAA02,
	hbA001,
	hbA002,
	hbA003
    ) => new Promise((resolve, reject) => {
        console.log(
            kdTpu, 
            nikKepalaTpu, 
            newNikKepalaTpu, 
            namaTpu, 
            namaDepanKepalaTpu, 
            namaBelakangKepalaTpu, 
            alamatTpu, 
            kodePos, 
            longtitude, 
            latitude, 
            luasTpu, 
            islamAA01,
            islamAA02,
            islamA001,
            islamA002,
            islamA003,
            kristenAA01,
            kristenAA02,
            kristenA001,
            kristenA002,
            kristenA003,
            hbAA01,
            hbAA02,
            hbA001,
            hbA002,
            hbA003
        );
        var sqlUpdateTpu = `SELECT * FROM update_data_tpu(
            '`+ kdTpu +`',
            '`+ nikKepalaTpu +`',
            '`+ newNikKepalaTpu +`',
            '`+ namaTpu +`',
            '`+ namaDepanKepalaTpu +`',
            '`+ namaBelakangKepalaTpu +`',
            '`+ alamatTpu +`',
            '`+ kodePos +`',
            '`+ longtitude +`',
            '`+ latitude +`',
            `+ luasTpu +`,
            ${islamAA01},
            ${islamAA02},
            ${islamA001},
            ${islamA002},
            ${islamA003},
            ${kristenAA01},
            ${kristenAA02},
            ${kristenA001},
            ${kristenA002},
            ${kristenA003},
            ${hbAA01},
            ${hbAA02},
            ${hbA001},
            ${hbA002},
            ${hbA003}
        )`;
        pool.query(sqlUpdateTpu, (error, result) => {
            if(error) throw error;
            resolve(result.rows[0]);
        }); 
});

exports.cetakDataTpu = () => new Promise((resolve) => {
    var sqlCetakDataTpu = `SELECT * FROM cetak_data_tpu()`;
    pool.query(sqlCetakDataTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.dataAdmin = () => new Promise((resolve, reject) => {
    var sqlDataAdmin =`SELECT * FROM data_admin()`;
    pool.query(sqlDataAdmin, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    });
});

exports.dataAdminTpu = () => new Promise((resolve, reject) => {
    var sqlDataAdminTpu =`SELECT * FROM data_admin_tpu()`;
    pool.query(sqlDataAdminTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    });
});

exports.listTpu = () => new Promise((resolve, reject) => {
    var sqlListTpu = `SELECT * FROM list_tpu()`;
    pool.query(sqlListTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
});

exports.addDataAdmin = (
    nik, 
    namaDepan, 
    namaBelakang, 
    alamat, 
    kelurahan, 
    kecamatan, 
    kodePos, 
    kotKab, 
    provinsi, 
    telepon, 
    kelamin, 
    email, 
    password, 
    jenisAdmin, 
    kdAdmin, 
    kdTpu
) => new Promise((resolve, reject) => {
    var sqlAddDataAdmin = `SELECT * FROM tambah_data_admin(
        '${nik}', 
        '${namaDepan}', 
        '${namaBelakang}', 
        '${alamat}', 
        '${kelurahan}', 
        '${kecamatan}', 
        '${kodePos}', 
        '${kotKab}', 
        '${provinsi}', 
        '${telepon}', 
        ${kelamin}, 
        '${email}', 
        '${password}', 
        ${jenisAdmin}, 
        '${kdAdmin}', 
        '${kdTpu}'
    )`;
    pool.query(sqlAddDataAdmin, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

exports.deleteDataAdmin = (kdAdmin, nik) => new Promise((resolve, reject) => {
    var sqlDeleteDataAdmin = `SELECT * FROM delete_admin('${kdAdmin}', '${nik}')`;
    pool.query(sqlDeleteDataAdmin, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

exports.updateDataAdmin = (
    nik, 
	newNik,
	namaDepan, 
	namaBelakang, 
	alamat, 
	kelurahan, 
	kecamatan, 
	kodePos, 
	kotKab, 
	provinsi, 
	telepon, 
	kelamin, 
	email, 
	password, 
	jenisAdmin, 
	kdAdmin, 
	newKdAdmin, 
	kdTpu,
	newKdTpu
) => new Promise((resolve, reject) => {
    var sqlUpdateDataAdmin = `SELECT * FROM update_data_admin(
        '${nik}', 
        '${newNik}',
        '${namaDepan}', 
        '${namaBelakang}', 
        '${alamat}', 
        '${kelurahan}', 
        '${kecamatan}', 
        '${kodePos}', 
        '${kotKab}', 
        '${provinsi}', 
        '${telepon}', 
        ${kelamin}, 
        '${email}', 
        '${password}', 
        ${jenisAdmin}, 
        '${kdAdmin}', 
        '${newKdAdmin}', 
        '${kdTpu}',
        '${newKdTpu}'
    )`;
    pool.query(sqlUpdateDataAdmin, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

exports.cetakDataAdmin = () => new Promise((resolve) => {
    var sqlCetakDataAdmin = `SELECT * FROM cetak_data_admin()`;
    pool.query(sqlCetakDataAdmin, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.getNamaAdmin = (kdAdmin) => new Promise((resolve, reject) => {
    var sqlGetNamaAdmin = `SELECT * FROM get_nama_admin('${kdAdmin}')`;
    pool.query(sqlGetNamaAdmin, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.getAdmin = (kdAdmin) => new Promise((resolve, reject) => {
    var sqlGetAdmin = `SELECT * FROM get_admin('${kdAdmin}')`;
    pool.query(sqlGetAdmin, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.getPesan = (kdAdmin, tujuan) => new Promise((resolve, reject) => {
    console.log(kdAdmin, tujuan);
    var sqlGetPesan = `SELECT * FROM select_pesan('${kdAdmin}', '${tujuan}')`;
    pool.query(sqlGetPesan, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.insertPesan = (pesan, tujuan, foto, file, kdAdmin) => new Promise((resolve, reject) => {
    var sqlInsertPesan = `SELECT * FROM insert_pesan('${pesan}', '${tujuan}', '${foto}', '${file}', '${kdAdmin}')`;
    pool.query(sqlInsertPesan, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.dataNisan = () => new Promise((resolve, reject) => {
    var sqlDataNisan = `SELECT * FROM tb_nisan`;
    pool.query(sqlDataNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.addDataNisan = (kdNisan, fotoNisan, namaNisan, harga, model) => new Promise((resolve, reject) => {
    var sqlAddDataNisan = `SELECT * FROM add_nisan(
        '${kdNisan}',
        '${fotoNisan}', 
        '${namaNisan}', 
        ${harga}, 
        '${model}'
    )`;
    pool.query(sqlAddDataNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.kdNisanGenerate = () => new Promise((resolve, reject) => {
    var sqlGetKdNisan = `SELECT * FROM nisan_kd_generate()`;
    pool.query(sqlGetKdNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.updateDataNisan = (kdNisan, namaNisan, hargaNisan, modelNisan, gambarNisan) => new Promise((resolve, reject) => {
    var sqlUpdateNisan = `SELECT * FROM update_nisan(
        '${kdNisan}', 
        '${namaNisan}', 
        ${hargaNisan}, 
        '${modelNisan}', 
        '${gambarNisan}'
    )`;
    pool.query(sqlUpdateNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    });
})

exports.deleteDataNisan = (kdNisan) => new Promise((resolve, reject) => {
    var sqlDeleteNisan = `SELECT * FROM delete_nisan('${kdNisan}')`;
    pool.query(sqlDeleteNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})