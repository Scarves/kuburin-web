var idNavBottom = document.getElementById('nav-bottom');

// comparing register password
function comparePassword() {
    var putNotif = document.getElementById('error');
    var idPassword = document.getElementById('password').value;
    var idKonfirmasiPassword = document.getElementById('konfirmasiPassword').value;
    putNotif.innerHTML = null;
    if(idPassword != idKonfirmasiPassword) {
        putNotif.innerHTML = "*Tidak Sesuai";
    } else {
        console.log('password sama');
    }
}

// Navbar Bottom fixed position
function navBottomPosition(position) {
    if(position == "fixed") {
        idNavBottom.classList.add("fixed-bottom");
        console.log('footer fixed positioned');
    }
}

// Navbar Bottom style
function navBottomColor(halaman) {
    if( halaman == "putih") {
        idNavBottom.style.backgroundColor = "white";
        console.log(halaman);
    } else {
        idNavBottom.style.backgroundColor = "#00B894";
        console.log(halaman);
    }
}

// OnClick upload file IPTM perpanjang
function getIptmPerpanjang() {
    document.getElementById('iptmPerpanjang').click();
}

// Surat Keterangan Meninggal Trigger Button
function fileSkmEvent() {
    document.getElementById('suratKeteranganMeninggal').click();
}

// KTP & KK Jenazah trigger button
function ktp() {
    document.getElementById('ktpJenazah').click();
}

function kk() {
    document.getElementById('kkJenazah').click();
}

// Form daftar jenazah 

var uploadTumpangan = document.getElementById('fileTumpangan');
var blokField = document.getElementById('blokField');
var blokOption = document.getElementById('blokOption');
var nikTumpangRow = document.getElementById('nikTumpangRow');
var nikTumpangField = document.getElementById('nikTumpangField');

// If pendaftaran baru selected
function hideTumpanganUpload() {
    uploadTumpangan.setAttribute('hidden', '');
    blokField.removeAttribute('hidden');
    blokOption.removeAttribute('hidden');
    nikTumpangRow.setAttribute('hidden', '');
    nikTumpangField.setAttribute('hidden', '');
    console.log('daftar baru');
}

// If pendaftaran tumpangan selected
function showTumpanganUpload() {
    blokField.setAttribute('hidden', '');
    blokOption.setAttribute('hidden', '');
    uploadTumpangan.removeAttribute('hidden');
    nikTumpangRow.removeAttribute('hidden');
    nikTumpangField.removeAttribute('hidden');
    console.log('daftar tumpang');
}

function tumpang() {
    document.getElementById('suratTumpang').click();
}