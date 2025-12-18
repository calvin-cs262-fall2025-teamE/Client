/* Modeled after lab 5, defines a post type and a default */

export interface Comment {
    id: number,
    authorId: number,
    text: string,
    timePosted: Date,
    replies?: Comment[],
    likes: number,
    retweets: number,
    shares: number,
    likedBy: number[],
    retweetedBy: number[],
}

export interface Post {
    id: number,
    type: string,
    title: string,
    authorId: string,
    communityId: number,
    upvotes: number,
    timePosted: Date,
    content: string,
    likes?: number,
    retweets?: number,
    shares?: number,
    likedBy?: number[], // Array of user IDs who liked this post
    retweetedBy?: number[], // Array of user IDs who retweeted this post
    comments: Comment[], // Array of comments on this post
    images?: string[], // Array of image URLs (optional, backward compatible)
}

export const defaultPost: Post = {
    id: 0,
    type: 'question',
    title: 'Default question?',
    authorId: '0',
    communityId: 0,
    upvotes: 10,
    timePosted: new Date(),
    content: "This is the default post",
    likes: 0,
    retweets: 0,
    shares: 0,
    likedBy: [],
    retweetedBy: [],
    comments: [],
};
