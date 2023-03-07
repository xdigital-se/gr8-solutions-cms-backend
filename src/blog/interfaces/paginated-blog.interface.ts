export interface PaginatedBlog<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}
