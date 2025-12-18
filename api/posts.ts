import { apiClient } from './client';
import { Post } from '@/types/Post';

/**
 * API response shape from backend
 */
interface BackendPostResponse {
  id: number;
  title: string;
  content: string;
  authorId: string; // Backend returns as string
  timePosted: string; // ISO string from backend
  upvotes: number;
  communityId: number;
  type: 'question' | 'advice';
  comments: any[]; // Always array from backend
  images: string[]; // Always array from backend (may be empty)
}

/**
 * Transform backend response to frontend Post type
 */
function transformPostResponse(backendPost: BackendPostResponse): Post {
  return {
    id: backendPost.id,
    title: backendPost.title,
    content: backendPost.content,
    authorId: backendPost.authorId, // Already string
    timePosted: new Date(backendPost.timePosted), // Convert ISO string to Date
    upvotes: backendPost.upvotes,
    communityId: backendPost.communityId,
    type: backendPost.type,
    comments: backendPost.comments || [], // Ensure array exists
    images: backendPost.images || [], // Ensure array exists
  };
}

/**
 * Get all posts
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await apiClient.get<BackendPostResponse[]>('/posts');
    return response.data.map(transformPostResponse);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  }
}

/**
 * Get posts by community ID
 */
export async function getPostsByCommunity(communityId: number): Promise<Post[]> {
  try {
    const response = await apiClient.get<BackendPostResponse[]>(`/communities/${communityId}/posts`);
    return response.data.map(transformPostResponse);
  } catch (error) {
    console.error(`Error fetching posts for community ${communityId}:`, error);
    throw error;
  }
}

/**
 * Get single post by ID
 */
export async function getPostById(postId: number): Promise<Post> {
  try {
    const response = await apiClient.get<BackendPostResponse>(`/posts/${postId}`);
    return transformPostResponse(response.data);
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    throw error;
  }
}

/**
 * Create post payload
 */
export interface CreatePostPayload {
  type: 'question' | 'advice';
  title: string;
  content: string;
  authorId: number; // Backend expects number
  communityId: number;
  images?: string[]; // base64 strings (pure base64, no data URL prefix)
}

/**
 * Create a new post
 */
export async function createPost(payload: CreatePostPayload): Promise<Post> {
  try {
    const response = await apiClient.post<BackendPostResponse>('/posts', payload);
    return transformPostResponse(response.data);
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

