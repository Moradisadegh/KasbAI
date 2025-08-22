import { IBankParser, NormalizedOutput } from '../types';
import { parse } from 'csv-parse/sync';

export class GenericCsvParser implements IBankParser {
  canParse(fileBuffer: Buffer, fileType: 'csv' | 'pdf' | 'xlsx'): boolean {
    return fileType === 'csv';
  }

  async parse(fileBuffer: Buffer): Promise<NormalizedOutput> {
    const records = parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // This is a placeholder. Real implementation requires mapping columns.
    // e.g. "Transaction Date" -> date_iso, "Debit" -> amount
    const transactions = records.map((record: any) => {
      // Very basic and likely incorrect mapping, needs to be robust
      const amount = parseFloat(record.Debit || record.Credit || record.Amount);
      const type = record.Debit ? 'debit' : 'credit';

      return {
        date_iso: new Date(record['Date'] || record['Transaction Date']).toISOString(),
        amount: isNaN(amount) ? 0 : amount,
        type: type,
        description_raw: record.Description || record.Details,
        balance_opt: parseFloat(record.Balance),
      };
    });

    return {
      bank_name: 'Generic CSV Bank',
      report_period_start: new Date().toISOString(), // Placeholder
      report_period_end: new Date().toISOString(), // Placeholder
      currency: 'USD', // Placeholder
      txns: transactions,
    };
  }
}
