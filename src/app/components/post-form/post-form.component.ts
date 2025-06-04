import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AngularMarkdownEditorModule } from 'angular-markdown-editor';
import { MarkdownService } from 'ngx-markdown';
import { Post, PostFormData } from '../../lib/models';
import { FileUrlComponent } from "../file-url/file-url.component";
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-post-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    MatProgressSpinnerModule,
    AngularMarkdownEditorModule,
    FormsModule,
    FileUrlComponent,
    MatCardModule
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit {
  @Input() postFormData: PostFormData | null = null;

  @Input() isLoading = false;

  @Output() formSubmit = new EventEmitter<PostFormData>();

  @Output() thumbnailChange = new EventEmitter<void>();

  blogForm: FormGroup;

  markdownText: string = '';

  thumbnailFile: File | null = null;

  imageURLs: string[] = [];

  additionalFiles: File[] = [];

  editorOptions: any;

  categories = [
    { label: 'Events', value: 'events' },
    { label: 'News', value: 'news' },
    { label: 'Backstage', value: 'backstage' },
    { label: 'Other', value: 'other' }
  ];

  constructor(private fb: FormBuilder, private markdownService: MarkdownService) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.blogForm.invalid || !this.thumbnailFile || !this.markdownText) {
      alert('mädchen bist du dumm oder kommst du jetzt klar?');

      return;
    }

    const post: Post = {
      title: this.blogForm.value.title,
      author: this.blogForm.value.author,
      description: this.blogForm.value.description,
      date: this.blogForm.value.date,
      category: this.blogForm.value.category
    }

    this.formSubmit.emit({
      post,
      thumbnail: this.thumbnailFile,
      markdown: new File([this.markdownText], `${crypto.randomUUID()}.md`, { type: 'text/markdown' }),
    });
  }

  onThumbnailChange(event: any) {
    this.thumbnailFile = event.target.files[0];

    this.thumbnailChange.emit();
  }

  onAdditionalFilesChange(event: any) {
    this.additionalFiles = Array.from(event.target.files);
  }

  ngOnInit() {
    this.editorOptions = {
      parser: (val: string) => this.markdownService.parse(val.trim())
    };

    if (this.postFormData) {
      this.blogForm.patchValue({
        title: this.postFormData.post.title,
        description: this.postFormData.post.description,
        date: this.postFormData.post.date,
        author: this.postFormData.post.author,
        category: this.postFormData.post.category
      });

      this.thumbnailFile = this.postFormData.thumbnail;

      this.markdownText = typeof this.postFormData.markdown === 'string' ? this.postFormData.markdown : '';
    }
  }
}
