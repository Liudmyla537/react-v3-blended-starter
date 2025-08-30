export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface CreatePost {
  title: string;
  body: string;
}
