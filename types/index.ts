export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
  draft?: boolean;
  readingTime: number;
  headings: Heading[];
  content: string;
}

export interface DBPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  readingTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
  draft?: boolean;
}
