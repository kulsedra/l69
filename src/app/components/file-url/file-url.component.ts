import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppwriteClient } from '../../lib/AppwriteClient';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-url',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './file-url.component.html',
  styleUrl: './file-url.component.css'
})
export class FileUrlComponent {
  @Input() files: File[] = [];

  fileURLs: string[] = [];

  isLoading = false;

  client = new AppwriteClient();

  async uploadFiles(): Promise<void> {

    if (this.files.length === 0) {
      alert('No additional files selected.');

      return;
    }

    const imageFiles = this.files.map(file =>
      this.client.uploadPostResource(file));


    this.isLoading = true;

    try {
      const fileUploadRefs = (await Promise.all(imageFiles)).map(fileRef => fileRef.$id);

      this.fileURLs = (await Promise.all(fileUploadRefs.map(id => this.client.downloadPostResource(id))))
    } catch (error) {
      console.error('Error uploading files:', error);

      alert('Error uploading files, check console for details');
    }
    finally {
      this.isLoading = false;
    }
  }
}
