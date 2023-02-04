import { buildDatabaseFromSchema, MySqlDbConfig } from "./builder";

export type MySqlDataTypes = "int" | "varchar" | "date";

type InferRelation<
  Schema extends object,
  Tables
> = Tables extends infer RelatedTableVariable extends keyof Schema
  ? {
      relatedTable: RelatedTableVariable;
      relatedColumns: Array<keyof Schema[RelatedTableVariable]>;
    }
  : boolean;

export type MySqlColumn<Schema extends object> =
  | {
      type: MySqlDataTypes;
      length?: number;
      primayKey?: boolean;
      defaultValue?: string;
      unique?: boolean;
    }
  | ({
      type: "relation";
    } & InferRelation<Schema, keyof Schema>);

export type MySqlTable<Schema extends object> = Record<
  string,
  MySqlColumn<Schema>
>;

export type MySqlSchema<Schema extends object> = {
  [Table in keyof Schema]: MySqlTable<Schema>;
};

export const declareMySqlSchema = async <TData extends MySqlSchema<TData>>(
  databaseConfig: MySqlDbConfig,
  schema: TData
) => {
  buildDatabaseFromSchema(databaseConfig, schema);
  return schema satisfies MySqlSchema<TData>;
};
