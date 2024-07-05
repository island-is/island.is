import { Module } from '@nestjs/common'
import { SmartSolutionsService } from './smartSolutions.service'
import { ConfigurableModuleClass } from './smartSolutions.module-definition'
import { gqlClientFactory } from './gqlClientFactory'
import { GQLFetcher } from './gqlFetch'

@Module({
  providers: [SmartSolutionsService, gqlClientFactory, GQLFetcher],
  exports: [SmartSolutionsService],
})
export class SmartSolutionsModule extends ConfigurableModuleClass {}
