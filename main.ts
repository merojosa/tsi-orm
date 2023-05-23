import { MySqlSchema, createMySqlClient } from "./src/mysql";

type OwnSchema = {
  Organization: "id" | "creation" | "users";
  User: "email" | "password" | "posts" | "organization";
  Post: "id" | "author";
  Category: "id" | "title";
  CategoriesOnPosts: "post";
};

const schema = {
  Organization: {
    id: {
      type: "int",
      primaryKey: true,
    },
    creation: {
      type: "date",
    },
    users: {
      type: "many-relation",
      table: "User",
    },
  },
  User: {
    email: { type: "varchar", length: 10, primaryKey: true },
    password: { type: "varchar", length: 20 },
    posts: {
      type: "many-relation",
      table: "Post",
    },
    organization: {
      type: "one-relation",
      table: "Organization",
      references: ["id"],
      fields: ["email"],
    },
  },
  Post: {
    id: {
      type: "int",
      primaryKey: true,
    },
    author: {
      type: "one-relation",
      table: "User",
      references: ["email"],
      fields: ["id"],
    },
  },
  Category: {
    id: {
      type: "int",
      primaryKey: true,
    },
    title: {
      type: "varchar",
    },
  },
  CategoriesOnPosts: {
    post: {
      type: "one-relation",
      table: "Post",
      references: ["id"],
      fields: ["post"],
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
  const result = await tsClient.Organization.findUnique({
    select: {
      id: true,
      creation: true,
      // users: {},
    },
    where: { id: 1 } as any,
  });

  console.log("Done!!!", result.id, result.creation);
};

method();
