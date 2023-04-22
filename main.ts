import { createMySqlClient, declareMySqlSchema } from "./src/mysql";

// Good at the moment, we'll see
const schema = declareMySqlSchema({
  Table1: {
    Columna1: {
      type: "date",
      value: new Date(),
    },
    Columna2: {
      type: "number",
      value: 1,
    },
  },
  Table2: {
    Columna2: {
      type: "many-relation",
      table: "Table2",
    },
  },
});

type Algo = typeof schema.Table2.Columna2.table;

// type Algo = typeof schema.Table.Columna1.value;

// buildDatabaseFromSchema(
//   {
//     database: "typescript-orm",
//     host: "localhost",
//     password: "Pass1234!",
//     user: "jose_local",
//     port: 3306,
//   },
//   schema
// );

// const tsClient = createMySqlClient(schema);

// const method = async () => {
//   const result = await tsClient.Organization.findUnique({
//     select: {
//       // users: {},
//     },
//     where: { id: 1 } as any,
//   });

//   console.log("Done!!!", result);
// };

// method();
