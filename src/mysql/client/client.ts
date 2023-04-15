import { findUniqueConstructor } from "./parser";
import MySqlSelectFields from "./select.types";
import { FilterBySelect } from "./utilities-types";
import MySqlDataTypeConverter from "./where.types";

export type FindUniqueArgs<
  Schema extends object,
  Table extends keyof Schema
> = {
  select?: MySqlSelectFields<Schema, Table>;
  where: MySqlDataTypeConverter<Schema, Table>;
};

type MySqlOperations<Schema extends object, Table extends keyof Schema> = {
  findUnique<
    TSelectFieldsParam extends FindUniqueArgs<Schema, Table>["select"]
  >(args: {
    select: TSelectFieldsParam;
    where: FindUniqueArgs<Schema, Table>["where"];
  }): Schema[Table] extends object
    ? Promise<FilterBySelect<Schema[Table], TSelectFieldsParam>>
    : Promise<Schema[Table]>;
};

type MySqlTypeScriptOrmClient<Schema extends object> = {
  [Table in keyof Schema]: MySqlOperations<Schema, Table>;
};

const getObjectKeys = <Obj extends object>(obj: Obj): (keyof Obj)[] => {
  const objectKeys = Object.keys(obj);
  return objectKeys.reduce((keys, key) => {
    if (obj.hasOwnProperty(key)) {
      keys.push(key as keyof Obj);
      return keys;
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
      findUnique: (args: any) => findUniqueConstructor(args, schema, table),
    };

    return {
      ...acc,
      [table]: ormOperations,
    };
  }, {} as MySqlTypeScriptOrmClient<Schema>);

  return object;
};
