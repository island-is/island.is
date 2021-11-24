const environment = (process.env.ENVIRONMENT || 'dev') as
  | 'dev'
  | 'staging'
  | 'prod'

type EnvedValue = string | Array<string>
type Enved<T> = { dev?: T; staging?: T; prod?: T }
export type ValueOrEnved<T> = T | Enved<T>

const wrapWithEnv = <T extends EnvedValue>(
  value: ValueOrEnved<T>,
): Enved<T> => {
  if (typeof value === 'string' || Array.isArray(value)) {
    return {
      dev: value as T,
      staging: value as T,
      prod: value as T,
    }
  }
  return value as Enved<T>
}

export const getCurrentEnvValue = <T extends EnvedValue>(
  value: ValueOrEnved<T>,
) => {
  const enved = wrapWithEnv(value)
  return enved[environment]
}
