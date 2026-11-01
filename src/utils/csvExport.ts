import { Transaction } from '../types';

/**
 * Escapes a cell value for standard RFC 4180 CSV compliance
 */
function escapeCSV(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Exports transactions to a CSV file and triggers a browser download.
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  fileName: string = 'spendwise_transactions.csv'
): void {
  const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Payment Method', 'Description'];

  const rows = transactions.map((t) => [
    escapeCSV(t.date),
    escapeCSV(t.title),
    escapeCSV(t.type.toUpperCase()),
    escapeCSV(t.category),
    escapeCSV(t.amount),
    escapeCSV(t.paymentMethod || 'N/A'),
    escapeCSV(t.description || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  // Add UTF-8 BOM for proper Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports all application data as JSON backup
 */
export function exportDataAsJSON(data: unknown, fileName: string = 'spendwise_backup.json'): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
