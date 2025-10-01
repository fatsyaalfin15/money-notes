import { formatCurrency } from './utils.js';

// Ambil semua elemen DOM yang dibutuhkan
const elements = {
    // Dashboard
    totalPemasukan: document.getElementById('total-pemasukan'),
    totalPengeluaran: document.getElementById('total-pengeluaran'),
    saldoAkhir: document.getElementById('saldo-akhir'),
    // Views
    mainView: document.getElementById('main-view'),
    historyView: document.getElementById('history-view'),
    // Navigasi
    navMainBtn: document.getElementById('nav-main-btn'),
    navHistoryBtn: document.getElementById('nav-history-btn'),
    // Form
    form: document.getElementById('transaction-form'),
    formTitle: document.getElementById('form-title'),
    cancelEditBtn: document.getElementById('cancel-edit-btn'),
    // Lists
    transactionList: document.getElementById('transaction-list'),
    historyList: document.getElementById('history-list'),
    // Modals
    deleteModal: document.getElementById('delete-modal'),
    welcomeModal: document.getElementById('welcome-modal'),
};

/**
 * Merender (menampilkan) dashboard dengan data terbaru.
 */
export function renderDashboard(transactions) {
    const pemasukan = transactions
        .filter(t => t.jenis === 'pemasukan')
        .reduce((sum, t) => sum + t.nominal, 0);

    const pengeluaran = transactions
        .filter(t => t.jenis === 'pengeluaran')
        .reduce((sum, t) => sum + t.nominal, 0);

    const saldo = pemasukan - pengeluaran;

    elements.totalPemasukan.textContent = formatCurrency(pemasukan);
    elements.totalPengeluaran.textContent = formatCurrency(pengeluaran);
    elements.saldoAkhir.textContent = formatCurrency(saldo);
}

/**
 * Membuat satu elemen item transaksi dalam bentuk HTML string.
 */
function createTransactionItemHTML(tx) {
    const type = tx.jenis;
    const sign = type === 'pemasukan' ? '+' : '-';
    return `
        <div class="transaction-item ${type}" data-id="${tx.id}">
            <div class="transaction-details">
                <p>${tx.kategori}</p>
                <small>${new Date(tx.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</small>
                <small class="catatan">${tx.catatan || ''}</small>
            </div>
            <div class="transaction-actions">
                <p class="nominal ${type}">${sign} ${formatCurrency(tx.nominal)}</p>
                <div class="action-buttons">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Hapus</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Merender daftar transaksi ke dalam DOM.
 */
export function renderTransactions(transactions) {
    elements.transactionList.innerHTML = transactions.length > 0 
        ? transactions.map(createTransactionItemHTML).join('')
        : '<p style="text-align: center; color: #6b7280;">Belum ada transaksi.</p>';
}

/**
 * BARU: Merender riwayat transaksi yang dikelompokkan per tanggal.
 */
export function renderHistory(transactions) {
    const groupedByDate = transactions.reduce((acc, tx) => {
        const date = tx.tanggal;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(tx);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length === 0) {
        elements.historyList.innerHTML = '<p style="text-align: center; color: #6b7280;">Belum ada riwayat transaksi.</p>';
        return;
    }

    let html = '';
    for (const date of sortedDates) {
        const formattedDate = new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        html += `<div class="date-group">`;
        html += `<h3 class="date-header">${formattedDate}</h3>`;
        html += groupedByDate[date].map(createTransactionItemHTML).join('');
        html += `</div>`;
    }
    elements.historyList.innerHTML = html;
}

/**
 * Mengisi form dengan data transaksi untuk diedit.
 */
export function populateForm(transaction) {
    elements.form.id.value = transaction.id;
    elements.form.tanggal.value = transaction.tanggal;
    elements.form.kategori.value = transaction.kategori;
    elements.form.jenis.value = transaction.jenis;
    elements.form.nominal.value = transaction.nominal;
    elements.form.catatan.value = transaction.catatan;
    
    elements.formTitle.textContent = 'Edit Transaksi';
    elements.form.querySelector('button[type="submit"]').textContent = 'Update Transaksi';
    elements.cancelEditBtn.style.display = 'inline-block';
    switchView('main');
}

/**
 * Mengosongkan dan mereset form ke kondisi awal.
 */
export function resetForm() {
    elements.form.reset();
    elements.form.id.value = '';
    elements.formTitle.textContent = 'Tambah Transaksi Baru';
    elements.form.querySelector('button[type="submit"]').textContent = 'Simpan Transaksi';
    elements.cancelEditBtn.style.display = 'none';
    document.getElementById('tanggal').valueAsDate = new Date();
}

/**
 * BARU: Menampilkan atau menyembunyikan modal berdasarkan ID.
 */
export function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
}

/**
 * BARU: Berpindah antara tampilan utama dan riwayat.
 */
export function switchView(viewName) {
    if (viewName === 'main') {
        elements.mainView.style.display = 'block';
        elements.historyView.style.display = 'none';
        elements.navMainBtn.classList.add('active');
        elements.navHistoryBtn.classList.remove('active');
    } else {
        elements.mainView.style.display = 'none';
        elements.historyView.style.display = 'block';
        elements.navMainBtn.classList.remove('active');
        elements.navHistoryBtn.classList.add('active');
    }
}