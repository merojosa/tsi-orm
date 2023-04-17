type MySqlDataTypeConverter<
  TSchema extends object,
  TTable extends keyof TSchema
> = {
  [Column in keyof TSchema[TTable]]: TSchema[TTable][Column] extends {
    type: "int";
  }
    ? number
    : TSchema[TTable][Column] extends { type: "date" }
    ? Date
    : TSchema[TTable][Column] extends { type: "varchar" }
    ? string
    : TSchema[TTable][Column] extends {
        type: "relation";
        relatedTable: keyof TSchema;
      }
    ? MySqlDataTypeConverter<TSchema, TSchema[TTable][Column]["relatedTable"]>
    : never;
};

export default MySqlDataTypeConverter;
