import { Module } from '@nestjs/common'
import { SmartSolutionsApi } from './smartSolutions.api'

@Module({
  providers: [SmartSolutionsApi],
  exports: [SmartSolutionsApi],
})
export class SmartSolutionsClientModule {}
