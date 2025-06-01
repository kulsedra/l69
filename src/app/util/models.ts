export interface Post {
    author: string;
    date: string;
    title: string;
    description: string;
    category: 'events' | 'news' | 'backstage' | 'other';
}

export interface PostResource {
    type: 'post_thumbnail_storage_link' | 'post_picture_storage_link' | 'post_markdown_storage_link';
    storage_link: string;
    post: Post;
}