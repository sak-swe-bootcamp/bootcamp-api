import type { Blog } from '@prisma/client/edge';
import { Hono } from 'hono';
import { db } from '../lib/db.js';

export const postBlog = new Hono().post(async (c) => {
	try {
		const { title, content, userName, userImage } = await c.req.json();
		const blog: Blog = await db.blog.create({
			data: { title, content, userName, userImage },
		});
		return c.json(blog, 201);
	} catch (error) {
		return c.json({ error: 'ブログ作成中にエラーが発生しました' }, 500);
	}
});
