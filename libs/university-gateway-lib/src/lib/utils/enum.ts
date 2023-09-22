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

// Can be used when both TSourceEnum and TDestEnum have the same keys
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

// Can be used when TSourceEnum and TDestEnum are similar
// will throw error if key does not exist in TDestEnum and
// no defaultValue is provided
export const mapEnumToOtherEnum = <
  TSourceEnum,
  TDestEnum,
  TSourceKeys extends string,
  TDestKeys extends string,
>(
  value: TSourceEnum | undefined,
  enumTypeFrom: { [key in TSourceKeys]: TSourceEnum },
  enumTypeTo: { [key in TDestKeys]: TDestEnum },
  defaultValue: TDestEnum | undefined = undefined,
): TDestEnum => {
  if (!value) {
    throw new Error(`Empty value for enum: ${enumTypeTo}`)
  }

  const keysFrom = Object.keys(enumTypeFrom)
  const valuesFrom = Object.values(enumTypeFrom)
  const indexFrom = valuesFrom.indexOf(value.toString())
  if (indexFrom < 0) {
    if (defaultValue) return defaultValue
    throw new Error(`${value} does not exist in enum (from): ${enumTypeFrom}`)
  }
  const keyFrom = keysFrom[indexFrom]

  const keysTo = Object.keys(enumTypeTo)
  const valuesTo = Object.values(enumTypeTo)
  const indexTo = keysTo.indexOf(keyFrom)
  if (indexTo < 0) {
    if (defaultValue) return defaultValue
    throw new Error(`${value} does not exist in enum (to): ${enumTypeTo}`)
  }

  return valuesTo[indexTo] as TDestEnum
}

// Can be used when mapping string to enum,

export const mapStringToEnum = <TDestEnum, TKeys extends string>(
  value: string | undefined,
  enumType: { [key in TKeys]: TDestEnum },
  defaultValue: TDestEnum | undefined = undefined,
): TDestEnum => {
  if (!value) {
    throw new Error(`Empty value for enum: ${enumType}`)
  }

  const keys = Object.keys(enumType)
  const values = Object.values(enumType)

  const index = keys.indexOf(value)

  if (index < 0) {
    if (defaultValue) return defaultValue
    throw new Error(`${value} does not exist in enum: ${enumType}`)
  }

  return values[index] as TDestEnum
}
