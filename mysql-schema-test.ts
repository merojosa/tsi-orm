/*
 * TODO:
 * Triggers
 * Constraints
 */

export type MySqlDataTypes = "int" | "varchar" | "date";

type InferRelation<
  Schema extends object,
  TData
> = TData extends infer RelatedTableVariable extends keyof Schema
  ? {
      relatedTable: RelatedTableVariable;
      relatedColumns: Array<keyof Schema[RelatedTableVariable]>;
    }
  : boolean;

type MySqlColumn<Schema extends object, Table extends keyof Schema> =
  | {
      type: MySqlDataTypes;
      length: number;
      primayKey?: boolean;
      defaultValue?: string;
      unique?: boolean;
    }
  | ({
      type: "relation";
    } & InferRelation<Schema, keyof Schema>);

type MySqlTable<Schema extends object, Table extends keyof Schema> = Record<
  string,
  MySqlColumn<Schema, Table>
>;

type MySqlSchema<Schema extends object> = {
  [Table in keyof Schema]: MySqlTable<Schema, Table>;
};

const declareSchema = <TData extends MySqlSchema<TData>>(schema: TData) => {
  return schema satisfies MySqlSchema<TData>;
};

export const schema = declareSchema({
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
