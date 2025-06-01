import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule
  ],
})
export class SubmitComponent {
  blogForm: FormGroup;
  thumbnailFile: File | null = null;
  markdownFile: File | null = null;
  additionalFiles: File[] = [];
  categories = [
    { label: 'Events', value: 'events' },
    { label: 'News', value: 'news' },
    { label: 'Backstage', value: 'backstage' },
    { label: 'Other', value: 'other' }
  ];

  constructor(private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required]
    });

  }

  onThumbnailChange(event: any) {
    this.thumbnailFile = event.target.files[0];
  }

  onMarkdownChange(event: any) {
    this.markdownFile = event.target.files[0];
  }

  onAdditionalFilesChange(event: any) {
    this.additionalFiles = Array.from(event.target.files);
  }

  onSubmit() {
    if (this.blogForm.invalid || !this.thumbnailFile || !this.markdownFile) {
      alert('mädchen bist du dumm oder kommst du jetzt klar?');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('author', this.blogForm.value.description);
    formData.append('description', this.blogForm.value.description);
    formData.append('date', this.blogForm.value.date);
    formData.append('thumbnail', this.thumbnailFile as Blob);
    formData.append('markdown', this.markdownFile as Blob);
    formData.append('category', this.blogForm.value.category);

    this.additionalFiles.forEach((file, index) => {
      formData.append(`additionalFiles[]`, file);
    });

    /*
      TODO: post zu appwrite
      alli date sind in 'formData'
    */
    console.log(formData.get('category'));
  }
}
 