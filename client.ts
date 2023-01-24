import { schema } from "./mysql-schema-test";

type TypeScriptOrmClient<T> = {
  [key in keyof T]: {
    findUnique(args: {
      select?: Partial<Record<keyof T[key], boolean>>;
      where: T[key];
    }): T[key];
  };
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

const result = tsClient.User.findUnique({
  where: {
    email: { length: 1, type: "int" },
    password: { length: 1, type: "date" },
  },
});
