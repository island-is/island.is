import { DynamicModule, Module } from '@nestjs/common'

export type Register<
  Config,
  Modules extends any[]
> = {
  config?: Config
  modules?: Modules
}
