import { Component } from '@angular/core';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-post',
  imports: [MarkdownComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

  markdownService: MarkdownService;

  constructor(markdownService: MarkdownService) {
    this.markdownService = markdownService;
  }

  testPost = {
    author: "Lukas",
    date: "2025-06-01",
    title: "Biercolai Festli",
    description: "Fest zum fiire, dass d Nina zrugg chunt",
    category: "events"
  }

  testPostThumbnail = {
    type: "post_thumbnail_storage_link",
    storage_link: "assets/post.jpg",
    post: this.testPost
  }

  testPostContent = {
    type: "post_markdown_storage_link",
    storage_link: "assets/post.md",
    post: this.testPost
  }

  get item() {
    return {
      post: this.testPost,
      thumbnail: this.testPostThumbnail,
      content: this.testPostContent
    };
  }
}
