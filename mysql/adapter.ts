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

type MySqlColumn<Schema extends object> =
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

type MySqlTable<Schema extends object> = Record<string, MySqlColumn<Schema>>;

type MySqlSchema<Schema extends object> = {
  [Table in keyof Schema]: MySqlTable<Schema>;
};

const declareSchema = <TData extends MySqlSchema<TData>>(schema: TData) => {
  return schema satisfies MySqlSchema<TData>;
};

export default declareSchema;
