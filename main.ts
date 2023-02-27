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

const tsClient = createMySqlClient(schema);
