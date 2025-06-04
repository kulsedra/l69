import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { AppwriteClient } from '../../../lib/AppwriteClient';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-delete',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent implements OnInit {
  isLoading = false;

  postId: string = '';

  client = new AppwriteClient();

  constructor(private route: ActivatedRoute) { }

  async inactivatePost() {
    this.isLoading = true;

    try {
      await this.client.inactivatePost(this.postId);

      alert('Post inactivated successfully!');

      window.location.href = '/';
    }
    catch (error) {
      alert('Error inactivating post. Check console for details.');

      console.error('Error inactivating post:', error);
    }
    finally {
      this.isLoading = false;
    }
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
  }
}
