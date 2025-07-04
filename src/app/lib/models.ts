export interface Post {
    author: string;
    date: string;
    title: string;
    description: string;
    category: Category;
}

export type PostResourceType = 'post_thumbnail_storage_link' | 'post_picture_storage_link' | 'post_markdown_storage_link' | 'post_audio_storage_link';

export interface PostResource {
    type: PostResourceType;
    storage_link: string;
    post: string;
}

export interface UploadResource {
    type: PostResourceType;
    file: File;
}

export interface CardData {
    title: string;
    description: string;
    thumbnail: string;
    postID: string;
    category?: Category;

}

export interface PostFormData {
    post: Post;
    thumbnail: File;
    audio?: File;
    markdown: File | string;
}

export enum Category {
    Events = 'events',
    News = 'news',
    Backstage = 'backstage',
    Other = 'other'
}