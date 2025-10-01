
let state = {
    transactions: [],
    transactionToEdit: null
};

const STORAGE_KEY = 'money-notes-transactions';


export function loadTransactions() {
    const savedTransactions = localStorage.getItem(STORAGE_KEY);
    if (savedTransactions) {
        state.transactions = JSON.parse(savedTransactions);
    }
}

/**
 * Menyimpan state transaksi saat ini ke localStorage.
 */
function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
}

/**
 * Mengembalikan semua transaksi.
 * @returns {Array}
 */
export function getTransactions() {
    return state.transactions;
}

/**
 * Menambah transaksi baru.
 * @param {object} transaction - Objek transaksi baru.
 */
export function addTransaction(transaction) {
    const newTransaction = {
        ...transaction,
        id: Date.now(), // ID unik
        nominal: parseFloat(transaction.nominal)
    };
    state.transactions.unshift(newTransaction); // Tambah ke awal array
    saveTransactions();
}

/**
 * Memperbarui transaksi yang sudah ada.
 * @param {object} updatedTransaction - Objek transaksi dengan data baru.
 */
export function updateTransaction(updatedTransaction) {
    const index = state.transactions.findIndex(t => t.id == updatedTransaction.id);
    if (index !== -1) {
        state.transactions[index] = {
            ...updatedTransaction,
            nominal: parseFloat(updatedTransaction.nominal)
        };
        saveTransactions();
    }
}

/**
 * Menghapus transaksi berdasarkan ID.
 * @param {number} id - ID transaksi yang akan dihapus.
 */
export function deleteTransaction(id) {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveTransactions();
}

/**
 * Mendapatkan transaksi berdasarkan ID.
 * @param {number} id - ID transaksi.
 * @returns {object|undefined}
 */
export function getTransactionById(id) {
    return state.transactions.find(t => t.id === id);
}

export function setTransactionToEdit(transaction) {
    state.transactionToEdit = transaction;
}

export function getTransactionToEdit() {
    return state.transactionToEdit;
}