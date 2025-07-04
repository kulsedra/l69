import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { Post } from '../../lib/models';
import { AppwriteClient } from '../../lib/AppwriteClient';
import { common } from '../../lib/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-post',
  imports: [MarkdownComponent, MatCardModule, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  postId: string = '';

  post: Post | null = null;

  postThumbnail: string | null = null;

  postMarkdown: string | null = null;

  postAudio: string | null = null;

  client = new AppwriteClient();

  markdownService: MarkdownService;

  constructor(private route: ActivatedRoute, markdownService: MarkdownService) {
    this.markdownService = markdownService;
  }

  async ngOnInit(): Promise<void> {
    this.postId = this.route.snapshot.paramMap.get('id') || '';

    this.post = await this.client.getPost(this.postId) as unknown as Post;

    const { downloadPostThumbnail, downloadPostMarkdown, downloadPostAudio } = common(this.client);

    this.postThumbnail = await downloadPostThumbnail(this.postId);

    this.postMarkdown = await downloadPostMarkdown(this.postId);

    this.postAudio = await downloadPostAudio(this.postId);
  }
}
