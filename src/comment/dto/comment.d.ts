// Base interface for comment data
export interface BaseCommentData {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for comment including user and post associations
// export interface Comment extends BaseCommentData {
//   PostId: number;
//   ParentId?: number;
//   UserId: number;
// }

// Interface for comment data used in responses
export interface Comment extends BaseCommentData {
  UserId: number;
  PostId: number;
  ParentId: number | null;
  replies: Comment[];
}

export interface CommentResponse {
  comment?: Comment;
  message?: string;
}

// Response type for getting comments by post ID
export interface CommentsResult {
  comments?: Comment[];
}
