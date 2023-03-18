import { findUniqueConstructor } from "./parser";
import MySqlSelectFields from "./select.types";
import MySqlDataTypeConverter from "./where.types";

type MySqlOperations<Schema extends object, Table extends keyof Schema> = {
  findUnique(args: {
    select?: MySqlSelectFields<Schema, Table>;
    where: MySqlDataTypeConverter<Schema, Table>;
  }): Schema[Table];
};

type MySqlTypeScriptOrmClient<Schema extends object> = {
  [Table in keyof Schema]: MySqlOperations<Schema, Table>;
};

const getObjectKeys = <Obj extends object>(obj: Obj): (keyof Obj)[] => {
  const objectKeys = Object.keys(obj);
  return objectKeys.reduce((keys, key) => {
    if (obj.hasOwnProperty(key)) {
      return [...keys, key as keyof Obj];
    }
    return keys;
  }, [] as (keyof Obj)[]);
};

export const createMySqlClient = <Schema extends object>(
  schema: Schema
): MySqlTypeScriptOrmClient<Schema> => {
  const tables = getObjectKeys(schema);

  const object = tables.reduce((acc, table) => {
    const ormOperations: MySqlOperations<Schema, typeof table> = {
      findUnique: (args: any) => findUniqueConstructor(args),
    };
    return {
      ...acc,
      [table]: ormOperations,
    };
  }, {} as MySqlTypeScriptOrmClient<Schema>);

  return object;
};
