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
import { common } from '../../lib/common';

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
    const { getAllPosts } = common(this.client);

    this.cardData = await getAllPosts(true);
  }

  goToPost(postID: string) {
    this.router.navigate(['/post', postID]);
  }
}
