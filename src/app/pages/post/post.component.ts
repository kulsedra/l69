import { Component } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

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

  get item() {
    return {
      post: this.testPost,
      thumbnail: this.testPostThumbnail
    };
  }
}
