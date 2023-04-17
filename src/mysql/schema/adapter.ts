export type MySqlDataTypes = "int" | "varchar" | "date";

/*
 * It will infer the relation looking at the schema. That means when the
 * relatedTable changes, the relatedColumns has to belong to that particular table.
 **/
type InferRelation<
  TSchema extends object,
  TTables
> = TTables extends infer RelatedTableVariable extends keyof TSchema
  ? {
      relatedTable: RelatedTableVariable;
      relatedColumns: Array<keyof TSchema[RelatedTableVariable]>;
    }
  : never;

export type MySqlColumn<TSchema extends object> =
  | {
      type: MySqlDataTypes;
      length?: number;
      primayKey?: boolean;
      defaultValue?: string;
      unique?: boolean;
    }
  | ({
      type: "relation";
    } & InferRelation<TSchema, keyof TSchema>);

export type MySqlTable<TSchema extends object> = Record<
  string,
  MySqlColumn<TSchema>
>;

export type MySqlSchema<TSchema extends object> = {
  [Table in keyof TSchema]: MySqlTable<TSchema>;
};

export const declareMySqlSchema = <TData extends MySqlSchema<TData>>(
  schema: TData
) => {
  return schema satisfies MySqlSchema<TData>;
};
