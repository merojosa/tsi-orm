import { MySqlDataTypes, schema } from "./mysql-schema-test";

/**
 * If the object has a `type` property with primitives, stop the recursion.
 */
type RecursiveConvertion<V, O> = {
  [K in keyof O]: O[K] extends { type: MySqlDataTypes }
    ? V
    : RecursiveConvertion<V, O[K]>;
};

type SelectFields<TData extends object, key extends keyof TData> = Partial<
  RecursiveConvertion<boolean, TData[key]>
>;

type TypeScriptOrmClient<TData extends object> = {
  [key in keyof TData]: {
    findUnique(args: {
      select?: SelectFields<TData, key>;
      where: TData[key];
    }): TData[key];
  };
};

const createClient = <TData extends object>(
  schema: TData
): TypeScriptOrmClient<TData> => {
  const keys = Object.keys(schema);

  const object = keys.reduce((acc, key) => {
    acc[key] = {
      findUnique: (args) => console.log(`Console ${key}_findUnique`, args),
    };
    return acc;
  }, {} as TypeScriptOrmClient<TData>);

  return object;
};

const tsClient = createClient(schema);

const result = tsClient.User.findUnique({
  select: {
    password: true,
    login: {
      type: "relation",
      relatedColumns: ["jjeeje"],
      relatedTable: "identity_manager",
    },
  },
  where: {
    email: { length: 1, type: "int" },
    password: { length: 1, type: "date" },
    login: {
      relatedColumns: [],
      relatedTable: "identity_manager",
      type: "relation",
    },
  },
});
