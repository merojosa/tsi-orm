import mysql, { ConnectionOptions } from "mysql2/promise";
import { MySqlDataType, MySqlSchema, MySqlTable } from "../schema/adapter";

export type MySqlDbConfig = Required<
  Pick<ConnectionOptions, "host" | "user" | "password" | "database" | "port">
>;

export const buildDatabaseFromSchema = async (
  dbConfig: MySqlDbConfig,
  schema: MySqlSchema<any>
) => {
  const tables = Object.entries(schema);

  const createTablesInstructions = tables.map(
    ([tableName, propertiesObject]) => {
      return `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${getColumns(
        propertiesObject
      )});`;
    }
  );

  try {
    const errors = await createTablesFromSqlInstructions(
      dbConfig,
      createTablesInstructions
    );

    if (errors.length) {
      errors.forEach(({ reason }) => console.error(reason));
    }
  } catch (error) {
    console.error(error);
  }
};

const getColumns = (tableProperties: MySqlTable<any, any>): string => {
  const columns = Object.entries(tableProperties);

  const concatenatedColumns = columns.reduce(
    (acc, [columnName, columnProperties], index) => {
      if (
        columnProperties.type !== "many-relation" &&
        columnProperties.type !== "one-relation"
      ) {
        return acc.concat(
          `${index !== 0 ? ", " : ""}\`${columnName}\` ${getMySqlDataType(
            columnProperties.type,
            columnProperties.length
          )}`
        );
      }
      return acc;
    },
    ""
  );
  return concatenatedColumns;
};

const getMySqlDataType = (type: MySqlDataType, length?: number): string => {
  const lenghtSql = `${length === undefined ? "" : `(${length})`}`;
  switch (type) {
    case "date":
      return "DATE";
    case "int":
      return `INT${lenghtSql}`;
    case "varchar":
      return `VARCHAR${lenghtSql}`;
  }
};

const createTablesFromSqlInstructions = async (
  dbConfig: MySqlDbConfig,
  instructions: string[]
) => {
  const connection = await mysql.createConnection(dbConfig);

  const promises = instructions.map((instruction) =>
    connection.execute(instruction)
  );

  const awaitedPromises = await Promise.allSettled(promises);

  const results = awaitedPromises.reduce((errors, promise) => {
    if (promise.status === "rejected") {
      return [...errors, { reason: promise.reason }];
    }
    return errors;
  }, [] as { reason: string }[]);

  await connection.end();
  return results;
};
