import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { Post } from '../../util/models';
import { AppwriteClient } from '../../util/AppwriteClient';

@Component({
  selector: 'app-post',
  imports: [MarkdownComponent, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  postId: string = '';

  post: Post | null = null;

  postThumbnail: string | null = null;

  postMarkdown: string | null = null;

  client = new AppwriteClient();

  markdownService: MarkdownService;

  constructor(private route: ActivatedRoute, markdownService: MarkdownService) {
    this.markdownService = markdownService;
  }

  async ngOnInit(): Promise<void> {
    this.postId = this.route.snapshot.paramMap.get('id') || '';

    this.post = await this.client.getPost(this.postId) as unknown as Post;

    this.postThumbnail = await this.downloadPostThumbnail(this.postId);

    this.postMarkdown = await this.downloadPostMarkdown(this.postId);
  }

  private async downloadPostThumbnail(postId: string): Promise<string | null> {
    const resources = await this.client.getPostThumbnail(postId);

    if (resources.documents.length === 0) {
      console.warn('No thumbnail found for post:', postId);

      return null;
    }

    const thumbnailLink = resources.documents[0]['storage_link'];

    return await this.client.downloadPostResource(thumbnailLink);
  }

  private async downloadPostMarkdown(postId: string): Promise<string | null> {
    const resources = await this.client.getPostMarkdown(postId);

    if (resources.documents.length === 0) {
      console.warn('No markdown found for post:', postId);

      return null;
    }

    const markdownLink = resources.documents[0]['storage_link'];

    return await this.client.downloadPostResource(markdownLink);
  }
}
