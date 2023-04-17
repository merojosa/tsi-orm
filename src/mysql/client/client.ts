import { FindUniqueArgs, findUniqueParser } from "./parser-operations";
import { FilterBySelect } from "./utilities-types";

type MySqlOperations<TSchema extends object, TTable extends keyof TSchema> = {
  findUnique<
    TSelectFieldsParam extends FindUniqueArgs<TSchema, TTable>["select"]
  >(args: {
    select: TSelectFieldsParam;
    where: FindUniqueArgs<TSchema, TTable>["where"];
  }): Promise<FilterBySelect<TSchema, TSchema[TTable], TSelectFieldsParam>>;
};

type MySqlTypeScriptOrmClient<TSchema extends object> = {
  [Table in keyof TSchema]: MySqlOperations<TSchema, Table>;
};

const getObjectKeys = <TObj extends object>(obj: TObj): (keyof TObj)[] => {
  const objectKeys = Object.keys(obj);
  return objectKeys.reduce((keys, key) => {
    if (obj.hasOwnProperty(key)) {
      keys.push(key as keyof TObj);
      return keys;
    }
    return keys;
  }, [] as (keyof TObj)[]);
};

export const createMySqlClient = <TSchema extends object>(
  schema: TSchema
): MySqlTypeScriptOrmClient<TSchema> => {
  const tables = getObjectKeys(schema);

  const object = tables.reduce((acc, table) => {
    const ormOperations: MySqlOperations<TSchema, typeof table> = {
      findUnique: (args: any) => findUniqueParser(args, schema, table),
    };

    return {
      ...acc,
      [table]: ormOperations,
    };
  }, {} as MySqlTypeScriptOrmClient<TSchema>);

  return object;
};
