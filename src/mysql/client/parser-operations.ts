import mysql from "mysql2/promise";
import type MySqlDataTypeConverter from "./where.types";
import type MySqlSelectFields from "./select.types";

export type FindUniqueArgs<
  Schema extends object,
  Table extends keyof Schema
> = {
  select?: MySqlSelectFields<Schema, Table>;
  where: MySqlDataTypeConverter<Schema, Table>;
};

// This should be removed
const tempGetSelectStatement = (selectEntries: [string, unknown][]) => {
  return selectEntries.reduce((selectString, [key, value], index) => {
    if (!value) {
      return selectString;
    }

    if (typeof value === "object") {
      return selectString;
    }

    return selectString.concat(`${index === 0 ? "" : ","} '${key}', ${key}`);
  }, "");
};

export const findUniqueParser = async <Schema extends object>(
  args: FindUniqueArgs<Schema, keyof Schema>,
  _schema: Schema,
  table: string | number | symbol
) => {
  const connection = await mysql.createConnection({
    database: "typescript-orm",
    host: "localhost",
    password: "Pass1234!",
    user: "jose_local",
    port: 3306,
  });

  const whereEntries = Object.entries(args.where);

  const whereStatement = whereEntries.length
    ? ` WHERE ${whereEntries.reduce((string, [key, value], index) => {
        const valueBasedOnType =
          typeof value === "number" ? value.toString() : `'${value}'`;

        if (index === 0) {
          return string.concat(`${key} = ${valueBasedOnType}`);
        }
        return string.concat(` AND ${key} = ${value}`);
      }, "")}`
    : "";

  // WIP: Handle relations
  function getSelectFieldsQuery(
    obj: object,
    selectValue: string,
    firstLevel: boolean = true
  ): string {
    const entries = Object.entries(obj);

    const result = entries.reduce((reduceValue, [key, value], index) => {
      if (!value) {
        return reduceValue;
      }

      if (value === true) {
        return reduceValue.concat(
          `${firstLevel && index === 0 ? "" : ","} '${key}', ${key}`
        );
      }

      if (typeof value === "object") {
        return reduceValue.concat(
          getSelectFieldsQuery(value, selectValue, false)
        );
      }

      return reduceValue;
    }, "");

    return result.trim();
  }

  if (args.select) {
    const resultTest = getSelectFieldsQuery(args.select, "");
  }

  const selectEntries = Object.entries(args.select || {});
  const selectStatement = tempGetSelectStatement(selectEntries);

  const tableName = table.toString();

  const [rows] = await connection.execute(
    `SELECT JSON_OBJECT(${selectStatement}) AS ${tableName} FROM ${tableName} ${whereStatement}`,
    [1]
  );

  if (Array.isArray(rows) && rows.length) {
    const result = rows[0] as any;
    return result[tableName];
  }
};
