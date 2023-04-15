import { MySqlDataTypes } from "../schema/adapter";

export type OmitNever<WithNevers> = {
  [Key in keyof WithNevers as WithNevers[Key] extends never
    ? never
    : Key]: WithNevers[Key] extends object
    ? OmitNever<WithNevers[Key]>
    : WithNevers[Key];
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

export type FilterBySelect<TBase, TSelectBase> = OmitNever<{
  [TBaseKey in keyof TBase]: TBaseKey extends keyof TSelectBase
    ? TSelectBase[TBaseKey] extends true
      ? TBase[TBaseKey] extends {
          type: MySqlDataTypes;
        }
        ? GetMySqlDataType<TBase[TBaseKey]>
        : never
      : TSelectBase[TBaseKey] extends object
      ? TBase[TBaseKey] extends object
        ? FilterBySelect<TBase[TBaseKey], TSelectBase[TBaseKey]> // Recursive call
        : never
      : never
    : never;
}>;

// export type FilterBySelect<TBase, TSelectBase> = OmitNever<{
//   [TBaseKey in keyof TBase]: TBaseKey extends keyof TSelectBase
//     ? TSelectBase[TBaseKey] extends true
//       ? TBase[TBaseKey] extends {
//           type: MySqlDataTypes;
//         }
//         ? GetMySqlDataType<TBase[TBaseKey]>
//         : never
//       : never
//     : never;
// }>;

// type Test = FilterBySelect<
//   {
//     id: {
//       type: "int";
//       primaryKey: boolean;
//     };
//     creation: {
//       type: "date";
//     };
//     users: {
//       type: "relation";
//       relatedTable: "User";
//       relatedColumns: "email"[];
//     };
//   },
//   { id: true; creation: true; users: false }
// >;
