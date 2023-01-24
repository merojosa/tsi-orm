/*
 * TODO:
 * Triggers
 * Constraints
 */

type MySqlDataTypes = "int" | "varchar" | "date";

type MySqlColumn<TableNames> =
  | {
      type: MySqlDataTypes;
      length: number;
      primayKey?: boolean;
      defaultValue?: string;
      unique?: boolean;
    }
  | {
      type: "relation";
      relatedTable: TableNames;
      relatedColumns: string[]; // TODO: The columns for the chosen table
    };

type MySqlEntity<TableNames> = Record<string, MySqlColumn<TableNames>>;

type MySqlSchema<TableNames extends string> = Record<
  TableNames,
  MySqlEntity<TableNames>
>;

export const schema: MySqlSchema<"User" | "Post"> = {
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
