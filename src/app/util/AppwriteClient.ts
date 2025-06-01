import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Client, Storage, Databases, ID, Query } from 'appwrite';
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

    public async uploadPostResource(resource: File) {
        return this.storage.createFile(
            'l69',
            ID.unique(),
            resource
        )
    }

    public async downloadPostResource(storageLink: string) {
        return this.storage.getFileView(
            'l69',
            storageLink
        )
    }

    public async createPostResource(postResource: PostResource) {
        return this.databases.createDocument(
            'l69',
            'post_ressources',
            ID.unique(),
            postResource
        );
    }

    public async getPostThumbnail(postID: string) {
        return this.databases.listDocuments(
            'l69',
            'post_ressources',
            [
                Query.equal('post', postID),
                Query.equal('type', 'post_thumbnail_storage_link')
            ]
        );
    }

    public async getPostMarkdown(postID: string) {
        return this.databases.listDocuments(
            'l69',
            'post_ressources',
            [
                Query.equal('post', postID),
                Query.equal('type', 'post_markdown_storage_link')
            ]
        );
    }

    public async getPostPictures(postID: string) {
        return this.databases.listDocuments(
            'l69',
            'post_ressources',
            [
                Query.equal('post', postID),
                Query.equal('type', 'post_picture_storage_link')
            ]
        );
    }

    public async getPostRessources(postID: string) {
        return this.databases.listDocuments(
            'l69',
            'post_ressources',
            [
                Query.equal('post', postID)
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
