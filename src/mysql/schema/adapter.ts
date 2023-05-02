export type MySqlDataType = "int" | "varchar" | "date";
export type MySqlRelationType = "one-relation" | "many-relation";
/*
 * It will infer the relation looking at the schema. That means when the
 * table changes, the references has to belong to that particular table.
 *
 * Only one relations can have references and fields
 **/
type OneRelation<
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

export type MySqlColumn<
  TSchema extends object,
  TChosenTable extends keyof TSchema
> =
  | {
      type: MySqlDataType;
      length?: number;
      primayKey?: boolean;
      defaultValue?: string;
      unique?: boolean;
    }
  | {
      type: Extract<MySqlRelationType, "many-relation">;
      table: keyof TSchema;
    }
  | ({
      type: Extract<MySqlRelationType, "one-relation">;
    } & OneRelation<TSchema, keyof TSchema, TChosenTable>);

export type MySqlTable<
  TSchema extends object,
  TChosenTable extends keyof TSchema
> = Record<string, MySqlColumn<TSchema, TChosenTable>>;

export type MySqlSchema<TSchema extends object> = {
  [Table in keyof TSchema]: MySqlTable<TSchema, Table>;
};

type ColumnDefinitionTest<TSchema, TCurrentTable> =
  | {
      type: "number";
      numberValue: number;
      optionalValue?: Date;
    }
  | {
      type: "boolean";
      booleanValue: boolean;
      optionalValue?: string;
    }
  | {
      type: "many-relation";
      table: keyof TSchema;
    }
  | {
      type: "one-relation";
      // fields: Array<keyof TSchema[TCurrentTable]>;
      references: TCurrentTable;
      test: string;
    };

// This is the good one but we have the problem about passing the schema
type SchemaTest<TSchema> = {
  [Table in string]: Record<string, ColumnDefinitionTest<TSchema, Table>>;
};

// This generates the autocomplete error
// keyof TSchema generates the autocomplete error
// type SchemaTest2<TSchema> = {
//   [Table in keyof TSchema]: Record<string, ColumnDefinitionTest<TSchema>>;
// };

export const declareMySqlSchema = <const TSchema extends SchemaTest<TSchema>>(
  schema: TSchema
) => {
  return schema;
};
