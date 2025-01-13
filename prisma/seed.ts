import { faker } from "@faker-js/faker";
import { db } from "../src/lib/db.js";

async function fetchMarkdownContent() {
  const response = await fetch(
    "https://jaspervdj.be/lorem-markdownum/markdown.txt",
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch markdown content: ${response.statusText}`);
  }
  return response.text();
}

async function main() {
  console.log("Seeding database...");

  const blogData = await Promise.all(
    Array.from({ length: 30 }).map(async () => ({
      title: faker.lorem.sentence(),
      content: await fetchMarkdownContent(),
      published: faker.datatype.boolean(),
      userName: faker.person.firstName(),
      userImage: faker.image.avatar(),
      createdAt: faker.date.past(),
    })),
  );

  for (const data of blogData) {
    await db.blog.create({
      data,
    });
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
