export interface Reply {
    id: number,
    authorId: number,
    communityId: number,
    postId: number,
    upvotes: number,
    timePosted: Date,
    content: string,
}

export const defaultReply = {
    id: 0,
    authorId: 0,
    communityId: 0,
    postId: 0,
    upvotes: 3,
    timePosted: new Date(),
    content: "This idea is of default value",
}