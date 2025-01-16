import type { Blog } from '@prisma/client/edge';
import { Hono } from 'hono';
import { db } from '../lib/db.js';

export const getBlog = new Hono().get(async (c) => {
  try {
    const id = c.req.param('id');
    const blog: Blog | null = await db.blog.findUnique({
      where: { id },
    });
    if (!blog) {
      return c.json({ error: 'ブログが見つかりません' }, 404);
    }
    return c.json(blog, 200);
  } catch (error) {
    return c.json({ error: 'ブログの取得中にエラーが発生しました' }, 500);
  }
});
