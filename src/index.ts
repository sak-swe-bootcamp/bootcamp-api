import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./lib/db.js";
import type { Blog } from "@prisma/client";
const app = new Hono();

app.get("/blogs", async (c) => {
	const blogs = await db.blog.findMany();
	return c.json(blogs);
});

app.get("/blogs/:id", async (c) => {
	const id = c.req.param("id");
	const blog = await db.blog.findUnique({
		where: {
			id,
		},
	});
	return c.json(blog);
});

app.post("/blogs", async (c) => {
	const { title, content, userName, userImage } = await c.req.json();
	const blog: Blog = await db.blog.create({
		data: {
			title,
			content,
			userName,
			userImage,
		},
	});
	return c.json(blog);
});

app.put("/blogs/:id", async (c) => {
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
	return c.json(blog);
});

app.delete("/blogs/:id", async (c) => {
	const id = c.req.param("id");
	const blog: Blog = await db.blog.delete({
		where: {
			id,
		},
	});
	return c.json(blog);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
