import { Module } from '@nestjs/common'
import { NationalIdGuard } from './national-id-guard'

@Module({
  imports: [NationalIdGuard],
  exports: [NationalIdGuard],
})
export class AccessModule {}
