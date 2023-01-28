import { createMySqlClient, declareMySqlSchema } from "./mysql";

const schema = declareMySqlSchema({
  ["identity_manager"]: {
    id: {
      type: "int",
      length: 1,
    },
    account: {
      length: 1,
      type: "date",
    },
    identity_tests: {
      type: "relation",
      relatedTable: "identity_test",
      relatedColumns: ["key"],
    },
  },
  ["User"]: {
    email: { type: "int", length: 10 },
    password: { type: "date", length: 20 },
    login: {
      type: "relation",
      relatedTable: "identity_manager",
      relatedColumns: ["account", "id"],
    },
  },
  Post: {
    author: {
      type: "relation",
      relatedTable: "User",
      relatedColumns: ["email", "password"],
    },
  },
  identity_test: {
    test: {
      type: "int",
      length: 20,
    },
    key: {
      type: "varchar",
      length: 24,
    },
  },
});

const tsClient = createMySqlClient(schema);

const result = tsClient.User.findUnique({
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
