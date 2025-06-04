import { Component, OnInit } from '@angular/core';
import { Post, PostFormData, PostResourceType } from '../../../lib/models';
import { AppwriteClient } from '../../../lib/AppwriteClient';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PostFormComponent } from "../../../components/post-form/post-form.component";
import { common } from '../../../lib/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [
    PostFormComponent,
    CommonModule
  ],
})
export class EditComponent implements OnInit {
  postId: string = '';

  postFormData: PostFormData | null = null;

  thumbnailPreviewUrl: string | null = null;

  isLoading = false;

  client = new AppwriteClient();

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  onThumbnailChange() {
    this.thumbnailPreviewUrl = null;
  }

  async onSubmit(postFormData: PostFormData) {
    this.isLoading = true;

    const { submitPost } = common(this.client);

    const postRef = await submitPost(postFormData);

    if (!postRef) {
      alert('Error submitting post, check console for details');

      this.isLoading = false;

      return;
    }

    // Inactivate old post

    try {
      await this.client.inactivatePost(this.postId);
    }
    catch (error) {
      console.error('Error inactivating old post:', error);

      alert('Error inactivating old post, check console for details');

      return;
    }
    finally {
      this.isLoading = false;
    }

    window.location.href = `/post/${postRef}`;
  }

  async downloadMarkdownContent(): Promise<string | null> {
    const markdown = await this.client.getPostMarkdown(this.postId);

    if (!markdown || markdown.documents.length === 0) {
      console.error('No markdown found for post:', this.postId);

      return null;
    }

    const markdownFile = await this.client.downloadPostResource(markdown.documents[0]['storage_link']);

    if (!markdownFile) {
      console.error('No file URL found for markdown:', markdown.documents[0]['storage_link']);

      return null;
    }

    try {
      const data = await this.http.get(markdownFile, { responseType: 'text' }).toPromise();

      return data || null;
    } catch (err) {
      console.error('Error loading markdown file:', err);
      return null;
    }
  }

  async downloadThumbnail(): Promise<{ file: File, fileURL: string } | null> {
    const thumbnail = await this.client.getPostThumbnail(this.postId);

    if (!thumbnail || thumbnail.documents.length === 0) {
      console.error('No thumbnail found for post:', this.postId);
      return null;
    }

    const fileURL = await this.client.downloadPostResource(thumbnail.documents[0]['storage_link']);

    if (!fileURL) {
      console.error('No file URL found for thumbnail:', thumbnail.documents[0]['storage_link']);
      return null;
    }

    try {
      const blob = await this.http.get(fileURL, { responseType: 'blob' }).toPromise();

      const file = new File([blob!], 'thumbnail', { type: blob?.type || 'image/png' });

      return { file, fileURL };
    } catch (err) {
      console.error('Fehler beim Laden des Bildes:', err);
      return null;
    }
  }

  async loadPost(postId: string) {
    this.isLoading = true;

    try {
      const post = await this.client.getPost(postId);

      if (!post) {
        alert('Post not found');

        return;
      }

      const downloadThumbnailResult = await this.downloadThumbnail();

      if (!downloadThumbnailResult) {
        alert('Error loading thumbnail, check console for details');

        return;
      }

      this.thumbnailPreviewUrl = downloadThumbnailResult.fileURL;

      const markdownContent = await this.downloadMarkdownContent();

      if (markdownContent === null) {
        alert('Error loading markdown content, check console for details');

        return;
      }

      this.postFormData = {
        post: post as unknown as Post,
        thumbnail: downloadThumbnailResult.file,
        markdown: markdownContent
      }
    } catch (error) {
      console.error('Error loading post:', error);

      alert('Error loading post, check console for details');
    } finally {
      this.isLoading = false;
    }
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') || '';

    if (this.postId) {
      this.loadPost(this.postId);
    }
  }
}
