import { createMySqlClient, declareMySqlSchema } from "./src/mysql";

// Good at the moment, we'll see
const schema = declareMySqlSchema({
  Table1: {
    Columna1: {
      type: "date",
    },
    ColumnaOtra: {
      type: "int",
    },
  },
  Table2: {
    Columna2: {
      type: "many-relation",
      table: "Table2",
    },
    ColumnaOneRelation: {
      type: "one-relation",
      table: "Table1",
      fields: ["Columna2", "ColumnaOneRelation"],
      references: ["ColumnaOtra"],
    },
  },
});

type Algo = typeof schema.Table2.ColumnaOneRelation.fields;

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
