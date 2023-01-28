import { MySqlDataTypes } from "../schema/adapter";

/**
 * If the object has a `type` property with primitives, stop the recursion.
 */
type BooleanConverter<
  Schema extends object,
  Table extends keyof Schema
> = Partial<{
  [Column in keyof Schema[Table]]: Schema[Table][Column] extends {
    type: MySqlDataTypes;
  }
    ? boolean
    : Schema[Table][Column] extends { relatedTable: keyof Schema }
    ? BooleanConverter<Schema, Schema[Table][Column]["relatedTable"]>
    : never;
}>;

type MySqlSelectFields<
  Schema extends object,
  Table extends keyof Schema
> = BooleanConverter<Schema, Table>;

export default MySqlSelectFields;
