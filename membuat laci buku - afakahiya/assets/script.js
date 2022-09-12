document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    const pencarian = document.getElementById('form1');
    const resetBtn = document.getElementById('resetbtn');

    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBuku();
    });
    pencarian.addEventListener('submit', function (event) {
      event.preventDefault();
      const titleCari = document.getElementById('titlecari').value;
      pencarianBuku(titleCari);
    });
    resetBtn.addEventListener('click', function (event) {
      event.preventDefault();
      resetDataBuku();
    });

    if (cekLocalStorage()) {
        ambilDataLocalStorage();
      }

  });

  function addBuku() {
    const judulBuku = document.getElementById('judul').value;
    const authorBuku = document.getElementById('author').value;
    const tahunBuku = parseInt(document.getElementById('tahun').value);
   
    const randomId = +new Date();
    const bukuObject = buatBukuObject(randomId, judulBuku, authorBuku, tahunBuku, false);
    bukuArray.push(bukuObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanData();
  }

   
  function buatBukuObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
  }

  const bukuArray = [];
  const bukuArrayPencarian = [];
  const RENDER_EVENT = 'render-buku';

  document.addEventListener(RENDER_EVENT, function () {
    const listBukuBelum = document.getElementById('belumDibaca');
    listBukuBelum.innerHTML = '';

    const listBukuSudah = document.getElementById('sudahDibaca');
    listBukuSudah.innerHTML = '';
   
    for (const anakBuku of bukuArray) {
      const cekIsiBuku = tambahBuku(anakBuku);
      if (!anakBuku.isCompleted) 
        listBukuBelum.append(cekIsiBuku);
      else
        listBukuSudah.append(cekIsiBuku);
    }
  });
  
  function editBuku(bukuId){
    const arahBuku = cariBukuIndex(bukuId);
   
    if (arahBuku === -1) return;

    const judulBuku = prompt("Masukan Judul Buku", bukuArray[arahBuku]['title']);
    const authorBuku = prompt("Masukan Author Buku", bukuArray[arahBuku]['author']);
    const tahunBuku = prompt("Masukan Tahun Buku", bukuArray[arahBuku]['year']);

    if((judulBuku != '' && judulBuku != null) && (authorBuku != '' && authorBuku != null) && (tahunBuku != '' && tahunBuku != null)){
        bukuArray[arahBuku]['title'] = judulBuku;
        bukuArray[arahBuku]['author'] = authorBuku;
        bukuArray[arahBuku]['year'] = parseInt(tahunBuku);
        alert('Data Berhasil Dirubah!');
    }else{
        alert('Data Tidak Boleh Kosong!');
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanData();
  }

  function resetDataBuku(){
    const listBukuBelum = document.getElementById('belumDibaca');
    listBukuBelum.innerHTML = '';

    const listBukuSudah = document.getElementById('sudahDibaca');
    listBukuSudah.innerHTML = '';

    for (const anakBuku of bukuArray) {
        const cekIsiBuku = tambahBuku(anakBuku);
        if (!anakBuku.isCompleted) 
          listBukuBelum.append(cekIsiBuku);
        else
          listBukuSudah.append(cekIsiBuku);
    }
  }

  function pencarianBuku(titleCari){
    while (bukuArrayPencarian.length) {
        bukuArrayPencarian.pop();
    }
    const judulBuku = document.getElementById('titlecari').value;

    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const buku of data) {
        const databuku = buku.title.toLowerCase();
        const cek = databuku.includes(judulBuku.toLowerCase());
        if(cek)
        bukuArrayPencarian.push(buku);
      }
    }
    
    const listBukuBelum = document.getElementById('belumDibaca');
    listBukuBelum.innerHTML = '';

    const listBukuSudah = document.getElementById('sudahDibaca');
    listBukuSudah.innerHTML = '';

    for (const anakBuku of bukuArrayPencarian) {
        const cekIsiBuku = tambahBuku(anakBuku);
        if (!anakBuku.isCompleted) 
          listBukuBelum.append(cekIsiBuku);
        else
          listBukuSudah.append(cekIsiBuku);
    }
  }

  function tambahBuku(bukuObject) {
    const txtJudulBuku = document.createElement('td');
    txtJudulBuku.innerText = bukuObject.title;
   
    const txtAuthorBuku = document.createElement('td');
    txtAuthorBuku.innerText = bukuObject.author;

    const txtTahunBuku = document.createElement('td');
    txtTahunBuku.innerText = bukuObject.year;

    const txtPengaturan = document.createElement('td');
   
    const txtTable = document.createElement('tr');
    txtTable.append(txtJudulBuku, txtAuthorBuku, txtTahunBuku, txtPengaturan);
    txtTable.setAttribute('id', `buku-${bukuObject.id}`);
   
   
    if (bukuObject.isCompleted) {
        const tmblRubahJadiBelum = document.createElement('button');
        tmblRubahJadiBelum.classList.add('button');
        tmblRubahJadiBelum.innerHTML = 'Baca Ulang';
     
        tmblRubahJadiBelum.addEventListener('click', function () {
          rubahJadiBelum(bukuObject.id);
        });
        const tmblEdit = document.createElement('button');
        tmblEdit.classList.add('button');
        tmblEdit.innerText = 'Edit';
     
        tmblEdit.addEventListener('click', function () {
          editBuku(bukuObject.id);
        });
        const tmblHapus = document.createElement('button');
        tmblHapus.classList.add('button');
        tmblHapus.innerText = 'Hapus';
     
        tmblHapus.addEventListener('click', function () {
          hapusYangDibaca(bukuObject.id);
        });
     
        txtPengaturan.append(tmblEdit, tmblHapus, tmblRubahJadiBelum);
      } else {
        const tmblEdit = document.createElement('button');
        tmblEdit.classList.add('button');
        tmblEdit.innerText = 'Edit';
     
        tmblEdit.addEventListener('click', function () {
          editBuku(bukuObject.id);
        });

        const tmblDibaca = document.createElement('button');
        tmblDibaca.classList.add('button');
        tmblDibaca.innerText = 'Sudah Dibaca';
        
        tmblDibaca.addEventListener('click', function () {
          rubahJadiDibaca(bukuObject.id);
        });

        const tmblHapus = document.createElement('button');
        tmblHapus.classList.add('button');
        tmblHapus.innerText = 'Hapus';
     
        tmblHapus.addEventListener('click', function () {
          hapusYangDibaca(bukuObject.id);
        });

        txtPengaturan.append(tmblEdit, tmblHapus, tmblDibaca);
      }
     
    return txtTable;
  }

  function rubahJadiDibaca (bukuId) {
    const arahBuku = cariBuku(bukuId);
   
    if (arahBuku == null) return;
   
    arahBuku.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanData();
  }

  function cariBuku(bukuId) {
    for (const anakBuku of bukuArray) {
      if (anakBuku.id === bukuId) {
        return anakBuku;
      }
    }
    return null;
  }

  function hapusYangDibaca(bukuId) {
    alert('Buku Berhasil Dihapus!');
    const arahBuku = cariBukuIndex(bukuId);
   
    if (arahBuku === -1) return;
   
    bukuArray.splice(arahBuku, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanData();
  }
   
   
  function rubahJadiBelum(bukuId) {
    const arahBuku = cariBuku(bukuId);
   
    if (arahBuku == null) return;
   
    arahBuku.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanData();
  }

  function cariBukuIndex(bukuId) {
    for (const index in bukuArray) {
      if (bukuArray[index].id === bukuId) {
        return index;
      }
    }
   
    return -1;
  }

  function simpanData() {
    if (cekLocalStorage()) {
      const parsed = JSON.stringify(bukuArray);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

const SAVED_EVENT = 'buku-tersimpan';
const STORAGE_KEY = 'StorageRakBuku';
 
function cekLocalStorage() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage nih Maaf ya!');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function ambilDataLocalStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const buku of data) {
        bukuArray.push(buku);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }