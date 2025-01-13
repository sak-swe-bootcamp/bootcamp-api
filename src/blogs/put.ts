import type { Blog } from '@prisma/client/edge';
import { Hono } from 'hono';
import { db } from '../lib/db.js';

export const putBlog = new Hono().put(async (c) => {
	try {
		const id = c.req.param('id');
		const { title, content, userName, userImage } = await c.req.json();
		const blog: Blog = await db.blog.update({
			where: { id },
			data: { title, content, userName, userImage },
		});
		return c.json(blog, 200);
	} catch (error) {
		if ((error as any).code === 'P2025') {
			return c.json({ error: 'ブログが見つかりません' }, 404);
		}
		return c.json({ error: 'ブログ更新中にエラーが発生しました' }, 500);
	}
});
