export type MySqlDataType = "int" | "varchar" | "date";
export type MySqlRelationType = "one-relation" | "many-relation";
/*
 * It will infer the relation looking at the schema. That means when the
 * table changes, the references has to belong to that particular table.
 *
 * Only one relations can have references and fields
 **/
type MySqlOneRelation<
  TSchema extends Record<string, string>,
  TTables,
  TChosenTable extends keyof TSchema
> = TTables extends infer TableVariable extends keyof TSchema
  ? {
      table: TableVariable;
      references: Array<TSchema[TableVariable]>;
      fields: Array<TSchema[TChosenTable]>;
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
  TSchema extends Record<string, string>,
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
  TSchema extends Record<string, string>,
  TCurrentTable extends keyof TSchema
> = Record<
  TSchema[TCurrentTable],
  MySqlColumnDefinition<TSchema, TCurrentTable>
>;

export type MySqlSchema<TSchema extends Record<string, string>> = {
  [CurrentTable in keyof TSchema]: MySqlTable<TSchema, CurrentTable>;
};
