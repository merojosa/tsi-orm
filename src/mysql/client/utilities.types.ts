import { MySqlDataType, MySqlRelationType } from "../schema/adapter";

export type OmitNever<TWithNevers> = {
  [Key in keyof TWithNevers as TWithNevers[Key] extends never
    ? never
    : Key]: TWithNevers[Key] extends object
    ? OmitNever<TWithNevers[Key]>
    : TWithNevers[Key];
};

export type GetMySqlDataType<
  TType extends {
    type: MySqlDataType;
  }
> = TType extends { type: "int" }
  ? number
  : TType extends { type: "varchar" }
  ? string
  : TType extends { type: "date" }
  ? Date
  : never;

/* This type filters the fields that are selected with the generic TSelectColumns.
 * If the field is a relation, it will go directly to its table definition to select
 * the relation fields. That's why we need the chema definition.
 * If a field is not selected (false or does not exist in TSelectColumns), it will
 * return the never type.
 * OmitNever will discard every property that has the never type.
 */
export type FilterBySelect<
  TSchema extends object,
  TTable,
  TSelectColumns
> = OmitNever<{
  [TBaseKey in keyof TTable]: TBaseKey extends keyof TSelectColumns // The field exists in the select fields?
    ? TSelectColumns[TBaseKey] extends true // Is field selected?
      ? TTable[TBaseKey] extends {
          type: MySqlDataType;
        }
        ? GetMySqlDataType<TTable[TBaseKey]>
        : never
      : TSelectColumns[TBaseKey] extends object
      ? TTable[TBaseKey] extends { type: MySqlRelationType; table: string } // Is the field is a relation?
        ? TTable[TBaseKey]["table"] extends keyof TSchema // Does it belong to the schema?
          ? FilterBySelect<
              TSchema,
              TSchema[TTable[TBaseKey]["table"]], // This is the relation mapped to the schema
              TSelectColumns[TBaseKey]
            >
          : never
        : never
      : never
    : never;
}>;
