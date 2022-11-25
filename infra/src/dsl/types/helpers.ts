import { ServiceBuilder } from '../dsl'

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type Envs<
  T extends (...arg: any) => any
> = ReturnType<T> extends ServiceBuilder<any, infer Envs> ? Envs : never

export const getConfig = <T extends (...arg: any) => any>(
  serviceBuilder: T,
) => {
  return {
    env: (p: Envs<T>) => {
      return process.env[(p as unknown) as string]
    },
  }
}
