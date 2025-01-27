import { zValidator } from '@hono/zod-validator';
import type { Blog } from '@prisma/client/edge';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../lib/db.js';

const schema = z.object({
  title: z.string().nonempty(),
  content: z.string().nonempty(),
  userName: z.string().nonempty(),
  userImage: z.string().optional(),
});

const DEFAULT_USER_IMAGE_URL = 'https://avatars.githubusercontent.com/u/42';

export const postBlog = new Hono().post(
  zValidator('json', schema, (result, c) => {
    if (!result.success) {
      return c.text('paramsが正しくありません', 400);
    }
  }),
  async (c) => {
    try {
      const { title, content, userName, userImage } = c.req.valid('json');
      const blog: Blog = await db.blog.create({
        data: {
          title,
          content,
          userName,
          userImage: userImage || DEFAULT_USER_IMAGE_URL,
        },
      });
      return c.json(blog, 201);
    } catch (error) {
      return c.json({ error: 'ブログ作成中にエラーが発生しました' }, 500);
    }
  },
);
