import { MySqlDataTypes, schema } from "./mysql-schema-test";

/**
 * If the object has a `type` property with primitives, stop the recursion.
 */
type BooleanConvertion<
  Schema extends object,
  Table extends keyof Schema
> = Partial<{
  [Column in keyof Schema[Table]]: Schema[Table][Column] extends {
    type: MySqlDataTypes;
  }
    ? boolean
    : Schema[Table][Column] extends { relatedTable: keyof Schema }
    ? BooleanConvertion<Schema, Schema[Table][Column]["relatedTable"]>
    : never;
}>;

type SelectFields<
  Schema extends object,
  Table extends keyof Schema
> = BooleanConvertion<Schema, Table>;

type TypeScriptOrmClient<Schema extends object> = {
  [Table in keyof Schema]: {
    findUnique(args: {
      select?: SelectFields<Schema, Table>;
      where: Schema[Table];
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

const tsClient = createClient(schema);

const result = tsClient.User.findUnique({
  select: {
    login: {
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
