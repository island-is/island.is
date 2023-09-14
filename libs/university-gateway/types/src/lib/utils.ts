type SymmetricalEnum<TEnum> = {
  [key in keyof TEnum]: key
}

type MapperResult<
  TSourceEnumObj,
  TDestEnumObj extends SymmetricalEnum<TSourceEnumObj>,
  TSourceValue extends keyof TSourceEnumObj,
> = TDestEnumObj extends { [key in TSourceValue]: infer TResult }
  ? TResult
  : never

// export const createEnumMapperFunction =
//   <TSourceEnumObj, TDestEnumObj extends SymmetricalEnum<TSourceEnumObj>>(
//     from: TSourceEnumObj,
//     to: TDestEnumObj,
//   ) =>
//   <TInput extends keyof TSourceEnumObj>(value: TInput) =>
//     value as MapperResult<TSourceEnumObj, TDestEnumObj, TInput>

export const mapEnum = <
  TSourceEnumObj,
  TDestEnumObj extends SymmetricalEnum<TSourceEnumObj>,
  TInput extends keyof TSourceEnumObj,
>(
  value: TInput,
  _from: TSourceEnumObj,
  _to: TDestEnumObj,
) => {
  return value as MapperResult<TSourceEnumObj, TDestEnumObj, TInput>
}
