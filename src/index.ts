import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./lib/db.js";
import type { Blog } from "@prisma/client";

const app = new Hono().basePath("/api");

app.get("/blogs", async (c) => {
	try {
		const blogs: Blog[] = await db.blog.findMany();
		return c.json(blogs, 200);
	} catch (error) {
		return c.json({ error: "Error fetching blogs" }, 500);
	}
});

app.get("/blogs/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const blog: Blog | null = await db.blog.findUnique({
			where: {
				id,
			},
		});
		if (!blog) {
			return c.json({ error: "Blog not found" }, 404);
		}
		return c.json(blog, 200);
	} catch (error) {
		return c.json({ error: "Error fetching blog" }, 500);
	}
});

app.post("/blogs", async (c) => {
	try {
		const { title, content, userName, userImage } = await c.req.json();
		const blog: Blog = await db.blog.create({
			data: {
				title,
				content,
				userName,
				userImage,
			},
		});
		return c.json(blog, 201);
	} catch (error) {
		return c.json({ error: "Error creating blog" }, 500);
	}
});

app.put("/blogs/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const { title, content, userName, userImage } = await c.req.json();
		const blog: Blog = await db.blog.update({
			where: {
				id,
			},
			data: {
				title,
				content,
				userName,
				userImage,
			},
		});
		return c.json(blog, 200);
	} catch (error) {
		if ((error as any).code === "P2025") {
			return c.json({ error: "Blog not found" }, 404);
		}
		return c.json({ error: "Error updating blog" }, 500);
	}
});

app.delete("/blogs/:id", async (c) => {
	try {
		const id = c.req.param("id");
		await db.blog.delete({
			where: {
				id,
			},
		});
		return c.json({ message: "Blog deleted" }, 200);
	} catch (error) {
		if ((error as { code: string }).code === "P2025") {
			return c.json({ error: "Blog not found" }, 404);
		}
		return c.json({ error: "Error deleting blog" }, 500);
	}
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
