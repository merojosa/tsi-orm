import { MySqlDataTypes } from "./adapter";

/**
 * If the object has a `type` property with primitives, stop the recursion.
 */
type BooleanConverter<
  Schema extends object,
  Table extends keyof Schema
> = Partial<{
  [Column in keyof Schema[Table]]: Schema[Table][Column] extends {
    type: MySqlDataTypes;
  }
    ? boolean
    : Schema[Table][Column] extends { relatedTable: keyof Schema }
    ? BooleanConverter<Schema, Schema[Table][Column]["relatedTable"]>
    : never;
}>;

type SelectFields<
  Schema extends object,
  Table extends keyof Schema
> = BooleanConverter<Schema, Table>;

type DataTypeConverter<Schema extends object, Table extends keyof Schema> = {
  [Column in keyof Schema[Table]]: Schema[Table][Column] extends { type: "int" }
    ? number
    : Schema[Table][Column] extends { type: "date" }
    ? Date
    : Schema[Table][Column] extends { type: "varchar" }
    ? string
    : Schema[Table][Column] extends {
        type: "relation";
        relatedTable: keyof Schema;
      }
    ? DataTypeConverter<Schema, Schema[Table][Column]["relatedTable"]>
    : never;
};

type TypeScriptOrmClient<Schema extends object> = {
  [Table in keyof Schema]: {
    findUnique(args: {
      select?: SelectFields<Schema, Table>;
      where: DataTypeConverter<Schema, Table>;
    }): Schema[Table];
  };
};

const createClient = <Schema extends object>(
  schema: Schema
): TypeScriptOrmClient<Schema> => {
  const keys = Object.keys(schema);

  const object = keys.reduce((acc, key) => {
    acc[key] = {
      findUnique: (args) => console.log(`Console ${key}_findUnique`, args),
    };
    return acc;
  }, {} as TypeScriptOrmClient<Schema>);

  return object;
};

export default createClient;
