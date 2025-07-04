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
    const { downloadPostMarkdown } = common(this.client);

    const markdown = await downloadPostMarkdown(this.postId);

    if (!markdown) {
      return null;
    }

    try {
      const data = await this.http.get(markdown, { responseType: 'text' }).toPromise();

      return data || null;
    } catch (err) {
      console.error('Error loading markdown file:', err);
      return null;
    }
  }

  async downloadThumbnail(): Promise<{ file: File, fileURL: string } | null> {
    const { downloadPostThumbnail } = common(this.client);

    const thumbnail = await downloadPostThumbnail(this.postId);

    if (!thumbnail) {
      return null;
    }

    try {
      const blob = await this.http.get(thumbnail, { responseType: 'blob' }).toPromise();

      const file = new File([blob!], 'thumbnail', { type: blob?.type || 'image/*' });

      return { file: file, fileURL: thumbnail };
    } catch (err) {
      console.error('Fehler beim Laden des Bildes:', err);

      return null;
    }
  }

  async downloadAudio(): Promise<File | null> {
    const { downloadPostAudio } = common(this.client);

    const audioUrl = await downloadPostAudio(this.postId);

    if (!audioUrl) {
      return null;
    }

    try {
      const blob = await this.http.get(audioUrl, { responseType: 'blob' }).toPromise();

      return new File([blob!], 'audio.webm', { type: 'audio/webm' });
    } catch (err) {
      console.error('Fehler beim Laden der Audiodatei:', err);

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

      const audio = await this.downloadAudio();

      this.postFormData = {
        post: post as unknown as Post,
        thumbnail: downloadThumbnailResult.file,
        markdown: markdownContent,
        audio: audio || undefined
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
