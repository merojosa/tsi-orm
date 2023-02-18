import { createMySqlClient, declareMySqlSchema } from "./src/mysql";

const schema = declareMySqlSchema(
  {
    host: "",
    user: "",
    password: "",
    database: "",
  },
  {
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
  }
);

const tsClient = createMySqlClient(schema);

/* const result = tsClient.User.findUnique({
  select: {
    email: true,
    login: {
      identity_tests: {
        key: true,
        test: true,
      },
    },
  },
  where: {
    email: 1,
    password: new Date(),
    login: {
      id: 1,
      account: new Date(),
      identity_tests: {
        test: 1,
        key: "ejejej",
      },
    },
  },
});
 */
