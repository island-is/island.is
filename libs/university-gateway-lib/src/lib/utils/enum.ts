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

export const mapEnumToEnum = <
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

export const mapStringToEnum = <TDestEnum, TKeys extends string>(
  value: string | undefined,
  enumType: { [key in TKeys]: TDestEnum },
  defaultValue: TDestEnum | undefined = undefined,
): TDestEnum => {
  if (!value) {
    throw new Error(`Empty value in enum: ${enumType.toString()}`)
  }

  const keys = Object.keys(enumType)
  const values = Object.values(enumType)

  const index = keys.indexOf(value)

  if (index < 0) {
    if (defaultValue) return defaultValue
    throw new Error(`${value} does not exist in enum: ${enumType.toString()}`)
  }

  return values[index] as TDestEnum
}
