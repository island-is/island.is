import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { ReferenceTemplateService } from './reference-template.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [ReferenceTemplateService],
  exports: [ReferenceTemplateService],
})
export class ReferenceTemplateModule {}
