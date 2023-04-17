import { createMySqlClient, declareMySqlSchema } from "./src/mysql";

const schema = declareMySqlSchema({
  Organization: {
    id: {
      type: "int",
      primaryKey: true,
    },
    creation: {
      type: "date",
    },
    users: {
      type: "relation",
      relatedTable: "User",
      relatedColumns: ["email"],
    },
  },
  User: {
    email: { type: "varchar", length: 10, primaryKey: true },
    password: { type: "varchar", length: 20 },
    posts: {
      type: "relation",
      relatedColumns: ["id"],
      relatedTable: "Post",
    },
    organization: {
      type: "relation",
      relatedTable: "Organization",
      relatedColumns: ["id"],
    },
  },
  Post: {
    id: {
      type: "int",
      primaryKey: true,
    },
    author: {
      type: "relation",
      relatedTable: "User",
      relatedColumns: ["email"],
    },
  },
});

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
      users: {
        email: true,
        password: true,
      },
    },
    where: { id: 1 } as any,
  });

  console.log("BREAKPOINT", result.users.password);
};

method();
