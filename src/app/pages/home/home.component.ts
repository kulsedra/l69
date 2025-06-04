import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppwriteClient } from '../../lib/AppwriteClient';
import { Router } from '@angular/router';
import { CardData } from '../../lib/models';
import { PostCardComponent } from "../../components/post-card/post-card.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    PostCardComponent
  ],
  standalone: true,
})
export class HomeComponent implements OnInit {

  private client = new AppwriteClient();

  cardData: CardData[] = [];

  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    try {
      const posts = (await this.client.getAllPosts())
        .documents.filter(post => post['active']);

      this.cardData = await Promise.all(
        posts.map(post => this.createCardData(post))
      );

    } catch (error) {
      console.error('Fehler beim Laden der Posts:', error);
    }
  }

  goToPost(postID: string) {
    this.router.navigate(['/post', postID]);
  }

  private async createCardData(post: any): Promise<CardData> {
    const thumbnail = await this.downloadPostThumbnail(post.$id);

    return {
      title: post.title,
      description: post.description,
      thumbnail: thumbnail || 'https://placehold.co/300x200?text=No_image_found', // Fallback image if no thumbnail is found
      postID: post.$id
    };
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
}
