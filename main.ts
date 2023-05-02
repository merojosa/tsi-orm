import { createMySqlClient, declareMySqlSchema } from "./src/mysql";

const schema = declareMySqlSchema({
  Table1: {
    Column1: {
      type: "boolean",
      booleanValue: true,
      optionalValue: "",
    },
    Column2: {
      type: "number",
      numberValue: 777,
      optionalValue: new Date(),
    },
  },
  Table2: {
    Column1: {
      type: "number",
      numberValue: 0,
      optionalValue: new Date(),
    },
    Column3: {
      type: "boolean",
      booleanValue: true,
    },
    Column4: {
      type: "many-relation",
      table: "Table2",
    },
    Columna5: {
      type: "one-relation",
      test: "1",
    },
  },
  Table3: {
    ColumnTest: {
      type: "number",
      numberValue: 1,
      optionalValue: new Date(),
    },
  },
});

type Algo = typeof schema.Table2.Column4.table;

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
