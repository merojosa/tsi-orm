import { MySqlDataTypes } from "../schema/adapter";

export type OmitNever<TWithNevers> = {
  [Key in keyof TWithNevers as TWithNevers[Key] extends never
    ? never
    : Key]: TWithNevers[Key] extends object
    ? OmitNever<TWithNevers[Key]>
    : TWithNevers[Key];
};

export type GetMySqlDataType<
  TType extends {
    type: MySqlDataTypes;
  }
> = TType extends { type: "int" }
  ? number
  : TType extends { type: "varchar" }
  ? string
  : TType extends { type: "date" }
  ? Date
  : never;

export type FilterBySelect<
  TSchema extends object,
  TTable,
  TSelectFields
> = OmitNever<{
  [TBaseKey in keyof TTable]: TBaseKey extends keyof TSelectFields // The field exists in the select fields?
    ? TSelectFields[TBaseKey] extends true // Is field selected?
      ? TTable[TBaseKey] extends {
          type: MySqlDataTypes;
        }
        ? GetMySqlDataType<TTable[TBaseKey]>
        : never
      : TSelectFields[TBaseKey] extends object
      ? TTable[TBaseKey] extends { type: "relation"; relatedTable: string } // Is the field is a relation?
        ? TTable[TBaseKey]["relatedTable"] extends keyof TSchema // Does it belong to the schema?
          ? FilterBySelect<
              TSchema,
              TSchema[TTable[TBaseKey]["relatedTable"]],
              TSelectFields[TBaseKey]
            >
          : never
        : never
      : never
    : never;
}>;
