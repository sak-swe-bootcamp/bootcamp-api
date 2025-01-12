import { Hono } from "hono";
import { db } from "../lib/db.js";

export const deleteBlog = new Hono().delete(async (c) => {
	try {
		const id = c.req.param("id");
		await db.blog.delete({ where: { id } });
		return c.json({ message: "ブログを削除しました" }, 200);
	} catch (error) {
		if ((error as { code: string }).code === "P2025") {
			return c.json({ error: "ブログが見つかりません" }, 404);
		}
		return c.json({ error: "ブログ削除中にエラーが発生しました" }, 500);
	}
});
