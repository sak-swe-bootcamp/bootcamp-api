import { faker } from '../src/utils/faker.js';
import { db } from '../src/lib/db.js';

async function main() {
  console.log('Seeding database...');

  const blogData = Array.from({ length: 30 }).map(() => ({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    published: faker.datatype.boolean(),
    userName: faker.person.firstName(),
    userImage: faker.image.avatar(),
    createdAt: faker.date.past(),
  }));

  for (const data of blogData) {
    await db.blog.create({
      data,
    });
  }

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
