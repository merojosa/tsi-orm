export type MySqlDataType = "int" | "varchar" | "date";
export type MySqlRelationType = "one-relation" | "many-relation";
/*
 * It will infer the relation looking at the schema. That means when the
 * table changes, the references has to belong to that particular table.
 *
 * Only one relations can have references and fields
 **/
type MySqlOneRelation<
  TSchema extends object,
  TTables,
  TChosenTable extends keyof TSchema
> = TTables extends infer TableVariable extends keyof TSchema
  ? {
      table: TableVariable;
      references: Array<keyof TSchema[TableVariable]>;
      fields: Array<keyof TSchema[TChosenTable]>;
    }
  : never;

export type MySqlColumnPrimitive = {
  type: MySqlDataType;
  length?: number;
  primaryKey?: boolean;
  defaultValue?: string;
  unique?: boolean;
};

export type MySqlColumnDefinition<
  TSchema extends object,
  TChosenTable extends keyof TSchema
> =
  | MySqlColumnPrimitive
  | {
      type: Extract<MySqlRelationType, "many-relation">;
      table: keyof TSchema;
    }
  | ({
      type: Extract<MySqlRelationType, "one-relation">;
    } & MySqlOneRelation<TSchema, keyof TSchema, TChosenTable>);

export type MySqlTable<
  TSchema extends object,
  TCurrentTable extends keyof TSchema
> = Record<string, MySqlColumnDefinition<TSchema, TCurrentTable>>;

export type MySqlSchema<TSchema extends object> = {
  [CurrentTable in keyof TSchema]: MySqlTable<TSchema, CurrentTable>;
};

export const declareMySqlSchema = <TSchema extends MySqlSchema<TSchema>>(
  schema: TSchema
) => {
  return schema;
};

export const Column = <TArgs extends MySqlColumnPrimitive>(arg: TArgs) => arg;
