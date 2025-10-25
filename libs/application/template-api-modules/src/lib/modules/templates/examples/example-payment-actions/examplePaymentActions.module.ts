import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { ExamplePaymentActionsService } from './examplePaymentActions.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [ExamplePaymentActionsService],
  exports: [ExamplePaymentActionsService],
})
export class ExamplePaymentActionsModule {}
