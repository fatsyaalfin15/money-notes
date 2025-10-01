import * as state from './state.js';
import * as ui from './ui.js';

let transactionIdToDelete = null;

/**
 * Fungsi utama untuk me-refresh seluruh UI berdasarkan state saat ini.
 */
function refreshUI() {
    const transactions = state.getTransactions();
    
    // Filter untuk tampilan utama
    const keyword = document.getElementById('filter-keyword').value.toLowerCase();
    const jenis = document.getElementById('filter-jenis').value;

    const filteredTransactions = transactions.filter(t => {
        const noteMatch = t.catatan ? t.catatan.toLowerCase().includes(keyword) : true;
        const categoryMatch = t.kategori.toLowerCase().includes(keyword);
        const jenisMatch = jenis === 'all' || t.jenis === jenis;
        return (noteMatch || categoryMatch) && jenisMatch;
    });

    // Render semua komponen UI
    ui.renderDashboard(transactions);
    ui.renderTransactions(filteredTransactions);
    ui.renderHistory(transactions); // BARU: Selalu render history agar tetap update
}

/**
 * Menangani submit form untuk menambah atau mengedit transaksi.
 */
function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const transactionData = Object.fromEntries(formData.entries());

    if (transactionData.id) {
        state.updateTransaction(transactionData);
    } else {
        state.addTransaction(transactionData);
    }
    
    ui.resetForm();
    refreshUI();
}

/**
 * Menangani klik pada daftar transaksi (untuk edit dan hapus).
 */
function handleListClick(event) {
    const target = event.target;
    const item = target.closest('.transaction-item');
    if (!item) return;

    const id = parseInt(item.dataset.id);

    if (target.classList.contains('edit-btn')) {
        const transaction = state.getTransactionById(id);
        if (transaction) {
            ui.populateForm(transaction);
        }
    }

    if (target.classList.contains('delete-btn')) {
        transactionIdToDelete = id;
        ui.toggleModal('delete-modal', true);
    }
}

/**
 * BARU: Menampilkan popup selamat datang jika belum pernah ditampilkan di sesi ini.
 */
function showWelcomePopup() {
    if (!sessionStorage.getItem('welcomeShown')) {
        ui.toggleModal('welcome-modal', true);
        sessionStorage.setItem('welcomeShown', 'true');
    }
}

/**
 * Inisialisasi aplikasi.
 */
function init() {
    state.loadTransactions();
    refreshUI();
    ui.resetForm();
    ui.switchView('main'); // Set tampilan awal

    showWelcomePopup(); // Panggil fungsi popup

    // Setup Event Listeners
    document.getElementById('transaction-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('transaction-list').addEventListener('click', handleListClick);
    document.getElementById('history-list').addEventListener('click', handleListClick); // BARU: Tambahkan listener ke list history juga
    document.getElementById('cancel-edit-btn').addEventListener('click', ui.resetForm);
    
    // Filter listeners
    document.getElementById('filter-keyword').addEventListener('input', refreshUI);
    document.getElementById('filter-jenis').addEventListener('change', refreshUI);

    // Modal listeners
    document.getElementById('modal-cancel-btn').addEventListener('click', () => ui.toggleModal('delete-modal', false));
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        if (transactionIdToDelete !== null) {
            state.deleteTransaction(transactionIdToDelete);
            transactionIdToDelete = null;
            ui.toggleModal('delete-modal', false);
            refreshUI();
        }
    });

    // Welcome modal listener
    document.getElementById('welcome-ok-btn').addEventListener('click', () => ui.toggleModal('welcome-modal', false));

    // Navigasi listeners
    document.getElementById('nav-main-btn').addEventListener('click', () => ui.switchView('main'));
    document.getElementById('nav-history-btn').addEventListener('click', () => ui.switchView('history'));
}

document.addEventListener('DOMContentLoaded', init);