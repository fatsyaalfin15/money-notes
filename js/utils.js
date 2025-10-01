/**
 * Memformat angka menjadi format mata uang Rupiah (IDR).
 * @param {number} amount - Angka yang akan diformat.
 * @returns {string} String dalam format mata uang, contoh: "Rp 50.000".
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}