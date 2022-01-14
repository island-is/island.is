import { Scope } from '@nestjs/common'

/**
 * An injection scope that is REQUEST-scoped during local development ( and
 * DEFAULT-scoped (singleton, constructed at process start-up) in production.
 * This is useful to lazily construct providers that depend on incomplete
 * configuration, so you can start your APIs in development without having
 * all the modules configured.
 */
export const LazyDuringDevScope =
  process.env.NODE_ENV !== 'production' ? Scope.REQUEST : Scope.DEFAULT
