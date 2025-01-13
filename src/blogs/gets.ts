import type { Blog } from '@prisma/client/edge';
import { db } from '../lib/db.js';
import { Hono } from 'hono';

export const getBlogs = new Hono().get('/', async (c) => {
	try {
		const blogs: Blog[] = await db.blog.findMany();
		return c.json(blogs, 200);
	} catch (error) {
		return c.json({ error: 'ブログの取得中にエラーが発生しました' }, 500);
	}
});
