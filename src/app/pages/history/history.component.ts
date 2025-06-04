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
import { common } from '../../lib/common';

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
    const { getAllPosts } = common(this.client);

    this.cardData = await getAllPosts(false);
  }

  async activatePost(postID: string) {
    this.isLoading = true;

    try {
      await this.client.activatePost(postID);

      alert('Post activated successfully!');

      const { getAllPosts } = common(this.client);

      this.cardData = await getAllPosts(false);
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
}
