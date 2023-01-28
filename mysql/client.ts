import MySqlSelectFields from "./select";
import MySqlDataTypeConverter from "./where";

type TypeScriptOrmClient<Schema extends object> = {
  [Table in keyof Schema]: {
    findUnique(args: {
      select?: MySqlSelectFields<Schema, Table>;
      where: MySqlDataTypeConverter<Schema, Table>;
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
