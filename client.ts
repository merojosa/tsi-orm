import { schema } from "./mysql-schema-test";

// https://stackoverflow.com/a/74566639/11026428
type UncapitalizeObjectKeys<T> = {
  [key in keyof T as Uncapitalize<key & string>]: T[key] extends Object
    ? UncapitalizeObjectKeys<T[key]>
    : T[key];
};

type TypeScriptOrmClient<T extends object> = UncapitalizeObjectKeys<
  Record<keyof T, { findAll: string; findUnique: string }>
>;

const createClient = <T extends object>(schema: T): TypeScriptOrmClient<T> => {
  const keys = Object.keys(schema);

  const object = keys.reduce((acc, key) => {
    acc[`${key.substring(0, 1).toLowerCase()}${key.substring(1)}`] = {
      findAll: `${key}_findAll`,
      findUnique: `${key}_findUnique`,
    };
    return acc;
  }, {} as TypeScriptOrmClient<T>);

  return object;
};

const tsClient = createClient(schema);

console.log(tsClient);
