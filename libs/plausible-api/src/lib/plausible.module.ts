import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PlausibleService } from './plausible.service'

@Module({
  imports: [HttpModule],
  providers: [PlausibleService],
  exports: [PlausibleService],
})
export class PlausibleModule {}
