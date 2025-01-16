import { Hono } from 'hono';
import { deleteBlog } from './delete.js';
import { getBlog } from './get.js';
import { postBlog } from './post.js';
import { putBlog } from './put.js';
import { getBlogs } from './gets.js';

export const blogs = new Hono()
  .route('/', getBlogs)
  .route('/:id', getBlog)
  .route('/:id', deleteBlog)
  .route('/:id', putBlog)
  .route('/', postBlog);
