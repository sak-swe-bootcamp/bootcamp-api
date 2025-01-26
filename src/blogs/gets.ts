import { Hono } from 'hono';
import { db } from '../lib/db.js';

export const getBlogs = new Hono().get('/', async (c) => {
  try {
    const blogs = await db.blog.findMany({
      select: {
        id: true,
        title: true,
        userName: true,
        userImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return c.json(blogs, 200);
  } catch (error) {
    return c.json({ error: 'ブログの取得中にエラーが発生しました' }, 500);
  }
});
