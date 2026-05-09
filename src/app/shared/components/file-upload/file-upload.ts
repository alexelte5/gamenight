import { Component, inject, output } from '@angular/core';
import { FileImport } from '../../../core/file-import';
import { LmsData } from '../../../../../shared-types';

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
})
export class FileUpload {
  categoriesLoaded = output<LmsData[]>();
  private readonly fileImportService = inject(FileImport);

  fileName: string = '';

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.fileImportService.parseFile(file).then((data) => (this.fileName = data[0].filename));
    this.fileImportService.parseFile(file).then((data) => {
      this.categoriesLoaded.emit(data);
    });
  }
}
