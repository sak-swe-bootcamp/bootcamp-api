import type { Blog } from '@prisma/client/edge';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import { db } from '../lib/db.js';

const schema = z.object({
  title: z.string(),
  content: z.string(),
  userName: z.string(),
  userImage: z.string(),
});

export const postBlog = new Hono().post(
  validator('form', (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.text('paramsが正しくありません', 400);
    }
    return parsed.data;
  }),
  async (c) => {
    try {
      const { title, content, userName, userImage } = c.req.valid('form');
      const blog: Blog = await db.blog.create({
        data: { title, content, userName, userImage },
      });
      return c.json(blog, 201);
    } catch (error) {
      return c.json({ error: 'ブログ作成中にエラーが発生しました' }, 500);
    }
  },
);
