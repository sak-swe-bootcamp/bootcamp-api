import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { blogs } from "./blogs/route.js";
import { swagger } from "./swagger/index.js";

const app = new Hono().basePath("/api");

const route = app.route("/blogs", blogs).route("/swagger", swagger);

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

serve({
	fetch: app.fetch,
	port: 3000,
});
