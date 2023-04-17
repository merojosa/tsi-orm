import { MySqlDataTypes } from "../schema/adapter";

/**
 * If the object has a `type` property with primitives, stop the recursion.
 */
type BooleanConverter<
  TSchema extends object,
  TTable extends keyof TSchema
> = Partial<{
  [Column in keyof TSchema[TTable]]: TSchema[TTable][Column] extends {
    type: MySqlDataTypes;
  }
    ? boolean
    : TSchema[TTable][Column] extends { relatedTable: keyof TSchema }
    ? BooleanConverter<TSchema, TSchema[TTable][Column]["relatedTable"]>
    : never;
}>;

type MySqlSelectFields<
  Schema extends object,
  Table extends keyof Schema
> = BooleanConverter<Schema, Table>;

export default MySqlSelectFields;
