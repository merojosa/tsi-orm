/*
 * TODO:
 * Triggers
 * Constraints
 */

export type MySqlDataTypes = "int" | "varchar" | "date";

type TestRelation<
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
    } & TestRelation<Schema, keyof Schema>);

type MySqlTable<Schema extends object, Table extends keyof Schema> = Record<
  string,
  MySqlColumn<Schema, Table>
>;

type MySqlSchema<Schema extends object> = {
  [Table in keyof Schema]: MySqlTable<Schema, Table>;
};

const declareSchema = <TData extends MySqlSchema<TData>>(
  schema: TData
): MySqlSchema<TData> => {
  return schema;
};

const schema = declareSchema({
  User: {
    email: {
      length: 1,
      type: "varchar",
      defaultValue: "false",
    },
    password: {
      length: 1,
      type: "int",
    },
    posts: {
      type: "relation",
      relatedTable: "Post",
      relatedColumns: ["id", "title"],
    },
  },
  Post: {
    id: { type: "int", length: 8, primayKey: true },
    title: {
      type: "varchar",
      length: 400,
    },
    author: {
      type: "relation",
      relatedTable: "User",
      relatedColumns: ["email"],
    },
  },
});
