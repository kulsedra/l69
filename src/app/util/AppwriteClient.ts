import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Client, Storage, Databases, ID } from 'appwrite';
import { Post, PostResource } from './models';

@Injectable({
    providedIn: 'root'
})
export class AppwriteClient {

    private readonly client = new Client();

    private readonly storage = new Storage(this.client);

    private readonly databases = new Databases(this.client);

    constructor() {
        this.client
            .setEndpoint(environment.appwriteEndpoint)
            .setProject(environment.appwriteProjectId);
    }

    public async uploadPostResource(postResource: PostResource, file: File) {
        return this.storage.createFile(
            'l69',
            postResource.storage_link,
            file
        )
    }

    public async downloadPostResource(postResource: PostResource) {
        return this.storage.getFileView(
            'l69',
            postResource.storage_link
        )
    }

    public async createPostResource(postResource: PostResource) {
        return this.databases.createDocument(
            'l69',
            'post_resources',
            ID.unique(),
            postResource
        );
    }

    public async getPostRessources(postID: string) {
        return this.databases.listDocuments(
            'l69',
            'post_resources',
            [
                `post=${postID}`
            ]
        );
    }

    public async createPost(post: Post) {
        return this.databases.createDocument(
            'l69',
            'posts',
            ID.unique(),
            post
        );
    }

    public async getPost(postID: string) {
        return this.databases.getDocument(
            'l69',
            'posts',
            postID
        )
    }

    public async getAllPosts() {
        return this.databases.listDocuments(
            'l69',
            'posts',
            []
        )
    }
}
