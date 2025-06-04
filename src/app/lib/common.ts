import { AppwriteClient } from "./AppwriteClient";
import { Post, PostFormData, PostResource, PostResourceType, UploadResource } from "./models";

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

    return {
        submitPost
    };
}