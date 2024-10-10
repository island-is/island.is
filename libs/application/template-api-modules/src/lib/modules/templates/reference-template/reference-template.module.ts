import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// Here you import your module service
import { ReferenceTemplateService } from './reference-template.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [ReferenceTemplateService],
  exports: [ReferenceTemplateService],
})
export class ReferenceTemplateModule {}
