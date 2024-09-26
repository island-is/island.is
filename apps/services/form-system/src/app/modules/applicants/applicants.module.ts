import { Module } from '@nestjs/common';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';

@Module({
  controllers: [ApplicantsController],
  providers: [ApplicantsService]
})
export class ApplicantsModule {}
