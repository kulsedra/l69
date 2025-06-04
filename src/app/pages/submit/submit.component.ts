import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Post, PostResource, PostResourceType, UploadResource } from '../../lib/models';
import { AppwriteClient } from '../../lib/AppwriteClient';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularMarkdownEditorModule } from 'angular-markdown-editor';
import { FormsModule } from '@angular/forms';
import { MarkdownService } from 'ngx-markdown';
import { PostFormComponent } from "../../components/post-form/post-form.component";

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
    MatProgressSpinnerModule,
    AngularMarkdownEditorModule,
    FormsModule,
    PostFormComponent
  ],
})
export class SubmitComponent implements OnInit {
  imageURLs: string[] = [];
  editorOptions: any;
  markdownText: string = '';
  isLoading = false;
  client = new AppwriteClient();
  blogForm: FormGroup;
  thumbnailFile: File | null = null;
  additionalFiles: File[] = [];


  constructor(private fb: FormBuilder, private markdownService: MarkdownService) {
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

  onAdditionalFilesChange(event: any) {
    this.additionalFiles = Array.from(event.target.files);
  }

  async onSubmit() {
    if (this.blogForm.invalid || !this.thumbnailFile || !this.markdownText) {
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

    const thumbnail = {
      type: 'post_thumbnail_storage_link' as PostResourceType,
      file: this.thumbnailFile
    }

    const thumbnailResource = await this.uploadFile(thumbnail, postResult);

    if (!thumbnailResource) {
      alert('Error uploading thumbnail, check console for details');

      this.isLoading = false;

      return;
    }

    const markdown = {
      type: 'post_markdown_storage_link' as PostResourceType,
      file: new File([this.markdownText], `${crypto.randomUUID()}.md`, { type: "text/markdown" })
    }

    const markdownResource = await this.uploadFile(markdown, postResult);

    if (!markdownResource) {
      alert('Error uploading markdown, check console for details');

      this.isLoading = false;

      return;
    }

    this.isLoading = false;

    alert('Post created successfully!');
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

  ngOnInit() {
    this.editorOptions = {
      parser: (val: string) => this.markdownService.parse(val.trim())
    };
  }
}
