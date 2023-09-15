import { ServiceBuilder } from '../dsl'

export const toServices = (builders: ServiceBuilder<any>[]) =>
  builders.map((b) => b.serviceDef)
