/* Modeled after lab 5, defines a post type and a default */

export interface Post {
    id: number,
    type: string,
    title: string,
    authorId: number,
    communityId: number,
    upvotes: number,
    timePosted: Date,
    content: string,
}

export const defaultPost: Post = {
    id: 0,
    type: 'question',
    title: 'Default question?',
    authorId: 0,
    communityId: 0,
    upvotes: 10,
    timePosted: new Date(),
    content: "This is the default post",
};
