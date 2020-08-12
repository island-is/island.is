import { Module } from '@nestjs/common'
import { ElasticService } from './services'

@Module({
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticModule {}
