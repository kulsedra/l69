import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Post, PostResource, PostResourceType, UploadResource } from '../../util/models';
import { AppwriteClient } from '../../util/AppwriteClient';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    CommonModule,
    MatProgressSpinnerModule
  ],
})
export class SubmitComponent {
  isLoading = false;
  client = new AppwriteClient();
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

  async onSubmit() {
    if (this.blogForm.invalid || !this.thumbnailFile || !this.markdownFile) {
      alert('mädchen bist du dumm oder kommst du jetzt klar?');
      return;
    }

    this.isLoading = true;

    const post: Post = {
      title: this.blogForm.value.title,
      author: this.blogForm.value.author,
      description: this.blogForm.value.description,
      date: this.blogForm.value.date,
      category: this.blogForm.value.category
    }

    const postResult = await this.createPost(post)

    if (!postResult) {
      alert('Error creating post, check console for details');

      this.isLoading = false;

      return;
    }

    const uploadResources = [
      {
        type: 'post_thumbnail_storage_link' as PostResourceType,
        file: this.thumbnailFile
      },
      {
        type: 'post_markdown_storage_link' as PostResourceType,
        file: this.markdownFile
      },
      ...this.additionalFiles.map(file => ({
        type: 'post_picture_storage_link' as PostResourceType,
        file
      }))
    ]

    const postResources = await this.uploadFiles(uploadResources, postResult);

    if (postResources.some(resource => resource === null)) {
      alert('Error uploading files, check console for details');

      this.isLoading = false;

      return;
    }

    this.isLoading = false;

    alert('Post created successfully!');

    console.log('Post created successfully:', postResult, postResources);

  }

  async createPost(post: Post): Promise<string | null> {
    try {
      const postId = await this.client.createPost(post);
      return postId.$id;
    } catch (error) {
      console.error('Error creating post:', error);
      return null
    }
  }

  async uploadFile(uploadResource: UploadResource, postID: string): Promise<PostResource | null> {
    try {
      const fileRef = await this.client.uploadPostResource(uploadResource.file);

      const postResource: PostResource = {
        type: uploadResource.type,
        storage_link: fileRef.$id,
        post: postID
      };

      await this.client.createPostResource(postResource);

      return postResource;
    } catch (error) {
      console.error('Error uploading file:', error);

      return null;
    }
  }

  async uploadFiles(uploadResources: UploadResource[], postID: string): Promise<(PostResource | null)[]> {
    try {
      return Promise.all(uploadResources.map(uploadResource => this.uploadFile(uploadResource, postID)));
    } catch (error) {
      console.error('Error uploading files:', error);
      return [];
    }
  }
}
