import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class FileImport {
  async parseFile(file: File) {
    const workbook = XLSX.read(await file.arrayBuffer());
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    const columns = Object.keys(rows[0] as object);

    return columns.map((column) => ({
      filename: file.name,
      name: column,
      answers: rows.map((row: any) => row[column]).filter(Boolean),
    }));
  }
}
