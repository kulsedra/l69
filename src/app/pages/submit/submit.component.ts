import { Component } from '@angular/core';
import { PostFormData, PostResourceType } from '../../lib/models';
import { AppwriteClient } from '../../lib/AppwriteClient';
import { PostFormComponent } from "../../components/post-form/post-form.component";
import { common } from '../../lib/common';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css'],
  imports: [
    PostFormComponent
  ],
})
export class SubmitComponent {
  isLoading = false;

  client = new AppwriteClient();

  async onSubmit(postFormData: PostFormData) {
    this.isLoading = true;

    const { submitPost } = common(this.client);

    const postRef = await submitPost(postFormData);

    if (!postRef) {
      alert('Error submitting post, check console for details');

      this.isLoading = false;

      return;
    }

    this.isLoading = false;

    window.location.href = `/post/${postRef}`;
  }
}
