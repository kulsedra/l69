import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppwriteClient } from '../../lib/AppwriteClient';
import { Router } from '@angular/router';
import { CardData, Category } from '../../lib/models';
import { PostCardComponent } from "../../components/post-card/post-card.component";
import { common } from '../../lib/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';

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
    PostCardComponent,
    MatFormField, 
    MatLabel,
    MatSelect,
    MatOption
  ],
  standalone: true,
})
export class HomeComponent implements OnInit {

  private client = new AppwriteClient();

  cardData: CardData[] = [];
  displayCards: CardData[] = [];
  category = Object.values(Category);

  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    const { getAllPosts } = common(this.client);

    this.cardData = await getAllPosts(true);
    this.cardData = this.cardData.reverse()
    this.displayCards = this.cardData;
  }

  goToPost(postID: string) {
    this.router.navigate(['/post', postID]);
  }
 onFilterChange(event: MatSelectChange): void {

  if (event.value == "all") {
    this.displayCards = this.cardData;
    return
  }

  this.displayCards = this.cardData.filter( (element) =>
  element.category == event.value)
  
}
}
