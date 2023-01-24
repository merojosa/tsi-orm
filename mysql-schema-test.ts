/*
 * TODO:
 * Triggers
 * Constraints
 */

type MySqlDataTypes = "int" | "varchar" | "date";

type MySqlColumn =
  | {
      type: MySqlDataTypes;
      length: number;
      primayKey?: boolean;
      defaultValue?: string;
      unique?: boolean;
    }
  | {
      type: "relation";
      relatedTable: string; // TODO: Existing tables that the user entered
      relatedColumns: string[]; // TODO: The columns for the chosen table
    };

type MySqlEntity = Record<string, MySqlColumn>;

type MySqlSchema = Record<string, MySqlEntity>;

export const schema: MySqlSchema = {
  User: {
    email: { type: "int", length: 10 },
    password: { type: "date", length: 20 },
  },
  Post: {
    author: {
      type: "relation",
      relatedTable: "User",
      relatedColumns: ["email", "password"],
    },
  },
};
