import { async } from "rxjs";
import { AppwriteClient } from "./AppwriteClient";
import { CardData, Post, PostFormData, PostResource, PostResourceType, UploadResource } from "./models";

export const common = (client: AppwriteClient) => {
    const createPost = async (post: Post): Promise<string | null> => {
        try {
            const postId = await client.createPost(post);

            return postId.$id;
        } catch (error) {
            console.error('Error creating post:', error);

            return null
        }
    }

    const uploadFile = async (uploadResource: UploadResource, postID: string): Promise<PostResource | null> => {
        try {
            const fileRef = await client.uploadPostResource(uploadResource.file);

            const postResource: PostResource = {
                type: uploadResource.type,
                storage_link: fileRef.$id,
                post: postID
            };

            await client.createPostResource(postResource);

            return postResource;
        } catch (error) {
            console.error('Error uploading file:', error);

            return null;
        }
    }

    const submitPost = async (postFormData: PostFormData): Promise<string | null> => {

        const postResult = await createPost(postFormData.post)

        if (!postResult) {
            return null
        }

        const thumbnail = {
            type: 'post_thumbnail_storage_link' as PostResourceType,
            file: postFormData.thumbnail
        }

        const thumbnailResource = await uploadFile(thumbnail, postResult);

        if (!thumbnailResource) {
            return null
        }

        const markdown = {
            type: 'post_markdown_storage_link' as PostResourceType,
            file: postFormData.markdown as File
        }

        const markdownResource = await uploadFile(markdown, postResult);

        if (!markdownResource) {
            return null
        }

        return postResult;
    }

    const createCardData = async (post: any): Promise<CardData> => {
        const thumbnail = await downloadPostThumbnail(post.$id);

        return {
            title: post.title,
            description: post.description,
            thumbnail: thumbnail || 'https://placehold.co/300x200?text=No_image_found', // Fallback image if no thumbnail is found
            postID: post.$id
        };
    }

    const downloadPostThumbnail = async (postId: string): Promise<string | null> => {
        const resources = await client.getPostThumbnail(postId);

        if (resources.documents.length === 0) {
            console.warn('No thumbnail found for post:', postId);

            return null;
        }

        const thumbnailLink = resources.documents[0]['storage_link'];

        return await client.downloadPostResource(thumbnailLink);
    }

    const downloadPostMarkdown = async (postId: string): Promise<string | null> => {
        const resources = await client.getPostMarkdown(postId);

        if (resources.documents.length === 0) {
            console.warn('No markdown found for post:', postId);

            return null;
        }

        const markdownLink = resources.documents[0]['storage_link'];

        return await client.downloadPostResource(markdownLink);
    }

    const getAllPosts = async (active: boolean): Promise<CardData[]> => {
        try {
            const posts = (await client.getAllPosts())
                .documents.filter(post => active ? post['active'] : !post['active']);

            return await Promise.all(
                posts.map(post => createCardData(post))
            );

        } catch (error) {
            console.error('Fehler beim Laden der Posts:', error);

            return [];
        }
    }

    return {
        submitPost,
        getAllPosts,
        downloadPostThumbnail,
        downloadPostMarkdown,
    };
}