import MySqlSelectFields from "./select";
import MySqlDataTypeConverter from "./where";

type MySqlTypeScriptOrmClient<Schema extends object> = {
  [Table in keyof Schema]: {
    findUnique(args: {
      select?: MySqlSelectFields<Schema, Table>;
      where: MySqlDataTypeConverter<Schema, Table>;
    }): Schema[Table];
  };
};

export const createMySqlClient = <Schema extends object>(
  schema: Schema
): MySqlTypeScriptOrmClient<Schema> => {
  const keys = Object.keys(schema);

  const object = keys.reduce((acc, key) => {
    acc[key] = {
      findUnique: (args) => console.log(`Console ${key}_findUnique`, args),
    };
    return acc;
  }, {} as MySqlTypeScriptOrmClient<Schema>);

  return object;
};
