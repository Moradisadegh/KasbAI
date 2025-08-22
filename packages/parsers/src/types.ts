export interface NormalizedTransaction {
  date_iso: string;
  txn_no?: string;
  type: 'debit' | 'credit';
  amount: number;
  balance_opt?: number;
  description_raw: string;
  counterparty_opt?: string;
}

export interface NormalizedOutput {
  bank_name: string;
  report_period_start: string;
  report_period_end: string;
  currency: string;
  txns: NormalizedTransaction[];
}

export interface IBankParser {
  // Determines if this parser can handle the given file buffer
  canParse(fileBuffer: Buffer, fileType: 'csv' | 'pdf' | 'xlsx'): boolean;
  // Parses the file and returns the normalized data
  parse(fileBuffer: Buffer): Promise<NormalizedOutput>;
}
