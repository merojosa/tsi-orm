import mysql from "mysql2/promise";
import { FindUniqueArgs } from "./client";

export const findUniqueConstructor = async <Schema extends object>(
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

  const [rows] = await connection.execute(
    `SELECT JSON_OBJECT('id', id, 'creation', creation) AS organization FROM organization ${whereStatement}`,
    [1]
  );

  if (Array.isArray(rows) && rows.length) {
    const result = rows[0] as any;
    return result[table.toString().toLowerCase()];
  }
};
