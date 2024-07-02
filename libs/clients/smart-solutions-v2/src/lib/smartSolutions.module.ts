import { Module } from '@nestjs/common'
import { SmartSolutionsService } from './smartSolutions.service'
import { ConfigurableModuleClass } from './smartSolutions.module-definition'
import { clientFactory } from './graphql/clientFactory'

@Module({
  providers: [SmartSolutionsService, clientFactory],
  exports: [SmartSolutionsService],
})
export class SmartSolutionsModule extends ConfigurableModuleClass {}
