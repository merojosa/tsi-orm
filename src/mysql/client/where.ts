type MySqlDataTypeConverter<
  Schema extends object,
  Table extends keyof Schema
> = {
  [Column in keyof Schema[Table]]: Schema[Table][Column] extends { type: "int" }
    ? number
    : Schema[Table][Column] extends { type: "date" }
    ? Date
    : Schema[Table][Column] extends { type: "varchar" }
    ? string
    : Schema[Table][Column] extends {
        type: "relation";
        relatedTable: keyof Schema;
      }
    ? MySqlDataTypeConverter<Schema, Schema[Table][Column]["relatedTable"]>
    : never;
};

export default MySqlDataTypeConverter;
