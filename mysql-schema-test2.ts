/*
 * TODO:
 * Triggers
 * Constraints
 */

export type MySqlDataTypes = "int" | "varchar" | "date";

type MySqlColumn<TableNames extends object> =
  | {
      type: MySqlDataTypes;
      length: number;
      primayKey?: boolean;
      defaultValue?: string;
      unique?: boolean;
    }
  | {
      type: "relation";
      relatedTable: keyof TableNames;
      relatedColumns: string[]; // TODO: The columns for the chosen table
    };

type MySqlEntity<Schema extends object> = Record<string, MySqlColumn<Schema>>;

type MySqlSchema<Schema extends object> = Readonly<
  Record<keyof Schema, MySqlEntity<Schema>>
>;

const declareSchema = <TData extends object>(
  schema: TData
): MySqlSchema<TData> => {
  return schema as any;
};

const schema = declareSchema({
  test1: false,
});
