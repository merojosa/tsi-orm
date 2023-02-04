import { MySqlDataTypes, MySqlSchema, MySqlTable } from "./adapter";

export const buildDatabaseFromSchema = (schema: MySqlSchema<any>) => {
  const tables = Object.entries(schema);

  const createTablesInstructions = tables.map(
    ([tableName, propertiesObject]) => {
      return `CREATE TABLE IF NOT EXISTS ${tableName} (${getColumns(
        propertiesObject
      )});`;
    }
  );

  console.log("BREAKPOINT tablesSql", createTablesInstructions);
};

const getColumns = (tableProperties: MySqlTable<any>): string => {
  const columns = Object.entries(tableProperties);

  const concatenatedColumns = columns.reduce(
    (acc, [columnName, columnProperties], index) => {
      if (columnProperties.type !== "relation") {
        return acc.concat(
          `${index !== 0 ? ", " : ""}${columnName} ${getMySqlDataType(
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

const getMySqlDataType = (type: MySqlDataTypes, length?: number): string => {
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
