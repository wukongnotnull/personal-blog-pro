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

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
  draft?: boolean;
}
