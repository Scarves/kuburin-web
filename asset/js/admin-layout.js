// Show tittle
// function showTitle() {
//     document.getElementById('titleContent').removeAttribute('hidden');
// }
// "use strict";

// const { default: fetch } = require("node-fetch");


// Decides what information based on admintype
function whatAdmin(adminType) {
    if(adminType == 'pusat') {
        document.getElementById('firstCard').innerHTML = 'Jumlah Ahli Waris';
        document.getElementById('secondCard').innerHTML = 'Jumlah TPU';
        document.getElementById('thirdCard').innerHTML = 'Jumlah Pengunjung';
        document.getElementById('fourthCard').innerHTML = 'Jumlah Admin TPU';
        document.getElementById('fifthCard').innerHTML = 'Jumlah Admin Aktif';
    }
};
// Insert information for admin into cards
function insertInfoDashboard(firstCard, secondCard, thirdCard, fourthCard, fifthCard) {
    document.getElementById('firstCardValue').innerHTML = firstCard;
    document.getElementById('secondCardValue').innerHTML = secondCard;
    document.getElementById('thirdCardValue').innerHTML = thirdCard;
    // document.getElementById('fourthCardValue').innerHTML = fourthCard;
    document.getElementById('fifthCardValue').innerHTML = fifthCard;
};

/**
 * HTML Boxes thing
 * stores id into array to enable system to run hapus/ubah function
 * 
 */

var listId = [];
var boxAll = document.getElementById('boxAll');
var allChecks = document.getElementsByClassName('checkbox');
var actionButtons = document.getElementById('actionBtn');

// Applying attr on ubah button for menu Data Pegawai
function applyUbahBtn(kdPegawai, kelamin, statusPegawai) {
    const ubahBtn = actionButtons.children[1];
    ubahBtn.setAttribute('data-toggle', 'modal');
    ubahBtn.setAttribute('data-target', `#ubahPegawai${kdPegawai}`);
    ubahBtn.onclick = ubahGender(kdPegawai, kelamin);
    ubahBtn.onclick = ubahStatusPegawai(kdPegawai, statusPegawai);
}

// Applying attr on ubah button for menu Data Perpanjang
function applyUbahBtnPerpanjang(kdPerpanjang, email, nikJenazah, statusPembayaran) {
    const ubahBtn = actionButtons.children[1];
    ubahBtn.setAttribute('data-toggle', 'modal');
    ubahBtn.setAttribute('data-target', `#ubahPerpanjang${kdPerpanjang}`);
    ubahBtn.setAttribute('onclick', `getFoto('${kdPerpanjang}', '${email}', '${nikJenazah}'); setStatPembayaran('${kdPerpanjang}', '${statusPembayaran}')`);
}

// Applying attr on ubah button for menu Data Pendaftaran Baru
function applyUbahBtnPendaftar(email, nikJenazah, nikAhli, kelamin, blok, agama, stat) {
    const ubahBtn = actionButtons.children[1];
    ubahBtn.setAttribute('data-toggle', 'modal');
    ubahBtn.setAttribute('data-target', `#ubahPendaftar${nikJenazah}`);
    ubahBtn.setAttribute('onclick', `getFoto('${email}', '${nikJenazah}'); selectAhliWaris('${nikAhli}', '${nikJenazah}'); setDefaultOptions('${nikJenazah}', '${kelamin}', '${blok}', '${agama}', ${stat})`);
}

// Applying attr on ubah button for menu Data Pendaftaran Tumpang
function applyUbahBtnPendaftarTumpang(email, nikJenazah, nikAhli, kelamin, kdLokasi, blok, blad, petak, agama, stat) {
    const ubahBtn = actionButtons.children[1];
    ubahBtn.setAttribute('data-toggle', 'modal');
    ubahBtn.setAttribute('data-target', `#ubahPendaftar${nikJenazah}`);
    ubahBtn.setAttribute(
        'onclick', 
        `getFoto('${gambarNisan}'); selectAhliWaris('${nikAhli}', '${nikJenazah}'); setDefaultOptions('${nikJenazah}', '${kelamin}', '${agama}', ${stat}); selectMakam('${kdLokasi}', '${nikJenazah}');`
    );
}

// Applying attr on ubah button for menu Data Pemesanan Nisan
function applyUbahBtnPemesanNisan(nikJenazah, statusPembayaran, kdNisan) {
    const ubahBtn = actionButtons.children[1];
    ubahBtn.setAttribute('data-toggle', 'modal');
    ubahBtn.setAttribute('data-target', `#ubahPendaftar${nikJenazah}`);
    ubahBtn.setAttribute(
        'onclick', 
        `getFoto('${nikJenazah}'); selectModelNisan('${nikJenazah}', '${kdNisan}'); setDefaultOptions('${nikJenazah}', ${statusPembayaran}); selectJenazah('${nikJenazah}', ${true});`
    );
}

// Reset attribute on ubah button 
function resetAttUbahBtn() {
    actionButtons.children[1].removeAttribute('data-toggle');
    actionButtons.children[1].removeAttribute('data-target');
    actionButtons.children[1].removeAttribute('onclick');
}

// Select or deselect selected checkbox for menu Data Pegawai
function isChecked(id, kelamin, statusPegawai) {
    var checkboxTarget = document.getElementById('checkbox' + id).checked;
    if( checkboxTarget == true) {
        console.log('true');
        checkboxTarget = true;
        pushId(id);
        applyUbahBtn(id, kelamin, statusPegawai);
    } else {
        console.log('false');
        checkboxTarget = false;
        removeId(id);
        resetAttUbahBtn();
    }
}

// Select or deselect selected checkbox for menu Data Perpanjang
function isCheckedPerpanjang(id, email, nikJenazah, statusPembayaran) {
    var checkboxTarget = document.getElementById('checkbox' + id).checked;
    if( checkboxTarget == true) {
        console.log('true');
        checkboxTarget = true;
        pushId(id);
        applyUbahBtnPerpanjang(id, email, nikJenazah, statusPembayaran);
    } else {
        console.log('false');
        checkboxTarget = false;
        removeId(id);
        resetAttUbahBtn();
    }
}

// Select or deselect selected checkbox for menu Data Pendaftaran Baru
function isCheckedPendaftar(email, nikJenazah, nikAhli, kelamin, blok, agama, stat) {
    var checkboxTarget = document.getElementById('checkbox' + nikJenazah).checked;
    if( checkboxTarget == true) {
        console.log('true');
        checkboxTarget = true;
        pushId(nikJenazah);
        applyUbahBtnPendaftar(email, nikJenazah, nikAhli, kelamin, blok, agama, stat);
    } else {
        console.log('false');
        checkboxTarget = false;
        removeId(nikJenazah);
        resetAttUbahBtn();
    }
}

// Select or deselect selected checkbox for menu Data Pendaftaran Baru
function isCheckedPendaftarTumpang(email, nikJenazah, nikAhli, kelamin, kdLokasi, blok, blad, petak, agama, stat) {
    var checkboxTarget = document.getElementById('checkbox' + nikJenazah).checked;
    if( checkboxTarget == true) {
        console.log('true');
        checkboxTarget = true;
        pushId(nikJenazah);
        applyUbahBtnPendaftarTumpang(email, nikJenazah, nikAhli, kelamin, kdLokasi, blok, blad, petak, agama, stat);
    } else {
        console.log('false');
        checkboxTarget = false;
        removeId(nikJenazah);
        resetAttUbahBtn();
    }
}

// Select or deselect selected checkbox for menu Data Pemesanan Nisan
function isCheckedPemesanNisan(nikJenazah, statusPembayaran, kdNisan) {
    var checkboxTarget = document.getElementById('checkbox' + nikJenazah).checked;
    if( checkboxTarget == true) {
        console.log('true');
        checkboxTarget = true;
        pushId(nikJenazah);
        applyUbahBtnPemesanNisan(nikJenazah, statusPembayaran, kdNisan);
    } else {
        console.log('false');
        checkboxTarget = false;
        removeId(nikJenazah);
        resetAttUbahBtn();
    }
}

// Store an Id of checked box into listId
function pushId(id) {
    var isDuplicate = listId.find( element => element == id);
    if(isDuplicate === undefined) {
        listId.push(id);
        console.log('isi list id :');
        console.log(listId);
        document.getElementById('hapusBtn').removeAttribute('disabled');
        document.getElementById('ubahBtn').removeAttribute('disabled');
        if(listId.length > 1) {
            document.getElementById('ubahBtn').setAttribute('disabled', '');
        }
        if(allChecks.length == listId.length) {
            console.log('checkbox full');
            boxAll.checked = true;
        }
    }
}

// Remove an Id of unchecked box from listId
function removeId(id) {
    var itemIndex = listId.indexOf(id);
    listId.splice(itemIndex, 1);
    console.log('isi list id :');
    console.log(listId);
    if(allChecks.length > listId.length) {
        console.log('checkbox not full');
        boxAll.checked = false;
    }
    if(listId.length == 1) {
        document.getElementById('ubahBtn').removeAttribute('disabled');
    } else {
        document.getElementById('ubahBtn').setAttribute('disabled', '');
    }
    if(listId.length == 0) {
        document.getElementById('hapusBtn').setAttribute('disabled', '');
    }
}

// Select All / Remove All checkedbox
function allCheckboxes() {
    var allChecks = document.getElementsByClassName('checkbox');
    if(boxAll.checked == true) {
        for(i = 0; i < allChecks.length; i++) {
            var getId = allChecks[i].id.substring(8);
            allChecks[i].checked = true;
            pushId(getId);
        }
    } else {
        for(i = 0; i < allChecks.length; i++) {
            var getId = allChecks[i].id.substring(8);
            allChecks[i].checked = false;
            removeId(getId);
        }
    }
}

/**
 * Remove Data from DB by inputed link and Id
 */
function removeData(link) {
    if(listId.length > 0) {
        fetch(link, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({listHapus: listId})
        })
        .then(() => window.location.reload())
        .catch(error => console.error(error));
    }
}

/**
 * Define gaji pegawai by its golongan on Form Tambah Pegawai and Ubah Data Pegawai (with parameter) in Data Pegawai Menu
 */
function defineGaji(kdPegawai) {
    var golonganField = document.getElementById('tambahGolongan').value;
    var gajiField = document.getElementById('tambahJumlahGaji');
    var showGaji = document.getElementById('showGaji');
    if(kdPegawai.length > 1) {
        golonganField = document.getElementById(`ubahGolongan${kdPegawai}`).value;
        var gajiField = document.getElementById(`ubahJumlahGaji${kdPegawai}`);
        var showGaji = document.getElementById(`showUbahGaji${kdPegawai}`);
    }
    switch(golonganField) {
        case '1A':
            gajiField.value = '1.560.800';
            showGaji.innerHTML = '1.560.800';
        break;
        case '1B':
            gajiField.value = '1.704.500';
            showGaji.innerHTML = '1.704.500';
        break;
        case '1C':
            gajiField.value = '1.776.600';
            showGaji.innerHTML = '1.776.600';
        break;
        case '1D':
            gajiField.value = '1.815.800';
            showGaji.innerHTML = '1.815.800';
        break;
        case '2A':
            gajiField.value = '2.022.200';
            showGaji.innerHTML = '2.022.200';
        break;
        case '2B':
            gajiField.value = '2.208.400';
            showGaji.innerHTML = '2.208.400';
        break;
        case '2C':
            gajiField.value = '2.301.800';
            showGaji.innerHTML = '2.301.800';
        break;
        case '2D':
            gajiField.value = '2.399.200';
            showGaji.innerHTML = '2.399.200';
        break;
        case '3A':
            gajiField.value = '2.579.400';
            showGaji.innerHTML = '2.579.400';
        break;
        case '3B':
            gajiField.value = '2.688.500';
            showGaji.innerHTML = '2.688.500';
        break;
        case '3C':
            gajiField.value = '2.802.300';
            showGaji.innerHTML = '2.802.300';
        break;
        case '3D':
            gajiField.value = '2.920.800';
            showGaji.innerHTML = '2.920.800';
        break;
        case '4A':
            gajiField.value = '3.044.300';
            showGaji.innerHTML = '3.044.300';
        break;
        case '4B':
            gajiField.value = '3.173.100';
            showGaji.innerHTML = '3.173.100';
        break;
        case '4C':
            gajiField.value = '3.307.300';
            showGaji.innerHTML = '3.307.300';
        break;
        case '4D':
            gajiField.value = '3.447.200';
            showGaji.innerHTML = '3.447.200';
        break;
        case '4E':
            gajiField.value = '3.593.100';
            showGaji.innerHTML = '3.593.100';
        break;
    }
}