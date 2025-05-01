
export interface TweetData {
  content: string;
  id?: string;
  created_at?: string;
  user_id?: string;
}

export interface GenerationOptions {
  topic: string;
  count: number;
  user_id?: string;
}
