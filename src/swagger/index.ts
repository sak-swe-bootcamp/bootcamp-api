import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Blog API",
			version: "1.0.0",
			description: "ブログ記事を管理するためのAPI",
		},
		paths: {
			"/blogs": {
				get: {
					summary: "すべてのブログを取得",
					responses: {
						200: {
							description: "ブログの一覧",
							content: {
								"application/json": {
									schema: {
										type: "array",
										items: {
											type: "object",
											properties: {
												id: { type: "string" },
												title: { type: "string" },
												content: { type: "string" },
												userName: { type: "string" },
												userImage: { type: "string" },
											},
										},
									},
								},
							},
						},
					},
				},
				post: {
					summary: "新しいブログを作成",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										title: { type: "string" },
										content: { type: "string" },
										userName: { type: "string" },
										userImage: { type: "string" },
									},
								},
							},
						},
					},
					responses: {
						201: {
							description: "新しいブログの作成",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											id: { type: "string" },
											title: { type: "string" },
											content: { type: "string" },
											userName: { type: "string" },
											userImage: { type: "string" },
										},
									},
								},
							},
						},
					},
				},
			},
			"/blogs/{id}": {
				get: {
					summary: "IDで指定されたブログを取得",
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							description: "取得するブログのID",
							schema: {
								type: "string",
							},
						},
					],
					responses: {
						200: {
							description: "指定されたIDのブログ",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											id: { type: "string" },
											title: { type: "string" },
											content: { type: "string" },
											userName: { type: "string" },
											userImage: { type: "string" },
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

export const swagger = new Hono()
	.get("/ui", swaggerUI({ url: "/api/swagger/doc" }))
	.get("/doc", (c) => {
		return c.json(swaggerSpec);
	});
