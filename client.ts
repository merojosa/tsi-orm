import { schema } from "./mysql-schema-test";

type TypeScriptOrmClient<T> = {
  [key in keyof T]: { findUnique(...args: any[]): T[key] };
};

const createClient = <T>(schema: T): TypeScriptOrmClient<T> => {
  const keys = Object.keys(schema);

  const object = keys.reduce((acc, key) => {
    acc[key] = {
      findUnique: (args) => console.log(`Console ${key}_findUnique`, args),
    };
    return acc;
  }, {} as TypeScriptOrmClient<T>);

  return object;
};

const tsClient = createClient(schema);

const { author } = tsClient.Post.findUnique();
