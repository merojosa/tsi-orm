import { MySqlSchema, createMySqlClient } from "./src/mysql";

type OwnSchema = {
  Author: "id" | "name" | "email" | "birth" | "books";
  Book: "id" | "name" | "author" | "authorId";
};

const schema = {
  Author: {
    id: { type: "int", primaryKey: true },
    name: { type: "varchar" },
    birth: { type: "date" },
    email: { type: "varchar" },
    books: {
      type: "many-relation",
      table: "Book",
    },
  },
  Book: {
    id: { type: "int", primaryKey: true },
    name: { type: "varchar" },
    authorId: { type: "int" },
    author: {
      type: "one-relation",
      table: "Author",
      fields: ["authorId"],
      references: ["id"],
    },
  },
} satisfies MySqlSchema<OwnSchema>;

// buildDatabaseFromSchema(
//   {
//     database: "typescript-orm",
//     host: "localhost",
//     password: "Pass1234!",
//     user: "jose_local",
//     port: 3306,
//   },
//   schema
// );

const tsClient = createMySqlClient(schema);

const method = async () => {
  const result = await tsClient.Author.findUnique({
    where: { id: 1 } as any,
    select: { id: true, books: { name: true } },
  });

  console.log("Done!!!", result);
};

method();
