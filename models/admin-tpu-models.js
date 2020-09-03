const { Pool } = require('pg');
const pgFormat = require('pg-format');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_URL,
    database: process.env.DB_NAME
});

exports.dashboard = (kdTpu) => new Promise((resolve, reject) => {
    var sqlDashboard = `SELECT * FROM dashboard_admin_tpu('${kdTpu}')`;
    pool.query(sqlDashboard, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

exports.dataPegawai = (kdTpu) => new Promise((resolve, reject) => {
    var sqlDataPegawai = `SELECT * FROM data_pegawai('${kdTpu}')`;
    pool.query(sqlDataPegawai, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.tambahDataPegawai = (
    kdTpu, 
	golongan, 
	kotkab, 
	jabatan, 
	tunjangan, 
	provinsi, 
	gaji, 
	alamat, 
	telp, 
	mulaiBekerja, 
	kelurahan, 
	kelamin, //bool 
	namaDepan, 
	kecamatan, 
	email, 
	namaBelakang, 
	kodePos, 
	nik
) => new Promise((resolve, reject) => {
    var sqlTambahPegawai = `SELECT * FROM tambah_data_pegawai(
        '${kdTpu}', 
        '${golongan}', 
        '${kotkab}', 
        '${jabatan}', 
        ${tunjangan}, 
        '${provinsi}', 
        ${gaji}, 
        '${alamat}', 
        '${telp}', 
        '${mulaiBekerja}', 
        '${kelurahan}', 
        ${kelamin},
        '${namaDepan}', 
        '${kecamatan}', 
        '${email}', 
        '${namaBelakang}', 
        '${kodePos}', 
        '${nik}'
    )`;
    pool.query(sqlTambahPegawai, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

// Update data pegawai
exports.updateDataPegawai = (
    kdTpu, 
    kdPegawai, 
    golongan, 
    kotkab, 
    kdJabatan, 
    tunjangan, 
    provinsi, 
    gaji, 
    alamat, 
    telepon, 
    mulaiBekerja, //Date 
    kelurahan, 
    kelamin, //bool 
    namaDepan, 
    kecamatan, 
    email, 
    namaBelakang, 
    kdPos, 
    nik, 
    statusPegawai //bool
) => new Promise((resolve, reject) => {
    console.log(
        kdTpu, 
        kdPegawai, 
        golongan, 
        kotkab, 
        kdJabatan, 
        tunjangan, 
        provinsi, 
        gaji, 
        alamat, 
        telepon, 
        mulaiBekerja,
        kelurahan, 
        kelamin,
        namaDepan, 
        kecamatan, 
        email, 
        namaBelakang, 
        kdPos, 
        nik, 
        statusPegawai
    );
    var sqlUpdatePegawai = `SELECT * FROM update_data_pegawai(
        '${kdTpu}', 
        '${kdPegawai}', 
        '${golongan}', 
        '${kotkab}', 
        '${kdJabatan}', 
        ${tunjangan}, 
        '${provinsi}', 
        ${gaji}, 
        '${alamat}', 
        '${telepon}', 
        '${mulaiBekerja}',
        '${kelurahan}', 
        ${kelamin},
        '${namaDepan}', 
        '${kecamatan}', 
        '${email}', 
        '${namaBelakang}', 
        '${kdPos}', 
        '${nik}', 
        ${statusPegawai}
    )`;
    pool.query(sqlUpdatePegawai, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// Delete data pegawai
exports.hapusDataPegawai = (kdPegawai) => new Promise((resolve, reject) => {
    var sqlDeletePegawai = `SELECT * FROM delete_pegawai('${kdPegawai}')`;
    pool.query(sqlDeletePegawai, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

// Print data pegawai report pdf formatted
exports.cetakDataPegawai = (kdTpu) => new Promise((resolve, reject) => {
    var sqlCetakDataPegawai = `SELECT * FROM cetak_data_pegawai('${kdTpu}')`;
    pool.query(sqlCetakDataPegawai, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

// Get nama TPU by its kdTpu
exports.getNamaTpu = (kdTpu) => new Promise((resolve, reject) => {
    var sqlGetNamaTpu = `SELECT * FROM get_nama_tpu('${kdTpu}')`;
    pool.query(sqlGetNamaTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.listJabatan = (kdTpu) => new Promise((resolve, reject) => {
    var sqlListJabatan = `SELECT * FROM list_jabatan()`;
    pool.query(sqlListJabatan, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.profileTpu = (kdTpu) => new Promise((resolve, reject) => {
    var sqlProfileTpu =`SELECT * FROM profile_tpu('${kdTpu}')`;
    pool.query(sqlProfileTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

exports.updateProfileTpu = (
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
        console.log(
            kdTpu.length, 
            nikKepalaTpu.length, 
            newNikKepalaTpu.length, 
            namaTpu.length, 
            namaDepanKepalaTpu.length, 
            namaBelakangKepalaTpu.length, 
            alamatTpu.length, 
            kodePos.length, 
            longtitude.length, 
            latitude.length, 
            luasTpu.length, 
            islamAA01.length,
            islamAA02.length,
            islamA001.length,
            islamA002.length,
            islamA003.length,
            kristenAA01.length,
            kristenAA02.length,
            kristenA001.length,
            kristenA002.length,
            kristenA003.length,
            hbAA01.length,
            hbAA02.length,
            hbA001.length,
            hbA002.length,
            hbA003.length
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

// Logout to inform system that this admin is offline
exports.logout = (kdAdmin) => new Promise((resolve, reject) => {
    var sqlLogout = `SELECT * FROM logout_admin_tpu('${kdAdmin}')`;
    pool.query(sqlLogout, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.getNamaAdmin = (kdAdmin) => new Promise((resolve, reject) => {
    var sqlGetNamaAdmin = `SELECT * FROM get_nama_admin('${kdAdmin}')`;
    pool.query(sqlGetNamaAdmin, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

// get list admin
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

exports.dataPembayaran = (kdTpu) => new Promise((resolve, reject) => {
    var sqlDataPembayaran = `SELECT * FROM data_pembayaran('${kdTpu}')`;
    pool.query(sqlDataPembayaran, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.dataPerpanjangan = (kdTpu) => new Promise((resolve, reject) => {
    var sqlDataPerpanjangan = `SELECT * FROM data_perpanjangan('${kdTpu}')`;
    pool.query(sqlDataPerpanjangan, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.dataPerpanjangFoto = (email, nikJenazah) => new Promise((resolve, reject) => {
    var sqlDataFoto = `SELECT * FROM get_foto_data_perpanjang('${email}', '${nikJenazah}')`;
    pool.query(sqlDataFoto, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.updatePerpanjang = (kdPerpanjang, statusPembayaran, foto) => new Promise((resolve, reject) => {
    var sqlUpdateIptm = `SELECT * FROM update_data_perpanjang('${kdPerpanjang}', ${statusPembayaran}, '${foto}')`;
    pool.query(sqlUpdateIptm, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.getKepalaTpu = (kdTpu) => new Promise((resolve, reject) => {
    var sqlKepalaTpu = `SELECT * FROM get_kepala_tpu('${kdTpu}')`;
    pool.query(sqlKepalaTpu, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.deletePerpanjang = (kdPerpanjang) => new Promise((resolve, reject) => {
    var sqlDeletePerpanjang = `SELECT * FROM delete_perpanjang('${kdPerpanjang}')`;
    pool.query(sqlDeletePerpanjang, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.dataPendaftarBaru = (kdTpu) => new Promise((resolve, reject) => {
    var sqlDataDaftarBaru = `SELECT * FROM data_pendaftar_baru('${kdTpu}')`;
    pool.query(sqlDataDaftarBaru, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.getFotoJenazah = (nikJenazah) => new Promise((resolve, reject) => {
    var sqlFotoJenazah =  `SELECT * FROM get_foto_daftar_baru('${nikJenazah}')`;
    pool.query(sqlFotoJenazah, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.dataPendaftarTumpang = (kdTpu) => new Promise((resolve, reject) => {
    var sqlDataDaftarBaru = `SELECT * FROM data_pendaftar_tumpang('${kdTpu}')`;
    pool.query(sqlDataDaftarBaru, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.getFotoTumpang = (nikJenazah) => new Promise((resolve, reject) => {
    var sqlGetFotoTumpang = `SELECT * FROM get_foto_tumpangan('${nikJenazah}')`;
    pool.query(sqlGetFotoTumpang, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.getAhliWaris = () => new Promise((resolve, reject) => {
    var sqlGetAhliWaris = `SELECT * FROM data_ahli_waris()`;
    pool.query(sqlGetAhliWaris, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.checkLoc = (kdTpu, blok, blad, petak) => new Promise((resolve, reject) => {
    var sqlCheckLoc = `SELECT * FROM place_check('${kdTpu}', '${blok}', ${blad}, ${petak})`;
    pool.query(sqlCheckLoc, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0].place_check);
    })
})

exports.addDaftarBaru = (
    kdTpu, 
    nikJenazah, 
    namaJenazah, 
    tglLahir, 
    tmptLahir, 
    kelamin, 
    agama, 
    alamat, 
    tglWafat, 
    tglMakam, 
    ktp, 
    kk, 
    skm, 
    nikAhli, 
    blok, 
    blad, 
    petak,
    statusPembayaran
) => new Promise((resolve, reject) => {
    console.log(
        kdTpu, 
        nikJenazah, 
        namaJenazah, 
        tglLahir, 
        tmptLahir, 
        kelamin, 
        agama, 
        alamat, 
        tglWafat, 
        tglMakam, 
        ktp, 
        kk, 
        skm, 
        nikAhli, 
        blok, 
        blad, 
        petak,
        statusPembayaran
    );
    var sqlAddDaftarBaru = `
        SELECT * FROM add_data_daftar_baru(
            '${kdTpu}', 
            '${nikJenazah}', 
            '${namaJenazah}', 
            '${tglLahir}', 
            '${tmptLahir}', 
            ${kelamin}, 
            '${agama}', 
            '${alamat}', 
            '${tglWafat}', 
            '${tglMakam}', 
            '${ktp}', 
            '${kk}', 
            '${skm}', 
            '${nikAhli}', 
            '${blok}', 
            ${blad}, 
            ${petak},
            ${statusPembayaran}
        )
    `;
    pool.query(sqlAddDaftarBaru, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.updateDaftarBaru = (
    newNikAhli,
	nikAhli, 
	newNikJenazah, 
	nikJenazah, 
	namaJenazah, 
	kelamin, 
	tglLahir, 
	tmptLahir, 
	agama, 
	alamat, 
	tglWafat, 
	tglMakam, 
	blok, 
	blad, 
	petak, 
	ktp, 
	kk, 
	skm, 
	statusPembayaran
) => new Promise((resolve, reject) => {
    console.log(
        newNikAhli,
        nikAhli, 
        newNikJenazah, 
        nikJenazah, 
        namaJenazah, 
        kelamin, 
        tglLahir, 
        tmptLahir, 
        agama, 
        alamat, 
        tglWafat, 
        tglMakam, 
        blok, 
        blad, 
        petak, 
        ktp, 
        kk, 
        skm, 
        statusPembayaran
    );
    var sqlUpdateDaftarBaru = `
        SELECT * FROM update_data_daftar_baru(
            '${newNikAhli}',
            '${nikAhli}', 
            '${newNikJenazah}', 
            '${nikJenazah}', 
            '${namaJenazah}', 
            ${kelamin}, 
            '${tglLahir}', 
            '${tmptLahir}', 
            '${agama}', 
            '${alamat}', 
            '${tglWafat}', 
            '${tglMakam}', 
            '${blok}', 
            ${blad}, 
            ${petak}, 
            '${ktp}', 
            '${kk}', 
            '${skm}', 
            '${statusPembayaran}'
        )
    `;
    pool.query(sqlUpdateDaftarBaru, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
});

exports.deletePendaftar = (nikJenazah) => new Promise((resolve, reject) => {
    var sqlDeletePendaftar = `SELECT * FROM delete_data_daftar_baru('${nikJenazah}')`;
    pool.query(sqlDeletePendaftar, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.addDaftarTumpang = (
    kdTpu, 
	nikJenazah, 
	namaJenazah, 
	tglLahir, 
	tmptLahir, 
	kelamin, 
	agama, 
	alamat, 
	tglWafat, 
	tglMakam, 
	ktp, 
	kk, 
    skm, 
    iptm,
	nikAhli, 
	kdLokasi, 
    statusPembayaran,
    blok
) => new Promise((resolve, reject) => {
    console.log(
        kdTpu, 
        nikJenazah, 
        namaJenazah, 
        tglLahir, 
        tmptLahir, 
        kelamin, 
        agama, 
        alamat, 
        tglWafat, 
        tglMakam, 
        ktp, 
        kk, 
        skm, 
        iptm,
        nikAhli, 
        kdLokasi, 
        statusPembayaran,
        blok
    );
    var sqlAddDaftarTumpang = `
        SELECT * FROM add_data_daftar_tumpang(
            '${kdTpu}', 
            '${nikJenazah}', 
            '${namaJenazah}', 
            '${tglLahir}', 
            '${tmptLahir}', 
            ${kelamin}, 
            '${agama}', 
            '${alamat}', 
            '${tglWafat}', 
            '${tglMakam}', 
            '${ktp}', 
            '${kk}', 
            '${skm}', 
            '${iptm}',
            '${nikAhli}', 
            '${kdLokasi}', 
            ${statusPembayaran},
            '${blok}'
        )
    `;
    pool.query(sqlAddDaftarTumpang, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.getDataMakam = (kdTpu) => new Promise((resolve, reject) => {
    var sqlGetDataMakam = `SELECT * FROM data_makam('${kdTpu}')`;
    pool.query(sqlGetDataMakam, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.updateDaftarTumpang = (
    newNikAhli, 
	nikAhli, 
	newNikJenazah, 
	nikJenazah, 
	kdLokasi,
	namaJenazah, 
	kelamin, 
	tglLahir, 
	tmptLahir, 
	agama, 
	alamat, 
	tglWafat, 
	tglMakam,  
	ktp, 
	kk, 
	skm, 
	iptm,
	statusPembayaran
) => new Promise((resolve, reject) => {
    console.log(
        newNikAhli, 
        nikAhli, 
        newNikJenazah, 
        nikJenazah, 
        kdLokasi,
        namaJenazah, 
        kelamin, 
        tglLahir, 
        tmptLahir, 
        agama, 
        alamat, 
        tglWafat, 
        tglMakam,  
        ktp, 
        kk, 
        skm, 
        iptm,
        statusPembayaran
    );
    var sqlUpdateDaftarTumpang = `
        SELECT * FROM update_data_daftar_tumpang(
            '${newNikAhli}', 
            '${nikAhli}', 
            '${newNikJenazah}', 
            '${nikJenazah}', 
            '${kdLokasi}',
            '${namaJenazah}', 
            ${kelamin}, 
            '${tglLahir}', 
            '${tmptLahir}', 
            '${agama}', 
            '${alamat}', 
            '${tglWafat}', 
            '${tglMakam}',  
            '${ktp}', 
            '${kk}', 
            '${skm}', 
            '${iptm}',
            ${statusPembayaran}
        )
    `;
    pool.query(sqlUpdateDaftarTumpang, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.dataPesanNisan = (kdTpu) => new Promise((resolve, reject) => {
    var sqlDataPesanNisan = `SELECT * FROM data_pesan_nisan('${kdTpu}')`;
    pool.query(sqlDataPesanNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows);
    })
})

exports.listJenazahNisan = (kdTpu) => new Promise((resolve, reject) => {
    var sqlListJenazahNisan = `SELECT * FROM list_jenazah_nisan('${kdTpu}')`;
    pool.query(sqlListJenazahNisan, (error, result) => {
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

exports.addPesanNisan = (nikJenazah, kdNisan, statusPembayaran) => new Promise((resolve, reject) => {
    var sqlAddPesanNisan = `SELECT * FROM add_pesan_nisan(
        '${nikJenazah}', 
        '${kdNisan}', 
        ${statusPembayaran}
    )`;
    pool.query(sqlAddPesanNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.updatePesanNisan = (nikJenazah, kdNisan, statusPembayaran) => new Promise((resolve, reject) => {
    var sqlUpdatePesanNisan = `SELECT * FROM update_pesan_nisan(
        '${nikJenazah}', 
        '${kdNisan}', 
        ${statusPembayaran}
    )`;
    pool.query(sqlUpdatePesanNisan, (error, result) => {
        if(error) throw error;
        console.log('hasil update ', result.rows[0])
        resolve(result.rows[0]);
    })
})

exports.deletePesanNisan = (nikJenazah) => new Promise((resolve, reject) => {
    var sqlDeletePesanNisan = `SELECT * FROM delete_pesan_nisan('${nikJenazah}')`;
    pool.query(sqlDeletePesanNisan, (error, result) => {
        if(error) throw error;
        resolve(result.rows[0]);
    })
})

exports.cetakPesanNisan = (kdTpu) => new Promise((resolve, reject) => {
    var sqlCetakPesanNisan = `SELECT * FROM cetak_pesan_nisan('${kdTpu}')`;
    pool.query(sqlCetakPesanNisan, (error, result) => {
        resolve(result.rows);
    })
})