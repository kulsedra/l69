import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppwriteClient } from '../../lib/AppwriteClient';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostCardComponent } from "../../components/post-card/post-card.component";

interface CardData {
  title: string;
  description: string;
  thumbnail: string;
  postID: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  imports: [
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    PostCardComponent
],
  standalone: true,
})
export class HistoryComponent implements OnInit {

  isLoading = false;

  private client = new AppwriteClient();

  cardData: CardData[] = [];

  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.getAllPosts();
  }

  async getAllPosts() {
    try {
      const posts = (await this.client.getAllPosts())
        .documents.filter(post => !post['active']);

      this.cardData = await Promise.all(
        posts.map(post => this.createCardData(post))
      );

    } catch (error) {
      console.error('Fehler beim Laden der Posts:', error);
    }
  }


  async activatePost(postID: string) {
    this.isLoading = true;

    try {
      await this.client.activatePost(postID);

      alert('Post activated successfully!');

      await this.getAllPosts();
    } catch (error) {
      alert('Error activating post. Check console for details.');

      console.error('Error activating post:', error);
    } finally {
      this.isLoading = false;
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
      thumbnail: thumbnail || 'assets/default-thumbnail.jpg', // Fallback image if no thumbnail is found
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
