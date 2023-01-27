import { MySqlDataTypes, schema } from "./mysql-schema-test";

/**
 * If the object has a `type` property with primitives, stop the recursion.
 */
type BooleanConvertion<Tables extends object, Column extends keyof Tables> = {
  [key in keyof Tables[Column]]: Tables[Column][key] extends {
    type: MySqlDataTypes;
  }
    ? boolean
    : Tables[Column][key] extends { relatedTable: keyof Tables }
    ? Partial<BooleanConvertion<Tables, Tables[Column][key]["relatedTable"]>>
    : never;
};

type SelectFields<Tables extends object, Column extends keyof Tables> = Partial<
  BooleanConvertion<Tables, Column>
>;

type TypeScriptOrmClient<Tables extends object> = {
  [Column in keyof Tables]: {
    findUnique(args: {
      select?: SelectFields<Tables, Column>;
      where: Tables[Column];
    }): Tables[Column];
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
    email: true,
    login: {
      account: true,
      identity_tests: {
        key: true,
        test: true,
      },
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
