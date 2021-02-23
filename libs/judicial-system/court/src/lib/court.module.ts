import { Module } from '@nestjs/common';
import { CourtService } from './court.service';

@Module({
  providers: [CourtService]
})
export class CourtModule {}
