import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { db } from "./lib/db.js";
import type { Blog } from "@prisma/client";
import { swaggerUI } from '@hono/swagger-ui';
import swaggerJSDoc from 'swagger-jsdoc';
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// Swagger設定
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'ブログ記事を管理するためのAPI',
    },
    paths: {
      '/blogs': {
        get: {
          summary: 'すべてのブログを取得',
          responses: {
            200: {
              description: 'ブログの一覧',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        content: { type: 'string' },
                        userName: { type: 'string' },
                        userImage: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: '新しいブログを作成',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    userName: { type: 'string' },
                    userImage: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: '新しいブログの作成',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      content: { type: 'string' },
                      userName: { type: 'string' },
                      userImage: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/blogs/{id}': {
        get: {
          summary: 'IDで指定されたブログを取得',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: '取得するブログのID',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: '指定されたIDのブログ',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      content: { type: 'string' },
                      userName: { type: 'string' },
                      userImage: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
});

const app = new Hono().basePath("/api");

// Swagger UIを表示
app.get('/ui', swaggerUI({ url: '/api/doc' }));

// OpenAPIの仕様を提供
app.get('/doc', (c) => {
  return c.json(swaggerSpec);
});

// ブログのAPI
app.get("/blogs", async (c) => {
  try {
    const blogs: Blog[] = await db.blog.findMany();
    return c.json(blogs, 200);
  } catch (error) {
    return c.json({ error: "ブログの取得中にエラーが発生しました" }, 500);
  }
});

app.get("/blogs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const blog: Blog | null = await db.blog.findUnique({
      where: { id },
    });
    if (!blog) {
      return c.json({ error: "ブログが見つかりません" }, 404);
    }
    return c.json(blog, 200);
  } catch (error) {
    return c.json({ error: "ブログの取得中にエラーが発生しました" }, 500);
  }
});

app.post("/blogs",
	zValidator('json',
    z.object({
      email: z.string().email(),
      name: z.string().max(10),
    })
	),
	async (c) => {
		try {
			const { title, content, userName, userImage } = await c.req.json();
			const blog: Blog = await db.blog.create({
				data: { title, content, userName, userImage },
			});
			return c.json(blog, 201);
		} catch (error) {
			return c.json({ error: "ブログ作成中にエラーが発生しました" }, 500);
		}
	}
);

app.put("/blogs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { title, content, userName, userImage } = await c.req.json();
    const blog: Blog = await db.blog.update({
      where: { id },
      data: { title, content, userName, userImage },
    });
    return c.json(blog, 200);
  } catch (error) {
    if ((error as any).code === "P2025") {
      return c.json({ error: "ブログが見つかりません" }, 404);
    }
    return c.json({ error: "ブログ更新中にエラーが発生しました" }, 500);
  }
});

app.delete("/blogs/:id", async (c) => {
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

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
