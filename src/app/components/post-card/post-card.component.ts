import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CardData } from '../../lib/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-card',
  imports: [MatCardModule, CommonModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input() card: CardData | null = null;
}
