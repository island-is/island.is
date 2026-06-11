import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { ExampleSdfService } from './example-sdf.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [ExampleSdfService],
  exports: [ExampleSdfService],
})
export class ExampleSdfModule {}
