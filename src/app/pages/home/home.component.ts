import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppwriteClient } from '../../util/AppwriteClient';

interface CardData {
  title: string;
  description: string;
  thumbnail: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  standalone: true,
})
export class HomeComponent implements OnInit {
  private client = new AppwriteClient();

  cardData: CardData[] = [];

  async ngOnInit(): Promise<void> {
    try {
      const posts = await this.client.getAllPosts();

      this.cardData = await Promise.all(
        posts.documents.map(post => this.createCardData(post))
      );

    } catch (error) {
      console.error('Fehler beim Laden der Posts:', error);
    }
  }

  private async createCardData(post: any): Promise<CardData> {
    const thumbnail = await this.downloadPostThumbnail(post.$id);

    return {
      title: post.title,
      description: post.description,
      thumbnail: thumbnail || 'assets/default-thumbnail.jpg', // Fallback image if no thumbnail is found
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
