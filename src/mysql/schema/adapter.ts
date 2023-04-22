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
  | ({
      type: Extract<MySqlRelationType, "one-relation">;
    } & OneRelation<TSchema, keyof TSchema, TChosenTable>)
  | {
      type: Extract<MySqlRelationType, "many-relation">;
      table: keyof TSchema;
    };

export type MySqlTable<
  TSchema extends object,
  TChosenTable extends keyof TSchema
> = Record<string, MySqlColumn<TSchema, TChosenTable>>;

export type MySqlSchema<TSchema extends object> = {
  [Table in keyof TSchema]: MySqlTable<TSchema, Table>;
};

type ColumnDefinition<TTables extends keyof any> =
  | {
      type: "date";
      value: Date;
    }
  | {
      type: "number";
      value: number;
    }
  | {
      type: "many-relation";
      table: TTables;
    }
  | {
      type: "one-relation";
    };

export const declareMySqlSchema = <
  TSchema extends Record<string, TColumns>,
  TColumns extends Record<string, ColumnDefinition<keyof TSchema>>
>(
  schema: TSchema
) => {
  return schema;
};
